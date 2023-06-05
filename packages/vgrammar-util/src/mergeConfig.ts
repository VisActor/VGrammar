/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-util/src/mergeConfig.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { isArray, isFunction, isNil, isObject } from '@visactor/vutils';

const isLegalKey = (key: string) => key !== '__proto__';

export const writeConfig = (output: any, key: string, value: any, recurse?: boolean | Record<string, any>) => {
  if (!isLegalKey(key)) {
    return;
  }

  if (isObject(value) && !isArray(value) && !isFunction(value)) {
    if (!isObject(output[key])) {
      output[key] = {};
    }

    const outputValue = output[key];

    Object.keys(value).forEach((subKey: string) => {
      if (recurse && (recurse === true || recurse[subKey])) {
        writeConfig(outputValue, subKey, value[subKey]);
      } else if (isLegalKey(subKey)) {
        outputValue[subKey] = value[subKey];
      }
    });
  } else {
    output[key] = value;
  }
};

function mergeNamed(a: any[], b: any[]) {
  if (isNil(a)) {
    return b;
  }

  const map = {};
  const out: any[] = [];

  const add = (_: any) => {
    if (!map[_.name]) {
      map[_.name] = 1;
      out.push(_);
    }
  };

  b.forEach(add);
  a.forEach(add);
  return out;
}

export const mergeConfig = (...configs: any[]) => {
  return configs.reduce((out, source) => {
    if (!source) {
      return out;
    }
    Object.keys(source).forEach(key => {
      if (key === 'signals') {
        // for signals, we merge the signals arrays
        // source signals take precedence over
        // existing signals with the same name
        out.signals = mergeNamed(out.signals, source.signals);
      } else {
        // otherwise, merge objects subject to recursion constraints
        // for legend block, recurse for the layout entry only
        // for style block, recurse for all properties
        // otherwise, no recursion: objects overwrite, no merging
        const r = key === 'legend' ? { layout: 1 } : key === 'style' ? true : null;
        writeConfig(out, key, source[key], r);
      }
    });

    return out;
  }, {});
};
