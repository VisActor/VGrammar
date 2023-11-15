import { isNil, isString, merge } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender-core';
import type { CircleAxisAttributes, LineAxisAttributes, ComponentOptions } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { CircleAxis as CircleAxisComponent, LineAxis as LineAxisComponent } from '@visactor/vrender-components';
import type { IBaseScale } from '@visactor/vscale';
import type {
  BaseSignleEncodeSpec,
  IElement,
  IGroupMark,
  IScale,
  ITheme,
  IView,
  MarkFunctionType,
  MarkRelativeItemSpec,
  Nil,
  RecursivePartial,
  SimpleSignalType,
  StateEncodeSpec
} from '../types';
import { AxisEnum, ComponentEnum } from '../graph/enums';
import type { AxisSpec, AxisType, IAxis } from '../types/component';
import { ScaleComponent } from './scale';
import { invokeEncoder } from '../graph/mark/encode';
import { invokeFunctionType } from '../parse/util';
import type { IPolarCoordinate, IBaseCoordinate } from '@visactor/vgrammar-coordinate';
import { Factory } from '../core/factory';

export const generateLineAxisAttributes = (
  scale: IBaseScale,
  theme?: ITheme,
  addition?: RecursivePartial<LineAxisAttributes>,
  tickCount?: number
): LineAxisAttributes => {
  const axisTheme = theme?.components?.axis ?? {};
  if (!scale) {
    return merge({}, axisTheme, addition ?? {});
  }
  const tickData = scale.tickData?.(tickCount) ?? [];

  const items = [
    tickData.map(tick => ({
      id: tick.index,
      label: tick.tick,
      value: tick.value,
      rawValue: tick.tick
    }))
  ];
  return merge({}, axisTheme, { items }, addition ?? {});
};

export const generateCircleAxisAttributes = (
  scale: IBaseScale,
  theme?: ITheme,
  addition?: RecursivePartial<CircleAxisAttributes>,
  tickCount?: number
): CircleAxisAttributes => {
  const axisTheme = theme?.components?.circleAxis ?? {};
  if (!scale) {
    return merge({}, axisTheme, addition ?? {});
  }
  const tickData = scale.tickData?.(tickCount) ?? [];
  const items = [
    tickData.map(tick => ({
      id: tick.index,
      label: tick.tick,
      value: tick.value,
      rawValue: tick.tick
    }))
  ];
  return merge({}, axisTheme, { items }, addition ?? {});
};

export const generateCoordinateAxisAttribute = (
  scale: IScale,
  coordinate: IBaseCoordinate,
  inside: boolean,
  baseValue: number,
  layout: MarkRelativeItemSpec,
  isGrid?: boolean
) => {
  const axisPosition = scale.getCoordinateAxisPosition();
  if (layout?.position === 'auto') {
    // FIXME: too hack
    layout.position = inside ? 'content' : axisPosition;
  }

  const axisPoints = scale.getCoordinateAxisPoints(baseValue);

  if (axisPoints) {
    const start = axisPoints[0];
    const end = axisPoints[1];
    const res: any = {
      start,
      end,
      verticalFactor:
        (axisPosition === 'top' || axisPosition === 'left' ? -1 : 1) *
        (inside ? -1 : 1) *
        (scale.getSpec().range?.reversed ? -1 : 1)
    };

    if (isGrid && coordinate.type === 'polar') {
      const angle = (coordinate as IPolarCoordinate).angle();

      res.center = (coordinate as IPolarCoordinate).origin();
      res.startAngle = angle[0];
      res.endAngle = angle[1];
    }

    return res;
  }

  const radius = (coordinate as IPolarCoordinate).radius();
  const angle = (coordinate as IPolarCoordinate).angle();
  return {
    center: (coordinate as IPolarCoordinate).origin(),
    radius: radius[1],
    innerRadius: radius[0],
    inside: inside,
    startAngle: angle[0],
    endAngle: angle[1]
  };
};

export class Axis extends ScaleComponent implements IAxis {
  static readonly componentType: string = ComponentEnum.axis;

  protected declare spec: AxisSpec;

  private _axisComponentType: keyof typeof AxisEnum;

  constructor(view: IView, group?: IGroupMark, mode?: '2d' | '3d') {
    super(view, ComponentEnum.axis, group);
    this.spec.componentType = ComponentEnum.axis;
    this.mode = mode;
  }

  protected parseAddition(spec: AxisSpec) {
    super.parseAddition(spec);

    this.axisType(spec.axisType);
    this.tickCount(spec.tickCount);
    this.inside(spec.inside);
    this.baseValue(spec.baseValue);

    return this;
  }

  scale(scale?: IScale | string | Nil) {
    super.scale(scale);
    this._axisComponentType = null;
    return this;
  }

  axisType(axisType: AxisType | Nil) {
    this.spec.axisType = axisType;
    this._axisComponentType = null;
    this._prepareRejoin();
    this.commit();
    return this;
  }

  addGraphicItem(attrs: any, groupKey?: string) {
    const defaultAttributes = { x: 0, y: 0, start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
    const initialAttributes = merge(defaultAttributes, attrs);
    const graphicItem = Factory.createGraphicComponent(this._getAxisComponentType(), initialAttributes, {
      mode: this.mode,
      skipDefault: this.spec.skipTheme
    });
    return super.addGraphicItem(initialAttributes, groupKey, graphicItem);
  }

  tickCount(tickCount: SimpleSignalType<number> | Nil) {
    const scaleGrammar = isString(this.spec.scale) ? this.view.getScaleById(this.spec.scale) : this.spec.scale;

    if (scaleGrammar) {
      scaleGrammar.tickCount(tickCount);
    }

    return this.setFunctionSpec(tickCount, 'tickCount');
  }

  inside(inside: MarkFunctionType<boolean> | Nil) {
    return this.setFunctionSpec(inside, 'inside');
  }

  baseValue(baseValue: MarkFunctionType<number> | Nil) {
    return this.setFunctionSpec(baseValue, 'baseValue');
  }

  getAxisComponentType() {
    return this._axisComponentType;
  }

  protected _updateComponentEncoders() {
    const scaleGrammar = isString(this.spec.scale) ? this.view.getScaleById(this.spec.scale) : this.spec.scale;
    const encoders = Object.assign({ update: {} }, this.spec.encode);
    const componentEncoders: StateEncodeSpec = Object.keys(encoders).reduce((res, state) => {
      const encoder = encoders[state];
      if (encoder) {
        res[state] = {
          callback: (datum: any, element: IElement, parameters: any) => {
            const theme = this.spec.skipTheme ? null : this.view.getCurrentTheme();
            let addition = invokeEncoder(encoder as BaseSignleEncodeSpec, datum, element, parameters);
            const inside = invokeFunctionType(this.spec.inside, parameters, datum, element);
            const baseValue = invokeFunctionType(this.spec.baseValue, parameters, datum, element);

            const coordinate = scaleGrammar?.getCoordinate?.();
            if (coordinate) {
              addition = Object.assign(
                generateCoordinateAxisAttribute(
                  scaleGrammar,
                  coordinate,
                  inside,
                  baseValue,
                  this.spec.layout as MarkRelativeItemSpec
                ),
                addition
              );
            }

            const scale = scaleGrammar?.getScale?.();
            const tickCount = invokeFunctionType(this.spec.tickCount, parameters, datum, element);

            switch (this._getAxisComponentType()) {
              case AxisEnum.lineAxis:
                return generateLineAxisAttributes(scale, theme, addition, tickCount);
              case AxisEnum.circleAxis:
                return generateCircleAxisAttributes(scale, theme, addition, tickCount);
            }
            return addition;
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }

  private _getAxisComponentType() {
    if (this._axisComponentType) {
      return this._axisComponentType;
    }

    let type = this.spec.axisType;

    if (isNil(type)) {
      const scaleGrammar = isString(this.spec.scale) ? this.view.getScaleById(this.spec.scale) : this.spec.scale;

      type = scaleGrammar?.getCoordinate?.() ? (scaleGrammar.getCoordinateAxisPoints() ? 'line' : 'circle') : 'line';
    }

    this._axisComponentType = type === 'circle' ? AxisEnum.circleAxis : AxisEnum.lineAxis;

    return this._axisComponentType;
  }
}

export const registerAxis = () => {
  Factory.registerGraphicComponent(
    AxisEnum.lineAxis,
    (attrs: LineAxisAttributes, options?: ComponentOptions) =>
      new LineAxisComponent(attrs, options) as unknown as IGraphic
  );
  Factory.registerGraphicComponent(
    AxisEnum.circleAxis,
    (attrs: CircleAxisAttributes) => new CircleAxisComponent(attrs) as unknown as IGraphic
  );

  Factory.registerComponent(ComponentEnum.axis, Axis);
};
