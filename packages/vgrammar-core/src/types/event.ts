import type { IAnimationConfig, IElement, IMark } from '.';
import type { MarkType } from './mark';
import type { SignalDependency } from './signal';

export type AnimationEvent = {
  mark: IMark;
  animationState: string;
  animationConfig: IAnimationConfig;
};

export type GrammarEvent = MouseEvent & TouchEvent & KeyboardEvent & AnimationEvent;

export type EventHandler<T> = (event?: GrammarEvent, value?: T) => void;
export type BaseEventHandler = EventHandler<any>;
export type ResizeHandler = EventHandler<{ width?: number; height?: number }>;

export type AnimationEventType = 'animationStart' | 'animationEnd' | 'elementAnimationStart' | 'elementAnimationEnd';

export type AnimationListenerHandler = (event?: AnimationEvent, el?: IElement) => void;

export type EventType =
  | 'pointerdown'
  | 'pointerup'
  // 指针抬起与按下的图形不同时触发
  | 'pointerupoutside'
  | 'pointertap'
  | 'pointerover'
  | 'pointerenter'
  | 'pointerleave'
  | 'pointerout'
  | 'mousedown'
  | 'mouseup'
  | 'mouseupoutside'
  // 右键操作
  | 'rightdown'
  | 'rightup'
  | 'rightupoutside'
  | 'click'
  // 双击
  | 'dblclick'
  | 'mousemove'
  | 'mouseover'
  | 'mouseout'
  // 不会冒泡
  | 'mouseenter'
  // 不会冒泡
  | 'mouseleave'
  | 'wheel'
  | 'tap'
  | 'touchstart'
  | 'touchend'
  | 'touchendoutside'
  | 'touchmove'
  | 'touchcancel'
  // dragNdrop
  | 'dragstart'
  | 'drag'
  | 'dragenter'
  | 'dragleave'
  | 'dragover'
  | 'dragend'
  | 'drop'
  // gesture
  | 'pan'
  | 'panstart'
  | 'panend'
  | 'press'
  | 'pressup'
  | 'pressend'
  | 'pinch'
  | 'pinchstart'
  | 'pinchend'
  | 'swipe'
  // resize
  | 'resize';

export type WindowEventType = string;

export interface EventCallbackContext extends Event {
  element?: any;
  datum?: any;
}

export type EventCallback = (context: EventCallbackContext, params?: any) => any;
export interface BaseEventSpec {
  type: string;
  filter?: (context: EventCallbackContext) => boolean;
  throttle?: number;
  debounce?: number;
  /** 阻止事件的执行和传播 */
  consume?: boolean;
  callback?: EventCallback;
  dependency?: SignalDependency | SignalDependency[];
  target?:
    | string
    | Array<{
        target: string;
        callback: EventCallback;
      }>;
}

export type MergeEventSpec = Omit<BaseEventSpec, 'type'> & { merge: string[] | BaseEventSpec[] };

export interface ParsedViewEventSpec extends BaseEventSpec {
  source?: 'view';
  type: EventType;
  markId?: string;
  markName?: string;
  markType?: string;
}

export interface ParsedWindowEventSpec extends BaseEventSpec {
  source: 'window';
  type: WindowEventType;
  markId?: string;
  markName?: string;
  markType?: MarkType;
}

export type EventSpec =
  | BaseEventSpec
  | ({
      between: [BaseEventSpec, BaseEventSpec];
    } & BaseEventSpec)
  | MergeEventSpec;

export type EventSourceType = 'window' | 'view';
