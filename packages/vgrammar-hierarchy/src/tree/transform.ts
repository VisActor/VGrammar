import { flattenNodes, flattenTreeLinks } from '../format';
import type { HierarchicalData, TreeLinkElement, TreeNodeElement, TreeTramsformOptions } from '../interface';
import { TreeLayout } from './layout';

export const transform = (options: TreeTramsformOptions, upstreamData: HierarchicalData) => {
  const layout = new TreeLayout(options);

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
    const { maxDepth } = options ?? {};
    const nodes: TreeNodeElement[] = [];
    flattenNodes(res, nodes, { maxDepth });
    const links: TreeLinkElement[] = [];

    flattenTreeLinks(res, links, { maxDepth });

    return { nodes, links };
  }
  return res;
};
