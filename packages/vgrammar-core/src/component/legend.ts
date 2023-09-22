import type { IGraphic } from '@visactor/vrender-core';
import type { IBaseScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { isContinuous } from '@visactor/vscale';
import type { DiscreteLegendAttrs, ColorLegendAttributes, SizeLegendAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { DiscreteLegend, ColorContinuousLegend, SizeContinuousLegend, LegendEvent } from '@visactor/vrender-components';
import { array, isString, merge, last } from '@visactor/vutils';
import { DataFilterRank, ComponentEnum, LegendEnum } from '../graph';
import type {
  BaseSignleEncodeSpec,
  IData,
  IElement,
  IGroupMark,
  IScale,
  ITheme,
  IView,
  Nil,
  RecursivePartial,
  StateEncodeSpec
} from '../types';
import type { ILegend, LegendSpec, LegendType } from '../types/component';
import { parseColor } from '../parse/util';
import { ScaleComponent } from './scale';
import { invokeEncoder } from '../graph/mark/encode';
import { Factory } from '../core/factory';

export const generateDiscreteLegendAttributes = (
  scale: IBaseScale,
  theme?: ITheme,
  addition?: RecursivePartial<DiscreteLegendAttrs>,
  shapeScale?: IBaseScale
): DiscreteLegendAttrs => {
  const legendTheme = theme?.components?.discreteLegend;
  if (!scale) {
    return merge({}, legendTheme, addition ?? {});
  }
  // get domain items without repetitions
  const domainItems = Array.from(new Set(array(scale.domain())));
  const items = domainItems.map((item, index) => {
    const value = scale.scale(item);
    const color = parseColor(value);
    const shape = color
      ? {
          ...(theme?.components?.discreteLegend?.items?.[0]?.shape ?? {}),
          fill: color,
          stroke: color
        }
      : theme?.components?.discreteLegend?.items?.[0]?.shape ?? {};

    if (shapeScale) {
      Object.assign(shape, { symbolType: shapeScale.scale(item) });
    }

    return {
      label: item.toString(),
      id: item,
      shape,
      index
    };
  });
  return merge({}, legendTheme, { items }, addition ?? {});
};

export const generateColorLegendAttributes = (
  scale: IBaseScale,
  theme?: ITheme,
  addition?: RecursivePartial<ColorLegendAttributes>
): ColorLegendAttributes => {
  const legendTheme = theme?.components?.colorLegend;
  if (!scale) {
    return merge({}, legendTheme, addition ?? {});
  }
  const domain = scale.domain();
  return merge({}, legendTheme, { colors: scale.range().slice(), min: domain[0], max: last(domain) }, addition ?? {});
};

export const generateSizeLegendAttributes = (
  scale: IBaseScale,
  theme?: ITheme,
  addition?: RecursivePartial<SizeLegendAttributes>
): SizeLegendAttributes => {
  const legendTheme = theme?.components?.sizeLegend;
  if (!scale) {
    return merge({}, legendTheme, addition ?? {});
  }
  const domain = scale.domain();
  const attributes = {
    min: domain[0],
    max: domain[domain.length - 1],
    value: [domain[0], domain[domain.length - 1]]
  };
  return merge({}, legendTheme, attributes, addition ?? {});
};

export class Legend extends ScaleComponent implements ILegend {
  static readonly componentType: string = ComponentEnum.legend;
  protected declare spec: LegendSpec;

  private _legendComponentType: keyof typeof LegendEnum;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.legend, group);
    this.spec.componentType = ComponentEnum.legend;
    this.spec.legendType = 'auto';
  }

  protected parseAddition(spec: LegendSpec) {
    this.shapeScale(spec.shapeScale);
    super.parseAddition(spec);
    this.target(spec.target?.data, spec.target?.filter);
    this.legendType(spec.legendType);
    return this;
  }

  scale(scale?: IScale | string | Nil) {
    super.scale(scale);
    this._legendComponentType = null;
    return this;
  }

  shapeScale(shapeScale: LegendSpec['shapeScale']) {
    if (this.spec.shapeScale) {
      const lastScaleGrammar = isString(this.spec.shapeScale)
        ? this.view.getScaleById(this.spec.shapeScale)
        : this.spec.shapeScale;
      this.detach(lastScaleGrammar);
      this.spec.shapeScale = undefined;
    }
    const scaleGrammar = isString(shapeScale) ? this.view.getScaleById(shapeScale) : shapeScale;
    this.spec.shapeScale = scaleGrammar;
    this.attach(scaleGrammar);

    this.commit();
    return this;
  }

  legendType(legendType: LegendType | Nil) {
    this.spec.legendType = legendType;
    // clear legend type when spec is changed
    this._legendComponentType = null;
    this._prepareRejoin();
    this.commit();
    return this;
  }

  isContinuousLegend() {
    return this._getLegendComponentType() !== LegendEnum.discreteLegend;
  }

  target(data: IData | string | Nil, filter: string | ((datum: any, legendValues: any) => boolean) | Nil) {
    const isContinuous = this.isContinuousLegend();
    const eventName = isContinuous ? 'change' : LegendEvent.legendItemClick;
    const lastData = this.spec.target?.data;
    const lastDataGrammar = isString(lastData) ? this.view.getDataById(lastData) : lastData;
    if (lastDataGrammar) {
      this.view.removeEventListener(eventName, this._filterCallback);
    }
    this.spec.target = undefined;
    const dataGrammar = isString(data) ? this.view.getDataById(data) : data;
    const getFilterValue = (event: any) =>
      isContinuous ? { start: event.detail.value[0], end: event.detail.value[1] } : event.detail.currentSelected;
    const dataFilter = isString(filter)
      ? isContinuous
        ? (datum: any, filterValue: { start: number; end: number }) =>
            datum[filter] >= filterValue.start && datum[filter] <= filterValue.end
        : (datum: any, filterValue: any[]) => filterValue.includes(datum[filter])
      : filter;
    this._filterData(lastDataGrammar, dataGrammar, DataFilterRank.legend, getFilterValue, dataFilter);
    if (dataGrammar) {
      this.view.addEventListener(eventName, this._filterCallback);
      this.spec.target = { data: dataGrammar, filter };
    }
    return this;
  }

  setSelected(selectedValues: any[]) {
    // FIXME: provide ILegend interface in vis-component
    const legend = this.elements[0]?.getGraphicItem?.() as unknown as DiscreteLegend;
    legend.setSelected(selectedValues);
    return this;
  }

  addGraphicItem(attrs: any, groupKey?: string) {
    const graphicItem = Factory.createGraphicComponent(this._getLegendComponentType(), attrs);
    return super.addGraphicItem(attrs, groupKey, graphicItem);
  }

  release() {
    if (this._filterCallback) {
      this.view.removeEventListener('change', this._filterCallback);
    }
    super.release();
  }

  protected _updateComponentEncoders() {
    const scaleGrammar = isString(this.spec.scale) ? this.view.getScaleById(this.spec.scale) : this.spec.scale;
    const shapeScaleGrammar = isString(this.spec.shapeScale)
      ? this.view.getScaleById(this.spec.shapeScale)
      : this.spec.shapeScale;
    const encoders = Object.assign({ update: {} }, this.spec.encode);
    const componentEncoders: StateEncodeSpec = Object.keys(encoders).reduce((res, state) => {
      const encoder = encoders[state];
      if (encoder) {
        res[state] = {
          callback: (datum: any, element: IElement, parameters: any) => {
            const theme = this.view.getCurrentTheme();
            const addition = invokeEncoder(encoder as BaseSignleEncodeSpec, datum, element, parameters);
            const scale = scaleGrammar?.getScale?.();
            switch (this._getLegendComponentType()) {
              case LegendEnum.discreteLegend:
                return generateDiscreteLegendAttributes(scale, theme, addition, shapeScaleGrammar?.getScale?.());
              case LegendEnum.colorLegend:
                return generateColorLegendAttributes(scale, theme, addition);
              case LegendEnum.sizeLegend:
                return generateSizeLegendAttributes(scale, theme, addition);
            }
            return addition;
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }

  private _getLegendComponentType() {
    if (this._legendComponentType) {
      return this._legendComponentType;
    }

    // compute legend component type when needed
    if (!this.spec.legendType || this.spec.legendType === 'auto') {
      const scaleGrammar = isString(this.spec.scale) ? this.view.getScaleById(this.spec.scale) : this.spec.scale;
      const scaleType = scaleGrammar?.getScaleType?.();
      if (scaleType && isContinuous(scaleType)) {
        const range: any[] = scaleGrammar.getScale().range();
        if (parseColor(range?.[0])) {
          this._legendComponentType = LegendEnum.colorLegend;
        } else {
          this._legendComponentType = LegendEnum.sizeLegend;
        }
      } else {
        this._legendComponentType = LegendEnum.discreteLegend;
      }
    } else {
      this._legendComponentType =
        this.spec.legendType === 'color'
          ? 'colorLegend'
          : this.spec.legendType === 'size'
          ? 'sizeLegend'
          : 'discreteLegend';
    }
    return this._legendComponentType;
  }
}

export const registerLegend = () => {
  Factory.registerGraphicComponent(
    LegendEnum.discreteLegend,
    (attrs: DiscreteLegendAttrs) => new DiscreteLegend(attrs) as unknown as IGraphic
  );
  Factory.registerGraphicComponent(
    LegendEnum.colorLegend,
    (attrs: ColorLegendAttributes) => new ColorContinuousLegend(attrs) as unknown as IGraphic
  );
  Factory.registerGraphicComponent(
    LegendEnum.sizeLegend,
    (attrs: SizeLegendAttributes) => new SizeContinuousLegend(attrs) as unknown as IGraphic
  );

  Factory.registerComponent(ComponentEnum.legend, Legend);
};
