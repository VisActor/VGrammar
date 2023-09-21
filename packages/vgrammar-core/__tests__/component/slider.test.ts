import { registerSlider, Slider } from '../../src/component/slider';
import { emptyFunction, getMockedView } from '../util';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

registerSlider();
test('slider', function () {
  const view = getMockedView() as any;
  const slider = new Slider(view).min(0).max(100).encode({
    layout: 'vertical',
    railWidth: 10,
    railHeight: 100,
    x: 350,
    y: 200
  });
  (slider as any).graphicParent = { appendChild: emptyFunction };
  (slider as any).evaluateJoin();
  (slider as any).evaluateEncode(slider.elements, (slider as any)._getEncoders(), {});

  expect(slider.elements.length).toBe(1);
  expect(slider.elements[0].getGraphicItem().attribute).toEqual({
    align: 'bottom',
    endText: {
      space: 8,
      style: {
        fill: '#2C3542',
        fontSize: 12
      },
      text: '',
      visible: true
    },
    handlerSize: 14,
    handlerStyle: {
      fill: '#fff',
      lineWidth: 2,
      stroke: '#91caff',
      symbolType: 'circle'
    },
    handlerText: {
      precision: 0,
      space: 4,
      style: {
        fill: '#2C3542',
        fontSize: 12
      },
      visible: true
    },
    height: 8,
    layout: 'vertical',
    max: 100,
    min: 0,
    railHeight: 100,
    railStyle: {
      cornerRadius: 5,
      fill: 'rgba(0,0,0,.04)'
    },
    railWidth: 10,
    range: {
      draggableTrack: true
    },
    showHandler: true,
    showValue: true,
    slidable: true,
    startText: {
      space: 8,
      style: {
        fill: '#2C3542',
        fontSize: 12
      },
      text: '',
      visible: true
    },
    trackStyle: {
      fill: '#91caff'
    },
    value: [0, 100],
    valueStyle: {
      fill: '#2C3542',
      fontSize: 12
    },
    x: 350,
    y: 200
  });
});
