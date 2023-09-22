import type {
  DataFilterOptions,
  IComponent,
  IData,
  IDataFilter,
  IElement,
  IMark,
  IView,
  InteractionEvent
} from '../types';
import { BaseInteraction } from './base';
import { GrammarMarkType } from '../graph';
import { isString, mixin } from '@visactor/vutils';

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
        const element = event.element;
        if (!dataGrammar || (source && (!element || element.mark !== source))) {
          return;
        }
        if (getFilterValue) {
          this._filterValue = getFilterValue(event);
        }
        dataGrammar.commit();
        this.view.runAsync();
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

export abstract class Filter extends BaseInteraction {
  static defaultOptions: Omit<DataFilterOptions, 'target'> = {};
  options: DataFilterOptions;

  protected _data?: IData;
  protected _marks?: IMark[];
  protected _dataFilter: IDataFilter;
  protected handleFilter: (event?: InteractionEvent) => void;
  protected _filterData: (
    data: IData,
    source: IMark | null,
    filterRank: number,
    getFilterValue: (event: any) => any,
    filter?: (data: any[], parameters: any) => boolean,
    transform?: (data: any[], parameters: any) => any[]
  ) => this;

  constructor(view: IView, option?: DataFilterOptions) {
    super(view);
    this._marks = view
      .getMarksBySelector(this.options.source)
      .filter(mark => mark.markType === GrammarMarkType.component && (mark as IComponent).componentType === 'legend');
    this._data = isString(this.options.target.data)
      ? view.getDataById(this.options.target.data)
      : this.options.target.data;
  }
}

mixin(Filter, FilterMixin);
