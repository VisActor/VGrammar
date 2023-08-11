/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-wordcloud/test/wordcloud-test.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { transform } from '../src/wordcloud';

test('Wordcloud should not throw error when size is 0', async () => {
  const data = [
    { text: 'foo', size: 49, index: 0 },
    { text: 'bar', size: 36, index: 1 },
    { text: 'baz', size: 25, index: 2 },
    { text: 'abc', size: 1, index: 3 }
  ];

  const result = await transform(
    {
      size: [0, 0],
      text: { field: 'text' },
      fontSize: { field: 'size' },
      fontSizeRange: [1, 7]
    },
    data
  );

  expect(result).toEqual([]);
});

test('Wordcloud should not throw error when size is negative', async () => {
  const data = [
    { text: 'foo', size: 49, index: 0 },
    { text: 'bar', size: 36, index: 1 },
    { text: 'baz', size: 25, index: 2 },
    { text: 'abc', size: 1, index: 3 }
  ];

  const result = await transform(
    {
      size: [-10, 100],
      text: { field: 'text' },
      fontSize: { field: 'size' },
      fontSizeRange: [1, 7]
    },
    data
  );

  expect(result).toEqual([]);
});

test('Wordcloud should not throw error when size is very small', async () => {
  const data = [
    { text: 'foo', size: 49, index: 0 },
    { text: 'bar', size: 36, index: 1 },
    { text: 'baz', size: 25, index: 2 },
    { text: 'abc', size: 1, index: 3 }
  ];

  const result = await transform(
    {
      size: [10, 10],
      text: { field: 'text' },
      fontSize: { field: 'size' },
      fontSizeRange: [1, 7],
      enlarge: true
    },
    data
  );

  expect(result).toEqual([]);
});

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
  expect(result.length).toBe(data.length);
  expect(result[0].fontFamily).toBe('sans-serif');
  expect(result[0].fontSize).toBe(7);
  expect(result[0].fontStyle).toBe('normal');
  expect(result[0].fontWeight).toBe('normal');
  expect(result[0].x).toBe(250);
  expect(result[0].y).toBe(250);
});

test('Wordcloud generates wordcloud layout with negative data', async () => {
  const data = [
    { text: 'foo', size: -49, index: 0 },
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
  expect(result.length).toBe(data.length);
  expect(result[0].fontFamily).toBe('sans-serif');
  expect(result[0].fontSize).toBe(7);
  expect(result[0].fontStyle).toBe('normal');
  expect(result[0].fontWeight).toBe('normal');
  expect(result[0].x).toBe(250);
  expect(result[0].y).toBe(250);
});

test('Wordcloud generates wordcloud layout with negative data and -domain[0] === domain[1]', async () => {
  const data = [
    { text: 'foo', size: -49, index: 0 },
    { text: 'bar', size: 49, index: 1 }
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
  expect(result.length).toBe(data.length);
  expect(result[0].fontFamily).toBe('sans-serif');
  expect(result[0].fontSize).toBe(7);
  expect(result[0].fontStyle).toBe('normal');
  expect(result[0].fontWeight).toBe('normal');
  expect(result[0].x).toBe(250);
  expect(result[0].y).toBe(250);
});

test('Wordcloud generates wordcloud layout with one data', async () => {
  const data = [{ text: 'foo', size: 49, index: 0 }];

  const result = await transform(
    {
      size: [500, 500],
      text: { field: 'text' },
      fontSize: { field: 'size' },
      fontSizeRange: [1, 7]
    },
    data
  );
  expect(result.length).toBe(data.length);
  expect(result[0].fontFamily).toBe('sans-serif');
  expect(result[0].fontSize).toBe(7);
  expect(result[0].fontStyle).toBe('normal');
  expect(result[0].fontWeight).toBe('normal');
  expect(result[0].x).toBe(250);
  expect(result[0].y).toBe(250);
});

test('Wordcloud generates wordcloud layout with domain[0] == domain[1] & domain[0] < 0', async () => {
  const data = [
    { text: 'foo', size: -49, index: 0 },
    { text: 'bar', size: -49, index: 1 }
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
  expect(result.length).toBe(data.length);
  expect(result[0].fontFamily).toBe('sans-serif');
  expect(result[0].fontSize).toBe(1);
  expect(result[0].fontStyle).toBe('normal');
  expect(result[0].fontWeight).toBe('normal');
  expect(result[0].x).toBe(250);
  expect(result[0].y).toBe(250);
});

test('Wordcloud generates wordcloud layout with domain[0] == domain[1] & domain[0] > 0', async () => {
  const data = [
    { text: 'foo', size: 49, index: 0 },
    { text: 'bar', size: 49, index: 1 }
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
  expect(result.length).toBe(data.length);
  expect(result[0].fontFamily).toBe('sans-serif');
  expect(result[0].fontSize).toBe(1);
  expect(result[0].fontStyle).toBe('normal');
  expect(result[0].fontWeight).toBe('normal');
  expect(result[0].x).toBe(250);
  expect(result[0].y).toBe(250);
});
