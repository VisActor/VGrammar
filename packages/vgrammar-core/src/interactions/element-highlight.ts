import { InteractionStateEnum } from '../graph/enums';
import type { ElementHighlightOptions, IMark, IView, InteractionEvent } from '../types';
import { BaseInteraction } from './base';

export class ElementHighlight extends BaseInteraction<ElementHighlightOptions> {
  static type: string = 'element-highlight';
  type: string = ElementHighlight.type;

  static defaultOptions: ElementHighlightOptions = {
    highlightState: InteractionStateEnum.highlight,
    blurState: InteractionStateEnum.blur,
    trigger: 'pointerover',
    resetTrigger: 'pointerout'
  };
  options: ElementHighlightOptions;
  protected _marks?: IMark[];

  constructor(view: IView, options?: ElementHighlightOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementHighlight.defaultOptions, options);

    this._marks = view.getMarksBySelector(this.options.selector);
  }

  protected getEvents() {
    return [
      {
        type: this.options.trigger,
        handler: this.handleStart
      },
      { type: this.options.resetTrigger, handler: this.handleReset }
    ];
  }

  clearPrevElements() {
    const { highlightState, blurState } = this.options;

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        if (highlightState && el.hasState(highlightState)) {
          el.removeState(highlightState);
        }

        if (blurState && el.hasState(blurState)) {
          el.removeState(blurState);
        }
      });
    });
  }

  handleStart = (e: InteractionEvent) => {
    if (e.element && this._marks && this._marks.includes(e.element.mark)) {
      const { highlightState, blurState } = this.options;

      this._marks.forEach(mark => {
        mark.elements.forEach(el => {
          const isHighlight = el === e.element;

          if (isHighlight) {
            el.removeState(blurState);
            el.addState(highlightState);
          } else {
            el.removeState(highlightState);
            el.addState(blurState);
          }
        });
      });
    }
  };

  handleReset = (e: InteractionEvent) => {
    const hasActiveElement = e.element && this._marks && this._marks.includes(e.element.mark);

    if (hasActiveElement) {
      this.clearPrevElements();
    }
  };
}
