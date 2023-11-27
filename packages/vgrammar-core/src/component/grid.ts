import { isString, merge } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender-core';
import type { CircleAxisGridAttributes, ComponentOptions, LineAxisGridAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { CircleAxisGrid, LineAxisGrid } from '@visactor/vrender-components';
import type { IBaseScale } from '@visactor/vscale';
import type {
  BaseSingleEncodeSpec,
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
import { AxisEnum, ComponentEnum, GridEnum } from '../graph/enums';
import type { GridShape, GridSpec, AxisType, IAxis, IGrid } from '../types/component';
import { ScaleComponent } from './scale';
import { invokeEncoder } from '../graph/mark/encode';
import { invokeFunctionType } from '../parse/util';
import { generateCoordinateAxisAttribute } from './axis';
import { Factory } from '../core/factory';

export const generateLineAxisGridAttributes = (
  scale: IBaseScale,
  theme?: ITheme,
  addition?: RecursivePartial<LineAxisGridAttributes>,
  tickCount?: number
): LineAxisGridAttributes => {
  const gridTheme = theme?.components?.grid ?? {};
  if (!scale) {
    return merge({}, gridTheme, addition ?? {});
  }
  const tickData = scale.tickData?.(tickCount) ?? [];
  const items = tickData.map(tick => ({
    id: tick.index,
    label: tick.tick,
    value: tick.value,
    rawValue: tick.tick
  }));
  return merge({}, gridTheme, { items }, addition ?? {});
};

export const generateCircleAxisGridAttributes = (
  scale: IBaseScale,
  theme?: ITheme,
  addition?: RecursivePartial<CircleAxisGridAttributes>,
  tickCount?: number
): CircleAxisGridAttributes => {
  const gridTheme = theme?.components?.circleGrid ?? {};
  if (!scale) {
    return merge({}, gridTheme, addition ?? {});
  }
  const tickData = scale.tickData?.(tickCount) ?? [];
  const items = tickData.map(tick => ({
    id: tick.index,
    label: tick.tick,
    value: tick.value,
    rawValue: tick.tick
  }));
  return merge({}, gridTheme, { items }, addition ?? {});
};

export class Grid extends ScaleComponent implements IGrid {
  static readonly componentType: string = ComponentEnum.grid;
  protected declare spec: GridSpec;

  protected mode?: '2d' | '3d';

  private _gridComponentType: keyof typeof GridEnum;
  private _targetAxis: IAxis;

  constructor(view: IView, group?: IGroupMark, mode?: '2d' | '3d') {
    super(view, ComponentEnum.grid, group);
    this.spec.componentType = ComponentEnum.grid;
    this.mode = mode;
  }

  protected parseAddition(spec: GridSpec) {
    super.parseAddition(spec);
    this.target(spec.target);
    this.gridType(spec.gridType);
    this.gridShape(spec.gridShape);
    return this;
  }

  scale(scale?: IScale | string | Nil) {
    super.scale(scale);
    this._gridComponentType = null;
    return this;
  }

  gridType(gridType: AxisType | Nil) {
    this.spec.gridType = gridType;
    this._gridComponentType = null;
    this._prepareRejoin();
    this.commit();
    return this;
  }

  gridShape(gridShape: GridShape | Nil) {
    this.spec.gridShape = gridShape;
    // no need to rejoin when gridShape is updated
    // this._gridComponentType = null;
    // this._prepareRejoin();
    this.commit();
    return this;
  }

  target(axis: IAxis | string | Nil) {
    if (this.spec.target) {
      const prevAxis = isString(this.spec.target)
        ? (this.view.getMarkById(this.spec.target) as IAxis)
        : this.spec.target;
      this.detach(prevAxis);
    }
    this.spec.target = axis;
    const nextAxis = isString(axis) ? (this.view.getMarkById(axis) as IAxis) : axis;
    this.attach(nextAxis);
    this._targetAxis = nextAxis;

    // clear grid type when target is updated
    this._gridComponentType = null;
    this._updateComponentEncoders();

    this.commit();
    return this;
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

  addGraphicItem(attrs: any, groupKey?: string) {
    const defaultAttributes = { x: 0, y: 0, start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
    const initialAttributes = merge(defaultAttributes, attrs);
    const graphicItem = Factory.createGraphicComponent(this._getGridComponentType(), initialAttributes, {
      mode: this.mode,
      skipDefault: this.spec.skipTheme
    });
    return super.addGraphicItem(initialAttributes, groupKey, graphicItem);
  }

  protected _updateComponentEncoders() {
    const encoders = Object.assign({ update: {} }, this.spec.encode);
    const componentEncoders: StateEncodeSpec = Object.keys(encoders).reduce((res, state) => {
      const encoder = encoders[state];
      if (encoder) {
        res[state] = {
          callback: (datum: any, element: IElement, parameters: any) => {
            const theme = this.spec.skipTheme ? null : this.view.getCurrentTheme();
            let addition = invokeEncoder(encoder as BaseSingleEncodeSpec, datum, element, parameters);
            let scaleGrammar: IScale;
            const baseValue = invokeFunctionType(this.spec.baseValue, parameters, datum, element);

            // get attributes from target axis
            if (this._targetAxis) {
              const targetScale = this._targetAxis.getSpec()?.scale as IScale | string | Nil;
              scaleGrammar = isString(targetScale) ? this.view.getScaleById(targetScale) : targetScale;

              const targetElement = this._targetAxis.elements[0];
              if (targetElement) {
                switch (this._getGridComponentType()) {
                  case GridEnum.lineAxisGrid:
                    addition = Object.assign(
                      {
                        x: targetElement.getGraphicAttribute('x'),
                        y: targetElement.getGraphicAttribute('y'),
                        start: targetElement.getGraphicAttribute('start'),
                        end: targetElement.getGraphicAttribute('end'),
                        verticalFactor: targetElement.getGraphicAttribute('verticalFactor') ?? 1
                      },
                      addition
                    );
                    break;
                  case GridEnum.circleAxisGrid:
                    addition = Object.assign(
                      {
                        x: targetElement.getGraphicAttribute('x'),
                        y: targetElement.getGraphicAttribute('y'),
                        center: targetElement.getGraphicAttribute('center'),
                        radius: targetElement.getGraphicAttribute('radius'),
                        innerRadius: targetElement.getGraphicAttribute('innerRadius'),
                        inside: targetElement.getGraphicAttribute('inside'),
                        startAngle: targetElement.getGraphicAttribute('startAngle'),
                        endAngle: targetElement.getGraphicAttribute('endAngle')
                      },
                      addition
                    );
                    break;
                }
              }
            }
            // compute attribute by spec
            else {
              scaleGrammar = isString(this.spec.scale) ? this.view.getScaleById(this.spec.scale) : this.spec.scale;
              const inside = invokeFunctionType(this.spec.inside, parameters, datum, element);

              const coordinate = scaleGrammar?.getCoordinate?.();
              if (coordinate) {
                addition = Object.assign(
                  generateCoordinateAxisAttribute(
                    scaleGrammar,
                    coordinate,
                    inside,
                    baseValue,
                    this.spec.layout as MarkRelativeItemSpec,
                    true
                  ),
                  addition
                );
              }
            }

            // compute addition shape attributes for line grid
            if (this._getGridComponentType() === GridEnum.lineAxisGrid) {
              if (this.spec.gridShape === 'line' || !this.spec.gridShape) {
                // set axis type
                addition = Object.assign({}, addition, { type: 'line' });
              } else {
                // set addition length & axis type
                addition = Object.assign(
                  {
                    center: addition.start,
                    closed: true
                  },
                  addition,
                  { type: this.spec.gridShape }
                );
              }
            }

            const scale = scaleGrammar?.getScale?.();
            const tickCount = invokeFunctionType(this.spec.tickCount, parameters, datum, element);
            switch (this._getGridComponentType()) {
              case GridEnum.lineAxisGrid:
                return generateLineAxisGridAttributes(scale, theme, addition, tickCount);
              case GridEnum.circleAxisGrid:
                return generateCircleAxisGridAttributes(scale, theme, addition, tickCount);
            }
            return addition;
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }

  private _getGridComponentType() {
    if (this._gridComponentType) {
      return this._gridComponentType;
    }

    if (this.spec.gridType) {
      switch (this.spec.gridType) {
        case 'circle':
          this._gridComponentType = GridEnum.circleAxisGrid;
          break;
        case 'line':
        default:
          this._gridComponentType = GridEnum.lineAxisGrid;
      }
    } else if (this._targetAxis) {
      const axisComponentType = this._targetAxis.getAxisComponentType();
      switch (axisComponentType) {
        case AxisEnum.circleAxis:
          this._gridComponentType = GridEnum.circleAxisGrid;
          break;
        case AxisEnum.lineAxis:
        default:
          this._gridComponentType = GridEnum.lineAxisGrid;
      }
    } else if (this.spec.scale) {
      const scaleGrammar = isString(this.spec.scale) ? this.view.getScaleById(this.spec.scale) : this.spec.scale;
      this._gridComponentType = scaleGrammar?.getCoordinate?.()
        ? scaleGrammar.getCoordinateAxisPoints()
          ? GridEnum.lineAxisGrid
          : GridEnum.circleAxisGrid
        : GridEnum.lineAxisGrid;
    } else {
      this._gridComponentType = GridEnum.lineAxisGrid;
    }

    return this._gridComponentType;
  }
}

export const registerGrid = () => {
  Factory.registerGraphicComponent(
    GridEnum.lineAxisGrid,
    (attrs: LineAxisGridAttributes, options?: ComponentOptions) =>
      new LineAxisGrid(attrs, options) as unknown as IGraphic
  );

  Factory.registerGraphicComponent(
    GridEnum.circleAxisGrid,
    (attrs: CircleAxisGridAttributes, options?: ComponentOptions) =>
      new CircleAxisGrid(attrs, options) as unknown as IGraphic
  );

  Factory.registerComponent(ComponentEnum.grid, Grid);
};
