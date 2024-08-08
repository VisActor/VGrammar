import { isObject } from '@visactor/vutils';
import type { IViewEventConfig } from '../types';

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
