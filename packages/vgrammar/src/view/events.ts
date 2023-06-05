import { isArray, isObject } from '@visactor/vutils';
import type { IViewEventConfig } from '../types';
import { EVENT_SOURCE_VIEW, EVENT_SOURCE_WINDOW } from './constants';

/**
 * 初始化事件配置，将所有配置转化为 {[key: string]: boolean } 格式。
 * Initialize event handling configuration.
 * @param {object} config - The configuration settings.
 * @return {object}
 */
export function initializeEventConfig(config: any) {
  const eventsConfig = Object.assign({ defaults: {} }, config);

  const unpack = (obj: any, keys: string[]) => {
    keys.forEach(k => {
      if (isArray(obj[k])) {
        obj[k] = obj[k].reduce((set: any, key: any) => {
          set[key] = true;
          return set;
        }, {});
      }
    });
  };

  unpack(eventsConfig.defaults, ['prevent', 'allow']);
  unpack(eventsConfig, [EVENT_SOURCE_VIEW, EVENT_SOURCE_WINDOW]);

  return eventsConfig;
}

export function prevent(eventConfig: IViewEventConfig, type: string) {
  const def = eventConfig.defaults;
  const prevent = def.prevent;
  const allow = def.allow;

  if (prevent === false || allow === true) {
    return false;
  }

  if (prevent === true || allow === false) {
    return true;
  }

  if (prevent) {
    return prevent[type];
  }

  if (allow) {
    return !allow[type];
  }

  return false;
}

export function permit(eventConfig: IViewEventConfig, key: string, type: string) {
  const rule = eventConfig?.[key];

  if (rule === false || (isObject(rule) && !rule[type])) {
    return false;
  }

  return true;
}
