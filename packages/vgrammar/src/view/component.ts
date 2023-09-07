import { isString } from '@visactor/vutils';
import { DefaultKey } from '../graph/constants';
import { GrammarMarkType } from '../graph/enums';
import type {
  IGroupMark,
  IView,
  IComponent,
  ComponentSpec,
  IData,
  Nil,
  MarkFunctionType,
  StateEncodeSpec,
  IElement,
  IDataFilter,
  BaseSignleEncodeSpec
} from '../types';
import { Mark } from './mark';
import { getComponent } from './register-component';

export class Component extends Mark implements IComponent {
  declare markType: GrammarMarkType.component;
  readonly componentType: string;
  protected declare spec: ComponentSpec;

  protected mode?: '2d' | '3d';

  protected _componentDatum = { [DefaultKey]: 0 };
  protected _encoders: StateEncodeSpec;

  protected _filterValue: any;
  protected _filterCallback: (event: any, element: IElement) => void;
  protected _dataFilter: IDataFilter;

  constructor(view: IView, componentType: string, group?: IGroupMark, mode?: '2d' | '3d') {
    super(view, GrammarMarkType.component, group);
    this.componentType = componentType;
    this.spec.type = 'component';
    this.spec.componentType = componentType;
    this.mode = mode;
  }

  configureComponent(config: any) {
    this.spec.componentConfig = config;
    this.commit();
    return this;
  }

  addGraphicItem(attrs: any, groupKey?: string, newGraphicItem?: any) {
    const graphicItem = newGraphicItem ?? getComponent(this.componentType).creator(attrs, this.mode);
    return super.addGraphicItem(attrs, groupKey, graphicItem);
  }

  join(data: IData | string | Nil) {
    return super.join(data, DefaultKey);
  }

  encodeState(state: string, channel: string | BaseSignleEncodeSpec, value?: MarkFunctionType<any>) {
    super.encodeState(state, channel, value);
    this._updateComponentEncoders();
    return this;
  }

  protected _prepareRejoin() {
    this._componentDatum[DefaultKey] += 1;
  }

  protected evaluateJoin(data: any[]) {
    this.spec.key = DefaultKey;
    // component mark do not support data join
    return super.evaluateJoin([this._componentDatum]);
  }

  protected _updateComponentEncoders() {
    this._encoders = this.spec.encode;
  }

  protected _getEncoders() {
    return this._encoders ?? {};
  }

  protected _filterData(
    lastData: IData | Nil,
    data: IData | Nil,
    filterRank: number,
    getFilterValue: (event: any) => any,
    filter?: (data: any[], parameters: any) => boolean,
    transform?: (data: any[], parameters: any) => any[]
  ) {
    // remove last event listener & data filter
    const lastDataGrammar = isString(lastData) ? this.view.getDataById(lastData) : lastData;
    if (lastDataGrammar) {
      // this.view.removeEventListener('change', this._filterCallback);
      lastDataGrammar.removeDataFilter(this._dataFilter);
      this._filterCallback = null;
      this._dataFilter = null;
    }

    // append new event listener & data filter
    const dataGrammar = isString(data) ? this.view.getDataById(data) : data;
    if (dataGrammar) {
      this._filterCallback = (event: any, element: IElement) => {
        if (!element || element.mark !== this || !dataGrammar) {
          return;
        }
        this._filterValue = getFilterValue(event);
        dataGrammar.commit();
        this.view.runAsync();
      };
      // this.view.addEventListener('change', this._filterCallback);

      this._dataFilter = {
        source: `${this.uid}`,
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
    // this.commit();
    return this;
  }
}
