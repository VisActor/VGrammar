import { InteractionStateEnum } from '../graph/enums';
import type { ElementActiveOptions, IMark, IView, InteractionEvent } from '../types';
import { BaseInteraction } from './base';

export class ElementActive extends BaseInteraction<ElementActiveOptions> {
  static type: string = 'element-active';
  type: string = ElementActive.type;

  static defaultOptions: ElementActiveOptions = {
    state: InteractionStateEnum.active,
    trigger: 'pointerover',
    triggerOff: 'pointerout'
  };
  options: ElementActiveOptions;
  protected _marks?: IMark[];

  constructor(view: IView, options?: ElementActiveOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementActive.defaultOptions, options);

    this._marks = view.getMarksBySelector(this.options.selector);
  }

  protected getEvents() {
    return [
      {
        type: this.options.trigger,
        handler: this.handleStart
      },
      { type: this.options.triggerOff, handler: this.handleReset }
    ];
  }

  getStartState(): string {
    return this.options.state;
  }

  start(element: InteractionEvent['element']) {
    if (element) {
      if (this._marks && this._marks.includes(element.mark)) {
        element.addState(this.options.state);
      }
    }
  }

  reset(element: InteractionEvent['element']) {
    if (element) {
      if (this._marks && this._marks.includes(element.mark)) {
        element.removeState(this.options.state);
      }
    }
  }

  handleStart = (e: InteractionEvent) => {
    this.start(e.element);
  };

  handleReset = (e: InteractionEvent) => {
    this.reset(e.element);
  };
}
