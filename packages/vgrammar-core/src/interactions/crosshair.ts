import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { clampRadian, getAngleByPoint, isString, merge } from '@visactor/vutils';
import type { IRectGraphicAttribute } from '@visactor/vrender';
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
import type {
  CrosshairOptions,
  CrosshairType,
  IGroupMark,
  ITheme,
  IView,
  InteractionEvent,
  RecursivePartial
} from '../types';
import { BaseInteraction } from './base';
import { CrosshairEnum } from '../graph';
import type { IBandLikeScale, IBaseScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { isContinuous, isDiscrete } from '@visactor/vscale';
import { invokeFunctionType } from '../parse/util';

type CrosshairComponent = CircleCrosshair | LineCrosshair | PolygonCrosshair | RectCrosshair | SectorCrosshair;

const computeCrosshairStartEnd = (
  point: IPointLike,
  scale: IBaseScale,
  type: CrosshairType,
  groupSize: { width: number; height: number },
  config: any,
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
  config: any,
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
  config: any,
  theme?: ITheme,
  addition?: RecursivePartial<LineCrosshairAttrs> & any
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
  config: any,
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
  config: any,
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
  config: any,
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
  config: any,
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
  config: any,
  theme?: ITheme,
  addition?: RecursivePartial<PolygonCrosshairAttrs>
): PolygonCrosshairAttrs => {
  const crosshairTheme = theme?.components?.circleCrosshair;
  const { center, radius } = computeRadiusOfTangential(point, scale, type, groupSize, config, addition);

  const startAngle = crosshairTheme.startAngle;
  const endAngle = crosshairTheme.endAngle;
  return merge({}, crosshairTheme, { center, radius: radius, startAngle, endAngle }, addition ?? {});
};

export class Crosshair extends BaseInteraction<CrosshairOptions> {
  static type: string = 'crosshair';
  type: string = Crosshair.type;
  options: CrosshairOptions;

  static defaultOptions: Omit<CrosshairOptions, 'target'> = {
    trigger: 'pointermove',
    resetTrigger: 'pointerleave',
    crosshairType: 'x',
    crosshairShape: 'line'
  };

  protected _crosshairComponent?: CrosshairComponent;
  protected _crosshairComponentType?: keyof typeof CrosshairEnum;
  protected _container: IGroupMark;

  constructor(view: IView, options?: CrosshairOptions) {
    super(view, options);
    this.options = Object.assign({}, Crosshair.defaultOptions, options);
    this._container = (view.getMarksBySelector(this.options.container)?.[0] as IGroupMark) ?? view.rootMark;
  }

  protected getEvents() {
    return {
      [this.options.trigger]: this.handleCrosshairShow,
      [this.options.resetTrigger]: this.handleCrosshairHide
    };
  }

  protected handleCrosshairShow = (event: InteractionEvent) => {
    if (!this._crosshairComponent) {
      return;
    }
    const groupGraphicItem = this._container.getGroupGraphicItem();
    // FIXME: waiting for vRender to add transformed position to event
    const point = { x: 0, y: 0 };
    const globalTransMatrix = groupGraphicItem.globalTransMatrix;
    const containerPoint = { x: globalTransMatrix.e, y: globalTransMatrix.f };
    globalTransMatrix.transformPoint(event.canvas, point);

    if (
      point.x < 0 ||
      point.x > groupGraphicItem.attribute.width ||
      point.y < 0 ||
      point.y > groupGraphicItem.attribute.height
    ) {
      this._crosshairComponent.hideAll();
      return;
    }

    const crosshairType = this.options.crosshairType ?? 'x';
    const groupSize = { width: groupGraphicItem.attribute.width, height: groupGraphicItem.attribute.height };
    const scaleGrammar = isString(this.options.scale) ? this.view.getScaleById(this.options.scale) : this.options.scale;
    const scale = scaleGrammar.getScale();
    const config = { center: this.options.center, radius: this.options.radius };
    const theme = this.view.getCurrentTheme();
    const addition = invokeFunctionType(this.options.attributes, this.parameters(), {}, {}) as any;

    let attributes: any = {};
    switch (this.getCrosshairComponentType()) {
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
    // Hack: waiting for component to fix
    if (this.getCrosshairComponentType() !== CrosshairEnum.circleCrosshair) {
      attributes.x = containerPoint.x;
      attributes.y = containerPoint.y;
    }
    this._crosshairComponent.showAll();
    this._crosshairComponent.setAttributes(attributes);
  };

  protected handleCrosshairHide = () => {
    this._crosshairComponent.hideAll();
  };

  protected getCrosshairComponentType() {
    if (this._crosshairComponentType) {
      return this._crosshairComponentType;
    }
    const shape = this.options.crosshairShape ?? 'line';
    const type = this.options.crosshairType ?? 'x';
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

  protected getDefaultCrosshairAttribute(): any {
    const type = this.options.crosshairType ?? 'x';
    if (type === 'radius' || type === 'radius-polygon') {
      return { center: { x: 0, y: 0 }, zIndex: -1 };
    }
    return { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, zIndex: -1 };
  }

  bind(): void {
    super.bind();

    const stage = this.view.renderer.stage();
    if (this._crosshairComponent || !stage) {
      return;
    }

    switch (this.getCrosshairComponentType()) {
      case CrosshairEnum.lineCrosshair:
        this._crosshairComponent = new LineCrosshair(this.getDefaultCrosshairAttribute());
        break;
      case CrosshairEnum.rectCrosshair:
        this._crosshairComponent = new RectCrosshair(this.getDefaultCrosshairAttribute());
        break;
      case CrosshairEnum.sectorCrosshair:
        this._crosshairComponent = new SectorCrosshair(this.getDefaultCrosshairAttribute());
        break;
      case CrosshairEnum.circleCrosshair:
        this._crosshairComponent = new CircleCrosshair(this.getDefaultCrosshairAttribute());
        break;
      case CrosshairEnum.polygonCrosshair:
        this._crosshairComponent = new PolygonCrosshair(this.getDefaultCrosshairAttribute());
        break;
      case CrosshairEnum.ringCrosshair:
        this._crosshairComponent = new SectorCrosshair(this.getDefaultCrosshairAttribute());
        break;
    }
    (stage.defaultLayer as any).appendChild(this._crosshairComponent);
  }

  unbind(): void {
    super.unbind();

    if (this._crosshairComponent) {
      this._crosshairComponent.release();
      this._crosshairComponent = null;
    }
  }
}
