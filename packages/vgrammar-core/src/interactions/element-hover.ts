import type { ElementHoverOptions, GrammarEvent, IMark, IView } from '../types';
import { BaseInteraction } from './base';

export class ElementHoverState extends BaseInteraction {
  static type: string = 'element-hover';

  static defaultOptions: ElementHoverOptions = {
    state: 'hover',
    startTrigger: 'pointerover',
    endTrigger: 'pointerout'
  };
  type: string = 'element-hover';
  options: ElementHoverOptions;
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
    this.options = Object.assign(ElementHoverState.defaultOptions, option);

    this._marks = view.getMarksBySelector(this.options.selector);
  }

  protected getEvents() {
    return {
      [this.options.startTrigger]: this.handleStart,
      [this.options.endTrigger]: this.handleEnd
    };
  }

  handleStart = (e: GrammarEvent) => {
    if (e.element) {
      if (this._marks && this._marks.includes(e.element.mark)) {
        e.element.addState(this.options.state);
      }
    }
  };

  handleEnd = (e: GrammarEvent) => {
    if (e.element) {
      if (this._marks && this._marks.includes(e.element.mark)) {
        e.element.removeState(this.options.state);
      }
    }
  };
}
