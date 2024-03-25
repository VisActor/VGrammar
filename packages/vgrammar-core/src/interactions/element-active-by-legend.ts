import { InteractionStateEnum } from '../graph/enums';
import type { ElementActiveByLegendOptions, IElement, IGlyphElement, IMark, IView, InteractionEvent } from '../types';
import { BaseInteraction } from './base';
import { LegendEvent } from '@visactor/vrender-components';
import { isNil } from '@visactor/vutils';
import { generateFilterValue } from './utils';

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
    return [
      {
        type: LegendEvent.legendItemHover,
        handler: this.handleStart
      },
      {
        type: LegendEvent.legendItemUnHover,
        handler: this.handleReset
      }
    ];
  }

  getStartState(): string {
    return this.options.state;
  }

  start(element: IElement | IGlyphElement | string) {
    const itemKey = element;

    if (isNil(itemKey)) {
      return;
    }

    const filterValue = generateFilterValue(this.options);

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        const isActive = filterValue(el) === itemKey;

        if (isActive) {
          el.addState(this.options.state);
        } else {
          el.removeState(this.options.state);
        }
      });
    });
  }

  reset() {
    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        el.removeState(this.options.state);
      });
    });
  }

  handleStart = (e: InteractionEvent) => {
    this.start(e.detail?.data?.id);
  };

  handleReset = (e: InteractionEvent) => {
    this.reset();
  };
}
