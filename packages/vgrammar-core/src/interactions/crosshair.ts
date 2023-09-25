import {
  CircleCrosshair,
  LineCrosshair,
  PolygonCrosshair,
  RectCrosshair,
  SectorCrosshair
} from '@visactor/vrender-components';
import type { CrosshairOptions, IGroupMark, IView, InteractionEvent } from '../types';
import { BaseInteraction } from './base';
import { CrosshairEnum } from '../graph';
import { isString } from '@visactor/vutils';
import {
  generateCircleCrosshairAttributes,
  generateLineCrosshairAttributes,
  generatePolygonCrosshairAttributes,
  generateRectCrosshairAttributes,
  generateRingCrosshairAttributes,
  generateSectorCrosshairAttributes
} from '../component/crosshair';

type CrosshairComponent = CircleCrosshair | LineCrosshair | PolygonCrosshair | RectCrosshair | SectorCrosshair;

export class Crosshair extends BaseInteraction {
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
    super(view);
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
    groupGraphicItem.globalTransMatrix.transformPoint(event.canvas, point);

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
    const addition = (this.options.attributes ?? {}) as any;

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
    attributes.x = groupGraphicItem.attribute.x;
    attributes.y = groupGraphicItem.attribute.y;
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
      return { center: { x: 0, y: 0 } };
    }
    return { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
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
