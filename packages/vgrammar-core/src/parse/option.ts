import { isFunction, isObject } from '@visactor/vutils';
import type { IGrammarBase } from '../types';
import { isGrammar } from './util';

export const parseOptionValue = (value: IGrammarBase | any, params: any) => {
  if (isGrammar(value)) {
    return value.output();
  } else if (value && isObject<any>(value)) {
    if (isFunction(value.callback)) {
      return (datum: any) => {
        return value.callback(datum, params);
      };
    }

    if (isFunction(value.value)) {
      return value.value(params);
    }

    return value;
  }

  return value;
};

export const parseOptions = (options: Record<string, IGrammarBase | any> | Array<IGrammarBase | any>, params: any) => {
  if (!options) {
    return options;
  }

  if (isObject(options)) {
    return Object.keys(options).reduce((res, key) => {
      const option = options[key];

      res[key] = parseOptionValue(option, params);

      return res;
    }, {});
  }

  return (options as Array<IGrammarBase | any>).map(option => parseOptionValue(option, params));
};
