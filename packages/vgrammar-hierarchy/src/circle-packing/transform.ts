import { flattenNodes } from '../format';
import type { CirclePackingNodeElement, HierarchicalData, SunburstTramsformOptions } from '../interface';
import { CirclePackingLayout } from './layout';

export const transform = (options: SunburstTramsformOptions, upstreamData: HierarchicalData) => {
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

  if (options.flatten) {
    const nodes: CirclePackingNodeElement[] = [];
    flattenNodes(res, nodes, { maxDepth: options?.maxDepth });

    return nodes;
  }

  return res;
};
