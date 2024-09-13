import { isObject, isString, mixin } from '@visactor/vutils';
import type { BaseEventSpec, EventSpec } from '../types/event';
import type { IView, IViewEventConfig } from '../types/view';
import { generateFilterByMark, parseEventSelector, parseHandler } from '../parse/event';
import { parseReference } from '../parse/util';
import { EVENT_SOURCE_VIEW, EVENT_SOURCE_WINDOW, NO_TRAP } from './constants';
import { permit, prevent } from './events';
// eslint-disable-next-line no-duplicate-imports
import { vglobal } from '@visactor/vrender-core';
import type { IElement } from '../types/element';
import getExtendedEvents from '../graph/util/events-extend';
import View from './View';

class ViewEventsMixin {
  private _eventConfig: IViewEventConfig;
  private _eventCache: Record<string, () => void>;
  private _eventListeners: Array<{
    type: string;
    source: any;
    handler: any;
  }>;

  event(eventSpec: EventSpec) {
    if ('between' in eventSpec) {
      const [starEvent, endEvent] = eventSpec.between;
      // FIXME between需要生成唯一ID
      const id = `${starEvent.type}-${eventSpec.type}-${endEvent.type}`;

      let unbindEndEvent: any;

      this.bindEvents(
        Object.assign({}, starEvent, {
          callback: () => {
            if (!this._eventCache) {
              this._eventCache = {};
            }
            // 中间的事件绑定
            if (!this._eventCache[id]) {
              const unbindEvent = this.bindEvents(eventSpec);
              this._eventCache[id] = unbindEvent;
            }
            if (!unbindEndEvent) {
              // 结束的事件绑定
              unbindEndEvent = this.bindEvents(
                Object.assign({}, endEvent, {
                  callback: () => {
                    if (this._eventCache[id]) {
                      this._eventCache[id]();
                      this._eventCache[id] = null;
                    }
                  }
                })
              );
            }
          }
        })
      );
    } else if ('merge' in eventSpec) {
      eventSpec.merge.forEach(entry => {
        const singleEvent: Partial<BaseEventSpec> = Object.assign({}, eventSpec);

        if (isString(entry)) {
          singleEvent.type = entry;
        } else if (isObject(entry)) {
          Object.assign(singleEvent, entry);
        }
        singleEvent.debounce = 50;
        this.bindEvents(singleEvent as BaseEventSpec);
      });
    } else {
      this.bindEvents(eventSpec);
    }
  }

  // --- Event ---

  private bindEvents(eventSpec: BaseEventSpec) {
    if (this._eventConfig.disable) {
      return;
    }
    const { type: evtType, filter, callback, throttle, debounce, consume, target, dependency } = eventSpec;
    const eventSelector = parseEventSelector(evtType);

    if (!eventSelector) {
      return;
    }
    const { source, type } = eventSelector;

    const markFilter = generateFilterByMark(eventSelector);
    const targetSignals =
      Array.isArray(target) && target.length
        ? target.map(entry => {
            return {
              signal: (this as unknown as IView).getSignalById(entry.target),
              callback: entry.callback
            };
          })
        : [
            {
              signal: isString(target) ? (this as unknown as IView).getSignalById(target) : null,
              callback
            }
          ];
    const validateSignals = targetSignals.filter(entry => entry.signal || entry.callback);
    const refs = parseReference(dependency, this as unknown as IView);

    const send = parseHandler(
      (evt?: any) => {
        const needPreventDefault =
          (source === EVENT_SOURCE_VIEW && prevent(this._eventConfig, type)) ||
          (consume && (evt.cancelable === undefined || evt.cancelable));

        if (source === EVENT_SOURCE_WINDOW) {
          evt = getExtendedEvents(this as unknown as IView, evt, type, EVENT_SOURCE_WINDOW);
        }

        let hasCommitted = false;

        if ((!filter || filter(evt)) && (!markFilter || markFilter(evt.element)) && validateSignals.length) {
          const params = refs.reduce((params, ref) => {
            params[ref.id()] = ref.output();
            return params;
          }, {});
          validateSignals.forEach(entry => {
            if (entry.callback && entry.signal) {
              const changed = entry.signal.set(entry.callback(evt, params));

              if (changed) {
                (this as unknown as IView).commit(entry.signal);
                hasCommitted = true;
              }
            } else if (entry.callback) {
              entry.callback(evt, params);
            } else {
              (this as unknown as IView).commit(entry.signal);
              hasCommitted = true;
            }
          });
        }

        if (needPreventDefault) {
          evt.preventDefault();
        }

        if (consume) {
          evt.stopPropagation();
        }

        if (hasCommitted) {
          (this as unknown as IView).run();
        }
      },
      { throttle, debounce }
    );

    if (source === EVENT_SOURCE_VIEW) {
      if (permit(this._eventConfig, EVENT_SOURCE_VIEW, type)) {
        // send traps errors, so use {trap: false} option
        (this as unknown as IView).addEventListener(type, send, NO_TRAP);

        return () => {
          (this as unknown as IView).removeEventListener(type, send);
        };
      }
    } else if (source === EVENT_SOURCE_WINDOW) {
      vglobal.addEventListener(type, send);
      this._eventListeners.push({
        type: type,
        source: vglobal,
        handler: send
      });

      return () => {
        vglobal.removeEventListener(type, send);

        const index = this._eventListeners.findIndex((entry: any) => {
          return entry.type === type && entry.source === vglobal && entry.handler === send;
        });

        if (index >= 0) {
          this._eventListeners.splice(index, 1);
        }
      };
    }
  }
}

export const registerViewEventsAPI = () => {
  mixin(View, ViewEventsMixin);
};
