/* Adapted from d3-hierarchy by Mike Bostock
 * https://observablehq.com/collection/@d3/d3-hierarchy
 * Licensed under the ISC

 * url: https://github.com/d3/d3-hierarchy/blob/main/src/cluster.js
 * License: https://github.com/d3/d3-hierarchy/blob/main/LICENSE
 * @license
 */

import { isNumber } from '@visactor/vutils';
import type { TreeNodeElement } from '../interface';
import { eachAfter } from '../utils';

function defaultSeparation(a: TreeNodeElement, b: TreeNodeElement) {
  return a.parentKey === b.parentKey ? 1 : 2;
}

function meanX(children: TreeNodeElement[]) {
  return (
    children.reduce((x, c) => {
      return x + c.x;
    }, 0) / children.length
  );
}

function maxY(children: TreeNodeElement[]) {
  return (
    1 +
    children.reduce((y, c) => {
      return Math.max(y, c.y);
    }, 0)
  );
}

function leafLeft(node: TreeNodeElement) {
  let children = node.children;
  while (children) {
    node = children[0];
    children = node.children;
  }
  return node;
}

function leafRight(node: TreeNodeElement) {
  let children = node.children;
  while (children) {
    node = children[children.length - 1];
    children = node.children;
  }
  return node;
}

export function clusterTree(
  root: TreeNodeElement,
  viewBox?: { x0: number; y0: number; width: number; height: number },
  minNodeGap?: number,
  linkWidth?: number | number[],
  separation: (a: TreeNodeElement, b: TreeNodeElement) => number = defaultSeparation
) {
  let previousNode: TreeNodeElement;
  let x = 0;

  // First walk, computing the initial x & y values.
  eachAfter([root], node => {
    const children = node.children;
    if (children) {
      node.x = meanX(children);
      node.y = maxY(children);
    } else {
      node.x = previousNode ? (x += separation(node, previousNode)) : 0;
      node.y = 0;
      previousNode = node;
    }
  });

  if (isNumber(minNodeGap) && isNumber(linkWidth)) {
    // Second walk, normalizing x & y to the desired size.
    eachAfter([root], node => {
      node.x = viewBox.x0 + (node.x - root.x) * minNodeGap;
      node.y = viewBox.y0 + (root.y - node.y) * linkWidth;
    });
  } else {
    const left = leafLeft(root);
    const right = leafRight(root);
    const x0 = left.x - separation(left, right) / 2;
    const x1 = right.x + separation(right, left) / 2;
    const kx = isNumber(minNodeGap) ? minNodeGap : viewBox.width / (x1 - x0);

    eachAfter([root], node => {
      node.x = viewBox.x0 + (node.x - x0) * kx;
      node.y = viewBox.y0 + (1 - (root.y ? node.y / root.y : 1)) * viewBox.height;
    });
  }

  return root;
}
