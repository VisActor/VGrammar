import type { IGraphic } from '@visactor/vrender';
import type { DataZoomAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { DataZoom as DatazoomComponent } from '@visactor/vrender-components';
import { isNil, isString, merge } from '@visactor/vutils';
import { ComponentDataRank, ComponentEnum } from '../graph';
import { defaultTheme } from '../theme/default';
import type {
  BaseSignleEncodeSpec,
  ChannelEncodeType,
  IData,
  IElement,
  IGroupMark,
  IView,
  Nil,
  RecursivePartial,
  ScaleEncodeType,
  StateEncodeSpec
} from '../types';
import type { DatazoomFilterValue, DatazoomSpec, IDatazoom } from '../types/component';
import { getComponent, registerComponent } from '../view/register-component';
import { invokeEncoder } from '../graph/mark/encode';
import { Component } from '../view/component';
import { parseEncodeType } from '../parse/mark';

registerComponent(
  ComponentEnum.datazoom,
  (attrs: DataZoomAttributes) => new DatazoomComponent(attrs) as unknown as IGraphic
);

export const generateDatazoomAttributes = (
  data: any[],
  x: ScaleEncodeType,
  y: ScaleEncodeType,
  x1: ChannelEncodeType,
  y1: ChannelEncodeType,
  element: IElement,
  parameters: any,
  addition?: RecursivePartial<DataZoomAttributes>
): DataZoomAttributes => {
  const datazoomTheme = defaultTheme.datazoom;
  if (!data) {
    return merge({}, datazoomTheme, addition ?? {});
  }
  const previewXCallback = x ? (datum: any) => invokeEncoder({ x }, datum, element, parameters).x : null;
  const previewYCallback = y ? (datum: any) => invokeEncoder({ y }, datum, element, parameters).y : null;
  const previewX1Callback = x1
    ? (datum: any) => invokeEncoder({ x1 } as BaseSignleEncodeSpec, datum, element, parameters).x1
    : null;
  const previewY1Callback = y1
    ? (datum: any) => invokeEncoder({ y1 } as BaseSignleEncodeSpec, datum, element, parameters).y1
    : null;
  return merge(
    {},
    datazoomTheme,
    { previewData: data, previewXCallback, previewYCallback, previewX1Callback, previewY1Callback },
    addition ?? {}
  );
};

export class Datazoom extends Component implements IDatazoom {
  protected declare spec: DatazoomSpec;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.datazoom, group);
    this.spec.componentType = ComponentEnum.datazoom;
  }

  protected parseAddition(spec: DatazoomSpec) {
    super.parseAddition(spec);
    this.preview(spec.preview?.data, spec.preview?.x, spec.preview?.y, spec.preview?.x1, spec.preview?.y1);
    this.target(spec.target?.data, spec.target?.filter);
    this._updateComponentEncoders();
    return this;
  }

  preview(
    data: IData | string | Nil,
    x: ScaleEncodeType | Nil,
    y: ScaleEncodeType | Nil,
    x1?: ChannelEncodeType | Nil,
    y1?: ChannelEncodeType | Nil
  ) {
    if (!isNil(this.spec.preview)) {
      const lastData = this.spec.preview.data;
      const lastDataGrammar = isString(lastData) ? this.view.getDataById(lastData) : lastData;
      this.detach(lastDataGrammar);
      this.detach(parseEncodeType(this.spec.preview.x, this.view));
      this.detach(parseEncodeType(this.spec.preview.y, this.view));
      this.detach(parseEncodeType(this.spec.preview.x1, this.view));
      this.detach(parseEncodeType(this.spec.preview.y1, this.view));
    }
    this.spec.preview = undefined;
    if (data) {
      this.spec.preview = { data, x, y, x1, y1 };
      const dataGrammar = isString(data) ? this.view.getDataById(data) : data;
      this.attach(dataGrammar);
      this.attach(parseEncodeType(x, this.view));
      this.attach(parseEncodeType(y, this.view));
      this.attach(parseEncodeType(x1, this.view));
      this.attach(parseEncodeType(y1, this.view));
    }
    this._updateComponentEncoders();
    this.commit();
    return this;
  }

  target(data: IData | string | Nil, filter: string | ((datum: any, value: DatazoomFilterValue) => boolean) | Nil) {
    const lastData = this.spec.target?.data;
    const lastDataGrammar = isString(lastData) ? this.view.getDataById(lastData) : lastData;
    // FIXME: datazoom should emit change event
    const datazoom = this.elements[0]?.getGraphicItem?.() as unknown as DatazoomComponent;
    if (lastDataGrammar && datazoom) {
      datazoom.setUpdateStateCallback(null);
    }
    this.spec.target = undefined;
    const dataGrammar = isString(data) ? this.view.getDataById(data) : data;
    const getFilterValue = (event: any): DatazoomFilterValue => {
      const startRatio = event.start;
      const endRatio = event.end;
      return {
        startRatio,
        endRatio,
        start: this._invertDatazoomRatio(startRatio),
        end: this._invertDatazoomRatio(endRatio)
      };
    };
    const dataFilter = isString(filter)
      ? (datum: any, filterValue: DatazoomFilterValue) => {
          if (isNil(filterValue.start) || isNil(filterValue.end)) {
            return true;
          }
          const scale = this._getDatazoomMainScale();
          const range = scale.range();
          const datumRatio = (scale.scale(datum[filter]) - range[0]) / (range[range.length - 1] - range[0]);
          return filterValue.startRatio <= datumRatio && filterValue.endRatio >= datumRatio;
        }
      : filter;
    this._filterData(lastDataGrammar, dataGrammar, ComponentDataRank.datazoom, getFilterValue, dataFilter);
    if (dataGrammar && datazoom) {
      datazoom.setUpdateStateCallback((start: number, end: number) => {
        this._filterCallback({ start, end }, this.elements[0]);
      });
      this.spec.target = { data: dataGrammar, filter };
    }
    return this;
  }

  setStartEndValue(start?: number, end?: number) {
    const datazoom = this.elements[0]?.getGraphicItem?.() as unknown as DatazoomComponent;
    datazoom.setStartAndEnd(start, end);
    return this;
  }

  addGraphicItem(attrs: any, groupKey?: string) {
    const initialAttributes = Object.assign({}, defaultTheme.datazoom, attrs);
    const graphicItem = getComponent(this.componentType).creator(initialAttributes);
    const datazoom = graphicItem as unknown as DatazoomComponent;
    // FIXME: remove this logic when datazoom provides update event.
    if (this._filterCallback) {
      datazoom.setUpdateStateCallback((start: number, end: number) => {
        this._filterCallback({ start, end }, this.elements[0]);
      });
    }
    datazoom.setStatePointToData(state => {
      if (this.spec.preview) {
        return this._invertDatazoomRatio(state) ?? state;
      }
      return state;
    });
    return super.addGraphicItem(initialAttributes, groupKey, graphicItem);
  }

  protected _updateComponentEncoders() {
    const data = this.spec.preview?.data;
    const dataGrammar = isString(data) ? this.view.getDataById(data) : data;
    const encoders = Object.assign({ update: {} }, this.spec.encode);
    const componentEncoders: StateEncodeSpec = Object.keys(encoders).reduce((res, state) => {
      const encoder = encoders[state];
      if (encoder) {
        res[state] = {
          callback: (datum: any, element: IElement, parameters: any) => {
            const addition = invokeEncoder(encoder as BaseSignleEncodeSpec, datum, element, parameters);
            return generateDatazoomAttributes(
              dataGrammar?.getValue?.(),
              this.spec.preview?.x,
              this.spec.preview?.y,
              this.spec.preview?.x1,
              this.spec.preview?.y1,
              element,
              parameters,
              addition
            );
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }

  private _invertDatazoomRatio(ratio: number): any {
    const scale = this._getDatazoomMainScale();
    if (scale) {
      const range = scale.range();
      const scaledValue = (range[range.length - 1] - range[0]) * ratio + range[0];
      return scale.invert(scaledValue);
    }
    return null;
  }

  private _getDatazoomMainScale() {
    const datazoom = this.elements[0]?.getGraphicItem?.() as unknown as DatazoomComponent;
    if (datazoom && this.spec.preview) {
      const isHorizontal = datazoom.attribute.orient === 'top' || datazoom.attribute.orient === 'bottom';
      const scale = isHorizontal ? this.spec.preview.x?.scale : this.spec.preview.y?.scale;
      const scaleGrammar = isString(scale) ? this.view.getScaleById(scale) : scale;
      return scaleGrammar?.getScale();
    }
    return null;
  }
}
