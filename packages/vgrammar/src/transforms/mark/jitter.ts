import type { IElement, JitterTransformOptions } from '../../types';
import { transform as jitterX } from './jitter-x';
import { transform as jitterY } from './jitter-y';

/**
 * 针对mark的dodge变换，支持x、y方向
 */
export const transform = (options: JitterTransformOptions, upstreamData: IElement[]) => {
  if (!upstreamData || upstreamData.length === 0 || !upstreamData[0]?.mark) {
    return upstreamData;
  }

  jitterX(options, upstreamData);
  jitterY(options, upstreamData);

  return upstreamData;
};
