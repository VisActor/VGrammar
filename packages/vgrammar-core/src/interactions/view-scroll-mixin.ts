import { isNil } from '@visactor/vutils';
import type {
  InteractionEvent,
  IViewScrollMixin,
  ViewNavigationRange,
  ViewScrollSimpleOptions,
  ViewStateByDim
} from '../types';
import { handleScrolling } from './view-utils';

export class ViewScrollMixin implements IViewScrollMixin {
  protected _scrollX: number;
  protected _scrollY: number;

  protected formatPanScroll(e: InteractionEvent) {
    return e;
  }

  protected formatWheelScroll(e: InteractionEvent) {
    /**
     * @see https://vega.github.io/vega/examples/zoomable-world-map/
     * After testing, the ctrlKey field will only be true when the directions of the two fingers are inconsistent.
     * Based on this, determine whether to trigger the scroll event.
     */
    if (!(e as any).ctrlKey && ((e as any).deltaY !== 0 || (e as any).deltaX !== 0)) {
      (e as any).scrollX = (e as any).deltaX;
      (e as any).scrollY = (e as any).deltaY;
      return e;
    }

    return e;
  }

  formatScrollEvent(e: InteractionEvent) {
    if (!e) {
      return e;
    }

    if (e.type === 'pan') {
      return this.formatPanScroll(e);
    }

    if (e.type === 'wheel') {
      return this.formatWheelScroll(e);
    }

    return e;
  }

  handleScrollStart(
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    scrollOptions?: ViewScrollSimpleOptions
  ): ViewNavigationRange {
    e.stopPropagation();
    e.preventDefault();

    if (isNil((e as any).scrollX) && isNil((e as any).scrollY)) {
      return;
    }

    if (scrollOptions?.realtime) {
      return handleScrolling({ x: (e as any).scrollX, y: (e as any).scrollY }, navState, scrollOptions);
    }

    if (!isNil((e as any).scrollX)) {
      this._scrollX = isNil(this._scrollX) ? (e as any).scrollX : this._scrollX + (e as any).scrollX;
    }

    if (!isNil((e as any).scrollY)) {
      this._scrollY = isNil(this._scrollY) ? (e as any).scrollY : this._scrollY + (e as any).scrollY;
    }
  }

  handleScrollEnd(
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    scrollOptions?: ViewScrollSimpleOptions
  ): ViewNavigationRange {
    // do nothing now

    if (scrollOptions?.realtime === false && (isNil(this._scrollX) || isNil(this._scrollY))) {
      const res = handleScrolling({ x: this._scrollX, y: this._scrollY }, navState, scrollOptions);
      this._scrollX = null;
      this._scrollY = null;

      return res;
    }

    return null;
  }
}
