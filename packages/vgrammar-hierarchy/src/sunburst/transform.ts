import { flattenNodes } from '../format';
import type { HierarchicalData, SunburstNodeElement, SunburstTramsformOptions } from '../interface';
import { SunburstLayout } from './layout';

export const transform = (options: SunburstTramsformOptions, upstreamData: HierarchicalData) => {
  const layout = new SunburstLayout(options);

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
    const nodes: SunburstNodeElement[] = [];
    flattenNodes(res, nodes, { maxDepth: options?.maxDepth });

    return nodes;
  }
  return res;
};
