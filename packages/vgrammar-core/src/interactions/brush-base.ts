import { Brush, IOperateType } from '@visactor/vrender-components';
import type { BrushOptions, IElement, IGlyphElement, IMark, IView, InteractionEventHandler } from '../types';
import { BaseInteraction } from './base';
import type { IGraphic, IPolygon, IRectGraphicAttribute } from '@visactor/vrender';
import {
  polygonContainPoint,
  type IBounds,
  type IPointLike,
  polygonIntersectPolygon,
  isRectIntersect
} from '@visactor/vutils';
import { HOOK_EVENT } from '../graph';

export abstract class BrushBase<T extends BrushOptions> extends BaseInteraction {
  options: T;
  protected _brushComp?: Brush;
  protected _marks?: IMark[];

  constructor(view: IView, options?: T) {
    super(view);
    this.options = options;
    this._marks = view.getMarksBySelector(this.options.selector);
  }

  protected getEvents(): Record<string, InteractionEventHandler | InteractionEventHandler[]> {
    return {
      [HOOK_EVENT.BEFORE_DO_RENDER]: this.handleAfterDraw
    };
  }

  protected isPolygonBrushContainGraphicItem(
    brushMask: IPolygon,
    graphicItem: IGraphic,
    offset?: { x: number; y: number }
  ) {
    // 根据变换矩阵得到brushMask的实际坐标
    const points = brushMask.attribute.points;
    const { a, b, c, d, e, f } = brushMask.globalTransMatrix;

    const dx = offset?.x ?? 0;
    const dy = offset?.y ?? 0;

    const pointsCoord = points.map((p: IPointLike) => {
      return {
        x: a * p.x + c * p.y + e + dx,
        y: b * p.x + d * p.y + f + dy
      };
    });

    const globalAABBBoundsOffset = brushMask.globalAABBBounds
      .clone()
      .set(
        brushMask.globalAABBBounds.x1 + dx,
        brushMask.globalAABBBounds.y1 + dy,
        brushMask.globalAABBBounds.x2 + dx,
        brushMask.globalAABBBounds.y2 + dy
      );

    // 根据变换矩阵得到item的实际坐标
    const x = graphicItem.globalTransMatrix.e;
    const y = graphicItem.globalTransMatrix.f;

    // brush与图表图元进行相交 或 包含判断
    if (graphicItem.type === 'symbol' || graphicItem.type === 'circle') {
      return globalAABBBoundsOffset.contains(x, y) && polygonContainPoint(pointsCoord, x, y);
    } else if (graphicItem.type === 'rect') {
      const { width = 0, height = 0 } = graphicItem?.attribute as IRectGraphicAttribute;
      const pointsRect = [
        {
          x: x,
          y: y
        },
        {
          x: x + width,
          y: y
        },
        {
          x: x + width,
          y: y + height
        },
        {
          x: x,
          y: y + height
        }
      ];
      return polygonIntersectPolygon(pointsCoord, pointsRect);
    }
    return brushMask.globalAABBBounds.intersects(graphicItem.globalAABBBounds);
  }

  protected isRectBrushContainGraphicItem(
    brushMask: IPolygon,
    graphicItem: IGraphic,
    offset?: { x: number; y: number }
  ) {
    const dx = offset?.x ?? 0;
    const dy = offset?.y ?? 0;

    const globalAABBBoundsOffset = brushMask.globalAABBBounds
      .clone()
      .set(
        brushMask.globalAABBBounds.x1 + dx,
        brushMask.globalAABBBounds.y1 + dy,
        brushMask.globalAABBBounds.x2 + dx,
        brushMask.globalAABBBounds.y2 + dy
      );

    // 根据变换矩阵得到item的实际坐标
    const x = graphicItem.globalTransMatrix.e;
    const y = graphicItem.globalTransMatrix.f;

    // brush与图表图元进行相交 或 包含判断
    if (graphicItem.type === 'symbol' || graphicItem.type === 'circle') {
      return globalAABBBoundsOffset.contains(x, y);
    } else if (graphicItem.type === 'rect') {
      const { width = 0, height = 0 } = graphicItem?.attribute as IRectGraphicAttribute;
      return isRectIntersect(globalAABBBoundsOffset, { x1: x, y1: y, x2: x + width, y2: y + height }, false);
    }
    return brushMask.globalAABBBounds.intersects(graphicItem.globalAABBBounds);
  }

  protected isBrushContainGraphicItem(brushMask: IPolygon, graphicItem: IGraphic, offset?: { x: number; y: number }) {
    if (
      !brushMask?.globalTransMatrix ||
      !brushMask.globalAABBBounds ||
      brushMask.globalAABBBounds.empty() ||
      !graphicItem ||
      !brushMask?.attribute?.points ||
      brushMask.attribute.points.length <= 1
    ) {
      return false;
    }

    return this.options.brushType === 'polygon'
      ? this.isPolygonBrushContainGraphicItem(brushMask, graphicItem, offset)
      : this.isRectBrushContainGraphicItem(brushMask, graphicItem, offset);
  }

  handleAfterDraw = () => {
    const stage = this.view.renderer.stage();
    if (this._brushComp || !stage) {
      return;
    }

    const viewBox = this.view.getViewBox();

    this._brushComp = new Brush({
      interactiveRange: this.options.interactiveRange ?? {
        minX: viewBox.x1,
        maxX: viewBox.x2,
        minY: viewBox.y1,
        maxY: viewBox.y2
      },
      xRange: this.options.xRange ?? [viewBox.x1, viewBox.x2],
      yRange: this.options.yRange ?? [viewBox.y1, viewBox.y2],
      brushMode: this.options.brushMode ?? 'single',
      brushType: this.options.brushType,
      brushStyle: this.options.brushStyle,
      brushMoved: this.options.brushMoved,
      removeOnClick: this.options.removeOnClick,
      sizeThreshold: this.options.sizeThreshold,
      delayType: this.options.delayType,
      delayTime: this.options.delayTime
    });
    this._brushComp.setUpdateDragMaskCallback(this.handleBrushUpdate);

    (stage.defaultLayer as any).appendChild(this._brushComp);
  };

  abstract handleBrushUpdate: (options: {
    operateType: string;
    operateMask: IPolygon;
    operatedMaskAABBBounds: { [name: string]: IBounds };
  }) => void;

  unbind(): void {
    super.unbind();

    if (this._brushComp) {
      this._brushComp.releaseBrushEvents();
      this._brushComp.release();
      this._brushComp = null;
    }
  }

  protected dispatchEvent(
    options: {
      operateType: string;
      operateMask: IPolygon;
      operatedMaskAABBBounds: { [name: string]: IBounds };
    },
    activeElements: (IElement | IGlyphElement)[]
  ) {
    const params = { operateType: options.operateType, operateMask: options.operateMask, activeElements };
    if (options.operateType === IOperateType.drawStart || options.operateType === IOperateType.moveStart) {
      this.view.emit('brushStart', params);
      if (this.options.onStart) {
        this.options.onStart(params);
      }
    } else if (options.operateType === IOperateType.drawing || options.operateType === IOperateType.moving) {
      this.view.emit('brushUpdate', params);
      if (this.options.onUpdate) {
        this.options.onEnd(params);
      }
    } else if (options.operateType === IOperateType.drawEnd || options.operateType === IOperateType.moveEnd) {
      this.view.emit('brushEnd', params);
      if (this.options.onEnd) {
        this.options.onEnd(params);
      }
    } else {
      this.view.emit('brushReset', params);
      if (this.options.onReset) {
        this.options.onReset(params);
      }
    }
  }
}
