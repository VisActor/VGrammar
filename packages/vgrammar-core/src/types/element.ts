import type {
  IArc,
  IArc3d,
  IArea,
  ICircle,
  IGlyph,
  IGraphic,
  IGroup,
  IImage,
  ILine,
  IPath,
  IPolygon,
  IPyramid3d,
  IRect,
  IRect3d,
  IRichText,
  ISymbol,
  IText
} from '@visactor/vrender-core';
import type { DiffState } from '../graph/enums';
import type { IMark, IGlyphMark } from './grammar';
import type {
  BaseEncodeSpec,
  BaseSingleEncodeSpec,
  IMarkConfig,
  MarkFunctionType,
  MarkKeySpec,
  MarkType
} from './mark';

export interface ElementGraphicMap {
  circle: ICircle;
  arc: IArc;
  area: IArea;
  image: IImage;
  line: ILine;
  path: IPath;
  rule: ILine;
  shape: IPath;
  symbol: ISymbol;
  text: IText;
  richtext: IRichText;
  polygon: IPolygon;
  cell: ISymbol;
  interval: IGraphic;
  rect: IRect;
  rect3d: IRect3d;
  arc3d: IArc3d;
  pyramid3d: IPyramid3d;
  group: IGroup;
  glyph: IGlyph;
  linkPath: IGlyph;
  treePath: IGlyph;
  wave: IGlyph;
  ripplePoint: IGlyph;
  barBoxplot: IGlyph;
  boxPlot: IGlyph;
  component: IGroup;
  axis: IGroup;
  legend: IGroup;
  corsshair: IGroup;
  slider: IGroup;
  datazoom: IGroup;
  label: IGroup;
  player: IGroup;
}

export type GetGraphicByType<T> = T extends keyof ElementGraphicMap ? ElementGraphicMap[T] : IGraphic;

/**
 * 保存graphicItem状态
 */
export interface MarkElementItem {
  /** 唯一key */
  key: string;
  /** 原始数据 */
  datum: any;
  /** VGrammar view */
  view: any;
  /** 当前渲染帧下graphicItem对应的最新属性 */
  nextAttrs?: any;
  /** 是否初始化过，用于解决collection mark对应的item，可能跳过enter状态的问题 */
  // hasEntered: boolean;
}
export interface IElement {
  mark: IMark;
  isReserved: boolean;
  diffState: DiffState;
  key: string;
  groupKey?: string;
  data?: any[];
  /**
   * 不推荐使用，但是collection图元暂时可能回涉及到相关修改
   */
  items: MarkElementItem[];

  initGraphicItem: (attrs?: any) => void;
  updateGraphicItem: () => void;

  getDatum: () => any;
  getBounds: () => any;
  getGraphicItem: () => IGraphic;
  removeGraphicItem: () => void;
  resetGraphicItem: () => void;

  /**
   * 获取 graphic 视觉通道属性
   * @param channel 视觉通道
   * @param prev 是否从之前的 graphic 属性上获取，默认为 false
   * @returns 视觉通道值
   */
  getGraphicAttribute: (channel: string, prev?: boolean) => any;
  /**
   * 设置 graphic 视觉通道属性
   * @param channel 视觉通道
   * @param value 视觉通道属性
   * @param final 是否更新 graphic 最终变更的视觉通道结果，默认为 false
   */
  setGraphicAttribute: (channel: string, value: any, final?: boolean) => void;
  /**
   * 设置一系列 graphic 视觉通道属性
   * @param attributes 视觉通道键值对
   * @param final 是否更新 graphic 最终变更的视觉通道结果，默认为 false
   */
  setGraphicAttributes: (attributes: { [channel: string]: any }, final?: boolean) => void;

  /**
   * 【慎重使用】获取 VGrammar 自身的视觉通道属性
   * 只有在 'afterEncodeItems' 时机的mark transform中才能调用
   */
  getItemAttribute: (channel?: string) => any;
  /**
   * 【慎重使用】设置 VGrammar 自身的视觉通道
   * 只有在 'afterEncodeItems' 时机的mark transform中才能调用
   * @param attributes
   * @returns
   */
  setItemAttributes: (attributes: { [channel: string]: any } | any[]) => void;

  // element 执行流程相关接口
  updateData: (groupKey: string, data: any[], keyGenerator: MarkKeySpec, view: any) => void;
  state: (markState: MarkFunctionType<string | string[]>, parameters?: any) => void;
  encodeItems: (items: MarkElementItem[], encoders: BaseEncodeSpec, isReentered?: boolean, parameters?: any) => void;
  encodeGraphic: (attributes?: any) => void;
  transformElementItems: (items: MarkElementItem[], markType: MarkType, computePoints?: boolean) => Record<string, any>;
  remove: () => void;
  release: () => void;

  // 动画相关接口

  getFinalGraphicAttributes: () => { [key: string]: any };
  getPrevGraphicAttributes: () => { [key: string]: any };
  getNextGraphicAttributes: () => { [key: string]: any };
  clearChangedGraphicAttributes: () => void;
  clearGraphicAttributes: () => void;

  // state相关接口
  getStates: () => string[];
  hasState: (state: string) => boolean;
  clearStates: (noAnimation?: boolean) => void;
  addState: (state: string | string[], attrs?: any) => boolean;
  removeState: (state: string | string[]) => boolean;
  useStates: (states: string[], noAnimation?: boolean) => boolean;
  updateStates: (states: Record<string, boolean | BaseSingleEncodeSpec>) => any;
}

export interface IGlyphElement<P = any> extends IElement {
  mark: IGlyphMark;

  getGlyphGraphicItems: () => { [markName: string]: any };

  getGraphicAttribute: (channel: string, prev?: boolean, markName?: any) => any;
  setGraphicAttribute: (channel: string, value: any, final?: boolean, markName?: any) => void;
  setGraphicAttributes: (attributes: { [channel: string]: any }, final?: boolean, markName?: any) => void;

  getFinalGraphicAttributes: (markName?: string) => { [key: string]: any };
  getPrevGraphicAttributes: (markName?: string) => { [key: string]: any };
  getNextGraphicAttributes: (markName?: string) => { [key: string]: any };

  encodeCustom: (nextAttrs?: any) => { [markName: string]: any };
}
