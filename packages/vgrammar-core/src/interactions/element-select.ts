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
    const events = [
      {
        type: this.options.trigger,
        handler: this.handleStart
      }
    ];

    const eventName =
      this.options.resetTrigger === 'empty'
        ? this.options.trigger
        : this.options.resetTrigger.includes('view:')
        ? this.options.resetTrigger.replace('view:', '')
        : this.options.resetTrigger;

    if (eventName !== this.options.trigger) {
      events.push({ type: eventName as EventType, handler: this.handleReset });
      this._isToggle = false;
    } else {
      this._isToggle = true;
    }

    return events;
  }

  clearPrevElements() {
    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        if (el.hasState(this.options.state)) {
          el.removeState(this.options.state);
        }
      });
    });
  }

  handleStart = (e: InteractionEvent) => {
    if (e.element && this._marks && this._marks.includes(e.element.mark)) {
      if (!this.options.isMultiple) {
        this.clearPrevElements();
      }

      if (e.element.hasState(this.options.state)) {
        if (this.options.resetTrigger === this.options.trigger) {
          e.element.removeState(this.options.state);
        }
      } else {
        e.element.addState(this.options.state);
      }
    } else if (
      this._isToggle &&
      (this.options.resetTrigger === 'empty' || this.options.resetTrigger.includes('view:'))
    ) {
      this.clearPrevElements();
    }
  };

  handleReset = (e: InteractionEvent) => {
    const hasActiveElement = e.element && this._marks && this._marks.includes(e.element.mark);

    if (this.options.resetTrigger === 'empty' || this.options.resetTrigger.includes('view:')) {
      if (!hasActiveElement) {
        this.clearPrevElements();
      }
    } else if (hasActiveElement) {
      this.clearPrevElements();
    }
  };
}
