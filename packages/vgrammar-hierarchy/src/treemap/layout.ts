import type { TreemapOptions, TreemapDatum, TreemapNodeElement, TreemapData } from '../interface';
// eslint-disable-next-line
import { isArray, isFunction, isNumber } from '@visactor/vutils';
import binary from './binary';
import dice from './dice';
import slice from './slice';
import sliceDice from './sliceDice';
import { generateSquarify } from './squarify';
import { field } from '@visactor/vgrammar-util';
import { calculateNodeValue } from '../utils';

const algorithms = { binary, dice, slice, sliceDice };

export class TreemapLayout {
  private options: TreemapOptions;

  private _splitNode: (parent: TreemapNodeElement, x0: number, y0: number, x1: number, y1: number) => void;

  private _getNodeKey?: (datum: TreemapDatum) => string;

  private _maxDepth: number;

  static defaultOpionts: Partial<TreemapOptions> = {
    aspectRatio: (1 + Math.sqrt(5)) / 2,
    gapWidth: 0,
    labelPadding: 0,
    labelPosition: 'top',
    splitType: 'binary',
    minVisibleArea: 10
  };
  constructor(options?: TreemapOptions) {
    this.options = Object.assign({}, TreemapLayout.defaultOpionts, options);

    const keyOption = this.options.nodeKey;
    const keyFunc = isFunction(keyOption) ? keyOption : keyOption ? field(keyOption as string) : null;

    this._getNodeKey = keyFunc;
    this._splitNode =
      this.options.splitType === 'squarify'
        ? generateSquarify(this.options.aspectRatio)
        : algorithms[this.options.splitType] ?? algorithms.binary;
    this._maxDepth = -1;
  }

  private _filterByArea = (node: TreemapNodeElement, ratio: number) => {
    const minArea = this._getMinAreaByDepth(node.depth);

    if (minArea > 0 && node.value * ratio < minArea) {
      return false;
    } else if (node.children?.length) {
      const newChildren = node.children.filter(child => {
        return this._filterByArea(child, ratio);
      });

      if (!newChildren.length) {
        node.isLeaf = true;
        node.children = null;
      } else if (newChildren.length !== node.children.length) {
        node.children = newChildren;
      }
    }

    return true;
  };

  layout(
    data: TreemapData,
    config: { x0: number; x1: number; y0: number; y1: number } | { width: number; height: number }
  ) {
    if (!data || !data.length) {
      return [];
    }
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

    const nodes: TreemapNodeElement[] = [];
    const res = calculateNodeValue<TreemapDatum, TreemapNodeElement>(
      data,
      nodes,
      0,
      -1,
      null,
      this._getNodeKey,
      this.options.valueField
    );
    this._maxDepth = res.maxDepth;

    if (res.sum <= 0) {
      return [];
    }

    const root: TreemapNodeElement = {
      flattenIndex: -1,
      maxDepth: -1,
      key: '-1',
      depth: -1,
      index: -1,
      value: res.sum,
      datum: null,
      x0: viewBox.x0,
      x1: viewBox.x1,
      y0: viewBox.y0,
      y1: viewBox.y1,
      children: nodes
    };
    const areaRatio = (viewBox.width * viewBox.height) / res.sum;
    this._filterByArea(root, areaRatio);

    this._layout(root);

    return root.children ?? [];
  }

  private _getMinAreaByDepth = (depth: number) => {
    if (depth < 0) {
      return 0;
    }

    return (
      (isArray(this.options.minVisibleArea) ? this.options.minVisibleArea[depth] : this.options.minVisibleArea) ?? 0
    );
  };

  private _getGapWidthByDepth = (depth: number) => {
    if (depth < 0) {
      return 0;
    }

    return (isArray(this.options.gapWidth) ? this.options.gapWidth[depth] : this.options.gapWidth) ?? 0;
  };

  private _getPaddingByDepth = (depth: number) => {
    if (depth < 0) {
      return 0;
    }

    return (isArray(this.options.padding) ? this.options.padding[depth] : this.options.padding) ?? 0;
  };

  private _getLabelPaddingByDepth = (depth: number) => {
    if (depth < 0) {
      return 0;
    }

    return (isArray(this.options.labelPadding) ? this.options.labelPadding[depth] : this.options.labelPadding) ?? 0;
  };

  private _filterChildren(node: TreemapNodeElement) {
    const maxDepth = this.options.maxDepth;
    if (isNumber(maxDepth) && maxDepth >= 0 && node.depth >= maxDepth) {
      return false;
    }

    const minChildrenVisibleArea = this.options.minChildrenVisibleArea;
    if (
      isNumber(minChildrenVisibleArea) &&
      Math.abs((node.x1 - node.x0) * (node.y1 - node.y0)) < minChildrenVisibleArea
    ) {
      return false;
    }

    const minChildrenVisibleSize = this.options.minChildrenVisibleSize;
    if (
      isNumber(minChildrenVisibleSize) &&
      (Math.abs(node.x1 - node.x0) < minChildrenVisibleSize || Math.abs(node.y1 - node.y0) < minChildrenVisibleSize)
    ) {
      return false;
    }

    return true;
  }

  private _layout(parent: TreemapNodeElement) {
    if (!this._filterChildren(parent)) {
      parent.children = null;
      parent.isLeaf = true;
    }

    this._layoutNode(parent);

    if (parent.children?.length) {
      parent.children.forEach(child => {
        if (child?.children?.length) {
          this._layout(child);
        } else {
          this._layoutNode(child);
        }
      });
    }
  }

  private _layoutNode = (parent: TreemapNodeElement) => {
    const gapWidth = this._getGapWidthByDepth(parent.depth);
    let x0 = parent.x0;
    let y0 = parent.y0;
    let x1 = parent.x1;
    let y1 = parent.y1;

    parent.maxDepth = this._maxDepth;

    if (gapWidth > 0) {
      x0 += gapWidth / 2;
      x1 -= gapWidth / 2;
      y0 += gapWidth / 2;
      y1 -= gapWidth / 2;

      if (x0 > x1) {
        x0 = (x0 + x1) / 2;
        x1 = x0;
      }

      if (y0 > y1) {
        y0 = (y0 + y1) / 2;
        y1 = y0;
      }

      parent.x0 = x0;
      parent.x1 = x1;
      parent.y0 = y0;
      parent.y1 = y1;
    }

    if (parent.children) {
      const labelPadding = this._getLabelPaddingByDepth(parent.depth);
      const padding = this._getPaddingByDepth(parent.depth);

      if (padding > 0) {
        if (padding < Math.min(x1 - x0, y1 - y0) / 2) {
          // has enough space for padding
          y0 += padding;
          y1 -= padding;
          x0 += padding;
          x1 -= padding;
        }
      }

      if (labelPadding > 0) {
        if (this.options.labelPosition === 'top' && y0 + labelPadding < y1) {
          parent.labelRect = { x0: x0, y0: y0, x1, y1: y0 + labelPadding };
          y0 += labelPadding;
        } else if (this.options.labelPosition === 'bottom' && y1 - labelPadding > y0) {
          parent.labelRect = { x0: x0, y0: y1 - labelPadding, x1, y1: y1 };
          y1 -= labelPadding;
        } else if (this.options.labelPosition === 'left' && x0 + labelPadding < x1) {
          parent.labelRect = { x0: x0, y0: y0, x1: x0 + labelPadding, y1 };
          x0 += labelPadding;
        } else if (this.options.labelPosition === 'right' && x1 - labelPadding > x0) {
          parent.labelRect = { x0: x1 - labelPadding, y0: y0, x1: x1, y1 };
          x1 -= labelPadding;
        }
      }

      const childGapWidth = this._getGapWidthByDepth(parent.depth + 1);

      if (childGapWidth > 0) {
        x0 -= childGapWidth / 2;
        x1 += childGapWidth / 2;
        y0 -= childGapWidth / 2;
        y1 += childGapWidth / 2;
      }

      this._splitNode(parent, x0, y0, x1, y1);
    }
  };
}
