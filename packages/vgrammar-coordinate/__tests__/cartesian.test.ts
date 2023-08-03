import type { IPointLike } from '@visactor/vutils';
import { CartesianCoordinate } from '../src/cartesian';

function roundPoint(point: IPointLike): IPointLike {
  return {
    x: Math.round(point.x),
    y: Math.round(point.y)
  };
}

test('CartesianCoordinate() has the expected defaults', function () {
  const coord = new CartesianCoordinate();
  expect(coord.type).toEqual('cartesian');
  expect(coord.start()).toEqual({ x: 0, y: 0 });
  expect(coord.end()).toEqual({ x: 0, y: 0 });
});

test('CartesianCoordinate config functions return start point of coordinate', function () {
  const coord = new CartesianCoordinate();
  expect(coord.start([100, 200]).start()).toEqual({ x: 100, y: 200 });
  expect(coord.start(50, 50).start()).toEqual({ x: 50, y: 50 });
  expect(coord.start({ x: 200, y: 100 }).start()).toEqual({ x: 200, y: 100 });

  expect(coord.end([100, 200]).end()).toEqual({ x: 100, y: 200 });
  expect(coord.end(50, 50).end()).toEqual({ x: 50, y: 50 });
  expect(coord.end({ x: 200, y: 100 }).end()).toEqual({ x: 200, y: 100 });
});

test('CartesianCoordinate.convert() transforms point to canvas coordinate', function () {
  const coord = new CartesianCoordinate().applyTransforms([{ type: 'translate', offset: { x: 100, y: 100 } }]);
  expect(coord.convert({ x: 100, y: 140 })).toEqual({ x: 200, y: 240 });
  expect(coord.convert({ x: 50, y: 50 })).toEqual({ x: 150, y: 150 });
});

test('CartesianCoordinate.invert() transforms point from canvas coordinate', function () {
  const coord = new CartesianCoordinate().applyTransforms([{ type: 'translate', offset: { x: 100, y: 100 } }]);
  expect(coord.invert({ x: 200, y: 240 })).toEqual({ x: 100, y: 140 });
  expect(coord.invert({ x: 150, y: 150 })).toEqual({ x: 50, y: 50 });
});

test('CartesianCoordinate.applyTransform() applies additional transform', function () {
  const coord = new CartesianCoordinate();
  // translate
  coord.applyTransforms([{ type: 'translate', offset: { x: 10, y: 20 } }]);
  expect(coord.convert({ x: 100, y: 140 })).toEqual({ x: 110, y: 160 });
  expect(coord.invert({ x: 110, y: 160 })).toEqual({ x: 100, y: 140 });

  // rotate
  coord.applyTransforms([
    { type: 'translate', offset: { x: 100, y: 100 } },
    { type: 'rotate', angle: Math.PI / 2 }
  ]);
  expect(roundPoint(coord.convert({ x: 110, y: 140 }))).toEqual({ x: -240, y: 210 });
  expect(roundPoint(coord.invert({ x: -40, y: 210 }))).toEqual({ x: 110, y: -60 });

  // scale
  coord.applyTransforms([
    {
      type: 'translate',
      offset: { x: 100, y: 100 }
    },
    { type: 'scale', scale: { x: 0.5, y: 2 } }
  ]);
  expect(coord.convert({ x: 110, y: 140 })).toEqual({ x: 155, y: 380 });
  expect(coord.invert({ x: 155, y: 380 })).toEqual({ x: 110, y: 140 });

  // transpose
  coord.applyTransforms([
    {
      type: 'translate',
      offset: { x: 100, y: 100 }
    },
    { type: 'transpose' }
  ]);
  expect(coord.convert({ x: 110, y: 140 })).toEqual({ x: 240, y: 210 });
  expect(coord.invert({ x: 240, y: 210 })).toEqual({ x: 110, y: 140 });
});

test('CartesianCoordinate.getRangeByDimension() return the range by dimension', function () {
  const coord = new CartesianCoordinate().start([40, 500]).end([400, 30]);

  expect(coord.getRangeByDimension('x')).toEqual([40, 400]);
  expect(coord.getRangeByDimension('y')).toEqual([30, 500]);

  expect(coord.getRangeByDimension('x', false, true)).toEqual([400, 40]);

  // transpose
  coord.applyTransforms([{ type: 'transpose' }]);
  expect(coord.getRangeByDimension('x')).toEqual([30, 500]);
  expect(coord.getRangeByDimension('y')).toEqual([40, 400]);
});

test('CartesianCoordinate.getVisualPositionByDimension() return the correct visual position', function () {
  const coord = new CartesianCoordinate().start([40, 500]).end([400, 30]);
  expect(coord.getVisualPositionByDimension('x')).toEqual('bottom');
  expect(coord.getVisualPositionByDimension('y')).toEqual('left');

  // transpose
  coord.applyTransforms([{ type: 'transpose' }]);
  expect(coord.getVisualPositionByDimension('x')).toEqual('left');
  expect(coord.getVisualPositionByDimension('y')).toEqual('bottom');
});

test('CartesianCoordinate.getAxisPointsByDimension() return the axis points', function () {
  const coord = new CartesianCoordinate().start([40, 500]).end([400, 30]);

  expect(coord.getAxisPointsByDimension('x')).toEqual([
    { x: 40, y: 30 },
    { x: 400, y: 30 }
  ]);
  expect(coord.getAxisPointsByDimension('y')).toEqual([
    { x: 40, y: 30 },
    { x: 40, y: 500 }
  ]);
  expect(coord.getAxisPointsByDimension('x', false, true, 100)).toEqual([
    { x: 400, y: 100 },
    { x: 40, y: 100 }
  ]);

  // transpose
  coord.applyTransforms([{ type: 'transpose' }]);
  expect(coord.getAxisPointsByDimension('x')).toEqual([
    { x: 40, y: 30 },
    { x: 40, y: 500 }
  ]);
  expect(coord.getAxisPointsByDimension('y')).toEqual([
    { x: 40, y: 30 },
    { x: 400, y: 30 }
  ]);
});
