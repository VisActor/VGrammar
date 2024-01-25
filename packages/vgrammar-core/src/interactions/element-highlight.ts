import { InteractionStateEnum } from '../graph/enums';
import type {
  ElementHighlightOptions,
  EventType,
  IElement,
  IGlyphElement,
  IMark,
  IToggleStateMixin,
  IView,
  InteractionEvent
} from '../types';
import { BaseInteraction } from './base';
import { groupMarksByState } from './utils';
import { isString } from '@visactor/vutils';

export interface ElementHighlight extends IToggleStateMixin, BaseInteraction<ElementHighlightOptions> {}

export class ElementHighlight extends BaseInteraction<ElementHighlightOptions> {
  static type: string = 'element-highlight';
  type: string = ElementHighlight.type;

  static defaultOptions: ElementHighlightOptions = {
    highlightState: InteractionStateEnum.highlight,
    blurState: InteractionStateEnum.blur,
    trigger: 'pointerover',
    triggerOff: 'pointerout'
  };
  options: ElementHighlightOptions;
  protected _marks?: IMark[];
  protected _stateMarks: Record<string, IMark[]>;
  protected _lastElement?: IElement;
  protected _statedElements?: (IElement | IGlyphElement)[];
  protected _resetType?: 'view' | 'self';

  constructor(view: IView, options?: ElementHighlightOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementHighlight.defaultOptions, options);

    this._marks = view.getMarksBySelector(this.options.selector);
    this._stateMarks = groupMarksByState(this._marks, [this.options.highlightState, this.options.blurState]);
  }

  protected getEvents() {
    const triggerOff = this.options.triggerOff;
    const trigger = this.options.trigger;
    const events = [
      {
        type: trigger,
        handler: this.handleStart
      }
    ];

    let eventName = triggerOff;
    if (isString(triggerOff) && (triggerOff as string).includes('view:')) {
      eventName = (triggerOff as string).replace('view:', '') as EventType;
      this._resetType = 'view';
    } else {
      this._resetType = 'self';
    }

    events.push({ type: eventName as EventType, handler: this.handleReset });

    return events;
  }

  clearPrevElements() {
    const { highlightState, blurState } = this.options;

    if (this._lastElement) {
      this.clearAllStates(highlightState, blurState);

      this.dispatchEvent('reset', { elements: [this._lastElement], options: this.options });

      this._lastElement = null;

      this._statedElements = null;
    }
  }

  handleStart = (e: InteractionEvent) => {
    if (e.element && this._marks && this._marks.includes(e.element.mark)) {
      const { highlightState, blurState } = this.options;

      if (this._lastElement === e.element) {
        return;
      }

      this._statedElements = this.updateStates([e.element], this._statedElements, highlightState, blurState);

      this._lastElement = e.element;

      this.dispatchEvent('start', { elements: [e.element], options: this.options });
    } else if (this._lastElement && this._resetType === 'view') {
      this.clearPrevElements();
    }
  };

  handleReset = (e: InteractionEvent) => {
    if (!this._statedElements || !this._statedElements.length) {
      return;
    }

    const hasActiveElement = e.element && this._marks && this._marks.includes(e.element.mark);

    if (this._resetType === 'view' && !hasActiveElement) {
      this.clearPrevElements();
    } else if (this._resetType === 'self' && hasActiveElement) {
      this.clearPrevElements();
    }
  };
}
