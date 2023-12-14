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
    resetTrigger: 'pointerout'
  };
  options: ElementHighlightOptions;
  protected _marks?: IMark[];

  constructor(view: IView, options?: ElementHighlightOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementHighlightByKey.defaultOptions, options);

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
    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        el.removeState(this.options.highlightState);
        el.removeState(this.options.blurState);
      });
    });
  }

  handleStart = (e: InteractionEvent) => {
    if (e.element && this._marks && this._marks.includes(e.element.mark)) {
      const highlightKey = e.element.key;

      if (isNil(highlightKey)) {
        return;
      }
      this._marks.forEach(mark => {
        mark.elements.forEach(el => {
          const isHighlight = el.key === highlightKey;

          if (isHighlight) {
            el.removeState(this.options.blurState);
            el.addState(this.options.highlightState);
          } else {
            el.removeState(this.options.highlightState);
            el.addState(this.options.blurState);
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
