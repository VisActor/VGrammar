/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-util/src/error.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { getLogger } from './logger';

export const error = (message: string) => {
  const logger = getLogger();

  logger.error(message);
};
