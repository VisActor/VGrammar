import { extent } from '../src';

test('extent(arr)', () => {
  expect(extent([1, 2])).toEqual([1, 2]);
  expect(extent([])).toEqual([undefined, undefined]);
  expect(extent([NaN, undefined, null, NaN])).toEqual([undefined, undefined]);
  expect(extent([1, 1])).toEqual([1, 1]);
  expect(extent([Infinity, 1])).toEqual([1, Infinity]);
  expect(extent([undefined, 33, 1])).toEqual([1, 33]);
  expect(extent([null, 33, 1])).toEqual([1, 33]);
  expect(extent([NaN, 33, 1])).toEqual([1, 33]);
  expect(extent([NaN, undefined, null, 1])).toEqual([1, 1]);
  expect(extent([NaN, undefined, null, 'test'])).toEqual([undefined, undefined]);
});

test('extent() of string number', () => {
  expect(extent(['1', '2'])).toEqual([1, 2]);

  expect(extent(['1222', '2', 0])).toEqual([0, 1222]);
});

test('extent(arr, func)', () => {
  const func = (entry: any) => {
    return entry?.value;
  };

  expect(extent([{ value: 1 }, 2], func)).toEqual([1, 1]);
  expect(extent([], func)).toEqual([undefined, undefined]);
  expect(extent([NaN, undefined, null, NaN], func)).toEqual([undefined, undefined]);
  expect(extent([{ value: 1 }, { value: 1 }], func)).toEqual([1, 1]);
  expect(
    extent(
      [Infinity, 1].map(e => ({ value: e })),
      func
    )
  ).toEqual([1, Infinity]);
  expect(
    extent(
      [undefined, 33, 1].map(e => ({ value: e })),
      func
    )
  ).toEqual([1, 33]);
  expect(
    extent(
      [null, 33, 1].map(e => ({ value: e })),
      func
    )
  ).toEqual([1, 33]);
  expect(
    extent(
      [NaN, 33, 1].map(e => ({ value: e })),
      func
    )
  ).toEqual([1, 33]);
  expect(
    extent(
      [NaN, undefined, null, 1].map(e => ({ value: e })),
      func
    )
  ).toEqual([1, 1]);
});
