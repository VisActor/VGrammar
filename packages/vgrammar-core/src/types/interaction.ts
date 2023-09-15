import type { FederatedEvent } from '@visactor/vrender';
import type { IView } from './view';

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

export interface ElementHoverOptions extends IBaseInteractionOptions {
  selector?: string | string[];
  startTrigger?: string;
  endTrigger?: string;
  state?: string;
}

export interface ElementSelectOptions extends IBaseInteractionOptions {
  selector?: string | string[];
  trigger?: string;
  state?: string;
}

export interface ElementHoverSpec extends ElementHoverOptions {
  type: 'element-hover';
}

export interface ElementSelectSpec extends ElementSelectOptions {
  type: 'element-select';
}

export type InteractionSpec = ElementHoverSpec | ElementSelectSpec;
