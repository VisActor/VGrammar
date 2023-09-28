import { clamp, isNil } from '@visactor/vutils';
import type {
  IViewZoomMixin,
  InteractionEvent,
  ViewNavigationRange,
  ViewStateByDim,
  ViewZoomSimpleOptions
} from '../types';
import { getFilteredValuesFromScale, getRangeOfLinkedComponent } from './view-utils';

export class ViewZoomMixin implements IViewZoomMixin {
  protected declare _state: Partial<Record<'x' | 'y', ViewStateByDim>>;

  protected _lastScale: number;
  protected _zoomPos: {
    zoomDelta: number;
    zoomX: number;
    zoomY: number;
  };

  protected _formatPinchZoom(e: InteractionEvent) {
    const scale = (e as any).scale;
    if (isNil(this._lastScale)) {
      this._lastScale = scale;
      return e;
    }
    const zoomDelta = scale / this._lastScale;

    this._lastScale = scale;
    const center = (e as any).center;

    (e as any).zoomDelta = zoomDelta;
    (e as any).zoomX = center.x;
    (e as any).zoomY = center.y;

    return e;
  }

  protected _formatWheelZoom(e: InteractionEvent) {
    /**
     * @see https://vega.github.io/vega/examples/zoomable-world-map/
     * After testing, the ctrlKey field will only be true when the directions of the two fingers are inconsistent.
     * Based on this, determine whether to trigger the scroll event.
     */
    if (!(e as any).ctrlKey) {
      (e as any).zoomDelta = null;
      (e as any).zoomX = null;
      (e as any).zoomY = null;
      return e;
    }

    // @see https://vega.github.io/vega/examples/zoomable-world-map/
    const zoomDelta = Math.pow(1.0005, -(e as any).deltaY * Math.pow(16, (e as any).deltaMode));

    (e as any).zoomDelta = zoomDelta;
    (e as any).zoomX = e.canvasX;
    (e as any).zoomY = e.canvasY;
    return e;
  }

  formatZoomEvent(e: InteractionEvent) {
    if (!e) {
      return e;
    }

    if (e.type === 'pinch') {
      return this._formatPinchZoom(e);
    }

    return this._formatWheelZoom(e);
  }

  updateZoomRange(
    rangeFactor: [number, number] = [0, 1],
    range: [number, number],
    zoomEvent: { zoomDelta: number; zoomX: number; zoomY: number },
    zoomOptions?: { rate?: number; focus?: boolean }
  ) {
    const { zoomDelta } = zoomEvent;

    const rangeDelta = Math.abs(rangeFactor[1] - rangeFactor[0]);

    if (rangeDelta >= 1 && zoomDelta >= 1) {
      return;
    }
    if (rangeDelta <= 1e-3 && zoomDelta <= 1) {
      return;
    }
    const value = (rangeDelta * (zoomDelta - 1) * (zoomOptions.rate ?? 1)) / 2;

    const start = clamp(rangeFactor[0] - value, 0, 1);
    const end = clamp(rangeFactor[1] + value, 0, 1);

    return [Math.min(start, end), Math.max(start, end)] as [number, number];
  }

  protected _handleZooming(
    zoomPos: { zoomDelta: number; zoomX: number; zoomY: number },
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    zoomOptions?: ViewZoomSimpleOptions
  ): ViewNavigationRange {
    const res: ViewNavigationRange = { needUpdate: false };
    if (!navState) {
      return res;
    }

    Object.keys(navState).forEach(dim => {
      const { scale, data, linkedComponent, rangeFactor } = navState[dim];

      if (linkedComponent) {
        res[dim] = this.updateZoomRange(getRangeOfLinkedComponent(linkedComponent), null, zoomPos, zoomOptions);
      } else if (scale) {
        const innerScale = scale.getScale();
        const newRange = this.updateZoomRange(rangeFactor, innerScale, zoomPos, zoomOptions);

        if (newRange) {
          navState[dim].rangeFactor = newRange;

          if (data) {
            navState[dim].filterValue = newRange;

            data.commit();
          } else {
            scale.setRangeFactor(newRange);
            scale.commit();
          }
          res.needUpdate = true;
          res[dim] = newRange;
        }
      }
    });
    return res;
  }

  handleZoomStart(
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    zoomOptions?: ViewZoomSimpleOptions
  ): ViewNavigationRange {
    if (isNil((e as any).zoomDelta)) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();

    if (zoomOptions?.realtime) {
      return this._handleZooming(
        e as unknown as { zoomDelta: number; zoomX: number; zoomY: number },
        navState,
        zoomOptions
      );
    }

    if (isNil(this._zoomPos)) {
      this._zoomPos = {
        zoomDelta: (e as any).zoomDelta,
        zoomX: (e as any).zoomX,
        zoomY: (e as any).zoomY
      };
    } else {
      this._zoomPos.zoomDelta *= (e as any).zoomDelta;
    }

    return null;
  }

  handleZoomEnd(
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    zoomOptions?: ViewZoomSimpleOptions
  ): ViewNavigationRange {
    this._lastScale = null;
    const res =
      zoomOptions?.realtime === false && this._zoomPos
        ? this._handleZooming(this._zoomPos, navState, zoomOptions)
        : null;

    this._zoomPos = null;

    return res;
  }

  handleZoomReset(
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    zoomOptions?: ViewZoomSimpleOptions
  ): ViewNavigationRange {
    const res: ViewNavigationRange = { needUpdate: false };
    if (!navState) {
      return res;
    }

    Object.keys(navState).forEach(dim => {
      const { scale, data, linkedComponent } = navState[dim];
      const newRange = [0, 1];

      if (linkedComponent) {
        res[dim] = newRange;
      } else if (scale) {
        navState[dim].rangeFactor = null;

        if (data) {
          navState[dim].filterValue = null;

          data.commit();
        } else {
          scale.setRangeFactor(newRange);
          scale.commit();
        }
        res.needUpdate = true;
        res[dim] = newRange;
      }
    });
    return res;
  }
}
