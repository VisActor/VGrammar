import { isContinuous, type IBaseScale } from '@visactor/vscale';
import { ComponentEnum } from '../graph/enums';
import type { IDatazoom, IScrollbar, ViewNavigationRange, ViewStateByDim } from '../types';

export const getRangeOfLinkedComponent = (comp: IDatazoom | IScrollbar): [number, number] => {
  if (comp.componentType === ComponentEnum.datazoom) {
    const res = (comp as IDatazoom).getStartEndValue();
    return res ? [res.start, res.end] : null;
  }

  return (comp as IScrollbar).getScrollRange();
};

export const getBoundsRangeOfLinkedComponent = (comp: IDatazoom | IScrollbar, dim: 'x' | 'y'): [number, number] => {
  const bounds = comp.getBounds();

  if (bounds && !bounds.empty()) {
    return dim === 'y' ? [bounds.y1, bounds.y2] : [bounds.x1, bounds.x2];
  }
};

export const getFilteredValuesFromScale = (scale: IBaseScale, range: [number, number]) => {
  const scaleRange = scale.range();
  const startPos = scaleRange[0] + (scaleRange[1] - scaleRange[0]) * range[0];
  const endPos = scaleRange[0] + (scaleRange[1] - scaleRange[0]) * range[1];

  if (isContinuous(scale.type)) {
    const startValue = scale.invert(startPos);
    const endValue = scale.invert(endPos);

    return [Math.min(startValue, endValue), Math.max(startValue, endValue)];
  }
  const domain = scale.domain();

  return domain.filter((entry: any) => {
    const val = scale.scale(entry);
    return val >= startPos && val <= endPos;
  });
};

export const updateScrollRange = (
  rangeFactor: [number, number] = [0, 1],
  range: [number, number],
  scrollValue: number = 0,
  scrollOptions?: { reversed?: boolean }
) => {
  if (Math.abs(scrollValue) < 1e-3) {
    return;
  }
  const rangeDelta = Math.abs(rangeFactor[1] - rangeFactor[0]);

  if (rangeDelta >= 1) {
    return;
  }
  const size = Math.abs(range[range.length - 1] - range[0]);

  if (size <= 0 || Number.isNaN(size)) {
    return;
  }

  const value = (scrollOptions.reversed ? -1 : 1) * scrollValue;

  if (value > 0 && rangeFactor[1] < 1) {
    const delta = Math.min(1 - rangeFactor[1], value / size);

    return [rangeFactor[0] + delta, rangeFactor[1] + delta] as [number, number];
  } else if (value < 0 && rangeFactor[0] > 0) {
    const delta = Math.max(-rangeFactor[0], value / size);

    return [rangeFactor[0] + delta, rangeFactor[1] + delta] as [number, number];
  }
};

export const handleScrolling = (
  scrollPos: { x?: number; y?: number },
  navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
  scrollOptions?: { reversed?: boolean }
): ViewNavigationRange => {
  const res: ViewNavigationRange = { needUpdate: false };
  if (!navState) {
    return res;
  }

  Object.keys(navState).forEach(dim => {
    const { scale, data, linkedComponent, rangeFactor, wholeScale } = navState[dim];

    if (linkedComponent) {
      res[dim] = updateScrollRange(
        getRangeOfLinkedComponent(linkedComponent),
        getBoundsRangeOfLinkedComponent(linkedComponent, dim as 'x' | 'y'),
        scrollPos[dim],
        scrollOptions
      );
    } else if (scale) {
      const innerScale = scale.getScale();
      const newRange = updateScrollRange(rangeFactor, innerScale.range(), scrollPos[dim], scrollOptions);

      if (newRange) {
        navState[dim].rangeFactor = newRange;

        if (data) {
          navState[dim].filterValue = rangeFactor;

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
};
