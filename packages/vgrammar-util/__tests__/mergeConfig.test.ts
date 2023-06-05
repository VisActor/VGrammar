/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-util/test/mergeConfig-test.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { mergeConfig } from '../src/mergeConfig';

test('mergeConfig merges configuration objects', () => {
  expect(
    mergeConfig(
      { mark: { fill: 'blue', stroke: { value: 'black' }, dashArray: [1, 2] } },
      { mark: { stroke: { signal: '"black"' }, dashArray: [3, 4] } }
    )
  ).toEqual({
    mark: { fill: 'blue', stroke: { signal: '"black"' }, dashArray: [3, 4] }
  });
});

test('mergeConfig merges legend objects', () => {
  expect(
    mergeConfig(
      {
        legend: {
          orient: 'right',
          titlePadding: 5,
          layout: {
            anchor: 'start',
            left: { anchor: 'middle' },
            right: { anchor: 'start', direction: 'horizontal' }
          }
        }
      },
      {
        legend: {
          orient: 'left',
          layout: {
            anchor: 'middle',
            right: { anchor: 'middle' }
          }
        }
      }
    )
  ).toEqual({
    legend: {
      orient: 'left',
      titlePadding: 5,
      layout: {
        anchor: 'middle',
        left: { anchor: 'middle' },
        right: { anchor: 'middle' }
      }
    }
  });
});

test('mergeConfig merges signal arrays', () => {
  expect(
    mergeConfig(
      {
        signals: [
          { name: 'foo', value: 1 },
          { name: 'bar', value: 2 }
        ]
      },
      {
        signals: [
          { name: 'foo', value: 3 },
          { name: 'baz', value: 4 }
        ]
      }
    )
  ).toEqual({
    signals: [
      { name: 'foo', value: 3 },
      { name: 'baz', value: 4 },
      { name: 'bar', value: 2 }
    ]
  });
});

test('mergeConfig handles empty arguments', () => {
  const c = { autosize: 'pad' };
  expect(mergeConfig()).toEqual({});
  expect(mergeConfig(null)).toEqual({});
  expect(mergeConfig(undefined)).toEqual({});
  expect(mergeConfig(c, null, undefined)).toEqual(c);
  expect(mergeConfig(null, c, undefined)).toEqual(c);
  expect(mergeConfig(null, undefined, c)).toEqual(c);
});
