import { isNil } from '@visactor/vutils';
import type {
  InteractionEvent,
  IViewDragMixin,
  ViewNavigationRange,
  ViewDragSimpleOptions,
  ViewStateByDim
} from '../types';
import {
  getBoundsRangeOfLinkedComponent,
  getFilteredValuesFromScale,
  getRangeOfLinkedComponent,
  handleScrolling
} from './view-utils';

export class ViewDragMixin implements IViewDragMixin {
  protected _pointerId: number;
  protected _dragStart: { x: number; y: number };
  protected _filterValueX: { start: number; end: number };
  protected _filterValueY: { start: number; end: number };

  protected _shouldTriggerDragByPointer(e: InteractionEvent) {
    if (!isNil((e as any).pointerId)) {
      const shouldStart = isNil(this._pointerId) || this._pointerId === (e as any).pointerId;
      this._pointerId = (e as any).pointerId;

      return shouldStart;
    }

    return true;
  }

  protected _shouldStart(e: InteractionEvent) {
    return this._shouldTriggerDragByPointer(e);
  }

  protected _shouldUpdate(e: InteractionEvent) {
    return this._shouldTriggerDragByPointer(e);
  }

  handleDragStart(
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    dragOptions?: ViewDragSimpleOptions
  ): ViewNavigationRange {
    if (!this._shouldStart(e)) {
      return;
    }

    this._dragStart = { x: e.canvasX, y: e.canvasY };
    return null;
  }

  handleDragUpdate(
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    dragOptions?: ViewDragSimpleOptions
  ): ViewNavigationRange {
    if (!this._dragStart || !this._shouldUpdate(e)) {
      return;
    }

    if (dragOptions?.realtime) {
      const x = e.canvasX - this._dragStart.x;
      const y = e.canvasY - this._dragStart.y;
      return handleScrolling({ x, y }, navState, dragOptions);
    }

    return null;
  }

  handleDragEnd(
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    dragOptions?: ViewDragSimpleOptions
  ): ViewNavigationRange {
    if (!this._dragStart) {
      return;
    }
    const res =
      dragOptions?.realtime === false
        ? handleScrolling(
            {
              x: e.canvasX - this._dragStart.x,
              y: e.canvasY - this._dragStart.y
            },
            navState,
            dragOptions
          )
        : null;

    this._pointerId = null;
    this._dragStart = null;

    return res;
  }
}
