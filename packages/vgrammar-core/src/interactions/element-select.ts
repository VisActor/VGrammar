import type { ElementSelectOptions, IMark, IView, InteractionEvent } from '../types';
import { BaseInteraction } from './base';

export class ElementSelectState extends BaseInteraction {
  static type: string = 'element-select';

  static defaultOptions: ElementSelectOptions = {
    state: 'selected',
    trigger: 'click'
  };
  type: string = 'element-hover';
  options: ElementSelectOptions;
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
    this.options = Object.assign(ElementSelectState.defaultOptions, option);

    this._marks = view.getMarksBySelector(this.options.selector);
  }

  protected getEvents() {
    return {
      [this.options.trigger]: this.handleStart
    };
  }

  handleStart = (e: InteractionEvent) => {
    if (e.element) {
      if (this._marks && this._marks.includes(e.element.mark)) {
        this._marks.forEach(mark => {
          mark.elements.forEach(el => {
            if (el.hasState(this.options.state)) {
              el.removeState(this.options.state);
            }
          });
        });

        e.element.addState(this.options.state);
      }
    }
  };

  handleEnd = (e: InteractionEvent) => {
    if (e.element) {
      if (this._marks && this._marks.includes(e.element.mark)) {
        e.element.removeState(this.options.state);
      }
    }
  };
}
