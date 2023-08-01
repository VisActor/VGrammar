import type { DodgeTransformOptions, IElement } from '../../types';
import { getBandWidthOfScale, isBandLikeScale } from '../../graph/mark/encode';
import { array, isNil } from '@visactor/vutils';
import { getter, toPercent } from '@visactor/vgrammar-util';

/**
 * 针对mark的dodge变换，支持x、y方向
 */
export const transform = (options: DodgeTransformOptions, upstreamData: IElement[]) => {
  if (!upstreamData || upstreamData.length === 0 || !upstreamData[0]?.mark) {
    return upstreamData;
  }
  const mark = upstreamData[0].mark;
  const markScales = mark.getScales();
  const bandScale = Object.values(markScales).find(isBandLikeScale);

  if (!bandScale) {
    return upstreamData;
  }

  const scales = mark.getScalesByChannel();
  const bandWidth = getBandWidthOfScale(bandScale);
  const dodgeChannel = isNil(options.dodgeChannel)
    ? scales.y === bandScale ||
      scales.y1 === bandScale ||
      (scales.x && !isBandLikeScale(scales.x)) ||
      (scales.x1 && !isBandLikeScale(scales.x1))
      ? 'y'
      : 'x'
    : options.dodgeChannel;

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

    if (markType === 'rect' || markType === 'interval' || markType === 'arc') {
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
          const x = (element as any).getItemAttribute('x') + bandWidth / 2 + offset + size / 2;

          (element as any).setItemAttributes({ x });

          if (markType === 'rule') {
            (element as any).setItemAttributes({ x1: x });
          }
        } else if (dodgeChannel === 'y') {
          const y = (element as any).getItemAttribute('y') + bandWidth / 2 + offset + size / 2;

          (element as any).setItemAttributes({ y });

          if (markType === 'rule') {
            (element as any).setItemAttributes({ y1: y });
          }
        }
      });
    }
  }

  return upstreamData;
};
