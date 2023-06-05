import { Scale } from '../../src/view/scale';
import { getMockedView } from '../util';

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
