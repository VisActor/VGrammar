import type { FederatedEvent } from '@visactor/vrender';
import type { IView } from './view';
import type { EventType, ViewEventType } from './event';

export interface IBaseInteractionOptions {
  shouldStart?: (e: FederatedEvent) => boolean;

  shouldEnd?: (e: FederatedEvent) => boolean;

  shouldUpdate?: (e: FederatedEvent) => boolean;
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

export interface ElementActiveSpec extends ElementActiveOptions {
  type: 'element-active';
}
export interface ElementSelectSpec extends ElementSelectOptions {
  type: 'element-select';
}

export type InteractionSpec = ElementActiveSpec | ElementSelectSpec;
