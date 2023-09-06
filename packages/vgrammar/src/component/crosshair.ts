import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { clampRadian, getAngleByPoint, isString, merge } from '@visactor/vutils';
import type { IGraphic, IGroup, IRectGraphicAttribute } from '@visactor/vrender';
import type {
  CircleCrosshairAttrs,
  LineCrosshairAttrs,
  PolygonCrosshairAttrs,
  RectCrosshairAttrs,
  SectorCrosshairAttrs
} from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import {
  CircleCrosshair,
  LineCrosshair,
  PolygonCrosshair,
  RectCrosshair,
  SectorCrosshair
} from '@visactor/vrender-components';
import type { IBandLikeScale, IBaseScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { isContinuous, isDiscrete } from '@visactor/vscale';
import { ComponentEnum, CrosshairEnum } from '../graph';
import type { CrosshairType, CrosshairSpec, CrosshairShape, ICrosshair } from '../types/component';
import type {
  BaseSignleEncodeSpec,
  IElement,
  IGroupMark,
  ITheme,
  IView,
  RecursivePartial,
  StateEncodeSpec
} from '../types';
import { ScaleComponent } from './scale';
import { invokeEncoder } from '../graph/mark/encode';
import { Factory } from '../core/factory';

const computeCrosshairStartEnd = (
  point: IPointLike,
  scale: IBaseScale,
  type: CrosshairType,
  groupSize: { width: number; height: number },
  config: CrosshairSpec['componentConfig'],
  offset: number = 0
) => {
  const start = { x: 0, y: 0 };
  const end = { x: 0, y: 0 };
  const radius = type === 'angle' ? config?.radius ?? Math.min(groupSize.width, groupSize.height) / 2 : null;
  const center = type === 'angle' ? config?.center ?? { x: groupSize.width / 2, y: groupSize.height / 2 } : null;

  let current = 0;
  if (isDiscrete(scale.type)) {
    if (type === 'x') {
      current = scale.scale(scale.invert(point.x));
    } else if (type === 'y') {
      current = scale.scale(scale.invert(point.y));
    } else if (type === 'angle') {
      const angle = clampRadian(getAngleByPoint(center, point) + Math.PI * 2);
      current = scale.scale(scale.invert(angle));
    }
  } else if (isContinuous(scale.type)) {
    if (type === 'x') {
      current = point.x;
    } else if (type === 'y') {
      current = point.y;
    } else if (type === 'angle') {
      current = getAngleByPoint(center, point);
    }
  }
  current += offset;
  switch (type) {
    case 'x':
      start.x = current;
      start.y = 0;
      end.x = current;
      end.y = groupSize.height;
      break;
    case 'y':
      start.x = 0;
      start.y = current;
      end.x = groupSize.width;
      end.y = current;
      break;
    case 'angle':
      start.x = center.x;
      start.y = center.y;
      end.x = center.x + radius * Math.cos(current);
      end.y = center.y + radius * Math.sin(current);
      break;
  }
  return { start, end };
};

const computeRadiusOfTangential = (
  point: IPointLike,
  scale: IBaseScale,
  type: CrosshairType,
  groupSize: { width: number; height: number },
  config: CrosshairSpec['componentConfig'],
  addition?:
    | RecursivePartial<PolygonCrosshairAttrs>
    | RecursivePartial<CircleCrosshairAttrs>
    | RecursivePartial<SectorCrosshairAttrs>
) => {
  const center = addition?.center ?? config?.center ?? { x: groupSize.width / 2, y: groupSize.height / 2 };
  let currentRadius = 0;

  if (isDiscrete(scale.type)) {
    const offset = scale.type === 'band' ? (scale as IBandLikeScale).bandwidth() / 2 : 0;
    const radius = Math.sqrt((point.x - center.x) ** 2 + (point.y - center.y) ** 2);
    currentRadius = scale.scale(scale.invert(radius)) + offset;
  } else if (isContinuous(scale.type)) {
    const maxRadius = config?.radius ?? Math.min(groupSize.width, groupSize.height) / 2;
    currentRadius = Math.min(maxRadius, Math.sqrt((point.x - center.x) ** 2 + (point.y - center.y) ** 2));
  }

  return { radius: currentRadius, center };
};

export const generateLineCrosshairAttributes = (
  point: IPointLike,
  scale: IBaseScale,
  type: CrosshairType,
  groupSize: { width: number; height: number },
  config: CrosshairSpec['componentConfig'],
  theme?: ITheme,
  addition?: RecursivePartial<LineCrosshairAttrs> & CrosshairSpec['componentConfig']
): LineCrosshairAttrs => {
  const crosshairTheme = theme?.components?.lineCrosshair;
  const offset = scale.type === 'band' ? (scale as IBandLikeScale).bandwidth() / 2 : 0;
  const points = computeCrosshairStartEnd(
    point,
    scale,
    type,
    groupSize,
    {
      radius: addition?.radius ?? config?.radius,
      center: addition?.center ?? config?.center
    },
    offset
  );
  return merge({}, crosshairTheme, points, addition ?? {});
};

export const generateRectCrosshairAttributes = (
  point: IPointLike,
  scale: IBaseScale,
  type: CrosshairType,
  groupSize: { width: number; height: number },
  config: CrosshairSpec['componentConfig'],
  theme?: ITheme,
  addition?: RecursivePartial<RectCrosshairAttrs>
): RectCrosshairAttrs => {
  const crosshairTheme = theme?.components?.rectCrosshair;
  const defaultSize = scale.type === 'band' || scale.type === 'point' ? (scale as IBandLikeScale).step() : undefined;
  const customRectStyle = addition?.rectStyle;
  const size =
    defaultSize ??
    (type === 'y'
      ? customRectStyle?.width ?? crosshairTheme.rectStyle.width
      : customRectStyle?.height ?? crosshairTheme.rectStyle.height);
  const points = computeCrosshairStartEnd(point, scale, type, groupSize, config, scale.type === 'band' ? 0 : -size / 2);
  const rectStyle: Partial<IRectGraphicAttribute> = {};
  if (type === 'x') {
    rectStyle.width = size;
  } else {
    rectStyle.height = size;
  }
  const attribute = merge(
    {},
    crosshairTheme,
    {
      start: points.start,
      end: points.end,
      rectStyle
    },
    addition ?? {}
  );
  if (type === 'x') {
    attribute.rectStyle.height = attribute.end.y - attribute.start.y;
  } else {
    attribute.rectStyle.width = attribute.end.x - attribute.start.x;
  }
  return attribute;
};

export const generateRingCrosshairAttributes = (
  point: IPointLike,
  scale: IBaseScale,
  type: CrosshairType,
  groupSize: { width: number; height: number },
  config: CrosshairSpec['componentConfig'],
  theme?: ITheme,
  addition?: RecursivePartial<SectorCrosshairAttrs>
): SectorCrosshairAttrs => {
  const crosshairTheme = theme?.components?.circleCrosshair;
  const { center, radius } = computeRadiusOfTangential(point, scale, type, groupSize, config, addition);

  const startAngle = crosshairTheme.startAngle;
  const endAngle = crosshairTheme.endAngle;
  const deltaRadius = scale.type === 'band' || scale.type === 'point' ? (scale as IBandLikeScale).step() : 0;

  return merge(
    {},
    crosshairTheme,
    { center, innerRadius: radius - deltaRadius / 2, radius: radius + deltaRadius / 2, startAngle, endAngle },
    addition ?? {}
  );
};

export const generateSectorCrosshairAttributes = (
  point: IPointLike,
  scale: IBaseScale,
  type: CrosshairType,
  groupSize: { width: number; height: number },
  config: CrosshairSpec['componentConfig'],
  theme?: ITheme,
  addition?: RecursivePartial<SectorCrosshairAttrs>
): SectorCrosshairAttrs => {
  const crosshairTheme = theme?.components?.sectorCrosshair;
  const radius = addition?.radius ?? config?.radius ?? Math.min(groupSize.width, groupSize.height) / 2;
  const center = (addition?.center ??
    config?.center ?? { x: groupSize.width / 2, y: groupSize.height / 2 }) as IPointLike;
  const defaultAngle = crosshairTheme.endAngle - crosshairTheme.startAngle;
  const angle = scale.type === 'band' || scale.type === 'point' ? (scale as IBandLikeScale).step() : defaultAngle;
  let currentAngle = 0;
  if (isDiscrete(scale.type)) {
    const angle = clampRadian(getAngleByPoint(center, point) + Math.PI * 2);
    currentAngle =
      scale.scale(scale.invert(angle)) + (scale.type === 'band' ? (scale as IBandLikeScale).bandwidth() / 2 : 0);
  } else if (isContinuous(scale.type)) {
    currentAngle = getAngleByPoint(center, point);
  }
  const startAngle = currentAngle - angle / 2;
  const endAngle = currentAngle + angle / 2;
  return merge({}, crosshairTheme, { center, radius, startAngle, endAngle }, addition ?? {});
};

export const generateCircleCrosshairAttributes = (
  point: IPointLike,
  scale: IBaseScale,
  type: CrosshairType,
  groupSize: { width: number; height: number },
  config: CrosshairSpec['componentConfig'],
  theme?: ITheme,
  addition?: RecursivePartial<CircleCrosshairAttrs>
): CircleCrosshairAttrs => {
  const crosshairTheme = theme?.components?.circleCrosshair;
  const { center, radius } = computeRadiusOfTangential(point, scale, type, groupSize, config, addition);

  const startAngle = crosshairTheme.startAngle;
  const endAngle = crosshairTheme.endAngle;

  return merge({}, crosshairTheme, { center, radius: radius, startAngle, endAngle }, addition ?? {});
};

export const generatePolygonCrosshairAttributes = (
  point: IPointLike,
  scale: IBaseScale,
  type: CrosshairType,
  groupSize: { width: number; height: number },
  config: CrosshairSpec['componentConfig'],
  theme?: ITheme,
  addition?: RecursivePartial<PolygonCrosshairAttrs>
): PolygonCrosshairAttrs => {
  const crosshairTheme = theme?.components?.circleCrosshair;
  const { center, radius } = computeRadiusOfTangential(point, scale, type, groupSize, config, addition);

  const startAngle = crosshairTheme.startAngle;
  const endAngle = crosshairTheme.endAngle;
  return merge({}, crosshairTheme, { center, radius: radius, startAngle, endAngle }, addition ?? {});
};

export class Crosshair extends ScaleComponent implements ICrosshair {
  static readonly componentType: string = ComponentEnum.crosshair;
  protected declare spec: CrosshairSpec;

  private _crosshairComponentType?: keyof typeof CrosshairEnum;
  private _additionalEncodeResult: any;
  private _lastGroup: IGroup;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.crosshair, group);
    this.spec.componentType = ComponentEnum.crosshair;
    this.spec.crosshairShape = 'line';
    this.spec.crosshairType = 'x';
  }

  protected parseAddition(spec: CrosshairSpec) {
    super.parseAddition(spec);
    this.crosshairType(spec.crosshairType);
    this.crosshairShape(spec.crosshairShape);
    return this;
  }

  crosshairType(crosshairType?: CrosshairType) {
    this.spec.crosshairType = crosshairType;
    this._crosshairComponentType = null;
    this._prepareRejoin();
    this.commit();
    return this;
  }

  crosshairShape(crosshairShape?: CrosshairShape) {
    this.spec.crosshairShape = crosshairShape;
    this._crosshairComponentType = null;
    this._prepareRejoin();
    this.commit();
    return this;
  }

  addGraphicItem(attrs: any, groupKey?: string) {
    const initialAttributes = Object.assign(this._getDefaultCrosshairAttribute(), attrs);
    const graphicItem = Factory.createGraphicComponent(this._getCrosshairComponentType(), initialAttributes);
    return super.addGraphicItem(initialAttributes, groupKey, graphicItem);
  }

  release() {
    (this._lastGroup as any)?.off?.('pointermove', this._onCrosshairShow);
    (this._lastGroup as any)?.off?.('pointerleave', this._onCrosshairHide);
    super.release();
  }

  protected init(stage: any, parameters: any) {
    super.init(stage, parameters);

    const groupGraphicItem = this.group ? this.group.getGroupGraphicItem() : stage.defaultLayer;
    if (this._lastGroup !== groupGraphicItem) {
      // FIXME: waiting for vRender to fix
      (this._lastGroup as any)?.off?.('pointermove', this._onCrosshairShow);
      (this._lastGroup as any)?.off?.('pointerleave', this._onCrosshairHide);
    }
    groupGraphicItem?.on?.('pointermove', this._onCrosshairShow);
    groupGraphicItem?.on?.('pointerleave', this._onCrosshairHide);
    this._lastGroup = groupGraphicItem;
  }

  protected _updateComponentEncoders() {
    const encoders = Object.assign({ update: {} }, this.spec.encode);
    const componentEncoders: StateEncodeSpec = Object.keys(encoders).reduce((res, state) => {
      const encoder = encoders[state];
      if (encoder) {
        res[state] = {
          callback: (datum: any, element: IElement, parameters: any) => {
            this._additionalEncodeResult = invokeEncoder(encoder as BaseSignleEncodeSpec, datum, element, parameters);
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }

  private _onCrosshairShow = (event: any) => {
    if (!this.elements[0]?.getGraphicItem?.()) {
      return;
    }
    const groupGraphicItem = this.group.getGroupGraphicItem();
    // FIXME: waiting for vRender to add transformed position to event
    const point = { x: 0, y: 0 };
    groupGraphicItem.globalTransMatrix.transformPoint(event.canvas, point);

    if (
      point.x < 0 ||
      point.x > groupGraphicItem.attribute.width ||
      point.y < 0 ||
      point.y > groupGraphicItem.attribute.height
    ) {
      return;
    }

    const crosshair = this.elements[0].getGraphicItem() as IGroup;
    const crosshairType = this.spec.crosshairType ?? 'x';
    const groupSize = { width: groupGraphicItem.attribute.width, height: groupGraphicItem.attribute.height };
    const scaleGrammar = isString(this.spec.scale) ? this.view.getScaleById(this.spec.scale) : this.spec.scale;
    const scale = scaleGrammar.getScale();
    const config = this.spec.componentConfig;
    const theme = this.view.getCurrentTheme();
    const addition = this._additionalEncodeResult ?? {};

    let attributes = {};
    switch (this._getCrosshairComponentType()) {
      case CrosshairEnum.lineCrosshair:
        attributes = generateLineCrosshairAttributes(point, scale, crosshairType, groupSize, config, theme, addition);
        break;
      case CrosshairEnum.rectCrosshair:
        attributes = generateRectCrosshairAttributes(point, scale, crosshairType, groupSize, config, theme, addition);
        break;
      case CrosshairEnum.sectorCrosshair:
        attributes = generateSectorCrosshairAttributes(point, scale, crosshairType, groupSize, config, theme, addition);
        break;
      case CrosshairEnum.circleCrosshair:
        attributes = generateCircleCrosshairAttributes(point, scale, crosshairType, groupSize, config, theme, addition);
        break;
      case CrosshairEnum.polygonCrosshair:
        attributes = generatePolygonCrosshairAttributes(
          point,
          scale,
          crosshairType,
          groupSize,
          config,
          theme,
          addition
        );
        break;
      case CrosshairEnum.ringCrosshair:
        attributes = generateRingCrosshairAttributes(point, scale, crosshairType, groupSize, config, theme, addition);
        break;
    }
    crosshair.showAll();
    crosshair.setAttributes(attributes);
  };

  private _onCrosshairHide = (event: any) => {
    const crosshair = this.elements[0].getGraphicItem() as IGroup;
    crosshair.hideAll();
  };

  private _getCrosshairComponentType() {
    if (this._crosshairComponentType) {
      return this._crosshairComponentType;
    }
    const shape = this.spec.crosshairShape ?? 'line';
    const type = this.spec.crosshairType ?? 'x';
    if (shape === 'rect') {
      if (type === 'angle') {
        this._crosshairComponentType = CrosshairEnum.sectorCrosshair;
      } else if (type === 'radius') {
        this._crosshairComponentType = CrosshairEnum.ringCrosshair;
      } else if (type === 'radius-polygon') {
        this._crosshairComponentType = CrosshairEnum.polygonCrosshair;
      } else {
        this._crosshairComponentType = CrosshairEnum.rectCrosshair;
      }
    } else {
      if (type === 'radius') {
        this._crosshairComponentType = CrosshairEnum.circleCrosshair;
      } else if (type === 'radius-polygon') {
        this._crosshairComponentType = CrosshairEnum.polygonCrosshair;
      } else {
        this._crosshairComponentType = CrosshairEnum.lineCrosshair;
      }
    }
    return this._crosshairComponentType;
  }

  private _getDefaultCrosshairAttribute() {
    const type = this.spec.crosshairType ?? 'x';
    if (type === 'radius' || type === 'radius-polygon') {
      return { center: { x: 0, y: 0 } };
    }
    return { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
  }
}

export const registerCrosshair = () => {
  Factory.registerGraphicComponent(
    CrosshairEnum.lineCrosshair,
    (attrs: LineCrosshairAttrs) => new LineCrosshair(attrs) as unknown as IGraphic
  );
  Factory.registerGraphicComponent(
    CrosshairEnum.rectCrosshair,
    (attrs: RectCrosshairAttrs) => new RectCrosshair(attrs) as unknown as IGraphic
  );
  Factory.registerGraphicComponent(
    CrosshairEnum.sectorCrosshair,
    (attrs: SectorCrosshairAttrs) => new SectorCrosshair(attrs) as unknown as IGraphic
  );
  Factory.registerGraphicComponent(
    CrosshairEnum.circleCrosshair,
    (attrs: CircleCrosshairAttrs) => new CircleCrosshair(attrs) as unknown as IGraphic
  );
  Factory.registerGraphicComponent(
    CrosshairEnum.polygonCrosshair,
    (attrs: PolygonCrosshairAttrs) => new PolygonCrosshair(attrs) as unknown as IGraphic
  );
  Factory.registerGraphicComponent(
    CrosshairEnum.ringCrosshair,
    (attrs: SectorCrosshairAttrs) => new SectorCrosshair(attrs) as unknown as IGraphic
  );

  Factory.registerComponent(ComponentEnum.crosshair, Crosshair);
};
