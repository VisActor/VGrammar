import type {
  SunburstOptions,
  HierarchicalDatum,
  SunburstNodeElement,
  HierarchicalData,
  SunburstLabelConfig
} from '../interface';
import { isNil, isArray, isFunction, range, isBoolean, polarToCartesian } from '@visactor/vutils';
import dice from '../treemap/dice';
import { field, toPercent } from '@visactor/vgrammar-util';
import { calculateNodeValue } from '../utils';
const keyMap = {
  x0: 'startAngle',
  x1: 'endAngle',
  y0: 'innerRadius',
  y1: 'outerRadius'
};

export class SunburstLayout {
  private options: SunburstOptions;

  private _getNodeKey?: (datum: HierarchicalDatum) => string;

  private _maxDepth: number;

  private _parsedCenter: [number, number];

  private _parsedInnerRadius: number | number[];

  private _parsedOutterRadius: number | number[];

  private _maxRadius: number;

  static defaultOpionts: Partial<SunburstOptions> = {
    startAngle: Math.PI / 2,
    endAngle: (-3 * Math.PI) / 2,
    center: ['50%', '50%'],
    gapRadius: 0,
    innerRadius: 0,
    outerRadius: '70%'
  };

  constructor(options?: SunburstOptions) {
    this.options = options
      ? Object.assign({}, SunburstLayout.defaultOpionts, options)
      : Object.assign({}, SunburstLayout.defaultOpionts);

    const keyOption = this.options.nodeKey;
    const keyFunc = isFunction(keyOption) ? keyOption : keyOption ? field(keyOption as string) : null;

    this._getNodeKey = keyFunc;
    this._maxDepth = -1;
  }

  private _parseRadius(
    viewBox: { x0: number; x1: number; y0: number; y1: number; width: number; height: number },
    maxDepth: number
  ) {
    const cx = viewBox.x0 + toPercent(this.options.center[0], viewBox.width);
    const cy = viewBox.y0 + toPercent(this.options.center[1], viewBox.height);
    const maxRadius = Math.min(viewBox.width / 2, viewBox.height / 2);
    const innerRadius = this.options.innerRadius;
    const outerRadius = this.options.outerRadius;
    const isInnerArray = isArray(innerRadius);
    const parsedInnerRadius = isInnerArray
      ? innerRadius.map(entry => toPercent(entry, maxRadius))
      : toPercent(innerRadius, maxRadius);
    const isOuterArray = isArray(outerRadius);
    const gapRadius = this.options.gapRadius;
    const parsedOuterRadius = isOuterArray
      ? outerRadius.map(entry => toPercent(entry, maxRadius))
      : toPercent(outerRadius, maxRadius);
    const rangeArr = range(0, maxDepth + 1);

    if (isInnerArray) {
      this._parsedInnerRadius = rangeArr.map((entry, index) => {
        const ir = parsedInnerRadius[index];
        return isNil(ir) ? maxRadius : ir;
      });

      this._parsedOutterRadius = rangeArr.map((entry, index) => {
        return isOuterArray
          ? parsedOuterRadius[index] ?? maxRadius
          : index < maxDepth
          ? this._parsedInnerRadius[index + 1] - (isArray(gapRadius) ? gapRadius[index] ?? 0 : gapRadius)
          : (parsedOuterRadius as number);
      });
    } else if (isOuterArray) {
      this._parsedOutterRadius = rangeArr.map((entry, index) => {
        return isNil(parsedOuterRadius[index]) ? maxRadius : parsedOuterRadius[index];
      });

      this._parsedInnerRadius = rangeArr.map((entry, index) => {
        return index === 0
          ? (parsedInnerRadius as number)
          : this._parsedOutterRadius[index - 1] - (isArray(gapRadius) ? gapRadius[index] ?? 0 : gapRadius);
      });
    } else {
      const ir = toPercent(innerRadius, maxRadius);
      const or = parsedOuterRadius as number;
      const step = (or - ir) / (maxDepth + 1);

      this._parsedInnerRadius = rangeArr.map((entry, index) => {
        return ir + index * step;
      });
      this._parsedOutterRadius = rangeArr.map((entry, index) => {
        return this._parsedInnerRadius[index] + step - (isArray(gapRadius) ? gapRadius[index] ?? 0 : gapRadius);
      });
    }

    this._parsedCenter = [cx, cy];
    this._maxRadius = maxRadius;
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

    const nodes: SunburstNodeElement[] = [];
    const res = calculateNodeValue<HierarchicalDatum, SunburstNodeElement>(data, nodes, 0, -1, null, this._getNodeKey);

    this._parseRadius(viewBox, res.maxDepth);
    this._maxDepth = res.maxDepth;

    this._layout(nodes, {
      flattenIndex: -1,
      maxDepth: -1,
      key: '-1',
      depth: -1,
      index: -1,
      value: res.sum,
      datum: null,
      children: nodes,
      startAngle: this.options.startAngle,
      endAngle: this.options.endAngle
    });

    return nodes;
  }

  private _layout(nodes: SunburstNodeElement[], parent: SunburstNodeElement) {
    this._layoutNode(parent);

    nodes.forEach(node => {
      if (node?.children?.length) {
        this._layout(node.children, node);
      } else {
        this._layoutNode(node);
      }
    });
  }

  private _layoutLabel(child: SunburstNodeElement, labelOption: SunburstLabelConfig) {
    const angle = (child.startAngle + child.endAngle) / 2;
    const r =
      (labelOption.align === 'start'
        ? (child.innerRadius as number)
        : labelOption.align === 'end'
        ? child.outerRadius
        : (child.innerRadius + child.outerRadius) / 2) + (labelOption.offset ?? 0);
    const pos = polarToCartesian({ x: this._parsedCenter[0], y: this._parsedCenter[1] }, r, angle);

    child.label = {
      x: pos.x,
      y: pos.y,
      textBaseline: 'middle'
    };

    if (labelOption.rotate === 'tangential') {
      child.label.angle = angle - Math.PI / 2;
      child.label.textAlign = 'center';
      child.label.maxLineWidth = Math.abs(child.endAngle - child.startAngle) * r;
    } else {
      const uniformAngle = angle % (Math.PI * 2);
      const formatAngle = uniformAngle < 0 ? uniformAngle + Math.PI * 2 : uniformAngle;

      if (formatAngle > Math.PI / 2 && formatAngle < Math.PI * 1.5) {
        child.label.angle = formatAngle + Math.PI;
        child.label.textAlign =
          labelOption.align === 'start' ? 'end' : labelOption.align === 'end' ? 'start' : 'center';
      } else {
        child.label.angle = formatAngle;
        child.label.textAlign = labelOption.align;
      }

      child.label.maxLineWidth = child.isLeaf ? undefined : Math.abs(child.outerRadius - child.innerRadius);
    }
  }

  private _layoutNode = (parent: SunburstNodeElement) => {
    parent.maxDepth = this._maxDepth;

    if (parent.children) {
      const ir = this._parsedInnerRadius[parent.depth + 1];
      const or = this._parsedOutterRadius[parent.depth + 1];

      dice(parent, parent.startAngle, Math.min(ir, or), parent.endAngle, Math.max(ir, or), keyMap);

      const labelOption = isArray(this.options.label) ? this.options.label[parent.depth + 1] : this.options.label;

      parent.children.forEach(child => {
        child.x = this._parsedCenter[0];
        child.y = this._parsedCenter[1];

        if (labelOption) {
          return this._layoutLabel(child, isBoolean(labelOption) ? { align: 'center', rotate: 'radial' } : labelOption);
        }
      });
    }
  };
}
