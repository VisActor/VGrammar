import { parseViewBox } from '../src/view-box';

test('parseViewBox', function () {
  expect(parseViewBox({ width: 100, height: 100 })).toEqual({
    x0: 0,
    y0: 0,
    x1: 100,
    y1: 100,
    width: 100,
    height: 100
  });

  expect(parseViewBox({ x0: 10, y0: 10, x1: 100, y1: 100 })).toEqual({
    x0: 10,
    y0: 10,
    x1: 100,
    y1: 100,
    width: 90,
    height: 90
  });
});
