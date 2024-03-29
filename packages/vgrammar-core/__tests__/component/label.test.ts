import { registerLabel, Label } from '../../src/component/label';
import { emptyFunction, getMockedView } from '../util';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

registerLabel();
test('label', function () {
  const view = getMockedView() as any;
  const label = new Label(view).labelStyle({
    textStyle: {
      fillColor: '#666'
    }
  } as any);
  (label as any).graphicParent = { appendChild: emptyFunction };
  (label as any).evaluateJoin();
  (label as any).evaluateEncode(label.elements, (label as any)._getEncoders(), {});

  expect(label.elements.length).toBe(1);
  expect(label.elements[0].getGraphicItem().attribute).toEqual({
    dataLabels: [],
    pickable: false,
    size: {
      height: Infinity,
      width: Infinity
    }
  });
});
