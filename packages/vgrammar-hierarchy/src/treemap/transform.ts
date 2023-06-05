import type { TreemapData, TreemapOptions } from '../interface';
import { TreemapLayout } from './layout';

export const transform = (
  options: TreemapOptions & ({ width: number; height: number } | { x0: number; x1: number; y0: number; y1: number }),
  upstreamData: TreemapData
) => {
  const layout = new TreemapLayout(options);

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
