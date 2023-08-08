import type { ITextGraphicAttribute } from '@visactor/vrender';

export type ViewBoxOptions = { width: number; height: number } | { x0: number; x1: number; y0: number; y1: number };

export interface TreemapOptions {
  /**
   * The gap width between two nodes which has the same depth, two kinds of value are supported
   * 1. number: set the gapWidth for nodes of every depth
   * 2. number[]: number[i] means the gapWidth for node which depth = i;
   */
  gapWidth?: number | number[];
  /**
   * The padding width, two kinds of value are supported
   * 1. number: set the padding for nodes of every depth
   * 2. number[]: number[i] means the padding for node which depth = i;
   */
  padding?: number | number[];
  /**
   * the width / height ratio
   */
  aspectRatio?: number;
  /**
   * The padding for non-leaf node, we can use this space to display a label
   * This pading will only works when the node has enough space
   */
  labelPadding?: number | number[];
  /**
   * The position of label for non-leaf node
   */
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * the type of algorithm
   */
  splitType?: 'binary' | 'dice' | 'slice' | 'sliceDice' | 'squarify';
  /** parse the key of node */
  nodeKey?: string | number | ((datum: TreemapDatum) => string | number);
  /**
   *  the max depth to be showed, when the node has depth > maxDepth, the node won't be calculated
   */
  maxDepth?: number;
  /**
   * when the area (this unit is px * px) of the node is smaller then this value, this node will be hide
   */
  minVisibleArea?: number | number[];
  /**
   * when the area (this unit is px * px) of the node is smaller then this value, this children of this node will be hide
   */
  minChildrenVisibleArea?: number | number[];
  /**
   * when the width or height of the node is smaller then this value, this node will be hide
   */
  minChildrenVisibleSize?: number | number[];
}

export type TreemapTramsformOptions = TreemapOptions & ViewBoxOptions & { flatten?: boolean };

export interface HierarchicalDatum {
  value?: number;
  children?: HierarchicalDatum[];
}

export type HierarchicalData = HierarchicalDatum[];

export type TreemapData = HierarchicalDatum[];

export type TreemapDatum = HierarchicalDatum;

export interface HierarchicalNodeElement<Datum> {
  key: string;
  parentKey?: string;
  flattenIndex: number;
  index: number;
  /** the depth of node, from source to target */
  depth: number;
  maxDepth: number;
  /** whether or not this node is a leaf node */
  isLeaf?: boolean;
  value: number;
  datum: Datum[];

  children?: HierarchicalNodeElement<Datum>[];
}

/**
 * The node element after treemap layout
 */
export interface TreemapNodeElement extends Omit<HierarchicalNodeElement<TreemapDatum>, 'children'> {
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  width?: number;
  height?: number;
  labelRect?: { x0?: number; x1?: number; y0?: number; y1?: number };

  children?: TreemapNodeElement[];
}

type PositionType = string | number;

export interface SunburstLabelConfig {
  align?: 'start' | 'end' | 'center';
  rotate?: 'tangential' | 'radial';
  offset?: number;
}
export type SunburstLabelOptions = boolean | SunburstLabelConfig;

/**
 * The options of sunburst
 */
export interface SunburstOptions {
  startAngle?: number;
  endAngle?: number;
  center?: [PositionType, PositionType];
  innerRadius?: PositionType | PositionType[];
  outerRadius?: PositionType | PositionType[];
  gapRadius?: number | number[];
  /** parse the key of node */
  nodeKey?: string | number | ((datum: HierarchicalDatum) => string | number);
  label?: SunburstLabelOptions | SunburstLabelOptions[];
}

export type SunburstTramsformOptions = SunburstOptions & ViewBoxOptions & { flatten?: boolean; maxDepth?: number };

/**
 * The node element after sunburst layout
 */
export interface SunburstNodeElement extends HierarchicalNodeElement<HierarchicalDatum> {
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  x?: number;
  y?: number;

  children?: SunburstNodeElement[];
  label?: Pick<ITextGraphicAttribute, 'x' | 'y' | 'textAlign' | 'textBaseline' | 'angle' | 'maxLineWidth'>;
}

export interface ICircle {
  x?: number;
  y?: number;
  radius?: number;
}

export interface CirclePackingOptions {
  nodeSort?: boolean | ((a: CirclePackingNodeElement, b: CirclePackingNodeElement) => number);
  padding?: number | number[];
  /**
   * set the radius of node, if not specified, we'll set `Math.sqrt(node.value);`.
   */
  setRadius?: (datum: CirclePackingNodeElement) => number;
  /** parse the key of node */
  nodeKey?: string | number | ((datum: HierarchicalDatum) => string | number);
  includeRoot?: boolean;
}

export type CirclePackingTramsformOptions = CirclePackingOptions &
  ViewBoxOptions & { flatten?: boolean; maxDepth?: number };

/**
 * The node element after sunburst layout
 */
export interface CirclePackingNodeElement extends HierarchicalNodeElement<HierarchicalDatum>, ICircle {
  children?: CirclePackingNodeElement[];
  label?: Pick<ITextGraphicAttribute, 'x' | 'y' | 'textAlign' | 'textBaseline' | 'angle' | 'maxLineWidth'>;
}

export interface TreeOptions {
  /**
   * The layout direction of chart
   */
  direction?: 'horizontal' | 'vertical' | 'LR' | 'RL' | 'TB' | 'BT';
  /**
   * layout tree in orthogonal | radial coordinate system
   */
  layoutType?: 'orthogonal' | 'radial';
  alignType?: 'leaf' | 'depth';
  /**
   * Specify the width of link, if not specified,
   * Compute the depth-most nodes for extents.
   */
  linkWidth?: number | number[];
  /**
   * Specify the min gap between two sibling nodes, if not specified, scale nodeGap based on the extent.
   */
  minNodeGap?: number;
  /** parse the key of node */
  nodeKey?: string | number | ((datum: HierarchicalDatum) => string | number);
}

export type TreeTramsformOptions = TreeOptions & ViewBoxOptions & { flatten?: boolean; maxDepth?: number };

export interface TreeNodeElement extends HierarchicalNodeElement<HierarchicalDatum> {
  children?: TreeNodeElement[];
  x?: number;
  y?: number;
}

export interface TreeLinkElement {
  source: TreeNodeElement;
  target: TreeNodeElement;
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  key?: string;
}
