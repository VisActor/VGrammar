import { InteractionStateEnum } from '../graph/enums';
import type { ElementActiveOptions, IMark, IView, InteractionEvent } from '../types';
import { BaseInteraction } from './base';

export class ElementActive extends BaseInteraction {
  static type: string = 'element-active';
  type: string = ElementActive.type;

  static defaultOptions: ElementActiveOptions = {
    state: InteractionStateEnum.active,
    trigger: 'pointerover',
    resetTrigger: 'pointerout'
  };
  options: ElementActiveOptions;
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
    this.options = Object.assign({}, ElementActive.defaultOptions, option);

    this._marks = view.getMarksBySelector(this.options.selector);
  }

  protected getEvents() {
    return {
      [this.options.trigger]: this.handleStart,
      [this.options.resetTrigger]: this.handleReset
    };
  }

  handleStart = (e: InteractionEvent) => {
    if (e.element) {
      if (this._marks && this._marks.includes(e.element.mark)) {
        e.element.addState(this.options.state);
      }
    }
  };

  handleReset = (e: InteractionEvent) => {
    if (e.element) {
      if (this._marks && this._marks.includes(e.element.mark)) {
        e.element.removeState(this.options.state);
      }
    }
  };
}
