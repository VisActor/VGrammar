import { InteractionStateEnum } from '../graph/enums';
import type { ElementActiveOptions, IMark, IView, InteractionEvent } from '../types';
import { BaseInteraction } from './base';

export class ElementActive extends BaseInteraction<ElementActiveOptions> {
  static type: string = 'element-active';
  type: string = ElementActive.type;

  static defaultOptions: ElementActiveOptions = {
    state: InteractionStateEnum.active,
    trigger: 'pointerover',
    resetTrigger: 'pointerout'
  };
  options: ElementActiveOptions;
  protected _marks?: IMark[];

  constructor(view: IView, options?: ElementActiveOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementActive.defaultOptions, options);

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
