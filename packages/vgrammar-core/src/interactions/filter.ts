import type { DataFilterOptions, IComponent, IData, IDataFilter, IElement, IMark, IView } from '../types';
import { BaseInteraction } from './base';
import { GrammarMarkType } from '../graph';
import { isString } from '@visactor/vutils';

export abstract class Filter extends BaseInteraction {
  static defaultOptions: Omit<DataFilterOptions, 'target'> = {};
  options: DataFilterOptions;

  protected _data?: IData;
  protected _marks?: IMark[];
  protected _filterValue: any;
  protected _dataFilter: IDataFilter;
  protected handleFilter: (event: any, element: IElement) => void;

  constructor(view: IView, option?: DataFilterOptions) {
    super(view);
    this._marks = view
      .getMarksBySelector(this.options.selector)
      .filter(mark => mark.markType === GrammarMarkType.component && (mark as IComponent).componentType === 'legend');
    this._data = isString(this.options.target.data)
      ? view.getDataById(this.options.target.data)
      : this.options.target.data;
  }

  protected _filterData(
    data: IData,
    source: IMark,
    filterRank: number,
    getFilterValue: (event: any) => any,
    filter?: (data: any[], parameters: any) => boolean,
    transform?: (data: any[], parameters: any) => any[]
  ) {
    const dataGrammar = isString(data) ? this.view.getDataById(data) : data;
    if (dataGrammar) {
      this.handleFilter = (event: any, element: IElement) => {
        if (!element || element.mark !== source || !dataGrammar) {
          return;
        }
        this._filterValue = getFilterValue(event);
        dataGrammar.commit();
        this.view.runAsync();
      };

      this._dataFilter = {
        source: `${source.uid}`,
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
