import { isNil, isString, merge } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender';
import type { CircleAxisAttributes, LineAxisAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { CircleAxis as CircleAxisComponent, LineAxis as LineAxisComponent } from '@visactor/vrender-components';
import type { IBaseScale } from '@visactor/vscale';
import { getComponent, registerComponent } from '../view/register-component';
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
  StateEncodeSpec
} from '../types';
import { AxisEnum, ComponentEnum } from '../graph';
import type { AxisSpec, AxisType, IAxis } from '../types/component';
import { ScaleComponent } from './scale';
import { invokeEncoder } from '../graph/mark/encode';
import { invokeFunctionType } from '../parse/util';
import type { IPolarCoordinate } from '@visactor/vgrammar-coordinate';

registerComponent(
  AxisEnum.lineAxis,
  (attrs: LineAxisAttributes, mode?: '2d' | '3d') => new LineAxisComponent(attrs, mode) as unknown as IGraphic
);
registerComponent(
  AxisEnum.circleAxis,
  (attrs: CircleAxisAttributes) => new CircleAxisComponent(attrs) as unknown as IGraphic
);

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

export class Axis extends ScaleComponent implements IAxis {
  protected declare spec: AxisSpec;

  protected mode?: '2d' | '3d';

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
    const graphicItem = getComponent(this._getAxisComponentType()).creator(initialAttributes, this.mode);
    return super.addGraphicItem(initialAttributes, groupKey, graphicItem);
  }

  tickCount(tickCount: MarkFunctionType<number> | Nil) {
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
            const theme = this.view.getCurrentTheme();
            let addition = invokeEncoder(encoder as BaseSignleEncodeSpec, datum, element, parameters);
            const inside = invokeFunctionType(this.spec.inside, parameters, datum, element);
            const coord = scaleGrammar?.getCoordinate?.();

            if (coord) {
              const axisPosition = scaleGrammar.getCoordinateAxisPosition();
              if ((this.spec.layout as MarkRelativeItemSpec)?.position === 'auto') {
                // FIXME: too hack
                (this.spec.layout as MarkRelativeItemSpec).position = inside ? 'content' : axisPosition;
              }
              const baseValue = invokeFunctionType(this.spec.baseValue, parameters, datum, element);

              const axisPoints = scaleGrammar.getCoordinateAxisPoints(baseValue);

              if (axisPoints) {
                const start = axisPoints[0];
                const end = axisPoints[1];

                addition = Object.assign(
                  {
                    start,
                    end,
                    verticalFactor:
                      (axisPosition === 'top' || axisPosition === 'left' ? -1 : 1) *
                      (inside ? -1 : 1) *
                      (scaleGrammar.getSpec().range?.reversed ? -1 : 1)
                  },
                  addition
                );
              } else {
                const radius = (coord as IPolarCoordinate).radius();
                const angle = (coord as IPolarCoordinate).angle();
                addition = Object.assign(
                  {
                    center: (coord as IPolarCoordinate).origin(),
                    radius: radius[1],
                    innerRadius: radius[0],
                    inside: inside,
                    startAngle: angle[0],
                    endAngle: angle[1]
                  },
                  addition
                );
              }
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
