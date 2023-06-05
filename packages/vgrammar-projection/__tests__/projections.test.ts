/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-projection/test/projections-test.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { projection } from '../src/index';

test('default projections are registered', function () {
  [
    'albers',
    'albersusa',
    'azimuthalequalarea',
    'azimuthalequidistant',
    'conicconformal',
    'conicequalarea',
    'conicequidistant',
    'equirectangular',
    'gnomonic',
    'identity',
    'mercator',
    'naturalEarth1',
    'orthographic',
    'stereographic',
    'transversemercator'
  ].forEach(function (name) {
    const p = projection(name);
    expect(p).not.toBe(null);
  });
});
