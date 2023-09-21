import { parseEventSelector } from '../src/parse/event';
import { initBrowserEnv } from '../src/env';

initBrowserEnv();
/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-event-selector/test/event-selector-test.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

test('Parser parses event selector strings', function () {
  let events: any;

  events = parseEventSelector('mouseup');
  expect(events).toEqual({
    source: 'view',
    type: 'mouseup'
  });

  events = parseEventSelector('rect:mousedown');
  expect(events).toEqual({
    source: 'view',
    type: 'mousedown',
    markType: 'rect'
  });

  events = parseEventSelector('@foo:mouseup');
  expect(events).toEqual({
    source: 'view',
    type: 'mouseup',
    markName: 'foo'
  });

  events = parseEventSelector('#foo:mouseup');
  expect(events).toEqual({
    source: 'view',
    type: 'mouseup',
    markId: 'foo'
  });

  events = parseEventSelector('window:mouseup');
  expect(events).toEqual({
    source: 'window',
    type: 'mouseup'
  });
});

test('Parser rejects invalid event selector strings', function () {
  expect(function () {
    parseEventSelector('a:b:c');
  }).toBeUndefined;
});
