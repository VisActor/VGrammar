import type { TreeLinkElement, TreemapNodeElement, TreeNodeElement } from './interface';

export const flattenNodes = <T = TreemapNodeElement>(
  nodes: TreemapNodeElement[],
  output: T[] = [],
  options?: {
    maxDepth?: number;
    callback?: (node: TreemapNodeElement) => T;
  }
) => {
  const hasMaxDepth = options?.maxDepth >= 0;

  nodes.forEach(node => {
    if (!hasMaxDepth || node.depth <= options.maxDepth) {
      output.push(options?.callback ? options.callback(node) : (node as unknown as T));
      if (node.children) {
        if (hasMaxDepth && node.depth === options.maxDepth) {
          node.children = null;
          node.isLeaf = true;
        } else {
          flattenNodes(node.children, output, options);
        }
      }
    }
  });

  return output;
};

export const flattenTreeLinks = <T>(
  nodes: TreeNodeElement[],
  output: T[] = [],
  options?: {
    maxDepth?: number;
    callback?: (link: TreeLinkElement) => T;
  }
) => {
  const hasMaxDepth = options?.maxDepth >= 0;

  nodes.forEach(node => {
    if (!hasMaxDepth || node.depth <= options.maxDepth - 1) {
      if (node.children) {
        node.children.forEach(child => {
          const link = {
            source: node,
            target: child,
            x0: node.x,
            y0: node.y,
            x1: child.x,
            y1: child.y,
            key: `${node.key}~${child.key}`
          };

          output.push(options?.callback ? options.callback(link) : (link as unknown as T));

          if (child.children?.length) {
            flattenTreeLinks([child], output, options);
          }
        });
      }
    }
  });

  return output;
};
