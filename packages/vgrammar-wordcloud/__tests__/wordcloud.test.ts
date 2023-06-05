/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-wordcloud/test/wordcloud-test.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { transform } from '../src/wordcloud';

describe.skip('wordcloud', () => {
  test('Wordcloud generates wordcloud layout', async () => {
    const data = [
      { text: 'foo', size: 49, index: 0 },
      { text: 'bar', size: 36, index: 1 },
      { text: 'baz', size: 25, index: 2 },
      { text: 'abc', size: 1, index: 3 }
    ];

    const result = await transform(
      {
        size: [500, 500],
        text: { field: 'text' },
        fontSize: { field: 'size' },
        fontSizeRange: [1, 7]
      },
      data
    );
    expect(result).toEqual([
      {
        angle: 0,
        fontFamily: 'sans-serif',
        fontSize: 7,
        fontStyle: 'normal',
        index: 0,
        size: 49,
        text: 'foo',
        fontWeight: 'normal',
        x: 250,
        y: 250
      },
      {
        angle: 0,
        fontFamily: 'sans-serif',
        fontSize: 6,
        fontStyle: 'normal',
        index: 1,
        size: 36,
        text: 'bar',
        fontWeight: 'normal',
        x: 251,
        y: 242
      },
      {
        angle: 0,
        fontFamily: 'sans-serif',
        fontSize: 5,
        fontStyle: 'normal',
        index: 2,
        size: 25,
        text: 'baz',
        fontWeight: 'normal',
        x: 260,
        y: 256
      },
      {
        angle: 0,
        fontFamily: 'sans-serif',
        fontSize: 1,
        fontStyle: 'normal',
        index: 3,
        size: 1,
        text: 'abc',
        fontWeight: 'normal',
        x: 249,
        y: 255
      }
    ]);
  });
});
