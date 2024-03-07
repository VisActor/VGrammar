import type { DataFilterOptions, IComponent, IScrollbar, IView, ScrollbarFilterValue } from '../types';
import { DataFilterRank, GrammarMarkType } from '../graph/enums';
import { isString } from '@visactor/vutils';
import { Filter } from './filter';

export class ScrollbarFilter extends Filter {
  static type: string = 'scrollbar-filter';
  type: string = ScrollbarFilter.type;

  static defaultOptions: Omit<DataFilterOptions, 'target'> = {};
  options: DataFilterOptions;

  constructor(view: IView, options?: DataFilterOptions) {
    super(view, options);
    this.options = Object.assign({}, ScrollbarFilter.defaultOptions, options);

    this._marks = view
      .getMarksBySelector(this.options.source)
      .filter(
        mark => mark.markType === GrammarMarkType.component && (mark as IComponent).componentType === 'scrollbar'
      );
    this._data = isString(this.options.target.data)
      ? view.getDataById(this.options.target.data)
      : this.options.target.data;
  }

  protected getEvents() {
    if (!this._marks || this._marks.length === 0) {
      return [];
    }

    const scrollbar = this._marks[0] as IScrollbar;

    if (!this._data || !scrollbar) {
      return [];
    }

    const filter = this.options.target.filter;
    const transform = this.options.target.transform;

    const getFilterValue = (event: any) => {
      if (isString(filter)) {
        const range = event.detail.value;
        const scaleGrammar = scrollbar.getScale();
        if (scaleGrammar) {
          const scale = scaleGrammar.getScale();
          const scaleRange = scale.range();
          const start = scale.invert(range[0] * (scaleRange[1] - scaleRange[0]) + scaleRange[0]);
          const end = scale.invert(range[1] * (scaleRange[1] - scaleRange[0]) + scaleRange[0]);
          return { start, end, startRatio: range[0], endRatio: range[1] };
        }
        return { startRatio: range[0], endRatio: range[1] };
      }
      return { startRatio: event.detail.value[0], endRatio: event.detail.value[1] };
    };
    const dataFilter = isString(filter)
      ? (datum: any, filterValue: ScrollbarFilterValue) => {
          const scaleGrammar = scrollbar.getScale();
          const scale = scaleGrammar.getScale();
          const range = scale.range();
          const datumRatio = (scale.scale(datum[filter]) - range[0]) / (range[range.length - 1] - range[0]);
          return filterValue.startRatio <= datumRatio && filterValue.endRatio >= datumRatio;
        }
      : filter;

    this._filterData(this._data, scrollbar, DataFilterRank.scrollbar, getFilterValue, dataFilter, transform);

    return [
      {
        type: 'scrollUp',
        handler: this.handleFilter
      },
      {
        type: 'scrollDrag',
        handler: this.handleFilter
      }
    ];
  }
}
