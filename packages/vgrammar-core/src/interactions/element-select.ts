import { isNumber, isString } from '@visactor/vutils';
import { InteractionStateEnum } from '../graph/enums';
import type { ElementSelectOptions, EventType, IMark, IView, InteractionEvent } from '../types';
import { BaseInteraction } from './base';

export class ElementSelect extends BaseInteraction<ElementSelectOptions> {
  static type: string = 'element-select';
  type: string = ElementSelect.type;

  static defaultOptions: ElementSelectOptions = {
    state: InteractionStateEnum.selected,
    trigger: 'click'
  };
  options: ElementSelectOptions;
  protected _resetType?: 'view' | 'self' | 'timeout';
  protected _marks?: IMark[];
  private _timer?: number;

  constructor(view: IView, options?: ElementSelectOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementSelect.defaultOptions, options);

    this._marks = view.getMarksBySelector(this.options.selector);
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

  clearPrevElements = (isMultiple?: boolean, isActive?: boolean) => {
    const { state, reverseState } = this.options;

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        if (!isMultiple && el.hasState(state)) {
          el.removeState(state);
        }

        if (reverseState) {
          if (isActive) {
            el.addState(reverseState);
          } else {
            el.removeState(reverseState);
          }
        }
      });
    });
  };

  handleStart = (e: InteractionEvent) => {
    const { state, reverseState } = this.options;

    if (e.element && this._marks && this._marks.includes(e.element.mark)) {
      this.clearPrevElements(this.options.isMultiple, true);

      if (e.element.hasState(state)) {
        if (this._resetType === 'self') {
          e.element.removeState(state);

          reverseState && e.element.addState(reverseState);
        }
      } else {
        if (this._timer) {
          clearTimeout(this._timer);
        }

        reverseState && e.element.removeState(reverseState);
        e.element.addState(state);

        if (this._resetType === 'timeout') {
          this._timer = setTimeout(() => {
            this.clearPrevElements();
          }, this.options.resetTrigger as number) as unknown as number;
        }
      }
    } else if (this._resetType === 'view') {
      this.clearPrevElements();
    }
  };

  handleReset = (e: InteractionEvent) => {
    const hasActiveElement = e.element && this._marks && this._marks.includes(e.element.mark);

    if (this._resetType === 'view' && !hasActiveElement) {
      this.clearPrevElements();
    } else if (this._resetType === 'self' && hasActiveElement) {
      this.clearPrevElements();
    }
  };
}
