import type { IView } from './view';
import type { EventType, InteractionEvent, ViewEventType } from './event';
import type {
  BaseCrosshairAttrs,
  BrushAttributes,
  TooltipAttributes,
  TooltipRowAttrs
} from '@visactor/vrender-components';
import type { IPolygon, ISymbolGraphicAttribute, ITextGraphicAttribute } from '@visactor/vrender-core';
import type { IElement, IGlyphElement } from './element';
import type { IData, IGrammarBase, IMark, IScale } from './grammar';
import type { IPointLike } from '@visactor/vutils';
import type { IBaseScale } from '@visactor/vscale';
import type { IDatazoom, IScrollbar } from './component';
import type { FieldEncodeType, MarkFunctionType } from './mark';
import type { GraphicEventType } from '@visactor/vrender-core';

export interface FilterDataTarget {
  data: string | IData;
  filter: string | ((datum: any, filterValues: any[]) => boolean);
  transform?: (data: any[], filterValues: any[]) => any[];
}

export interface IBaseInteractionOptions {
  id?: string;

  dependency?: string | string[] | IGrammarBase | IGrammarBase[];

  shouldStart?: (e: any) => boolean;

  shouldUpdate?: (e: any) => boolean;

  shouldEnd?: (e: any) => boolean;

  shouldReset?: (e: any) => boolean;

  onStart?: (e: any) => boolean;

  onUpdate?: (e: any) => boolean;

  onEnd?: (e: any) => boolean;

  onReset?: (e: any) => boolean;
}

export interface IInteraction<T = any> {
  readonly options: T;
  readonly type: string;
  depend: (grammar: IGrammarBase[] | IGrammarBase | string[] | string) => void;
  bind: () => void;
  unbind: () => void;
  start: (element: IElement | IGlyphElement | string | any) => void;
  reset: (element?: IElement | IGlyphElement) => void;
  getStartState: () => string;
}

export interface IInteractionConstructor<T = any> {
  readonly type: string;

  new (view: IView, options?: T): IInteraction<T>;
}

/**
 * the interaction to set the active state of specified marks
 */
export interface ElementActiveOptions extends IBaseInteractionOptions {
  /**
   * the selector of marks
   */
  selector?: string | string[] | IMark | IMark[];
  /**
   * the trigger event name
   */
  trigger?: EventType | EventType[];
  /**
   * the reset trigger event name
   */
  triggerOff?: EventType | EventType[] | 'none';
  /**
   * the active state name
   */
  state?: string;
}

export type ElementSelectTriggerOff = EventType | ViewEventType | 'empty' | 'none' | number;

/**
 * the interaction to set the seleted state of specified marks
 */
export interface ElementSelectOptions extends IBaseInteractionOptions {
  /**
   * the selector of marks
   */
  selector?: string | string[] | IMark | IMark[];
  /**
   * the trigger event name
   */
  trigger?: EventType | EventType[];
  /**
   * the selected state name
   */
  state?: string;
  /**
   * the non-selected state name
   */
  reverseState?: string;
  /**
   * the reset trigger event name
   */
  triggerOff?: ElementSelectTriggerOff | ElementSelectTriggerOff[];
  /**
   * whether or not support multiple selected
   */
  isMultiple?: boolean;
}

/**
 * the interaction to set the highlight state of specified marks
 */
export interface ElementHighlightOptions extends IBaseInteractionOptions {
  /**
   * the selector of marks
   */
  selector?: string | string[] | IMark | IMark[];
  /**
   * the trigger event name
   */
  trigger?: EventType;
  /**
   * the reset trigger event name
   */
  triggerOff?: EventType | 'none';
  /**
   * the highlight state name
   */
  highlightState?: string;
  /**
   * the blur state name
   */
  blurState?: string;
}

export interface ElementFilterOptions {
  /**
   * the filter type of element
   */
  filterType?: 'key' | 'groupKey';
  /**
   * the field to be filtered
   */
  filterField?: string;
}

/**
 * the interaction to set the active state of specified marks trigger by legend
 */
export interface ElementActiveByLegendOptions extends IBaseInteractionOptions, ElementFilterOptions {
  /**
   * the selector of marks
   */
  selector?: string | string[] | IMark | IMark[];
  /**
   * the active state name
   */
  state?: string;
}

/**
 * the interaction to set the active state of specified marks trigger by legend
 */
export interface ElementHighlightByLegendOptions extends IBaseInteractionOptions, ElementFilterOptions {
  /**
   * the selector of marks
   */
  selector?: string | string[] | IMark | IMark[];
  /**
   * the highlight state name
   */
  highlightState?: string;
  /**
   * the blur state name
   */
  blurState?: string;
}

export interface ElementHighlightByNameOptions extends ElementHighlightByLegendOptions {
  graphicName?: string | string[];
  /**
   * the trigger event name
   */
  trigger?: EventType;
  /**
   * the reset trigger event name
   */
  triggerOff?: EventType | 'none';

  parseData?: (e: InteractionEvent) => any;
}

export type ElementHighlightByGraphicNameOptions = ElementHighlightOptions;

export interface BrushEventParams {
  operateType: string;
  operateMask: IPolygon;
  activeElements?: (IElement | IGlyphElement)[];
}

export interface BrushOptions extends IBaseInteractionOptions, BrushAttributes {
  /**
   * the selector of marks
   */
  selector?: string | string[] | IMark | IMark[];

  onStart?: (params: BrushEventParams) => boolean;

  onUpdate?: (params: BrushEventParams) => boolean;

  onEnd?: (params: BrushEventParams) => boolean;

  onReset?: (params: BrushEventParams) => boolean;
}

export interface BrushHighlightOptions extends BrushOptions {
  /**
   * the highlight state name
   */
  highlightState?: string;
  /**
   * the blur state name
   */
  blurState?: string;
}

export interface BrushActiveOptions extends BrushOptions {
  /**
   * the active state name
   */
  state?: string;
}

export interface BrushFilterOptions extends BrushOptions {
  target: {
    data: IData | string;
    transform?: (data: any[], filterValue: any) => any[];
  };
}

export interface DataFilterOptions extends IBaseInteractionOptions {
  /**
   * the selector of marks
   */
  source?: string | string[] | IMark | IMark[];

  /**
   * data target
   */
  target: {
    data: IData | string;
    filter?: string | ((datum: any, filterValue: any) => boolean);
    transform?: (data: any[], filterValue: any) => any[];
  };
}

export interface DrillDownOptions extends Omit<BrushOptions, 'trigger'> {
  /**
   * the trigger event name
   */
  trigger?: GraphicEventType;
  /**
   * enable brush
   */
  brush?: boolean;
  // trigger attribute is included in brush attributes
  target: {
    data: IData | string;
    transform?: (data: any[], filterValue: any) => any[];
  };
}

export interface RollUpOptions extends DataFilterOptions {
  /**
   * the trigger event name
   */
  trigger?: EventType;
  /**
   * the reset trigger event name
   */
  triggerOff?: EventType | ViewEventType | 'empty';
}

export type CustomTooltipCallback = (
  datum: any,
  element: IElement,
  parameters: any
) => TooltipRowAttrs | TooltipRowAttrs[];

export interface ITooltipRow {
  visible?: boolean;
  key?: MarkFunctionType<string | Partial<ITextGraphicAttribute>> | FieldEncodeType;
  value?: MarkFunctionType<string | Partial<ITextGraphicAttribute>> | FieldEncodeType;
  symbol?: MarkFunctionType<string | Partial<ISymbolGraphicAttribute>> | FieldEncodeType;
}

export type TooltipType = 'x' | 'y' | 'angle' | 'radius';

export interface TooltipOptions extends IBaseInteractionOptions {
  /**
   * the selector of marks
   */
  selector?: string | string[] | IMark | IMark[];
  /**
   * the trigger event name
   */
  trigger?: EventType;
  /**
   * the reset trigger event name
   */
  triggerOff?: EventType | 'none';

  title?: ITooltipRow | string | CustomTooltipCallback;
  content?: ITooltipRow | ITooltipRow[] | CustomTooltipCallback;
  attributes?: MarkFunctionType<TooltipAttributes>;
}

export interface DimensionTooltipOptions extends TooltipOptions {
  scale?: IScale | string;
  tooltipType?: TooltipType;
  target?: {
    data: IData | string;
    filter: string | ((datum: any, tooltipValue: any) => boolean);
  };
  avoidMark?: string | string[];
  container?: string | IMark;
  center?: IPointLike;
}

export type CrosshairType = 'x' | 'y' | 'angle' | 'radius' | 'radius-polygon';

export type CrosshairShape = 'line' | 'rect';

export interface CrosshairOptions extends IBaseInteractionOptions {
  /**
   * the trigger event name
   */
  trigger?: EventType;
  /**
   * the reset trigger event name
   */
  triggerOff?: EventType | 'none';
  scale?: IScale | string;
  crosshairType?: CrosshairType;
  crosshairShape?: CrosshairShape;
  container?: string | IMark;
  radius?: number;
  center?: IPointLike;
  attributes?: MarkFunctionType<BaseCrosshairAttrs>;
}
export interface ViewNavigationBaseOptions {
  enableX?: boolean;
  enableY?: boolean;
  scaleX?: string | IScale;
  scaleY?: string | IScale;
  dataTargetX?: FilterDataTarget;
  dataTargetY?: FilterDataTarget;
  throttle?: number;
  linkedComponentX?: string | IDatazoom | IScrollbar;
  linkedComponentY?: string | IDatazoom | IScrollbar;
  rangeX?: [number, number] | (() => [number, number]);
  rangeY?: [number, number] | (() => [number, number]);
}

export interface ViewZoomSimpleOptions {
  realtime?: boolean;
  rate?: number;
  focus?: boolean;
  trigger?: EventType;
  endTrigger?: EventType;
  triggerOff?: EventType | 'none';
}

export type ViewZoomOptions = ViewZoomSimpleOptions & IBaseInteractionOptions & ViewNavigationBaseOptions;

export interface ViewScrollSimpleOptions {
  realtime?: boolean;
  reversed?: boolean;
  trigger?: EventType;
  endTrigger?: EventType;
}
export type ViewScrollOptions = ViewScrollSimpleOptions & IBaseInteractionOptions & ViewNavigationBaseOptions;

export interface ViewDragSimpleOptions {
  realtime?: boolean;
  reversed?: boolean;
  trigger?: EventType;
  endTrigger?: EventType;
  updateTrigger?: EventType;
}

export type ViewDragOptions = ViewDragSimpleOptions & IBaseInteractionOptions & ViewNavigationBaseOptions;

export interface ViewRoamOptions extends IBaseInteractionOptions, ViewNavigationBaseOptions {
  zoom?: ViewZoomSimpleOptions & { enable?: boolean };
  scroll?: ViewScrollSimpleOptions & { enable?: boolean };
  drag?: ViewDragSimpleOptions & { enable?: boolean };
}

/**
 * the interaction to set the highlight state of specified marks
 */
export interface SankeyHighlightOptions extends IBaseInteractionOptions {
  /**
   * the selector of node mark
   */
  nodeSelector?: string | IMark;
  /**
   * the selector of link mark
   */
  linkSelector?: string | IMark;
  /**
   * the trigger event name
   */
  trigger?: EventType;
  /**
   * the reset trigger event name
   */
  triggerOff?: EventType | 'none';
  /**
   * the highlight state name
   */
  highlightState?: string;
  /**
   * the blur state name
   */
  blurState?: string;
  /** set highlight state to different type of nodes */
  effect?: 'adjacency' | 'related';
}

export interface FishEyeOptions extends IBaseInteractionOptions {
  selector?: string | string[] | IMark | IMark[];
  /** the radius of x-direction */
  radiusX?: number;
  /** the radius of y-direction */
  radiusY?: number;
  /** the radiusRatio of x-direction */
  radiusRatioX?: number;
  /** the radiusRatio of y-direction */
  radiusRatioY?: number;
  /** x方向的扰动 */
  distortionX?: number;
  /** y方向的扰动 */
  distortionY?: number;
  /** 禁用 x方向的变形 */
  enableX?: boolean;
  /** 禁用y方向的变形 */
  enableY?: boolean;
  /** x方向的scale */
  scaleX?: string | IScale;
  /** y方向的scale */
  scaleY?: string | IScale;
  /** 节流的时长，单位为ms */
  throttle?: number;
  /**
   * the trigger event name
   */
  trigger?: EventType;
  /**
   * the trigger event of end
   */
  endTrigger?: EventType;
  /**
   * the trigger event of updating
   */
  updateTrigger?: EventType;
  /**
   * the trigger event of reset
   */
  triggerOff?: string | 'none';
}

export interface ElementActiveSpec extends ElementActiveOptions {
  /**
   * 设置交互的类型为 'element-active'
   */
  type: 'element-active';
}
export interface ElementSelectSpec extends ElementSelectOptions {
  /**
   * 设置交互的类型为 'element-select'
   */
  type: 'element-select';
}
export interface ElementHighlightSpec extends ElementHighlightOptions {
  /**
   * 设置交互的类型为 'element-highlight'
   */
  type: 'element-highlight';
}
export interface ElementHighlightByKeySpec extends ElementHighlightOptions {
  /**
   * 设置交互的类型为 'element-highlight-by-key'
   */
  type: 'element-highlight-by-key';
}
export interface ElementHighlightByGroupSpec extends ElementHighlightOptions {
  /**
   * 设置交互的类型为 'element-highlight-by-group'
   */
  type: 'element-highlight-by-group';
}
export interface ElementActiveByLegendSpec extends ElementActiveByLegendOptions {
  /**
   * 设置交互的类型为 'element-active-by-legend'
   */
  type: 'element-active-by-legend';
}

export interface ElementHighlightByLegendSpec extends ElementHighlightByLegendOptions {
  /**
   * 设置交互的类型为'element-highlight-by-legend'
   */
  type: 'element-highlight-by-legend';
}

export interface ElementHighlightByNameSpec extends ElementHighlightByNameOptions {
  /**
   * 设置交互的类型为'element-highlight-by-name'
   */
  type: 'element-highlight-by-name';
}

export interface BrushHighlightSpec extends BrushHighlightOptions {
  /**
   * 设置交互类型为'brush-highlight'
   */
  type: 'brush-highlight';
}

export interface BrushActiveSpec extends BrushActiveOptions {
  /**
   * 设置交互类型为 'brush-active'
   */
  type: 'brush-active';
}

export interface BrushFilterSpec extends BrushFilterOptions {
  /**
   * 设置交互类型为'brush-filter'
   */
  type: 'brush-filter';
}

export interface LegendFilterSpec extends DataFilterOptions {
  type: 'legend-filter';
}

export interface DatazoomFilterSpec extends DataFilterOptions {
  type: 'datazoom-filter';
}

export interface SliderFilterSpec extends DataFilterOptions {
  type: 'slider-filter';
}

export interface PlayerFilterSpec extends DataFilterOptions {
  type: 'player-filter';
}

export interface ScrollbarFilterSpec extends DataFilterOptions {
  type: 'scrollbar-filter';
}

export interface DrillDownSpec extends DrillDownOptions {
  type: 'drill-down';
}

export interface RollUpSpec extends RollUpOptions {
  type: 'roll-up';
}

export interface TooltipSpec extends TooltipOptions {
  type: 'tooltip';
}

export interface DimensionTooltipSpec extends DimensionTooltipOptions {
  type: 'dimension-tooltip';
}

export interface CrosshairSpec extends CrosshairOptions {
  type: 'crosshair';
}
export interface ViewRoamSpec extends ViewRoamOptions {
  type: 'view-roam';
}

export interface ViewZoomSpec extends ViewZoomOptions {
  type: 'view-zoom';
}

export interface ViewScrollSpec extends ViewScrollOptions {
  type: 'view-scroll';
}

export interface ViewDragSpec extends ViewDragOptions {
  type: 'view-drag';
}

export interface SankeyHighlightSpec extends SankeyHighlightOptions {
  type: 'sankey-highlight';
}

export interface FishEyeSpec extends FishEyeOptions {
  type: 'fish-eye';
}

export interface CustomizedInteractionSpec extends IBaseInteractionOptions {
  type: string;
}

export type InteractionSpec =
  | ElementActiveSpec
  | ElementSelectSpec
  | ElementHighlightSpec
  | ElementHighlightByKeySpec
  | ElementHighlightByGroupSpec
  | ElementActiveByLegendSpec
  | ElementHighlightByLegendSpec
  | ElementHighlightByNameSpec
  | BrushHighlightSpec
  | BrushActiveSpec
  | BrushFilterSpec
  | LegendFilterSpec
  | DatazoomFilterSpec
  | SliderFilterSpec
  | PlayerFilterSpec
  | ScrollbarFilterSpec
  | DrillDownSpec
  | RollUpSpec
  | TooltipSpec
  | DimensionTooltipSpec
  | CrosshairSpec
  | ViewRoamSpec
  | ViewZoomSpec
  | ViewScrollSpec
  | ViewDragSpec
  | SankeyHighlightSpec
  | FishEyeSpec
  | CustomizedInteractionSpec;

export interface ViewNavigationRange {
  needUpdate?: boolean;
  x?: [number, number];
  y?: [number, number];
}

export interface IViewZoomMixin {
  updateZoomRange: (
    rangeFactor: [number, number],
    range: [number, number],
    zoomEvent: { zoomDelta: number; zoomX: number; zoomY: number },
    zoomOptions?: ViewZoomSimpleOptions
  ) => [number, number];
  formatZoomEvent: (e: InteractionEvent) => InteractionEvent & { zoomDelta?: number; zoomX?: number; zoomY?: number };
  handleZoomStart: (
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    zoomOptions?: ViewZoomSimpleOptions
  ) => ViewNavigationRange;
  handleZoomEnd: (
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    zoomOptions?: ViewZoomSimpleOptions
  ) => ViewNavigationRange;
  handleZoomReset: (
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    zoomOptions?: ViewZoomSimpleOptions
  ) => ViewNavigationRange;
}

export interface IViewScrollMixin {
  formatScrollEvent: (e: InteractionEvent) => InteractionEvent & { scrollX?: number; scrollY?: number };
  handleScrollStart: (
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    scrollOptions?: ViewScrollSimpleOptions
  ) => ViewNavigationRange;
  handleScrollEnd: (
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    scrollOptions?: ViewScrollSimpleOptions
  ) => ViewNavigationRange;
}

export interface IViewDragMixin {
  handleDragStart: (
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    dragOptions?: ViewDragSimpleOptions
  ) => ViewNavigationRange;
  handleDragUpdate: (
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    dragOptions?: ViewDragSimpleOptions
  ) => ViewNavigationRange;
  handleDragEnd: (
    e: InteractionEvent,
    navState: Partial<Record<'x' | 'y', ViewStateByDim>>,
    dragOptions?: ViewDragSimpleOptions
  ) => ViewNavigationRange;
}

export interface IToggleStateMixin {
  updateStates: (
    newStatedElements: (IElement | IGlyphElement)[],
    prevStatedElements?: (IElement | IGlyphElement)[],
    state?: string,
    reverseState?: string
  ) => (IElement | IGlyphElement)[];
  clearAllStates: (state?: string, reverseState?: string) => void;
}

export interface ViewStateByDim {
  scale?: IScale;
  data?: IData;
  linkedComponent?: IDatazoom | IScrollbar;
  filterValue?: any[];
  wholeScale?: IBaseScale;
  initRangeFactor?: [number, number];
  getCurrentRange?: () => [number, number];
  rangeFactor?: [number, number];
}
