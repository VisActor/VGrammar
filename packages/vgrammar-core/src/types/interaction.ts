import type { IView } from './view';
import type { EventType, InteractionEvent, ViewEventType } from './event';

export interface IBaseInteractionOptions {
  shouldStart?: (e: InteractionEvent) => boolean;

  shouldUpdate?: (e: InteractionEvent) => boolean;

  shouldEnd?: (e: InteractionEvent) => boolean;

  shouldReset?: (e: InteractionEvent) => boolean;

  onStart?: (e: InteractionEvent) => boolean;

  onUpdate?: (e: InteractionEvent) => boolean;

  onEnd?: (e: InteractionEvent) => boolean;

  onReset?: (e: InteractionEvent) => boolean;
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
  trigger?: string;
  /**
   * the reset trigger event name
   */
  resetTrigger?: string;
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

export type InteractionSpec =
  | ElementActiveSpec
  | ElementSelectSpec
  | ElementHighlightSpec
  | ElementHighlightByKeySpec
  | ElementHighlightByGroupSpec
  | ElementActiveByLegendSpec
  | ElementHighlightByLegendSpec;
