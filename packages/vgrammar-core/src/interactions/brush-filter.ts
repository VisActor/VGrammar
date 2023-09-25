import type { IPolygon } from '@visactor/vrender';
import type { BrushFilterOptions, IElement, IGlyphElement, IView } from '../types';
import { BrushBase } from './brush-base';
import { isString, type IBounds, array, mixin } from '@visactor/vutils';
import { DataFilterRank } from '../graph';
import { FilterMixin } from './filter';

export interface BrushFilter
  extends Pick<FilterMixin, '_data' | '_filterValue' | '_dataFilter' | 'handleFilter' | '_filterData'>,
    BrushBase<BrushFilterOptions> {}

export class BrushFilter extends BrushBase<BrushFilterOptions> {
  static type: string = 'brush-filter';
  type: string = BrushFilter.type;

  static defaultOptions: Omit<BrushFilterOptions, 'target'> = {};

  constructor(view: IView, option?: BrushFilterOptions) {
    super(view, Object.assign({}, BrushFilter.defaultOptions, option));
    this._data = isString(this.options.target.data)
      ? view.getDataById(this.options.target.data)
      : this.options.target.data;
  }

  protected getEvents() {
    if (!this._data) {
      return {};
    }

    const transform = this.options.target.transform;
    const dataTransform = (data: any[], filterValue: any) => {
      const nextData = !filterValue ? data : filterValue;
      return transform ? transform(data, filterValue) : nextData;
    };

    this._filterData(this._data, null, DataFilterRank.brush, null, undefined, dataTransform);

    return super.getEvents();
  }

  handleBrushUpdate = (options: {
    operateType: string;
    operateMask: IPolygon;
    operatedMaskAABBBounds: { [name: string]: IBounds };
  }) => {
    const elements: (IElement | IGlyphElement)[] = [];

    let filterValue: any[] = [];

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        const isActive = this.isBrushContainGraphicItem(options.operateMask, el.getGraphicItem());

        if (isActive) {
          elements.push(el);
          filterValue = filterValue.concat(array(el.getDatum()));
        }
      });
    });

    if (this._data) {
      // remove repeated datum
      filterValue = Array.from(new Set(filterValue));

      // shallow compare
      if (
        !this._filterValue ||
        filterValue.length !== this._filterValue.length ||
        filterValue.some(datum => !this._filterValue.includes(datum))
      ) {
        this._filterValue = filterValue;
        this.handleFilter();
      }
    }

    this.dispatchEvent(options, elements);
  };
}

mixin(BrushFilter, FilterMixin);
