/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-projection/test/projections-test.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { projection, projectionProperties } from '../src/index';

test('default projections are registered', function () {
  expect(projectionProperties.length).toBe(19);
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
    expect(p).not.toBeNull();
    const proj = p();
    expect(proj.copy).not.toBeUndefined();

    const p1 = proj.copy();

    expect(p1).not.toBeUndefined();
  });
});
