import type { SankeyData, SankeyOptions } from './interface';
import { SankeyLayout } from './layout';

export const transform = (
  options: SankeyOptions & ({ width: number; height: number } | { x0: number; x1: number; y0: number; y1: number }),
  upstreamData: SankeyData | SankeyData[]
) => {
  const layout = new SankeyLayout(options);

  const res = layout.layout(
    Array.isArray(upstreamData) ? upstreamData[0] : upstreamData,
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
  return res ? [res] : [];
};
