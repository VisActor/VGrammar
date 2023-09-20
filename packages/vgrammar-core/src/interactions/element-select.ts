import { InteractionStateEnum } from '../graph/enums';
import type { ElementSelectOptions, IMark, IView, InteractionEvent } from '../types';
import { BaseInteraction } from './base';

export class ElementSelect extends BaseInteraction {
  static type: string = 'element-select';
  type: string = ElementSelect.type;

  static defaultOptions: ElementSelectOptions = {
    state: InteractionStateEnum.selected,
    trigger: 'click'
  };
  options: ElementSelectOptions;
  private _isToggle?: boolean;
  private _marks?: IMark[];

  constructor(
    view: IView,
    option?: {
      selector?: string | string[];
      startTrigger?: string;
      endTrigger?: string;
      state?: string;
    }
  ) {
    super(view);
    this.options = Object.assign({}, ElementSelect.defaultOptions, option);

    this._marks = view.getMarksBySelector(this.options.selector);
  }

  protected getEvents() {
    const events = {
      [this.options.trigger]: this.handleStart
    };

    const eventName =
      this.options.resetTrigger === 'empty'
        ? this.options.trigger
        : this.options.resetTrigger.includes('view:')
        ? this.options.resetTrigger.replace('view:', '')
        : this.options.resetTrigger;

    if (eventName !== this.options.trigger) {
      events[eventName] = this.handleReset;
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
