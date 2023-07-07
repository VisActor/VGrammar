import { splitAccessPath } from '../src';

test('splitAccessPath()', function () {
  expect(splitAccessPath('')).toEqual([]);
  expect(splitAccessPath('a.b')).toEqual(['a', 'b']);
  expect(splitAccessPath('a[b]')).toEqual(['a', 'b']);
  expect(splitAccessPath('a."b"')).toEqual(['a', '"b"']);
  expect(splitAccessPath("a['b']")).toEqual(['a', 'b']);
  expect(splitAccessPath('a["b"]')).toEqual(['a', 'b']);
  expect(splitAccessPath('a["b"].c')).toEqual(['a', 'b', 'c']);

  expect(splitAccessPath('a.\\b')).toEqual(['a', 'b']);
});
