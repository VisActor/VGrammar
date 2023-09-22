import type { IView } from './view';
import type { EventType, InteractionEvent, ViewEventType } from './event';
import type { BrushAttributes } from '@visactor/vrender-components';
import type { IPolygon } from '@visactor/vrender';
import type { IElement, IGlyphElement } from './element';
import type { IData } from './grammar';

export interface IBaseInteractionOptions {
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
  selector?: string | string[];
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
  selector?: string | string[];
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
  selector?: string | string[];
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
  selector?: string | string[];
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
  selector?: string | string[];
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
  selector?: string | string[];

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
    filter: string | ((datum: any, legendValues: any[]) => boolean);
  };
}

export interface DataFilterOptions extends IBaseInteractionOptions {
  /**
   * the selector of marks
   */
  selector?: string | string[];

  target: {
    data: IData | string;
    filter: string | ((datum: any, legendValues: any[]) => boolean);
  };
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
  | BrushActiveSpec;
