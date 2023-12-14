import { InteractionStateEnum } from '../graph/enums';
import type { ElementHighlightOptions, IElement, IGlyphElement, IMark, IView, InteractionEvent } from '../types';
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
  protected _lastElement?: IElement;
  protected _hasBlur?: boolean;

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
    let hasReset = false;
    const resetElements: (IElement | IGlyphElement)[] = [];

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        hasReset = el.removeState(highlightState);
        el.removeState(blurState);

        if (hasReset) {
          resetElements.push(el);
        }
      });
    });

    if (resetElements.length) {
      this.dispatchEvent('reset', { elements: resetElements, options: this.options });
    }

    this._lastElement = null;
    this._hasBlur = false;
  }

  handleStart = (e: InteractionEvent) => {
    if (e.element && this._marks && this._marks.includes(e.element.mark)) {
      const { highlightState, blurState } = this.options;

      if (this._lastElement === e.element) {
        return;
      }

      let hasHighlight = false;

      if (this._lastElement && this._hasBlur) {
        this._lastElement.removeState(highlightState);
        this._lastElement.addState(blurState);

        e.element.removeState(blurState);
        hasHighlight = e.element.addState(highlightState);
      } else {
        let hasBlur = false;

        this._marks.forEach(mark => {
          mark.elements.forEach(el => {
            const isHighlight = el === e.element;

            if (isHighlight) {
              el.removeState(blurState);
              hasHighlight = el.addState(highlightState);
            } else {
              el.removeState(highlightState);
              hasBlur = el.addState(blurState);

              if (hasBlur) {
                this._hasBlur = true;
              }
            }
          });
        });
      }

      this._lastElement = e.element;

      if (hasHighlight) {
        this.dispatchEvent('start', { elements: [e.element], options: this.options });
      }
    } else if (this._lastElement) {
      this.clearPrevElements();
    }
  };

  handleReset = (e: InteractionEvent) => {
    const hasActiveElement = e.element && this._marks && this._marks.includes(e.element.mark);

    if (hasActiveElement) {
      this.clearPrevElements();
    }
  };
}
