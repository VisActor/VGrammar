import { Scale } from '../../src/view/scale';
import { Data } from '../../src/view/data';
import { getMockedView } from '../util';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

const view = getMockedView();

test('Scale maintains scale structure', function () {
  const scale = new Scale(view as any, 'band')
    .domain({
      callback: (scale: any, params: any) => {
        return ['A', 'B'];
      }
    })
    .range({
      callback: (scale: any, params: any) => {
        return [0, 100];
      }
    });
  expect(scale.output().type).toEqual('band');
  expect(scale.output().domain()).toEqual([]);
  expect(scale.output().range()).toEqual([0, 1]);

  scale.run();
  expect(scale.output().domain()).toEqual(['A', 'B']);
  expect(scale.output().range()).toEqual([0, 100]);
});

test('Scale parse spec and collect dependencies', function () {
  const scale = new Scale(view as any, 'band');

  const spec0 = {
    id: 'xscale',
    type: 'band',
    domain: {
      callback: (scale: any, params: any) => {
        return ['A', 'B'];
      },
      dependency: 'signalA'
    },
    range: {
      callback: (scale: any, params: any) => {
        return [0, 100];
      },
      dependency: 'signalA'
    },
    padding: 0.05,
    round: true
  };
  scale.parse(spec0 as any);
  const references0 = [] as any[];
  scale.references.forEach((count, reference) => references0.push({ count, reference }));
  expect(scale.references.size).toEqual(1);
  expect(references0[0].count).toEqual(2);
  expect(references0[0].reference.id()).toEqual('signalA');

  const spec1 = {
    id: 'xscale',
    type: 'band',
    domain: { data: 'table', field: 'category' },
    range: {
      callback: (scale: any, params: any) => {
        return [0, params.viewWidth];
      },
      dependency: ['viewWidth']
    },
    padding: 0.05,
    round: true
  };
  scale.parse(spec1 as any);
  const references1 = [] as any[];
  scale.references.forEach((count, reference) => references1.push({ count, reference }));
  expect(scale.references.size).toEqual(2);
  expect(references1[0].count).toEqual(1);
  expect(references1[0].reference.id()).toEqual('table');
  expect(references1[1].count).toEqual(1);
  expect(references1[1].reference.id()).toEqual('viewWidth');
});

test('Scale sets configs by api', function () {
  const scale = new Scale(view as any, 'band');

  scale
    .domain({
      callback: (scale: any, params: any) => {
        return ['A', 'B'];
      },
      dependency: 'signalA'
    })
    .range({
      callback: (scale: any, params: any) => {
        return [0, 100];
      },
      dependency: 'signalA'
    });
  const references0 = [] as any[];
  scale.references.forEach((count, reference) => references0.push({ count, reference }));
  expect(scale.references.size).toEqual(1);
  expect(references0[0].count).toEqual(2);
  expect(references0[0].reference.id()).toEqual('signalA');

  scale.domain({ data: 'table', field: 'category' }).range({
    callback: (scale, params) => {
      return [0, params.viewWidth];
    },
    dependency: 'viewWidth'
  });
  const references1 = [] as any[];
  scale.references.forEach((count, reference) => references1.push({ count, reference }));
  expect(scale.references.size).toEqual(2);
  expect(references1[0].count).toEqual(1);
  expect(references1[0].reference.id()).toEqual('table');
  expect(references1[1].count).toEqual(1);
  expect(references1[1].reference.id()).toEqual('viewWidth');
});

test('set the domain ang range of a band scale by data', function () {
  const dataA = new Data(view as any, [
    { cat: 'A', min: 1, max: 100 },
    { cat: 'C', min: 2, max: 200 }
  ]).id('dataA');
  const scale = new Scale(view as any, 'band')
    .domain({
      data: dataA,
      field: 'cat'
    })
    .range({
      data: dataA,
      field: ['min', 'max']
    });
  expect(scale.output().type).toEqual('band');
  expect(scale.output().domain()).toEqual([]);
  expect(scale.output().range()).toEqual([0, 1]);

  dataA.runSync();
  scale.runSync();
  expect(scale.output().domain()).toEqual(['A', 'C']);
  expect(scale.output().range()).toEqual([1, 2]);
});

test('set the domain ang range of a linear scale by data', function () {
  const dataA = new Data(view as any, [
    { cat: 'A', min: 1, max: 100 },
    { cat: 'C', min: 2, max: 200 }
  ]).id('dataA');
  const scale = new Scale(view as any, 'linear')
    .domain({
      data: dataA,
      field: ['min', 'max']
    })
    .range([1, 100]);
  expect(scale.output().type).toEqual('linear');
  expect(scale.output().domain()).toEqual([0, 1]);
  expect(scale.output().range()).toEqual([0, 1]);

  dataA.runSync();
  scale.runSync();
  expect(scale.output().domain()).toEqual([1, 200]);
  expect(scale.output().range()).toEqual([1, 100]);
});

test('set the domain ang range of a band scale by multi data', function () {
  const dataA = new Data(view as any, [
    { cat: 'A', min: 1, max: 100 },
    { cat: 'C', min: 2, max: 200 }
  ]).id('dataA');
  const dataB = new Data(view as any, [
    { cat: 'E', min: 0, max: 150 },
    { cat: 'F', min: 1, max: 250 }
  ]).id('dataB');
  const scale = new Scale(view as any, 'band').domain({
    datas: [
      {
        data: dataA,
        field: 'cat'
      },
      {
        data: dataB,
        field: 'cat'
      }
    ]
  });
  expect(scale.output().type).toEqual('band');
  expect(scale.output().domain()).toEqual([]);
  expect(scale.output().range()).toEqual([0, 1]);

  dataA.runSync();
  dataB.runSync();
  scale.runSync();
  expect(scale.output().domain()).toEqual(['A', 'C', 'E', 'F']);
});

test('set the domain ang range of a linear scale by multi data', function () {
  const dataA = new Data(view as any, [
    { cat: 'A', min: 1, max: 100 },
    { cat: 'C', min: 2, max: 200 }
  ]).id('dataA');
  const dataB = new Data(view as any, [
    { cat: 'E', min: 0, max: 150 },
    { cat: 'F', min: 1, max: 250 }
  ]).id('dataB');
  const scale = new Scale(view as any, 'linear')
    .domain({
      datas: [
        {
          data: dataA,
          field: ['min', 'max']
        },
        {
          data: dataB,
          field: ['min', 'max']
        }
      ]
    })
    .range([1, 100]);
  expect(scale.output().type).toEqual('linear');
  expect(scale.output().domain()).toEqual([0, 1]);
  expect(scale.output().range()).toEqual([0, 1]);

  dataA.runSync();
  dataB.runSync();
  scale.runSync();
  expect(scale.output().domain()).toEqual([0, 250]);
});

test('identity scale dont set domain', function () {
  const dataA = new Data(view as any, [
    { cat: 'A', min: 1, max: 100 },
    { cat: 'C', min: 2, max: 200 }
  ]).id('dataA');
  const dataB = new Data(view as any, [
    { cat: 'E', min: 0, max: 150 },
    { cat: 'F', min: 1, max: 250 }
  ]).id('dataB');

  const scale = new Scale(view as any, 'identity');
  expect(scale.output().type).toEqual('identity');
  expect(scale.output().domain()).toBeUndefined();
  expect(scale.output().range()).toBeUndefined();

  dataA.runSync();
  dataB.runSync();
  scale.runSync();
  expect(scale.output().scale(1)).toEqual(1);
  expect(scale.output().scale(10)).toEqual(10);
});

test('identity scale has domain', function () {
  const dataA = new Data(view as any, [
    { cat: 'A', min: 1, max: 100 },
    { cat: 'C', min: 2, max: 200 }
  ]).id('dataA');
  const dataB = new Data(view as any, [
    { cat: 'E', min: 0, max: 150 },
    { cat: 'F', min: 1, max: 250 }
  ]).id('dataB');

  const scale = new Scale(view as any, 'identity')
    .domain({
      datas: [
        {
          data: dataA,
          field: ['min', 'max']
        },
        {
          data: dataB,
          field: ['min', 'max']
        }
      ]
    })
    .configure({ unknown: 'test' });
  expect(scale.output().type).toBe('identity');
  expect(scale.output().domain()).toBeUndefined();
  expect(scale.output().range()).toBeUndefined();

  dataA.runSync();
  dataB.runSync();
  scale.runSync();
  expect(scale.output().domain()).toEqual([1, 2, 100, 200, 0, 1, 150, 250]);
  expect(scale.output().range()).toEqual([1, 2, 100, 200, 0, 1, 150, 250]);
  expect(scale.output().scale(1)).toBe(1);
  expect(scale.output().scale(10)).toBe('test');
});
