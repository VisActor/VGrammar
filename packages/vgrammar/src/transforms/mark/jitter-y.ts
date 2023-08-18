import type { IElement, JitterYTransformOptions } from '../../types';
import { getBandWidthOfScale } from '../../graph/mark/encode';

/**
 * 针对mark的dodge变换，支持x、y方向
 */
export const transform = (options: JitterYTransformOptions, upstreamData: IElement[]) => {
  if (!upstreamData || upstreamData.length === 0 || !upstreamData[0]?.mark) {
    return upstreamData;
  }
  const mark = upstreamData[0].mark;
  const yScale = mark.getScalesByChannel()?.y;

  const ratio = Math.min(options.heightRatio ?? 0.4, 0.5);
  const bandWidth = options.height ?? getBandWidthOfScale(yScale);

  if (bandWidth > 0 && ratio > 0) {
    const prevYs = upstreamData.map(el => el.getItemAttribute('y'));
    const avg = prevYs.reduce((res, entry) => res + entry, 0) / prevYs.length;
    upstreamData.forEach(element => {
      element.setItemAttributes({ y: avg + bandWidth * ratio * Math.random() });
    });
  }

  return upstreamData;
};
