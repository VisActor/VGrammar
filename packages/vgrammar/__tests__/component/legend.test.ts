import { registerCrosshair, Crosshair } from '../../src/component/crosshair';
import { Scale } from '../../src/view/scale';
import { emptyFunction, getMockedView } from '../util';

registerCrosshair();
test('crosshair', function () {
  const view = getMockedView() as any;
  const scale = new Scale(view, 'point').domain(['A', 'B', 'C']).range([0, 270]).configure({
    padding: 0.5
  });
  const crosshair = new Crosshair(view).scale(scale).encode({ x: 340, y: 160 });
  (crosshair as any).graphicParent = { appendChild: emptyFunction };
  (crosshair as any).evaluateJoin();
  (crosshair as any).evaluateEncode(crosshair.elements, (crosshair as any)._getEncoders(), {});

  expect(crosshair.elements.length).toBe(1);
  expect(crosshair.elements[0].getGraphicItem().attribute).toEqual({
    end: {
      x: 0,
      y: 0
    },
    lineStyle: {
      lineDash: [2],
      lineWidth: 1,
      stroke: '#b2bacf'
    },
    start: {
      x: 0,
      y: 0
    }
  });
});
