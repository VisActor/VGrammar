import { eachBefore, eachAfter, calculateNodeValue } from '../utils';
import type { CirclePackingOptions, HierarchicalDatum, CirclePackingNodeElement, HierarchicalData } from '../interface';
import { isFunction, isNumber, isArray } from '@visactor/vutils';
import { field, zero } from '@visactor/vgrammar-util';
import { randomLCG } from '../lcg';
import { packSiblingsRandom } from './siblings';

function radiusLeaf(radius: (node: CirclePackingNodeElement) => number) {
  return function (node: CirclePackingNodeElement) {
    if (!node.children) {
      node.radius = Math.max(0, +radius(node) || 0);
    }
  };
}

function packChildrenRandom(padding: (node: CirclePackingNodeElement) => number, k: number, random: () => number) {
  return function (node: CirclePackingNodeElement) {
    const children = node?.children;
    if (children) {
      let i;
      const n = children.length;
      const r = padding(node) * k || 0;

      if (r) {
        for (i = 0; i < n; ++i) {
          children[i].radius += r;
        }
      }
      const e = packSiblingsRandom(children, random);
      if (r) {
        for (i = 0; i < n; ++i) {
          children[i].radius -= r;
        }
      }
      node.radius = e + r;
    }
  };
}

function translateChild(k: number, maxDepth: number) {
  return function (node: CirclePackingNodeElement, index: number, parent: CirclePackingNodeElement) {
    node.radius *= k;
    node.maxDepth = maxDepth;
    if (parent) {
      node.x = parent.x + k * node.x;
      node.y = parent.y + k * node.y;
    }
  };
}

export class CirclePackingLayout {
  private options: CirclePackingOptions;

  private _getNodeKey?: (datum: HierarchicalDatum) => string;

  private _getPadding?: (node: CirclePackingNodeElement) => number;

  private _maxDepth: number;

  static defaultOpionts: Partial<CirclePackingOptions> = {
    setRadius: (node: CirclePackingNodeElement) => {
      return Math.sqrt(node.value);
    },
    padding: 0,
    nodeSort: (a, b) => b.value - a.value
  };

  constructor(options?: CirclePackingOptions) {
    this.options = options;

    const keyOption = options?.nodeKey;
    const keyFunc = isFunction(keyOption) ? keyOption : keyOption ? field(keyOption as string) : null;

    this._getNodeKey = keyFunc;
    this._getPadding = isNumber(options?.padding)
      ? (node: CirclePackingNodeElement) => options.padding as number
      : isArray(options?.padding)
      ? (node: CirclePackingNodeElement) => options.padding[node.depth + 1] ?? 0
      : () => 0;
    this._maxDepth = -1;
  }

  layout(
    data: HierarchicalData,
    config: { x0: number; x1: number; y0: number; y1: number } | { width: number; height: number }
  ) {
    const viewBox =
      'width' in config
        ? { x0: 0, x1: config.width, y0: 0, y1: config.height, width: config.width, height: config.height }
        : {
            x0: Math.min(config.x0, config.x1),
            x1: Math.max(config.x0, config.x1),
            y0: Math.min(config.y0, config.y1),
            y1: Math.max(config.y0, config.y1),
            width: Math.abs(config.x1 - config.x0),
            height: Math.abs(config.y1 - config.y0)
          };

    if (!data || !data.length) {
      return [];
    }

    const nodes: CirclePackingNodeElement[] = [];
    const res = calculateNodeValue<HierarchicalDatum, CirclePackingNodeElement>(
      data,
      nodes,
      0,
      -1,
      null,
      this._getNodeKey
    );
    this._maxDepth = res.maxDepth;

    const random = randomLCG();
    const root: CirclePackingNodeElement = {
      flattenIndex: -1,
      maxDepth: -1,
      key: 'root',
      depth: -1,
      index: -1,
      value: res.sum,
      datum: null,
      children: nodes,
      x: viewBox.x0 + viewBox.width / 2,
      y: viewBox.y0 + viewBox.height / 2
    };
    const { nodeSort, setRadius, padding, includeRoot } = this.options ?? {};
    if (nodeSort !== false) {
      const sort = (isFunction(nodeSort) ? this.options.nodeKey : CirclePackingLayout.defaultOpionts.nodeSort) as (
        a: CirclePackingNodeElement,
        b: CirclePackingNodeElement
      ) => number;
      // 默认排序，布局效果更好
      eachBefore([root], (node: CirclePackingNodeElement) => {
        if (node.children && node.children.length) {
          node.children.sort(sort);
        }
      });
    }
    if (setRadius) {
      eachBefore([root], radiusLeaf(setRadius));
      eachAfter([root], packChildrenRandom(this._getPadding, 0.5, random));
      eachBefore([root], translateChild(1, this._maxDepth));
    } else {
      const size = Math.min(viewBox.width, viewBox.height);

      eachBefore([root], radiusLeaf(CirclePackingLayout.defaultOpionts.setRadius));
      // layout by value
      eachAfter([root], packChildrenRandom(zero, 1, random));
      if (padding) {
        eachAfter([root], packChildrenRandom(this._getPadding, root.radius / size, random));
      }
      eachBefore([root], translateChild(size / (2 * root.radius), this._maxDepth));
    }

    return includeRoot ? [root] : nodes;
  }
}
