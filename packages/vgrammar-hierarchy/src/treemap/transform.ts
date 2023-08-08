import { flattenNodes } from '../format';
import type { TreemapData, TreemapNodeElement, TreemapTramsformOptions } from '../interface';
import { TreemapLayout } from './layout';

export const transform = (options: TreemapTramsformOptions, upstreamData: TreemapData) => {
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

  if (options.flatten) {
    const nodes: TreemapNodeElement[] = [];
    flattenNodes(res, nodes, { maxDepth: options?.maxDepth });

    return nodes;
  }
  return res;
};
