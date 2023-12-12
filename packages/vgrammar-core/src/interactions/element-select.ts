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
  protected _isToggle?: boolean;
  protected _marks?: IMark[];

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

    const eventName =
      resetTrigger === 'empty'
        ? trigger
        : resetTrigger && resetTrigger.includes('view:')
        ? resetTrigger.replace('view:', '')
        : resetTrigger;

    if (eventName !== trigger) {
      events.push({ type: eventName as EventType, handler: this.handleReset });
      this._isToggle = false;
    } else {
      this._isToggle = true;
    }

    return events;
  }

  clearPrevElements(isMultiple?: boolean, isActive?: boolean) {
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
  }

  handleStart = (e: InteractionEvent) => {
    const { state, trigger, resetTrigger, reverseState } = this.options;

    if (e.element && this._marks && this._marks.includes(e.element.mark)) {
      this.clearPrevElements(this.options.isMultiple, true);

      if (e.element.hasState(state)) {
        if (resetTrigger === trigger) {
          e.element.removeState(state);

          reverseState && e.element.addState(reverseState);
        }
      } else {
        reverseState && e.element.removeState(reverseState);
        e.element.addState(state);
      }
    } else if (this._isToggle && (resetTrigger === 'empty' || resetTrigger?.includes('view:'))) {
      this.clearPrevElements();
    }
  };

  handleReset = (e: InteractionEvent) => {
    const { resetTrigger, state, reverseState } = this.options;
    const hasActiveElement = e.element && this._marks && this._marks.includes(e.element.mark);

    if (resetTrigger === 'empty' || resetTrigger?.includes('view:')) {
      if (!hasActiveElement) {
        this.clearPrevElements();
      }
    } else if (hasActiveElement) {
      this.clearPrevElements();
    }
  };
}
