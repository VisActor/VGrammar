import type { IPolarCoordinate } from '@visactor/vgrammar-coordinate';
import { Coordinate } from '../../src/view/coordinate';
import { getMockedView } from '../util';

const view = getMockedView();

test('Coordinate maintains coordinate structure', function () {
  const coordinate = new Coordinate(view as any, 'polar');

  coordinate
    .start([0, 0])
    .end(() => [400, 400])
    .origin({ callback: () => [200, 200], dependency: 'signalA' })
    .scale([0.5, 0.5])
    // .translate([100, 50])
    .rotate({ callback: () => Math.PI, dependency: 'signalB' })
    .transpose(true);

  const polarCoor = coordinate.output() as IPolarCoordinate;
  expect(polarCoor.type).toEqual('polar');
  expect(polarCoor.origin()).toEqual({ x: 0, y: 0 });
  expect((polarCoor as any).transforms.length).toEqual(0);
  coordinate.run();
  expect(polarCoor.origin()).toEqual({ x: 200, y: 200 });
  expect((polarCoor as any).transforms.length).toEqual(3);
});

test('Coordinate parse spec and collect dependencies', function () {
  const coordinate = new Coordinate(view as any, 'polar');

  const spec0 = {
    start: [0, 0],
    end: [400, 400],
    origin: { callback: () => [200, 200], dependency: 'signalA' }
  };
  coordinate.parse(spec0 as any);
  const references0 = [] as any[];
  coordinate.references.forEach((count, reference) => references0.push({ count, reference }));
  expect(coordinate.references.size).toEqual(1);
  expect(references0[0].count).toEqual(1);
  expect(references0[0].reference.id()).toEqual('signalA');

  const spec1 = {
    start: [0, 0],
    end: [400, 400],
    origin: [200, 200],

    translate: [0, 0],
    rotate: Math.PI,
    scale: [1, 1],
    transpose: true
  };
  coordinate.parse(spec1 as any);
  expect(coordinate.references.size).toEqual(0);
});

test('Coordinate sets configs by api', function () {
  const coordinate = new Coordinate(view as any, 'polar');

  coordinate
    .start([0, 0])
    .end(() => [400, 400])
    .origin({ callback: () => [200, 200], dependency: 'signalA' })
    .scale([0.5, 0.5])
    .translate([100, 50])
    .rotate({ callback: () => Math.PI, dependency: 'signalB' })
    .transpose(true);
  const references0 = [] as any[];
  coordinate.references.forEach((count, reference) => references0.push({ count, reference }));
  expect(coordinate.references.size).toEqual(2);
  expect(references0[0].count).toEqual(1);
  expect(references0[0].reference.id()).toEqual('signalA');
  expect(references0[1].count).toEqual(1);
  expect(references0[1].reference.id()).toEqual('signalB');

  coordinate.start([0, 0]).end([400, 400]).origin([200, 200]).scale([0.5, 0.5]).rotate(undefined).transpose(false);
  expect(coordinate.references.size).toEqual(0);
});
