import type { DataFilterOptions, IData, IDataFilter, IMark, IView, InteractionEvent } from '../types';
import { BaseInteraction } from './base';
import { isString } from '@visactor/vutils';

export interface FilterMixin {
  view: IView;
  _data?: IData;
  _marks?: IMark[];
  _filterValue: any;
  _dataFilter: IDataFilter;
  handleFilter: (event?: InteractionEvent) => void;
}

export class FilterMixin {
  _filterData(
    data: IData,
    source: IMark | null,
    filterRank: number,
    getFilterValue: (event: any) => any,
    filter?: (data: any[], parameters: any) => boolean,
    transform?: (data: any[], parameters: any) => any[]
  ) {
    const dataGrammar = isString(data) ? this.view.getDataById(data) : data;
    if (dataGrammar) {
      this.handleFilter = (event: InteractionEvent) => {
        const element = event?.element;
        if (!dataGrammar || (source && (!element || element.mark !== source))) {
          return;
        }
        if (getFilterValue) {
          this._filterValue = getFilterValue(event);
        }
        dataGrammar.commit();
        this.view.run();
      };

      this._dataFilter = {
        source: source ? `${source.uid}` : null,
        rank: filterRank,
        filter: (data: any[]) => {
          if (!this._filterValue) {
            return data;
          }
          const filteredData = filter ? data.filter(datum => filter(datum, this._filterValue)) : data;
          return transform ? transform(filteredData, this._filterValue) : filteredData;
        }
      };
      dataGrammar.addDataFilter(this._dataFilter);
    }
    return this;
  }
}

export interface Filter
  extends Pick<FilterMixin, '_data' | '_marks' | '_filterValue' | '_dataFilter' | 'handleFilter' | '_filterData'>,
    BaseInteraction<DataFilterOptions> {}

export abstract class Filter extends BaseInteraction<DataFilterOptions> {
  static defaultOptions: Omit<DataFilterOptions, 'target'> = {};
  options: DataFilterOptions;

  constructor(view: IView, options?: DataFilterOptions) {
    super(view, options);
    if (options.target) {
      this._data = isString(options.target.data) ? view.getDataById(options.target.data) : options.target.data;
    }
  }
}
