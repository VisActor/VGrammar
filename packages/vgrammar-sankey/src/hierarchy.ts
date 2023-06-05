import { isNil } from '@visactor/vutils';
import type { HierarchyNodeDatum } from './interface';

export const calculateNodeValue = (subTree: HierarchyNodeDatum[]) => {
  let sum = 0;
  subTree.forEach((node, index) => {
    if (isNil(node.value)) {
      if (node.children?.length) {
        node.value = calculateNodeValue(node.children);
      } else {
        node.value = 0;
      }
    }

    sum += Math.abs(node.value);
  });

  return sum;
};
