import type { IPolygon } from '@visactor/vrender';
import type { BrushFilterOptions, IData, IElement, IGlyphElement, IView } from '../types';
import { BrushBase } from './brush-base';
import { isString, type IBounds, array } from '@visactor/vutils';
import { ComponentDataRank } from '../graph';

export class BrushFilter extends BrushBase<BrushFilterOptions> {
  static type: string = 'brush-filter';
  type: string = BrushFilter.type;

  static defaultOptions: Omit<BrushFilterOptions, 'target'> = {};

  private _data: IData;
  private _filterValue: any = null;

  constructor(view: IView, option?: BrushFilterOptions) {
    super(view, Object.assign({}, BrushFilter.defaultOptions, option));
    this._data = isString(this.options.target.data)
      ? view.getDataById(this.options.target.data)
      : this.options.target.data;
  }

  protected getEvents() {
    if (this._data) {
      return {};
    }

    const dataFilter = {
      source: '',
      rank: ComponentDataRank.brush,
      filter: (data: any[]) => {
        if (!this._filterValue) {
          return data;
        }
        return this._filterValue;
      }
    };
    this._data.addDataFilter(dataFilter);

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
        this._data.commit();
        this.view.runAsync();
      }
    }

    this.dispatchEvent(options, elements);
  };
}
