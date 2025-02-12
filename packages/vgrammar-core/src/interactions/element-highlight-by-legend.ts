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
import { generateFilterValue } from './utils';

export class ElementHighlightByLegend extends BaseInteraction<ElementHighlightByLegendOptions> {
  static type: string = 'element-highlight-by-legend';
  type: string = ElementHighlightByLegend.type;

  static defaultOptions: ElementHighlightByLegendOptions = {
    highlightState: InteractionStateEnum.highlight,
    blurState: InteractionStateEnum.blur,
    filterType: 'groupKey'
  };
  options: ElementHighlightByLegendOptions;
  protected _marks?: IMark[];

  constructor(view: IView, options?: ElementHighlightByLegendOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementHighlightByLegend.defaultOptions, options);

    this._marks = view.getMarksBySelector(this.options.selector);
  }

  getStartState(): string {
    return this.options.highlightState;
  }

  protected getEvents() {
    return [
      {
        type: LegendEvent.legendItemHover,
        handler: this.handleStart
      },
      { type: LegendEvent.legendItemUnHover, handler: this.handleReset }
    ];
  }

  start(itemKey: IElement | IGlyphElement | string) {
    if (isNil(itemKey)) {
      return;
    }
    const filterValue = generateFilterValue(this.options);

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        const isHighlight = filterValue(el) === itemKey;

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

  resetAll() {
    const states = [this.options.highlightState, this.options.blurState];

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        el.removeState(states);
      });
    });
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

  handleStart = (e: InteractionEvent, element: IElement | IGlyphElement) => {
    this.start(e.detail?.data?.id);
  };

  handleReset = (e: InteractionEvent) => {
    this.resetAll();
  };
}
