import type { IGraphic } from '@visactor/vrender-core';
import type { DataZoomAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { DataZoom as DatazoomComponent } from '@visactor/vrender-components';
import { isNil, isString, merge, mixin } from '@visactor/vutils';
import { ComponentEnum } from '../graph/enums';
import type {
  BaseSignleEncodeSpec,
  ChannelEncodeType,
  IData,
  IElement,
  IGroupMark,
  ITheme,
  IView,
  Nil,
  RecursivePartial,
  ScaleEncodeType,
  StateEncodeSpec
} from '../types';
import type { DatazoomSpec, IDatazoom } from '../types/component';
import { invokeEncoder } from '../graph/mark/encode';
import { Component } from '../view/component';
import { parseEncodeType } from '../parse/mark';
import { Factory } from '../core/factory';
import { DatazoomFilter } from '../interactions/datazoom-filter';
import { Filter, FilterMixin } from '../interactions/filter';

export const generateDatazoomAttributes = (
  data: any[],
  theme?: ITheme,
  addition?: RecursivePartial<DataZoomAttributes>
): DataZoomAttributes => {
  const datazoomTheme = theme?.components?.datazoom;
  if (!data) {
    return merge({}, datazoomTheme, addition ?? {});
  }

  return merge({}, datazoomTheme, { previewData: data }, addition ?? {});
};

export class Datazoom extends Component implements IDatazoom {
  static readonly componentType: string = ComponentEnum.datazoom;
  protected declare spec: DatazoomSpec;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.datazoom, group);
    this.spec.componentType = ComponentEnum.datazoom;
  }

  protected parseAddition(spec: DatazoomSpec) {
    super.parseAddition(spec);
    this.preview(spec.preview?.data, spec.preview?.x, spec.preview?.y, spec.preview?.x1, spec.preview?.y1);
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

  setStartEndValue(start?: number, end?: number) {
    const datazoom = this.elements[0]?.getGraphicItem?.() as unknown as DatazoomComponent;
    datazoom?.setStartAndEnd?.(start, end);
    return this;
  }

  getStartEndValue() {
    const datazoom = this.elements[0]?.getGraphicItem?.() as unknown as DatazoomComponent;

    if (datazoom) {
      const state = datazoom.state;
      return {
        start: state.start,
        end: state.end
      };
    }

    return null;
  }

  addGraphicItem(attrs: any, groupKey?: string) {
    const theme = this.spec.skipTheme ? null : this.view.getCurrentTheme();
    const initialAttributes = Object.assign({}, theme?.components?.datazoom, attrs);
    const graphicItem = Factory.createGraphicComponent(this.componentType, initialAttributes, {
      skipDefault: this.spec.skipTheme
    });
    const datazoom = graphicItem as unknown as DatazoomComponent;
    datazoom.setStatePointToData(state => {
      if (this.spec.preview) {
        return this.invertDatazoomRatio(state) ?? state;
      }
      return state;
    });

    datazoom.setPreviewPointsX((datum: any) => {
      if (this.spec.preview?.x && this.spec.preview?.data) {
        return invokeEncoder({ x: this.spec.preview.x }, datum, this.elements[0], this.parameters()).x;
      }

      return undefined;
    });
    datazoom.setPreviewPointsY((datum: any) => {
      if (this.spec.preview?.y && this.spec.preview?.data) {
        return invokeEncoder({ y: this.spec.preview.y }, datum, this.elements[0], this.parameters()).y;
      }

      return undefined;
    });

    datazoom.setPreviewPointsX1((datum: any) => {
      if (this.spec.preview?.x1 && this.spec.preview?.data) {
        return invokeEncoder({ x1: this.spec.preview.x1 }, datum, this.elements[0], this.parameters()).x1;
      }

      return undefined;
    });
    datazoom.setPreviewPointsY1((datum: any) => {
      if (this.spec.preview?.y1 && this.spec.preview?.data) {
        return invokeEncoder({ y1: this.spec.preview.y1 }, datum, this.elements[0], this.parameters()).y1;
      }

      return undefined;
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
            const theme = this.spec.skipTheme ? null : this.view.getCurrentTheme();
            const addition = invokeEncoder(encoder as BaseSignleEncodeSpec, datum, element, parameters);
            return generateDatazoomAttributes(dataGrammar?.getValue?.(), theme, addition);
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }

  invertDatazoomRatio(ratio: number): any {
    const scale = this.getDatazoomMainScale();
    if (scale) {
      const range = scale.range();
      const scaledValue = (range[range.length - 1] - range[0]) * ratio + range[0];
      return scale.invert(scaledValue);
    }
    return null;
  }

  getDatazoomMainScale() {
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

export const registerDataZoom = () => {
  Factory.registerGraphicComponent(
    ComponentEnum.datazoom,
    (attrs: DataZoomAttributes) => new DatazoomComponent(attrs) as unknown as IGraphic
  );

  Factory.registerComponent(ComponentEnum.datazoom, Datazoom);

  mixin(Filter, FilterMixin);
  Factory.registerInteraction(DatazoomFilter.type, DatazoomFilter);
};
