import type { IElement, JitterTransformOptions, JitterXTransformOptions, JitterYTransformOptions } from '../../types';
import { getBandWidthOfScale } from '../../graph/mark/encode';
import { isNil } from '@visactor/vutils';
import { extent } from '@visactor/vgrammar-util';

const jitterByChannel = (options: JitterTransformOptions, upstreamData: IElement[], channel: 'x' | 'y') => {
  const mark = upstreamData[0].mark;
  const scale = mark.getScalesByChannel()?.[channel];
  const random = options.random ?? Math.random;
  const ratio = Math.min((channel === 'x' ? options.widthRatio : options.heightRatio) ?? 0.4, 0.5);
  const bandSize = (channel === 'x' ? options.bandWidth : options.bandHeight) ?? getBandWidthOfScale(scale);

  if (isNil(bandSize)) {
    let domain = extent(upstreamData, el => el.getItemAttribute(channel));

    if (isNil(domain[0]) || isNil(domain[1]) || domain[0] === domain[1]) {
      const viewBox = mark.view.getViewBox();
      domain = channel === 'x' ? [viewBox.x1, viewBox.x2] : [viewBox.y1, viewBox.y2];
    }
    const length = upstreamData.length;

    upstreamData.forEach((element, index) => {
      element.setItemAttributes({ [channel]: domain[0] + (domain[1] - domain[0]) * random(index, length) });
    });
  } else {
    const length = upstreamData.length;
    upstreamData.forEach((element, index) => {
      const val = element.getItemAttribute(channel);
      const domain = [val - ratio * bandSize, val + ratio * bandSize];
      element.setItemAttributes({ [channel]: domain[0] + (domain[1] - domain[0]) * random(index, length) });
    });
  }
};

/**
 * 针对mark的dodge变换，支持x、y方向
 */
export const jitterY = (options: JitterYTransformOptions, upstreamData: IElement[]) => {
  if (!upstreamData || upstreamData.length === 0 || !upstreamData[0]?.mark) {
    return upstreamData;
  }

  return jitterByChannel(options, upstreamData, 'y');
};

/**
 * 针对mark的dodge变换，支持x、y方向
 */
export const jitterX = (options: JitterXTransformOptions, upstreamData: IElement[]) => {
  if (!upstreamData || upstreamData.length === 0 || !upstreamData[0]?.mark) {
    return upstreamData;
  }

  return jitterByChannel(options, upstreamData, 'x');
};

/**
 * 针对mark的dodge变换，支持x、y方向
 */
export const transform = (options: JitterTransformOptions, upstreamData: IElement[]) => {
  if (!upstreamData || upstreamData.length === 0 || !upstreamData[0]?.mark) {
    return upstreamData;
  }

  jitterByChannel(options, upstreamData, 'x');
  jitterByChannel(options, upstreamData, 'y');

  return upstreamData;
};
