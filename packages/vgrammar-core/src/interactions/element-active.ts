import { InteractionStateEnum } from '../graph/enums';
import type { ElementActiveOptions, IElement, IMark, IView, InteractionEvent } from '../types';
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
  protected _prevActiveElement?: IElement;

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
        this._prevActiveElement = element;
      }
    }
  }

  reset(element?: InteractionEvent['element']) {
    const el = element ?? this._prevActiveElement;

    if (el) {
      if (this._marks && this._marks.includes(el.mark)) {
        el.removeState(this.options.state);
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
