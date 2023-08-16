import { transform } from '../src/wordcloud-shape';

test('Wordcloud shape should return empty data when shape is wrong', async () => {
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
      shape: 'test'
    },
    data
  );
  expect(result).toEqual([]);
});

test('Wordcloud shape should return empty data when size is undefined', async () => {
  const data = [
    { text: 'foo', size: 49, index: 0 },
    { text: 'bar', size: 36, index: 1 },
    { text: 'baz', size: 25, index: 2 },
    { text: 'abc', size: 1, index: 3 }
  ];
  const result = await transform(
    {
      size: undefined,
      text: { field: 'text' },
      fontSize: { field: 'size' },
      shape: 'test'
    },
    data
  );
  expect(result).toEqual([]);
});

test('Wordcloud shape should return empty data when size is [0, 0]', async () => {
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
      shape: 'test'
    },
    data
  );
  expect(result).toEqual([]);
});
