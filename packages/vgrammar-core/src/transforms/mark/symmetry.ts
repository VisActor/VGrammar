import { isNil, isValidNumber, maxInArray, minInArray } from '@visactor/vutils';
import type { IElement, SymmetryTransformOptions } from '../../types';

const symmetryByChannel = (upstreamData: IElement[], channel: 'x' | 'y', align?: 'min' | 'max') => {
  const baseChannel = `${channel}1`;
  const hasRangeValue = upstreamData.some(el => !isNil(el.getItemAttribute(baseChannel)));
  const middleValues = hasRangeValue
    ? upstreamData.map(el => (el.getItemAttribute(baseChannel) + el.getItemAttribute(channel)) / 2)
    : upstreamData.map(el => el.getItemAttribute(channel));
  const maxMid = align === 'min' ? minInArray(middleValues) : maxInArray(middleValues);

  if (isValidNumber(maxMid)) {
    upstreamData.forEach((el, index) => {
      const offset = maxMid - middleValues[index];
      if (hasRangeValue) {
        el.setItemAttributes({
          [baseChannel]: el.getItemAttribute(baseChannel) + offset,
          [channel]: el.getItemAttribute(channel) + offset
        });
      } else {
        el.setItemAttributes({
          [channel]: el.getItemAttribute(channel) + offset
        });
      }
    });
  }

  return upstreamData;
};

/**
 * 针对mark的symmetry变换，支持x、y方向
 */
export const symmetry = (options: SymmetryTransformOptions, upstreamData: IElement[]) => {
  if (!upstreamData || upstreamData.length === 0 || !upstreamData[0]?.mark) {
    return upstreamData;
  }

  return symmetryByChannel(upstreamData, options.channel ?? 'y', options.align);
};
