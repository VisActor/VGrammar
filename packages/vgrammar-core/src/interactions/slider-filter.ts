import type { DataFilterOptions, IComponent, ISlider, IView, SliderFilterValue } from '../types';
import { DataFilterRank, GrammarMarkType } from '../graph/enums';
import { isString } from '@visactor/vutils';
import { Filter } from './filter';

export class SliderFilter extends Filter {
  static type: string = 'slider-filter';
  type: string = SliderFilter.type;

  static defaultOptions: Omit<DataFilterOptions, 'target'> = {};
  options: DataFilterOptions;

  constructor(view: IView, options?: DataFilterOptions) {
    super(view, options);
    this.options = Object.assign({}, SliderFilter.defaultOptions, options);

    this._marks = view
      .getMarksBySelector(this.options.source)
      .filter(mark => mark.markType === GrammarMarkType.component && (mark as IComponent).componentType === 'slider');
    this._data = isString(this.options.target.data)
      ? view.getDataById(this.options.target.data)
      : this.options.target.data;
  }

  protected getEvents() {
    if (!this._marks || this._marks.length === 0) {
      return [];
    }

    const slider = this._marks[0] as ISlider;

    if (!this._data || !slider) {
      return [];
    }

    const filter = this.options.target.filter;
    const transform = this.options.target.transform;

    const getFilterValue = (event: any) => ({ start: event.detail.value[0], end: event.detail.value[1] });
    const dataFilter = isString(filter)
      ? (datum: any, filterValue: SliderFilterValue) =>
          datum[filter] >= filterValue.start && datum[filter] <= filterValue.end
      : filter;

    this._filterData(this._data, slider, DataFilterRank.slider, getFilterValue, dataFilter, transform);

    return [
      {
        type: 'change',
        handler: this.handleFilter
      }
    ];
  }
}
