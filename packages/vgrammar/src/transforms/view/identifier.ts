/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-view-transforms/src/Identifier.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { isNil } from '@visactor/vutils';
import type { IView } from './../../types/';

interface IdentifierOptions {
  as: string;
}

const COUNTER_NAME = ':vGrammar_identifier:';

export const transform = (options: IdentifierOptions, upstreamData: any[], params: any, view?: IView) => {
  if (isNil(view[COUNTER_NAME])) {
    view[COUNTER_NAME] = 0;
  }

  let id = view[COUNTER_NAME];
  const as = options.as;

  upstreamData.forEach((entry: any) => {
    if (entry && isNil(entry[as])) {
      id += 1;
      entry[as] = id;
    }
  });
  view[COUNTER_NAME] = id;

  return id;
};
