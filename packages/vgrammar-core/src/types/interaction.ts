import type { IView } from './view';
import type { EventType, InteractionEvent, ViewEventType } from './event';
import type {
  BaseCrosshairAttrs,
  BrushAttributes,
  TooltipAttributes,
  TooltipRowAttrs
} from '@visactor/vrender-components';
import type { IPolygon, ISymbolGraphicAttribute, ITextGraphicAttribute } from '@visactor/vrender';
import type { IElement, IGlyphElement } from './element';
import type { IData, IGrammarBase, IMark, IScale } from './grammar';
import type { IPointLike } from '@visactor/vutils';
import type { IBaseScale } from '@visactor/vscale';
import type { IDatazoom, IScrollbar } from './component';
import type { FieldEncodeType, MarkFunctionType } from './mark';

export interface FilterDataTarget {
  data: string | IData;
  filter: string | ((datum: any, filterValues: any[]) => boolean);
  transform?: (data: any[], filterValues: any[]) => any[];
}

export interface IBaseInteractionOptions {
  dependencies?: string | string[] | IGrammarBase | IGrammarBase[];

  shouldStart?: (e: any) => boolean;

  shouldUpdate?: (e: any) => boolean;

  shouldEnd?: (e: any) => boolean;

  shouldReset?: (e: any) => boolean;

  onStart?: (e: any) => boolean;

  onUpdate?: (e: any) => boolean;

  onEnd?: (e: any) => boolean;

  onReset?: (e: any) => boolean;
}

export interface IInteraction {
  readonly type: string;
  depend: (grammar: IGrammarBase[] | IGrammarBase | string[] | string) => void;
  bind: () => void;
  unbind: () => void;
}

export interface IInteractionConstructor {
  readonly type: string;

  new (view: IView, options?: any): IInteraction;
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
  trigger?: EventType;
  /**
   * the reset trigger event name
   */
  resetTrigger?: EventType;
  /**
   * the active state name
   */
  state?: string;
}

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
  trigger?: EventType;
  /**
   * the selected state name
   */
  state?: string;
  /**
   * the reset trigger event name
   */
  resetTrigger?: EventType | ViewEventType | 'empty';
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
  resetTrigger?: EventType;
  /**
   * the highlight state name
   */
  highlightState?: string;
  /**
   * the blur state name
   */
  blurState?: string;
}

/**
 * the interaction to set the active state of specified marks trigger by legend
 */
export interface ElementActiveByLegendOptions extends IBaseInteractionOptions {
  /**
   * the selector of marks
   */
  selector?: string | string[] | IMark | IMark[];
  /**
   * the active state name
   */
  state?: string;
  /**
   * the highlight state name
   */
  filterType?: 'key' | 'groupKey';
}

/**
 * the interaction to set the active state of specified marks trigger by legend
 */
export interface ElementHighlightByLegendOptions extends IBaseInteractionOptions {
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
  /**
   * the highlight state name
   */
  filterType?: 'key' | 'groupKey';
}

export interface ElementHighlightByNameOptions extends ElementHighlightByLegendOptions {
  name?: string | string[];
  /**
   * the trigger event name
   */
  trigger?: EventType;
  /**
   * the reset trigger event name
   */
  resetTrigger?: EventType;

  parseData?: (e: InteractionEvent) => any;
}

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

export interface DrillDownOptions extends BrushOptions {
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
  resetTrigger?: EventType | ViewEventType | 'empty';
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
  resetTrigger?: EventType;

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
  resetTrigger?: EventType;
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
}

export interface ViewZoomSimpleOptions {
  realtime?: boolean;
  rate?: number;
  focus?: boolean;
  trigger?: EventType;
  endTrigger?: EventType;
  resetTrigger?: EventType;
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

export interface ElementActiveSpec extends ElementActiveOptions {
  type: 'element-active';
}
export interface ElementSelectSpec extends ElementSelectOptions {
  type: 'element-select';
}
export interface ElementHighlightSpec extends ElementHighlightOptions {
  type: 'element-highlight';
}
export interface ElementHighlightByKeySpec extends ElementHighlightOptions {
  type: 'element-highlight-by-key';
}
export interface ElementHighlightByGroupSpec extends ElementHighlightOptions {
  type: 'element-highlight-by-group';
}
export interface ElementActiveByLegendSpec extends ElementActiveByLegendOptions {
  type: 'element-active-by-legend';
}

export interface ElementHighlightByLegendSpec extends ElementHighlightByLegendOptions {
  type: 'element-highlight-by-legend';
}

export interface ElementHighlightByNameSpec extends ElementHighlightByNameOptions {
  type: 'element-highlight-by-name';
}

export interface BrushHighlightSpec extends BrushHighlightOptions {
  type: 'brush-highlight';
}

export interface BrushActiveSpec extends BrushActiveOptions {
  type: 'brush-active';
}

export interface BrushFilterSpec extends BrushFilterOptions {
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
  | ViewDragSpec;

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

export interface ViewStateByDim {
  scale?: IScale;
  data?: IData;
  linkedComponent?: IDatazoom | IScrollbar;
  filterValue?: any[];
  wholeScale?: IBaseScale;
  rangeFactor?: [number, number];
}
