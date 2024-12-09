import type { ElementHighlightByGraphicNameOptions, IElement, IGlyphElement, IView, InteractionEvent } from '../types';
import { isNil } from '@visactor/vutils';
import { ElementHighlight } from './element-highlight';

export class ElementHighlightByGraphicName extends ElementHighlight {
  static type: string = 'element-highlight-by-graphic-name';
  type: string = ElementHighlightByGraphicName.type;

  options: ElementHighlightByGraphicNameOptions;

  constructor(view: IView, options?: ElementHighlightByGraphicNameOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementHighlightByGraphicName.defaultOptions, options);
    this._marks = view.getMarksBySelector(this.options.selector);
  }

  protected _filterByName(e: InteractionEvent) {
    const name = e?.target?.name;
    return !!name;
  }

  protected _parseTargetKey(e: InteractionEvent, element: IElement | IGlyphElement) {
    return e.target.name;
  }

  start(itemKey: IElement | IGlyphElement | string) {
    if (isNil(itemKey)) {
      return;
    }

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        const isHighlight = el.getGraphicItem()?.name === itemKey;
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

  reset() {
    const states = [this.options.blurState, this.options.highlightState];
    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        el.removeState(states);
      });
    });
  }

  handleStart = (e: InteractionEvent) => {
    if (e && e.element && this._marks.includes(e.element.mark)) {
      const shouldStart = this.options.shouldStart ? this.options.shouldStart(e) : this._filterByName(e);
      if (shouldStart) {
        const itemKey = this._parseTargetKey(e, e.element);
        this.start(itemKey);
      }
    }
  };

  handleReset = (e: InteractionEvent) => {
    if (e && e.element && this._marks.includes(e.element.mark)) {
      this.reset();
    }
  };
}
