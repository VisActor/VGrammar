import type { IPointLike } from '@visactor/vutils';
import type { IPolarPointLike } from '../src/interface';
import { PolarCoordinate } from '../src/polar';

function roundPoint(point: IPointLike): IPointLike {
  return {
    x: Math.round(point.x),
    y: Math.round(point.y)
  };
}

function roundDegreePolarPoint(point: IPolarPointLike): IPolarPointLike {
  return {
    r: Math.round(point.r),
    theta: Math.round((point.theta / Math.PI) * 180)
  };
}

test('PolarCoordinate() has the expected defaults', function () {
  const coord = new PolarCoordinate();
  expect(coord.type).toEqual('polar');
  expect(coord.start()).toEqual({ x: 0, y: 0 });
  expect(coord.end()).toEqual({ x: 0, y: 0 });
  expect(coord.origin()).toEqual({ x: 0, y: 0 });
});

test('PolarCoordinate config functions return start point of coordinate', function () {
  const coord = new PolarCoordinate();
  expect(coord.start([100, 200]).start()).toEqual({ x: 100, y: 200 });
  expect(coord.start(50, 50).start()).toEqual({ x: 50, y: 50 });
  expect(coord.start({ x: 200, y: 100 }).start()).toEqual({ x: 200, y: 100 });

  expect(coord.end([100, 200]).end()).toEqual({ x: 100, y: 200 });
  expect(coord.end(50, 50).end()).toEqual({ x: 50, y: 50 });
  expect(coord.end({ x: 200, y: 100 }).end()).toEqual({ x: 200, y: 100 });

  expect(coord.origin([100, 200]).origin()).toEqual({ x: 100, y: 200 });
  expect(coord.origin(50, 50).origin()).toEqual({ x: 50, y: 50 });
  expect(coord.origin({ x: 200, y: 100 }).origin()).toEqual({ x: 200, y: 100 });
});

test('PolarCoordinate.angle&radius return correct config of coordinate', function () {
  const coord = new PolarCoordinate();

  expect(coord.angle(0, Math.PI).angle()).toEqual([0, Math.PI]);
  expect(coord.angle([0, Math.PI / 2]).angle()).toEqual([0, Math.PI / 2]);

  expect(coord.radius(0, 80).radius()).toEqual([0, 80]);
  expect(coord.radius([20, 40]).radius()).toEqual([20, 40]);
});

test('PolarCoordinate.convert() transforms point to canvas coordinate', function () {
  const coord = new PolarCoordinate().origin([100, 100]);
  expect(roundPoint(coord.convert({ r: 20, theta: 0 }))).toEqual({ x: 120, y: 100 });
  expect(roundPoint(coord.convert({ r: 40, theta: Math.PI / 2 }))).toEqual({ x: 100, y: 140 });
  expect(roundPoint(coord.convert({ r: 60, theta: Math.PI }))).toEqual({ x: 40, y: 100 });
  expect(roundPoint(coord.convert({ r: 0, theta: (3 * Math.PI) / 2 }))).toEqual({ x: 100, y: 100 });
});

test('PolarCoordinate.invert() transforms point from canvas coordinate', function () {
  const coord = new PolarCoordinate().origin([100, 100]);
  expect(roundDegreePolarPoint(coord.invert({ x: 120, y: 100 }))).toEqual({ r: 20, theta: 0 });
  expect(roundDegreePolarPoint(coord.invert({ x: 100, y: 140 }))).toEqual({ r: 40, theta: 90 });
  expect(roundDegreePolarPoint(coord.invert({ x: 40, y: 100 }))).toEqual({ r: 60, theta: 180 });
  expect(roundDegreePolarPoint(coord.invert({ x: 100, y: 20 }))).toEqual({ r: 80, theta: 270 });
  expect(roundDegreePolarPoint(coord.invert({ x: 100, y: 100 }))).toEqual({ r: 0, theta: 0 });
});

test('PolarCoordinate.applyTransform() applies additional transform', function () {
  const coord = new PolarCoordinate().origin([100, 100]);
  // translate
  coord.applyTransforms([{ type: 'translate', offset: { x: 10, y: 20 } }]);
  expect(roundPoint(coord.convert({ r: 20, theta: Math.PI / 2 }))).toEqual({ x: 110, y: 140 });
  expect(roundDegreePolarPoint(coord.invert({ x: 110, y: 140 }))).toEqual({ r: 20, theta: 90 });

  // rotate
  coord.applyTransforms([{ type: 'rotate', angle: Math.PI / 2 }]);
  expect(roundPoint(coord.convert({ r: 20, theta: Math.PI / 2 }))).toEqual({ x: 80, y: 100 });
  expect(roundDegreePolarPoint(coord.invert({ x: 80, y: 100 }))).toEqual({ r: 20, theta: 90 });

  // scale
  coord.applyTransforms([{ type: 'scale', scale: { x: 0.5, y: 2 } }]);
  expect(roundPoint(coord.convert({ r: 20, theta: Math.PI / 2 }))).toEqual({ x: 100, y: 140 });
  expect(roundDegreePolarPoint(coord.invert({ x: 100, y: 140 }))).toEqual({ r: 20, theta: 90 });

  // // transpose
  coord.applyTransforms([{ type: 'transpose' }]);
  expect(roundPoint(coord.convert({ r: Math.PI / 2, theta: 20 }))).toEqual({ x: 100, y: 120 });

  const invertPoint = coord.invert({ x: 100, y: 120 });
  expect(invertPoint.r).toBeCloseTo(Math.PI / 2);
  expect(invertPoint.theta).toBeCloseTo(20);
});

test('PolarCoordinate getRangeByDimension', function () {
  const coord = new PolarCoordinate().origin([100, 100]).radius(0, 80);

  expect(coord.getRangeByDimension('theta')).toEqual([0, Math.PI * 2]);
  expect(coord.getRangeByDimension('r')).toEqual([0, 80]);

  expect(coord.getRangeByDimension('theta', false, true)).toEqual([Math.PI * 2, 0]);

  // transpose
  coord.applyTransforms([{ type: 'transpose' }]);
  expect(coord.getRangeByDimension('theta')).toEqual([0, 80]);
  expect(coord.getRangeByDimension('r')).toEqual([0, Math.PI * 2]);
});

test('PolarCoordinate getVisualPositionByDimension', function () {
  const coord = new PolarCoordinate().origin([100, 100]).radius(0, 80);
  expect(coord.getVisualPositionByDimension('theta')).toEqual('outside');
  expect(coord.getVisualPositionByDimension('r')).toEqual('start');

  // transpose
  coord.applyTransforms([{ type: 'transpose' }]);
  expect(coord.getVisualPositionByDimension('theta')).toEqual('start');
  expect(coord.getVisualPositionByDimension('r')).toEqual('outside');
});

test('PolarCoordinate getAxisPointsByDimension', function () {
  const coord = new PolarCoordinate().origin([100, 100]).radius(0, 80);

  expect(coord.getAxisPointsByDimension('theta')).toEqual(null);
  expect(coord.getAxisPointsByDimension('r')).toEqual([
    { x: 100, y: 100 },
    { x: 180, y: 100 }
  ]);

  expect(coord.getAxisPointsByDimension('r', false, true)).toEqual([
    { x: 180, y: 100 },
    { x: 100, y: 100 }
  ]);

  // transpose
  coord.applyTransforms([{ type: 'transpose' }]);
  expect(coord.getAxisPointsByDimension('theta')).toEqual([
    { x: 100, y: 100 },
    { x: 180, y: 100 }
  ]);
  expect(coord.getAxisPointsByDimension('r')).toEqual(null);
});
