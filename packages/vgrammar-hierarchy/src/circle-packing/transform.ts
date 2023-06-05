import type { HierarchicalData, SunburstOptions } from '../interface';
import { CirclePackingLayout } from './layout';

export const transform = (
  options: SunburstOptions & ({ width: number; height: number } | { x0: number; x1: number; y0: number; y1: number }),
  upstreamData: HierarchicalData
) => {
  const layout = new CirclePackingLayout(options);

  const res = layout.layout(
    upstreamData,
    'width' in options
      ? {
          width: options.width,
          height: options.height
        }
      : {
          x0: options.x0,
          x1: options.x1,
          y0: options.y0,
          y1: options.y1
        }
  );
  return res;
};
