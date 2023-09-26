import { InteractionStateEnum } from '../graph/enums';
import type { ElementActiveByLegendOptions, IElement, IGlyphElement, IMark, IView, InteractionEvent } from '../types';
import { BaseInteraction } from './base';
import { LegendEvent } from '@visactor/vrender-components';
import { isNil } from '@visactor/vutils';

export class ElementActiveByLegend extends BaseInteraction<ElementActiveByLegendOptions> {
  static type: string = 'element-active-by-legend';
  type: string = ElementActiveByLegend.type;

  static defaultOptions: ElementActiveByLegendOptions = {
    state: InteractionStateEnum.active,
    filterType: 'groupKey'
  };
  options: ElementActiveByLegendOptions;
  protected _marks?: IMark[];

  constructor(view: IView, options?: ElementActiveByLegendOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementActiveByLegend.defaultOptions, options);

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
        const isActive = el[this.options.filterType] === itemKey;

        if (isActive) {
          el.addState(this.options.state);
        } else {
          el.removeState(this.options.state);
        }
      });
    });
  };

  handleReset = (e: InteractionEvent) => {
    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        if (el.hasState(this.options.state)) {
          el.removeState(this.options.state);
        }
      });
    });
  };
}
