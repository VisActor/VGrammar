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
import { BaseInteraction } from './base';
import { groupMarksByState } from './utils';

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
    const resetTrigger = this.options.resetTrigger;
    const trigger = this.options.trigger;

    const events = [
      {
        type: trigger,
        handler: this.handleStart
      }
    ];

    let eventName = resetTrigger;

    if (resetTrigger === 'empty') {
      eventName = trigger as EventType;

      this._resetType = 'view';
    } else if (isString(resetTrigger)) {
      if (resetTrigger.includes('view:')) {
        eventName = resetTrigger.replace('view:', '') as EventType;

        this._resetType = 'view';
      } else {
        eventName = resetTrigger;

        this._resetType = 'self';
      }
    } else if (isNumber(resetTrigger)) {
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
    const { state, reverseState, isMultiple } = this.options;

    if (e.element && this._marks && this._marks.includes(e.element.mark)) {
      if (e.element.hasState(state)) {
        if (this._resetType === 'self') {
          if (this._statedElements) {
            this._statedElements = this._statedElements.filter(el => el !== e.element);
          }

          this.updateStates(state, reverseState);
        }
      } else {
        if (this._timer) {
          clearTimeout(this._timer);
        }
        e.element.addState(state);

        if (!this._statedElements) {
          this._statedElements = [];
        }
        if (isMultiple) {
          this._statedElements.push(e.element);
        } else {
          this._statedElements[0] = e.element;
        }
        this.updateStates(state, reverseState);
        this.dispatchEvent('start', { elements: this._statedElements, options: this.options });

        if (this._resetType === 'timeout') {
          this._timer = setTimeout(() => {
            this.clearPrevElements();
          }, this.options.resetTrigger as number) as unknown as number;
        }
      }
    } else if (this._resetType === 'view' && this._statedElements && this._statedElements.length) {
      this.clearPrevElements();
    }
  };

  handleReset = (e: InteractionEvent) => {
    const hasActiveElement = e.element && this._marks && this._marks.includes(e.element.mark);

    if (!this._statedElements || !this._statedElements.length) {
      return;
    }

    if (this._resetType === 'view' && !hasActiveElement) {
      this.clearPrevElements();
    } else if (this._resetType === 'self' && hasActiveElement) {
      this.clearPrevElements();
    }
  };
}
