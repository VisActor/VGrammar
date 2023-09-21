import { LegendEvent } from '@visactor/vrender-components';
import type { DataFilterOptions, IComponent, ILegend, IView, InteractionEvent } from '../types';
import { ComponentDataRank, GrammarMarkType } from '../graph';
import { isString } from '@visactor/vutils';
import { Filter } from './filter';

export class LegendFilter extends Filter {
  static type: string = 'legend-filter';
  type: string = LegendFilter.type;

  static defaultOptions: Omit<DataFilterOptions, 'target'> = {};
  options: DataFilterOptions;

  constructor(view: IView, option?: DataFilterOptions) {
    super(view);
    this.options = Object.assign({}, LegendFilter.defaultOptions, option);

    this._marks = view
      .getMarksBySelector(this.options.selector)
      .filter(mark => mark.markType === GrammarMarkType.component && (mark as IComponent).componentType === 'legend');
    this._data = isString(this.options.target.data)
      ? view.getDataById(this.options.target.data)
      : this.options.target.data;
  }

  protected getEvents() {
    if (!this._marks || this._marks.length === 0) {
      return {};
    }

    const legend = this._marks[0] as ILegend;

    if (!this._data || !legend) {
      return {};
    }

    const isContinuous = legend.isContinuousLegend();
    const filter = this.options.target.filter;

    const getFilterValue = (event: InteractionEvent) =>
      isContinuous ? { start: event.detail.value[0], end: event.detail.value[1] } : event.detail.currentSelected;
    const dataFilter = isString(filter)
      ? isContinuous
        ? (datum: any, filterValue: { start: number; end: number }) =>
            datum[filter] >= filterValue.start && datum[filter] <= filterValue.end
        : (datum: any, filterValue: any[]) => filterValue.includes(datum[filter])
      : filter;

    this._filterData(this._data, legend, ComponentDataRank.legend, getFilterValue, dataFilter);

    const eventName = isContinuous ? 'change' : LegendEvent.legendItemClick;
    return {
      [eventName]: this.handleFilter
    };
  }
}
