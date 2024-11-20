import { isNil } from '@visactor/vutils';
import type { ElementHighlightOptions, IMark, IView, InteractionEvent } from '../types';
import { BaseInteraction } from './base';
import { InteractionStateEnum } from '../graph/enums';

export class ElementHighlightByKey extends BaseInteraction<ElementHighlightOptions> {
  static type: string = 'element-highlight-by-key';
  type: string = ElementHighlightByKey.type;

  static defaultOptions: ElementHighlightOptions = {
    highlightState: InteractionStateEnum.highlight,
    blurState: InteractionStateEnum.blur,
    trigger: 'pointerover',
    triggerOff: 'pointerout'
  };
  options: ElementHighlightOptions;
  protected _marks?: IMark[];

  constructor(view: IView, options?: ElementHighlightOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementHighlightByKey.defaultOptions, options);

    this._marks = view.getMarksBySelector(this.options.selector);
  }

  getStartState(): string {
    return this.options.highlightState;
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

  resetAll() {
    const states = [this.options.highlightState, this.options.blurState];

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        el.removeState(states);
      });
    });
  }

  start(element: InteractionEvent['element']) {
    if (element && this._marks && this._marks.includes(element.mark)) {
      const highlightKey = element.key;

      if (isNil(highlightKey)) {
        return;
      }
      this._marks.forEach(mark => {
        mark.elements.forEach(el => {
          const isHighlight = el.key === highlightKey;

          if (isHighlight) {
            el.updateStates({
              [this.options.blurState]: false,
              [this.options.highlightState]: true
            });
          } else {
            el.updateStates({
              [this.options.blurState]: true,
              [this.options.highlightState]: false
            });
          }
        });
      });
    }
  }

  reset(element?: InteractionEvent['element']) {
    if (element) {
      if (this._marks && this._marks.includes(element.mark)) {
        element.removeState([this.options.highlightState, this.options.blurState]);
      }
    } else {
      this.resetAll();
    }
  }

  handleStart = (e: InteractionEvent) => {
    this.start(e.element);
  };

  handleReset = (e: InteractionEvent) => {
    const hasActiveElement = e.element && this._marks && this._marks.includes(e.element.mark);

    if (hasActiveElement) {
      this.resetAll();
    }
  };
}
