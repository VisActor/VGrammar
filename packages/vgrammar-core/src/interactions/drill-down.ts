import type { IPolygon } from '@visactor/vrender-core';
import type { DrillDownOptions, IElement, IGlyphElement, IView, InteractionEvent } from '../types';
import { BrushBase } from './brush-base';
import { isString, type IBounds, array } from '@visactor/vutils';
import { DataFilterRank } from '../graph';
import type { FilterMixin } from './filter';

export interface DrillDown
  extends Pick<FilterMixin, '_data' | '_filterValue' | '_dataFilter' | 'handleFilter' | '_filterData'>,
    BrushBase<DrillDownOptions> {}

export class DrillDown extends BrushBase<DrillDownOptions> {
  static type: string = 'drill-down';
  type: string = DrillDown.type;

  static defaultOptions: Omit<DrillDownOptions, 'target'> = {
    brush: false,
    trigger: 'click'
  };

  constructor(view: IView, option?: DrillDownOptions) {
    super(view, Object.assign({}, DrillDown.defaultOptions, option));
    this._data = isString(this.options.target.data)
      ? view.getDataById(this.options.target.data)
      : this.options.target.data;
  }

  protected getEvents() {
    if (!this._data) {
      return [];
    }

    const transform = this.options.target.transform;
    const dataTransform = (data: any[], filterValue: any) => {
      const nextData = !filterValue ? data : filterValue;
      return transform ? transform(data, filterValue) : nextData;
    };

    this._filterData(this._data, null, DataFilterRank.drillDown, null, undefined, dataTransform);

    if (this.options.brush) {
      return super.getEvents();
    }
    return [
      {
        type: this.options.trigger,
        handler: this.handleTrigger
      }
    ];
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

  handleTrigger = (event: InteractionEvent) => {
    const element = event.element;
    if (element && this._marks && this._marks.includes(element.mark)) {
      const filterValue = array(element.getDatum());
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
  };
}
