import type { IElement, JitterXTransformOptions } from '../../types';
import { getBandWidthOfScale } from '../../graph/mark/encode';

/**
 * 针对mark的dodge变换，支持x、y方向
 */
export const transform = (options: JitterXTransformOptions, upstreamData: IElement[]) => {
  if (!upstreamData || upstreamData.length === 0 || !upstreamData[0]?.mark) {
    return upstreamData;
  }
  const mark = upstreamData[0].mark;
  const xScale = mark.getScalesByChannel()?.x;

  const widthRatio = Math.min(options.widthRatio ?? 0.4, 0.5);
  const bandWidth = options.width ?? getBandWidthOfScale(xScale);

  if (bandWidth > 0 && widthRatio > 0) {
    const prevXs = upstreamData.map(el => el.getItemAttribute('x'));
    const avg = prevXs.reduce((res, entry) => res + entry, 0) / prevXs.length;
    upstreamData.forEach(element => {
      const x = element.getItemAttribute('x');

      element.setItemAttributes({ x: avg + bandWidth * widthRatio * Math.random() });
    });
  }

  return upstreamData;
};
