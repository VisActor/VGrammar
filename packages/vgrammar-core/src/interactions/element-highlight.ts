import { InteractionStateEnum } from '../graph/enums';
import type {
  ElementHighlightOptions,
  IElement,
  IGlyphElement,
  IMark,
  IToggleStateMixin,
  IView,
  InteractionEvent
} from '../types';
import { BaseInteraction } from './base';
import { groupMarksByState } from './utils';

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

  constructor(view: IView, options?: ElementHighlightOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementHighlight.defaultOptions, options);

    this._marks = view.getMarksBySelector(this.options.selector);
    this._stateMarks = groupMarksByState(this._marks, [this.options.highlightState, this.options.blurState]);
  }

  protected getEvents() {
    return [
      {
        type: this.options.trigger,
        handler: this.handleStart
      },
      { type: this.options.triggerOff, handler: this.handleReset }
    ];
  }

  clearPrevElements() {
    const { highlightState, blurState } = this.options;

    if (this._lastElement) {
      this.clearAllStates(highlightState, blurState);

      this.dispatchEvent('reset', { elements: [this._lastElement], options: this.options });

      this._lastElement = null;
    }
  }

  handleStart = (e: InteractionEvent) => {
    if (e.element && this._marks && this._marks.includes(e.element.mark)) {
      const { highlightState, blurState } = this.options;

      if (this._lastElement === e.element) {
        return;
      }
      this._statedElements = [e.element];

      this.updateStates(highlightState, blurState);

      this._lastElement = e.element;

      this.dispatchEvent('start', { elements: [e.element], options: this.options });
    } else if (this._lastElement) {
      this.clearPrevElements();
    }
  };

  handleReset = (e: InteractionEvent) => {
    const hasActiveElement = e.element && this._marks && this._marks.includes(e.element.mark);

    if (hasActiveElement) {
      this.clearPrevElements();
    }
  };
}
