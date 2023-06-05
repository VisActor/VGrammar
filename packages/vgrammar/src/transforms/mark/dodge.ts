import type { IElement } from '../../types';
import { getBandWidthOfScale } from '../../graph/mark/encode';
import { array, isNil } from '@visactor/vutils';
import { getter, toPercent } from '@visactor/vgrammar-util';

export interface DodgeOptions {
  /**
   * the gap for two graphic elements
   */
  innerGap?: number | string;
  /**
   * only used for rect / interval mark
   */
  maxWidth?: number;
  minWidth?: number;
  /** the gap between two category */
  categoryGap?: number | string;
  /**
   * specify the field to dodge, if this field is not specified, we'll use the `groupKey` of Element to dodge
   */
  dodgeBy?: string | string[];
  /**
   * specify the channel to dodge, if this field is not specified, we'll use the channel which is associated to a band scale
   */
  dodgeChannel?: 'x' | 'y';
}

/**
 * 针对mark的dodge变换，支持x、y方向
 */
export const transform = (options: DodgeOptions, upstreamData: IElement[]) => {
  if (!upstreamData || upstreamData.length === 0 || !upstreamData[0]?.mark) {
    return upstreamData;
  }
  const mark = upstreamData[0].mark;

  const scales = mark.getScalesByChannel();
  const yBandWidth = getBandWidthOfScale(scales.y);
  const dodgeChannel = options.dodgeChannel === 'y' || (isNil(options.dodgeChannel) && yBandWidth > 0) ? 'y' : 'x';
  const bandWidth = dodgeChannel === 'y' ? yBandWidth : getBandWidthOfScale(scales.x);

  if (bandWidth > 0) {
    const innerGap = options.innerGap ?? 0;
    const categoryGap = options.categoryGap ?? '20%';
    let getDodgeBy = (element: IElement) => element.groupKey;

    if (!isNil(options.dodgeBy)) {
      const getDodgeValue = getter(array(options.dodgeBy));

      getDodgeBy = (element: IElement) => getDodgeValue(element.getDatum());
    }

    const groupValues: any[] = [];

    upstreamData.forEach(element => {
      const groupValue = getDodgeBy(element);
      if (!groupValues.includes(groupValue)) {
        groupValues.push(groupValue);
      }
    });

    const groupCount = groupValues.length;

    if (groupCount < 1) {
      return upstreamData;
    }

    const catGap = toPercent(categoryGap, bandWidth);
    let innerSize = catGap >= bandWidth ? bandWidth : bandWidth - catGap;
    const innerGapSize = toPercent(innerGap, innerSize);
    let size = (innerSize - Math.max(groupCount - 1, 0) * innerGapSize) / groupCount;

    if (size > options.maxWidth) {
      innerSize -= (size - options.maxWidth) * groupCount;
      size = options.maxWidth;
    } else if (size < options.minWidth && options.minWidth <= bandWidth / groupCount) {
      innerSize += (options.minWidth - size) * groupCount;
      size = options.minWidth;
    }

    const offsetByGroup = {};

    groupValues.forEach((entry, index) => {
      offsetByGroup[entry] = -innerSize / 2 + index * (size + innerGapSize);
    });

    const markType = mark.markType;

    if (markType === 'rect' || markType === 'interval') {
      upstreamData.forEach(element => {
        const groupValue = getDodgeBy(element);
        const offset = offsetByGroup[groupValue];
        const attrs = (element as any).getItemAttribute();

        if (dodgeChannel === 'x') {
          const x = isNil(attrs.width) && !isNil(attrs.x1) ? Math.min(attrs.x, attrs.x1) : attrs.x;
          const width = !isNil(attrs.width) ? attrs.width : isNil(attrs.x1) ? bandWidth : Math.abs(attrs.x1 - attrs.x);
          const newAttrs: any = { x: x + width / 2 + offset };

          if (!isNil(attrs.width)) {
            newAttrs.width = size;
          } else {
            newAttrs.x1 = newAttrs.x + size;
          }

          (element as any).setItemAttributes(newAttrs);
        } else if (dodgeChannel === 'y') {
          const y = isNil(attrs.height) && !isNil(attrs.y1) ? Math.min(attrs.y, attrs.y1) : attrs.y;
          const height = !isNil(attrs.height)
            ? attrs.height
            : isNil(attrs.y1)
            ? bandWidth
            : Math.abs(attrs.y1 - attrs.y);

          const newAttrs: any = { y: y + height / 2 + offset };

          if (!isNil(attrs.height)) {
            newAttrs.height = size;
          } else {
            newAttrs.y1 = newAttrs.y + size;
          }

          (element as any).setItemAttributes(newAttrs);
        }
      });
    } else {
      upstreamData.forEach(element => {
        const groupValue = getDodgeBy(element);
        const offset = offsetByGroup[groupValue];

        if (dodgeChannel === 'x') {
          const mx = (element as any).getItemAttribute('x') + bandWidth / 2;

          (element as any).setItemAttributes({ x: mx + offset + size / 2 });
        } else if (dodgeChannel === 'y') {
          const my = (element as any).getItemAttribute('y') + bandWidth / 2;

          (element as any).setItemAttributes({ y: my + offset + size / 2 });
        }
      });
    }
  }

  return upstreamData;
};
