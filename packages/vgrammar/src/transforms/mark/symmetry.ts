import { isNil, isValidNumber } from '@visactor/vutils';
import type { IElement, SymmetryTransformOptions } from '../../types';
import { extent } from '@visactor/vgrammar-util';

const symmetryByChannel = (upstreamData: IElement[], channel: 'x' | 'y') => {
  const groupMap: Record<string, { els: IElement[]; mid?: number }> = {};
  const groupKey = channel === 'x' ? 'y' : 'x';

  upstreamData.forEach(element => {
    const groupValue = element.getItemAttribute(groupKey);

    if (groupMap[groupValue]) {
      groupMap[groupValue].els.push(element);
    } else {
      groupMap[groupValue] = {
        els: [element]
      };
    }
  });
  const baseChannel = `${channel}1`;
  const middleValuesByGroup: number[] = [];

  Object.keys(groupMap).forEach(groupKey => {
    const els = groupMap[groupKey].els;
    const values: number[] = [];
    let el: IElement;
    for (let i = 0, len = els.length; i < len; i++) {
      el = els[i];

      values.push(el.getItemAttribute(channel));
      values.push(el.getItemAttribute(baseChannel));
    }

    const ext = extent(values);

    if (!isNil(ext[0]) && !isNil(ext[1])) {
      groupMap[groupKey].mid = (ext[0] + ext[1]) / 2;
      middleValuesByGroup.push(groupMap[groupKey].mid);
    }
  });

  const maxMidY = Math.max.apply(null, middleValuesByGroup);

  if (isValidNumber(maxMidY)) {
    Object.keys(groupMap).forEach(groupKey => {
      const els = groupMap[groupKey].els;
      const offset = maxMidY - groupMap[groupKey].mid;
      let el: IElement;
      let value1: number;

      if (offset) {
        for (let i = 0, len = els.length; i < len; i++) {
          el = els[i];

          value1 = el.getItemAttribute(baseChannel);

          if (!isNil(value1)) {
            el.setItemAttributes({
              [baseChannel]: el.getItemAttribute(baseChannel) + offset,
              [channel]: el.getItemAttribute(channel) + offset
            });
          } else {
            el.setItemAttributes({
              [channel]: el.getItemAttribute(channel) + offset
            });
          }
        }
      }
    });
  }
};

/**
 * 针对mark的symmetry变换，支持x、y方向
 */
export const symmetry = (options: SymmetryTransformOptions, upstreamData: IElement[]) => {
  if (!upstreamData || upstreamData.length === 0 || !upstreamData[0]?.mark) {
    return upstreamData;
  }

  return symmetryByChannel(upstreamData, options.channel ?? 'y');
};
