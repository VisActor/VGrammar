import { eachBefore, calculateNodeValue } from '../utils';
import type { TreeOptions, HierarchicalDatum, TreeNodeElement, HierarchicalData } from '../interface';
import { isFunction, array, polarToCartesian } from '@visactor/vutils';
import { field } from '@visactor/vgrammar-util';
import { clusterTree } from './cluster';
import { tidyTree } from './tree';

export class TreeLayout {
  private options: TreeOptions;

  private _getNodeKey?: (datum: HierarchicalDatum) => string;

  private _maxDepth: number;

  static defaultOpionts: Partial<TreeOptions> = {
    direction: 'horizontal',
    alignType: 'depth',
    layoutType: 'orthogonal'
  };

  constructor(options?: TreeOptions) {
    this.options = Object.assign({}, TreeLayout.defaultOpionts, options);

    const keyOption = options?.nodeKey;
    const keyFunc = isFunction(keyOption) ? keyOption : keyOption ? field(keyOption as string) : null;

    this._getNodeKey = keyFunc;
    this._maxDepth = -1;
  }

  layout(
    data: HierarchicalDatum | HierarchicalData,
    config: { x0: number; x1: number; y0: number; y1: number } | { width: number; height: number }
  ) {
    const formattedData = array(data) as HierarchicalData;
    if (!formattedData.length) {
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
    const nodes: TreeNodeElement[] = [];
    const res = calculateNodeValue<HierarchicalDatum, TreeNodeElement>(
      formattedData,
      nodes,
      0,
      -1,
      null,
      this._getNodeKey
    );
    this._maxDepth = res.maxDepth;

    const isVertical = ['vertical', 'TB', 'BT'].includes(this.options.direction);
    const vb =
      this.options.layoutType === 'radial'
        ? {
            x0: 0,
            y0: 0,
            x1: Math.PI * 2,
            y1: Math.min(viewBox.width, viewBox.height) / 2,
            width: Math.PI * 2,
            height: Math.min(viewBox.width, viewBox.height) / 2
          }
        : isVertical
        ? viewBox
        : {
            x0: viewBox.y0,
            y0: viewBox.x0,
            x1: viewBox.y1,
            y1: viewBox.x1,
            width: viewBox.height,
            height: viewBox.width
          };

    if (this.options.alignType === 'leaf') {
      clusterTree(nodes[0], vb, this.options.minNodeGap, this.options.linkWidth);
    } else {
      tidyTree(nodes[0], vb, this.options.minNodeGap, this.options.linkWidth);
    }

    if (this.options.layoutType === 'radial') {
      const center = {
        x: (viewBox.x0 + viewBox.x1) / 2,
        y: (viewBox.y0 + viewBox.y1) / 2
      };

      eachBefore(nodes, node => {
        const angle = node.x;
        const radius = node.y;
        const res = polarToCartesian(center, radius, angle);

        node.x = res.x;
        node.y = res.y;
        node.maxDepth = this._maxDepth;
      });
    } else {
      if (['BT', 'RL'].includes(this.options.direction)) {
        eachBefore(nodes, node => {
          node.y = vb.y0 + vb.y1 - node.y;
          node.maxDepth = this._maxDepth;
        });
      } else {
        eachBefore(nodes, node => {
          node.maxDepth = this._maxDepth;
        });
      }

      if (!isVertical) {
        eachBefore(nodes, node => {
          [node.x, node.y] = [node.y, node.x];
        });
      }
    }

    return nodes;
  }
}
