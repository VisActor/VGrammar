import type { DataFilterOptions, DatazoomFilterValue, IComponent, IDatazoom, IView } from '../types';
import { DataFilterRank, GrammarMarkType } from '../graph';
import { isNil, isString } from '@visactor/vutils';
import { Filter } from './filter';

export class DatazoomFilter extends Filter {
  static type: string = 'datazoom-filter';
  type: string = DatazoomFilter.type;

  static defaultOptions: Omit<DataFilterOptions, 'target'> = {};
  options: DataFilterOptions;

  constructor(view: IView, option?: DataFilterOptions) {
    super(view);
    this.options = Object.assign({}, DatazoomFilter.defaultOptions, option);

    this._marks = view
      .getMarksBySelector(this.options.source)
      .filter(mark => mark.markType === GrammarMarkType.component && (mark as IComponent).componentType === 'datazoom');
    this._data = isString(this.options.target.data)
      ? view.getDataById(this.options.target.data)
      : this.options.target.data;
  }

  protected getEvents() {
    if (!this._marks || this._marks.length === 0) {
      return {};
    }

    const datazoom = this._marks[0] as IDatazoom;

    if (!this._data || !datazoom) {
      return {};
    }

    const filter = this.options.target.filter;
    const transform = this.options.target.transform;

    const getFilterValue = (event: any): DatazoomFilterValue => {
      const startRatio = event.start;
      const endRatio = event.end;
      return {
        startRatio,
        endRatio,
        start: datazoom.invertDatazoomRatio(startRatio),
        end: datazoom.invertDatazoomRatio(endRatio)
      };
    };
    const dataFilter = isString(filter)
      ? (datum: any, filterValue: DatazoomFilterValue) => {
          if (isNil(filterValue.start) || isNil(filterValue.end)) {
            return true;
          }
          const scale = datazoom.getDatazoomMainScale();
          const range = scale.range();
          const datumRatio = (scale.scale(datum[filter]) - range[0]) / (range[range.length - 1] - range[0]);
          return filterValue.startRatio <= datumRatio && filterValue.endRatio >= datumRatio;
        }
      : filter;

    this._filterData(this._data, datazoom, DataFilterRank.datazoom, getFilterValue, dataFilter, transform);

    return {
      // TODO: waiting for datazoom to provide events
      change: this.handleFilter
    };
  }
}
