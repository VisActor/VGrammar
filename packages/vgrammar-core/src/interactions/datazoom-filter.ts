import type { DataFilterOptions, DatazoomFilterValue, IComponent, IDatazoom, IView } from '../types';
import { DataFilterRank, GrammarMarkType } from '../graph/enums';
import { isNil, isString } from '@visactor/vutils';
import { Filter } from './filter';
import { getScaleRangeRatio } from '../util/scale';

export class DatazoomFilter extends Filter {
  static type: string = 'datazoom-filter';
  type: string = DatazoomFilter.type;

  static defaultOptions: Omit<DataFilterOptions, 'target'> = {};
  options: DataFilterOptions;

  constructor(view: IView, options?: DataFilterOptions) {
    super(view, options);
    this.options = Object.assign({}, DatazoomFilter.defaultOptions, options);

    this._marks = view
      .getMarksBySelector(this.options.source)
      .filter(mark => mark.markType === GrammarMarkType.component && (mark as IComponent).componentType === 'datazoom');
    this._data = isString(this.options.target.data)
      ? view.getDataById(this.options.target.data)
      : this.options.target.data;
  }

  protected getEvents() {
    if (!this._marks || this._marks.length === 0) {
      return [];
    }

    const datazoom = this._marks[0] as IDatazoom;

    if (!this._data || !datazoom) {
      return [];
    }

    const filter = this.options.target.filter;
    const transform = this.options.target.transform;

    const getFilterValue = (event: any): DatazoomFilterValue => {
      const startRatio = event.detail.start;
      const endRatio = event.detail.end;
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
          const datumRatio = getScaleRangeRatio(scale, datum[filter]);

          return filterValue.startRatio <= datumRatio && filterValue.endRatio >= datumRatio;
        }
      : filter;

    this._filterData(this._data, datazoom, DataFilterRank.datazoom, getFilterValue, dataFilter, transform);

    return [
      {
        type: 'change',
        handler: this.handleFilter
      }
    ];
  }
}
