import { InteractionStateEnum } from '../graph/enums';
import type {
  ElementHighlightByLegendOptions,
  IElement,
  IGlyphElement,
  IMark,
  IView,
  InteractionEvent
} from '../types';
import { BaseInteraction } from './base';
import { LegendEvent } from '@visactor/vrender-components';
import { isNil } from '@visactor/vutils';

export class ElementHighlightByLegend extends BaseInteraction {
  static type: string = 'element-highlight-by-legend';
  type: string = ElementHighlightByLegend.type;

  static defaultOptions: ElementHighlightByLegendOptions = {
    highlightState: InteractionStateEnum.highlight,
    blurState: InteractionStateEnum.blur,
    filterType: 'groupKey'
  };
  options: ElementHighlightByLegendOptions;
  private _marks?: IMark[];

  constructor(view: IView, option?: ElementHighlightByLegendOptions) {
    super(view);
    this.options = Object.assign({}, ElementHighlightByLegend.defaultOptions, option);

    this._marks = view.getMarksBySelector(this.options.selector);
  }

  protected getEvents() {
    return {
      [LegendEvent.legendItemHover]: this.handleStart,
      [LegendEvent.legendItemUnHover]: this.handleReset
    };
  }

  handleStart = (e: InteractionEvent, element: IElement | IGlyphElement) => {
    const itemKey = e.detail?.data?.id;

    if (isNil(itemKey)) {
      return;
    }

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        const isHighlight = el[this.options.filterType] === itemKey;

        if (isHighlight) {
          el.removeState(this.options.blurState);
          el.addState(this.options.highlightState);
        } else {
          el.removeState(this.options.highlightState);
          el.addState(this.options.blurState);
        }
      });
    });
  };

  handleReset = (e: InteractionEvent) => {
    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        el.removeState(this.options.blurState);
        el.removeState(this.options.highlightState);
      });
    });
  };
}
