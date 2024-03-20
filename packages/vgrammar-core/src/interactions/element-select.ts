import { isNumber, isString } from '@visactor/vutils';
import { InteractionStateEnum } from '../graph/enums';
import type {
  ElementSelectOptions,
  EventType,
  IElement,
  IGlyphElement,
  IMark,
  IToggleStateMixin,
  IView,
  InteractionEvent
} from '../types';
import { groupMarksByState } from './utils';
import { BaseInteraction } from './base';

export interface ElementSelect extends IToggleStateMixin, BaseInteraction<ElementSelectOptions> {}

export class ElementSelect extends BaseInteraction<ElementSelectOptions> {
  static type: string = 'element-select';
  type: string = ElementSelect.type;

  static defaultOptions: ElementSelectOptions = {
    state: InteractionStateEnum.selected,
    trigger: 'click'
  };
  protected _resetType?: 'view' | 'self' | 'timeout';
  protected _marks?: IMark[];
  protected _stateMarks: Record<string, IMark[]>;
  private _timer?: number;
  protected _statedElements?: (IElement | IGlyphElement)[];

  constructor(view: IView, options?: ElementSelectOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementSelect.defaultOptions, options);

    this._marks = view.getMarksBySelector(this.options.selector);
    this._stateMarks = groupMarksByState(this._marks, [this.options.state, this.options.reverseState]);
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

    if (triggerOff === 'empty') {
      eventName = trigger as EventType;

      this._resetType = 'view';
    } else if (triggerOff === 'none') {
      eventName = null;
      this._resetType = null;
    } else if (isString(triggerOff)) {
      if ((triggerOff as string).includes('view:')) {
        eventName = (triggerOff as string).replace('view:', '') as EventType;

        this._resetType = 'view';
      } else {
        eventName = triggerOff;

        this._resetType = 'self';
      }
    } else if (isNumber(triggerOff)) {
      eventName = null;
      this._resetType = 'timeout';
    } else {
      this._resetType = null;
    }

    if (eventName && eventName !== trigger) {
      events.push({ type: eventName as EventType, handler: this.handleReset });
    }

    return events;
  }

  clearPrevElements = () => {
    const { state, reverseState } = this.options;

    if (this._statedElements && this._statedElements.length) {
      this.clearAllStates(state, reverseState);
      this.dispatchEvent('reset', { elements: this._statedElements, options: this.options });

      this._statedElements = [];
    }
  };

  handleStart = (e: InteractionEvent) => {
    this.start(e.element);
  };

  handleReset = (e: InteractionEvent) => {
    this.reset(e.element);
  };

  start(element: InteractionEvent['element']) {
    const { state, reverseState, isMultiple } = this.options;
    if (element && this._marks && this._marks.includes(element.mark)) {
      if (element.hasState(state)) {
        if (this._resetType === 'self') {
          this._statedElements = this.updateStates(
            this._statedElements && this._statedElements.filter(el => el !== element),
            this._statedElements,
            state,
            reverseState
          );
        }
      } else {
        if (this._timer) {
          clearTimeout(this._timer);
        }
        element.addState(state);

        this._statedElements = this.updateStates(
          isMultiple && this._statedElements ? [...this._statedElements, element] : [element],
          this._statedElements,
          state,
          reverseState
        );
        this.dispatchEvent('start', { elements: this._statedElements, options: this.options });

        if (this._resetType === 'timeout') {
          this._timer = setTimeout(() => {
            this.clearPrevElements();
          }, this.options.triggerOff as number) as unknown as number;
        }
      }
    } else if (this._resetType === 'view' && this._statedElements && this._statedElements.length) {
      this.clearPrevElements();
    }
  }

  reset(element: InteractionEvent['element']) {
    if (!this._statedElements || !this._statedElements.length) {
      return;
    }

    const hasActiveElement = element && this._marks && this._marks.includes(element.mark);

    if (this._resetType === 'view' && !hasActiveElement) {
      this.clearPrevElements();
    } else if (this._resetType === 'self' && hasActiveElement) {
      this.clearPrevElements();
    }
  }
}
