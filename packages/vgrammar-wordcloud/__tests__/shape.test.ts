import { getShapeFunction, getMaxRadiusAndCenter } from '../src/shapes';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

test('getShapeFunction("triangle")', () => {
  const triangle = getShapeFunction('triangle');
  expect(triangle(Math.PI)).toBeCloseTo(0.577350269189626);
});

test('getShapeFunction("star")', () => {
  const star = getShapeFunction('star');
  expect(star(Math.PI)).toBeCloseTo(0.5168638546814986);
  expect(star(Math.PI / 2)).toBeCloseTo(0.9629644567045876);
});

test('getShapeFunction("cirlce")', () => {
  const circle = getShapeFunction('cirlce');
  expect(circle(Math.PI)).toBeCloseTo(1);
  expect(circle(Math.PI / 2)).toBeCloseTo(1);
});

test('getShapeFunction("square")', () => {
  const square = getShapeFunction('square');
  expect(square(Math.PI / 3)).toBeCloseTo(1.1547005383792517);
  expect(square((2 * Math.PI) / 3)).toBeCloseTo(1.1547005383792517);
});

test('getShapeFunction("pentagon")', () => {
  const shape = getShapeFunction('pentagon');
  expect(shape(Math.PI / 3)).toBeCloseTo(0.814609049583809);
  expect(shape((2 * Math.PI) / 3)).toBeCloseTo(0.8124675353306353);
});

test('getShapeFunction("cardioid")', () => {
  const shape = getShapeFunction('cardioid');
  expect(shape(Math.PI / 3)).toBeCloseTo(0.1339745962155614);
  expect(shape((2 * Math.PI) / 3)).toBeCloseTo(0.1339745962155614);

  expect(shape(Math.PI / 2)).toBeCloseTo(0);
  expect(shape(Math.PI)).toBeCloseTo(0.9999999999999999);
});

test('getShapeFunction("diamond")', () => {
  const shape = getShapeFunction('diamond');
  expect(shape(Math.PI / 3)).toBeCloseTo(0.7320508075688772);
  expect(shape((2 * Math.PI) / 3)).toBeCloseTo(0.7320508075688772);

  expect(shape(Math.PI / 2)).toBeCloseTo(1);
  expect(shape(Math.PI)).toBeCloseTo(1);
});

test('getMaxRadiusAndCenter() of cardioid', () => {
  const res = getMaxRadiusAndCenter('cardioid', [400, 400]);
  expect(res.maxRadius).toBeCloseTo(153);
  expect(res.center[0]).toBeCloseTo(200);
  expect(res.center[1]).toBeCloseTo(88);
});

test('getMaxRadiusAndCenter() of triangleForward', () => {
  const res = getMaxRadiusAndCenter('triangleForward', [400, 400]);
  expect(res.maxRadius).toBeCloseTo(200);
  expect(res.center[0]).toBeCloseTo(200);
  expect(res.center[1]).toBeCloseTo(200);
});

test('getMaxRadiusAndCenter() of triangleUpright', () => {
  const res = getMaxRadiusAndCenter('triangleUpright', [400, 400]);
  expect(res.maxRadius).toBeCloseTo(200);
  expect(res.center[0]).toBeCloseTo(200);
  expect(res.center[1]).toBeCloseTo(266);
});

test('getMaxRadiusAndCenter() of others', () => {
  const res = getMaxRadiusAndCenter('circle', [400, 400]);
  expect(res.maxRadius).toBeCloseTo(200);
  expect(res.center[0]).toBeCloseTo(200);
  expect(res.center[1]).toBeCloseTo(200);
});
