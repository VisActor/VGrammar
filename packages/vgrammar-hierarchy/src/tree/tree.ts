/* Adapted from d3-hierarchy by Mike Bostock
 * https://observablehq.com/collection/@d3/d3-hierarchy
 * Licensed under the ISC

 * url: https://github.com/d3/d3-hierarchy/blob/main/src/tree.js
 * License: https://github.com/d3/d3-hierarchy/blob/main/LICENSE
 * @license
 */

import { eachAfter, eachBefore } from '../utils';
import type { TreeNodeElement } from '../interface';
import { isArray, isNumber } from '@visactor/vutils';

interface TreeNode {
  _: TreeNodeElement;
  parent?: TreeNode;
  children?: TreeNode[];
  /**
   * default ancestor
   */
  A?: TreeNode;
  /** ancestor */
  a?: TreeNode;
  /** prelim */
  z: number;
  /** mod */
  m: number;
  /** change */
  c: number;
  /** shift */
  s: number;
  /** thread */
  t?: TreeNode;
  // index
  i: number;
}

function defaultSeparation(a: TreeNodeElement, b: TreeNodeElement) {
  return a.parentKey === b.parentKey ? 1 : 2;
}

// function radialSeparation(a, b) {
//   return (a.parent === b.parent ? 1 : 2) / a.depth;
// }

// This function is used to traverse the left contour of a subtree (or
// subforest). It returns the successor of v on this contour. This successor is
// either given by the leftmost child of v or by the thread of v. The function
// returns null if and only if v is on the highest level of its subtree.
function nextLeft(v: TreeNode) {
  const children = v.children;
  return children ? children[0] : v.t;
}

// This function works analogously to nextLeft.
function nextRight(v: TreeNode) {
  const children = v.children;
  return children ? children[children.length - 1] : v.t;
}

// Shifts the current subtree rooted at w+. This is done by increasing
// prelim(w+) and mod(w+) by shift.
function moveSubtree(wm: TreeNode, wp: TreeNode, shift: number) {
  const change = shift / (wp.i - wm.i);
  wp.c -= change;
  wp.s += shift;
  wm.c += change;
  wp.z += shift;
  wp.m += shift;
}

// All other shifts, applied to the smaller subtrees between w- and w+, are
// performed by this function. To prepare the shifts, we have to adjust
// change(w+), shift(w+), and change(w-).
function executeShifts(v: TreeNode) {
  let shift = 0;
  let change = 0;
  const children = v.children;
  let i = children.length;
  let w;
  while (--i >= 0) {
    w = children[i];
    w.z += shift;
    w.m += shift;
    shift += w.s + (change += w.c);
  }
}

// If vi-’s ancestor is a sibling of v, returns vi-’s ancestor. Otherwise,
// returns the specified (default) ancestor.
function nextAncestor(vim: TreeNode, v: TreeNode, ancestor: TreeNode) {
  const vimAncestor = vim.a ?? vim;

  return vimAncestor.parent === v.parent ? vimAncestor : ancestor;
}

function createTreeNode(node: TreeNodeElement, i: number): TreeNode {
  return {
    _: node,
    i,
    parent: null,
    A: null,
    a: null,
    z: 0,
    m: 0,
    c: 0,
    s: 0,
    t: null
  };
}

function treeRoot(root: TreeNodeElement) {
  const tree = createTreeNode(root, 0);
  const nodes: TreeNode[] = [tree];
  let child;
  let children;
  let i;
  let n;

  let node = nodes.pop();
  while (node) {
    children = node._.children;
    if (children) {
      n = children.length;
      node.children = new Array(n);
      for (i = n - 1; i >= 0; --i) {
        child = createTreeNode(children[i], i);
        node.children[i] = child;
        nodes.push(child);
        child.parent = node;
      }
    }
    node = nodes.pop();
  }

  tree.parent = createTreeNode(null, 0);
  tree.parent.children = [tree];
  return tree;
}

// Node-link tree diagram using the Reingold-Tilford "tidy" algorithm
export function tidyTree(
  root: TreeNodeElement,
  viewBox?: { x0: number; y0: number; width: number; height: number },
  minNodeGap?: number,
  linkWidth?: number | number[],
  separation: (a: TreeNodeElement, b: TreeNodeElement) => number = defaultSeparation
) {
  // Computes a preliminary x-coordinate for v. Before that, FIRST WALK is
  // applied recursively to the children of v, as well as the function
  // APPORTION. After spacing out the children by calling EXECUTE SHIFTS, the
  // node v is placed to the midpoint of its outermost children.
  const firstWalk = (v: TreeNode) => {
    const children = v.children;
    const siblings = v.parent.children;
    const w = v.i ? siblings[v.i - 1] : null;
    if (children) {
      executeShifts(v);
      const midpoint = (children[0].z + children[children.length - 1].z) / 2;
      if (w) {
        v.z = w.z + separation(v._, w._);
        v.m = v.z - midpoint;
      } else {
        v.z = midpoint;
      }
    } else if (w) {
      v.z = w.z + separation(v._, w._);
    }
    v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
  };

  // Computes all real x-coordinates by summing up the modifiers recursively.
  const secondWalk = (v: TreeNode) => {
    v._.x = v.z + v.parent.m;
    v.m += v.parent.m;
  };

  // The core of the algorithm. Here, a new subtree is combined with the
  // previous subtrees. Threads are used to traverse the inside and outside
  // contours of the left and right subtree up to the highest common level. The
  // vertices used for the traversals are vi+, vi-, vo-, and vo+, where the
  // superscript o means outside and i means inside, the subscript - means left
  // subtree and + means right subtree. For summing up the modifiers along the
  // contour, we use respective variables si+, si-, so-, and so+. Whenever two
  // nodes of the inside contours conflict, we compute the left one of the
  // greatest uncommon ancestors using the function ANCESTOR and call MOVE
  // SUBTREE to shift the subtree and prepare the shifts of smaller subtrees.
  // Finally, we add a new thread (if necessary).
  const apportion = (v: TreeNode, w: TreeNode, ancestor: TreeNode) => {
    if (w) {
      let vip = v;
      let vop = v;
      let vim = w;
      let vom = vip.parent.children[0];
      let sip = vip.m;
      let sop = vop.m;
      let sim = vim.m;
      let som = vom.m;
      let shift;
      vim = nextRight(vim);
      vip = nextLeft(vip);

      while (vim && vip) {
        vom = nextLeft(vom);
        vop = nextRight(vop);
        vop.a = v;
        shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);
        if (shift > 0) {
          moveSubtree(nextAncestor(vim, v, ancestor), v, shift);
          sip += shift;
          sop += shift;
        }
        sim += vim.m;
        sip += vip.m;
        som += vom.m;
        sop += vop.m;

        vim = nextRight(vim);
        vip = nextLeft(vip);
      }
      if (vim && !nextRight(vop)) {
        vop.t = vim;
        vop.m += sim - sop;
      }
      if (vip && !nextLeft(vom)) {
        vom.t = vip;
        vom.m += sip - som;
        ancestor = v;
      }
    }
    return ancestor;
  };

  const t = treeRoot(root);

  // Compute the layout using Buchheim et al.’s algorithm.
  eachAfter([t], firstWalk);
  t.parent.m = -t.z;
  eachBefore([t], secondWalk);

  let getY: (node: TreeNodeElement) => number;

  if (isNumber(linkWidth)) {
    getY = (node: TreeNodeElement) => {
      return node.depth * linkWidth;
    };
  } else if (isArray(linkWidth) && linkWidth.length) {
    const sumed = linkWidth.reduce((res, entry, index) => {
      res[index] = index === 0 ? entry : res[index - 1] + entry;

      return res;
    }, []);
    getY = (node: TreeNodeElement) => {
      return sumed[node.depth] ?? sumed[sumed.length - 1];
    };
  }

  // If a fixed node size is specified, scale x and y.
  if (isNumber(minNodeGap) && getY) {
    const setSizeOfNode = (node: TreeNodeElement) => {
      node.x = viewBox.x0 + viewBox.width / 2 + node.x * minNodeGap;
      node.y = viewBox.y0 + getY(node);
    };
    eachBefore([root], setSizeOfNode);
  } else {
    // If a fixed tree size is specified, scale x and y based on the extent.
    // Compute the left-most, right-most, and depth-most nodes for extents.
    let left = root;
    let right = root;
    let bottom = root;

    eachBefore([root], node => {
      if (node.x < left.x) {
        left = node;
      }
      if (node.x > right.x) {
        right = node;
      }
      if (node.depth > bottom.depth) {
        bottom = node;
      }
    });
    const s = left === right ? 1 : separation(left, right) / 2;
    const tx = s - left.x;
    const kx = isNumber(minNodeGap) ? minNodeGap : viewBox.width / (right.x + s + tx);
    const ky = viewBox.height / (bottom.depth || 1);

    eachBefore([root], node => {
      node.x = viewBox.x0 + (node.x + tx) * kx;
      node.y = viewBox.y0 + (getY ? getY(node) : node.depth * ky);
    });
  }

  return root;
}
