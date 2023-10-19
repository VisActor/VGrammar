import { transform } from '../../src/transforms/data/sampling';

test('lttb sample', () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({ index: i });
  }
  const sample = transform({ size: 10, yfield: 'index' }, data);
  expect(sample.length).toBe(11);
  expect(sample.map(datum => datum.index)).toEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 99]);
});

test('lttb sample with group', () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({ index: i, type: 'a' });
    data.push({ index: i * 2, type: 'b' });
  }
  const sample = transform({ size: 10, yfield: 'index', groupBy: 'type' }, data);
  expect(sample.length).toBe(22);
  expect(sample.map(datum => datum.index)).toEqual([
    0, 0, 10, 20, 20, 40, 30, 60, 40, 80, 50, 100, 60, 120, 70, 140, 80, 160, 90, 180, 99, 198
  ]);
});

test('min sample', () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({ index: i });
  }

  const sample = transform({ size: 10, mode: 'min', yfield: 'index' }, data);
  expect(sample.length).toBe(11);
  expect(sample.map(datum => datum.index)).toEqual([0, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91]);
});

test('min sample with group', () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({ index: i, type: 'a' });
    data.push({ index: i * 2, type: 'b' });
  }

  const sample = transform({ size: 10, mode: 'min', yfield: 'index', groupBy: 'type' }, data);
  expect(sample.length).toBe(22);
  expect(sample.map(datum => datum.index)).toEqual([
    0, 0, 1, 2, 11, 22, 21, 42, 31, 62, 41, 82, 51, 102, 61, 122, 71, 142, 81, 162, 91, 182
  ]);
});

test('max sample', () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({ index: i });
  }

  const sample = transform({ size: 10, mode: 'max', yfield: 'index' }, data);
  expect(sample.length).toBe(11);
  expect(sample.map(datum => datum.index)).toEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 99]);
});

test('max sample with group', () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({ index: i, type: 'a' });
    data.push({ index: i * 2, type: 'b' });
  }

  const sample = transform({ size: 10, mode: 'max', yfield: 'index', groupBy: 'type' }, data);
  expect(sample.length).toBe(22);
  expect(sample.map(datum => datum.index)).toEqual([
    0, 0, 10, 20, 20, 40, 30, 60, 40, 80, 50, 100, 60, 120, 70, 140, 80, 160, 90, 180, 99, 198
  ]);
});

test('average sample', () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({ index: i });
  }

  const sample = transform({ size: 10, mode: 'average', yfield: 'index' }, data);
  expect(sample.length).toBe(11);
  expect(sample.map(datum => datum.index)).toEqual([0, 5.5, 15.5, 25.5, 35.5, 45.5, 55.5, 65.5, 75.5, 85.5, 95]);
});

test('average sample with group', () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({ index: i, type: 'a' });
    data.push({ index: i * 2, type: 'b' });
  }

  const sample = transform({ size: 10, mode: 'average', yfield: 'index', groupBy: 'type' }, data);
  expect(sample.length).toBe(22);
  expect(sample.map(datum => datum.index)).toEqual([
    0, 0, 5.5, 11, 15.5, 31, 25.5, 51, 35.5, 71, 45.5, 91, 55.5, 111, 65.5, 131, 75.5, 151, 85.5, 171, 95, 190
  ]);
});

test('sum sample', () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({ index: i });
  }

  const sample = transform({ size: 10, mode: 'sum', yfield: 'index' }, data);
  expect(sample.length).toBe(11);
  expect(sample.map(datum => datum.index)).toEqual([0, 55, 155, 255, 355, 455, 555, 655, 755, 855, 855]);
});

test('sum sample with group', () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({ index: i, type: 'a' });
    data.push({ index: i * 2, type: 'b' });
  }

  const sample = transform({ size: 10, mode: 'sum', yfield: 'index', groupBy: 'type' }, data);
  expect(sample.length).toBe(22);
  expect(sample.map(datum => datum.index)).toEqual([
    0, 0, 55, 110, 155, 310, 255, 510, 355, 710, 455, 910, 555, 1110, 655, 1310, 755, 1510, 855, 1710, 855, 1710
  ]);
});
