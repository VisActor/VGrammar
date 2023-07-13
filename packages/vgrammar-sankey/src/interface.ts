export interface SankeyOptions {
  /**
   * The layout direction of chart
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * The align type of all the nodes
   */
  nodeAlign?: 'left' | 'right' | 'center' | 'justify' | 'start' | 'end';
  /**
   * The gap size between two nodes in the same layer
   */
  nodeGap?: number;
  /**
   * The width of each node, three kinds of value are supported
   * 1. percent string, eg: { nodeWidth: '12%' }
   * 2. simple number by the unit of 'px', eg: { nodeWidth: 20 }
   * 3. function, specify the nodeWidth by cutomized calculation
   */
  nodeWidth?: string | number | ((node: SankeyNodeElement) => number);
  /**
   * The width of link, the unit is px
   */
  linkWidth?: number | ((link: SankeyLinkElement) => number);
  /**
   * The minimal width of link + node
   */
  minStepWidth?: number;
  /**
   * The minimal size of node when data is not zero or null
   * This configuration can be used to avoid too thin node to be seen when data is too small
   * It's recommended to be smaller than 5px
   */
  minNodeHeight?: number;
  /**
   * The minimal size of link when data is not zero or null
   * This configuration can be used to avoid too thin link to be seen when data is too small
   * It's recommended to be smaller than 5px
   * This option should be smaller than `minNodeHeight` when both options are specified
   */
  minLinkHeight?: number;
  /** the iteration count of layout */
  iterations?: number;
  /** parse the key of node, the defaultValue */
  nodeKey?: string | number | ((datum: SankeyNodeDatum) => string | number);
  /** sort link by this function */
  linkSortBy?: (a: SankeyLinkElement, b: SankeyLinkElement) => number;
  /** sort node by this function */
  nodeSortBy?: (a: SankeyNodeElement, b: SankeyNodeElement) => number;
  /** specify the layer of node by customizedly */
  setNodeLayer?: (datum: SankeyNodeDatum) => number;
}

export interface SankeyLinkDatum {
  source: string | number;
  target: string | number;
  value?: number;
}

export interface SankeyNodeDatum {
  value?: number;
}

export interface HierarchyNodeDatum {
  value?: number;
  children?: HierarchyNodeDatum[];
}

export type SankeyData =
  | {
      nodes?: SankeyNodeDatum[];
      links: SankeyLinkDatum[];
    }
  | {
      nodes: HierarchyNodeDatum[];
    };

/**
 * The node element after sankey layout
 */
export interface SankeyNodeElement {
  key: string | number;
  index: number;
  /** the depth of node, from source to target */
  depth: number;

  /** the depth of node, from target to source */
  endDepth?: number;
  /** the final layer index after layout */
  layer?: number;
  isLastLayer?: boolean;
  value: number;
  datum: SankeyNodeDatum;
  sourceLinks: SankeyLinkElement[];
  targetLinks: SankeyLinkElement[];
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
}
/**
 * the link element after sankey layout
 */
export interface SankeyLinkElement {
  key?: string;
  vertical?: boolean;
  index: number;
  source: string | number;
  target: string | number;
  value: number;
  datum: SankeyLinkDatum | SankeyLinkDatum[];
  thickness?: number;
  sourceRect?: { x0: number; x1: number; y0: number; y1: number };
  targetRect?: { x0: number; x1: number; y0: number; y1: number };
  /** this will only be generate in hierarchy node data*/
  parents?: (string | number)[];
  y0?: number;
  y1?: number;
  x0?: number;
  x1?: number;
}

export type SankeyLayoutResult = {
  nodes: SankeyNodeElement[];
  links: SankeyLinkElement[];
  columns: SankeyNodeElement[][];
}[];
