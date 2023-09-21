import { Tooltip, registerTooltip } from '../../src/component/tooltip';
import { emptyFunction, getMockedView } from '../util';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

registerTooltip();
test('tooltip', function () {
  const view = getMockedView() as any;
  const tooltip = new Tooltip(view)
    .title({ value: 'Sales Statistics On Category' })
    .encode({ offsetX: 10, offsetY: 10 })
    .content([
      {
        key: 'category',
        value: { field: 'category' },
        symbol: { fill: 'lightGreen' }
      },
      {
        key: { text: 'amount' },
        value: datum => datum.amount,
        symbol: { fill: 'lightGreen', symbolType: 'square' }
      }
    ]);
  (tooltip as any).graphicParent = { appendChild: emptyFunction };
  (tooltip as any).evaluateJoin();
  (tooltip as any).evaluateEncode(tooltip.elements, (tooltip as any)._getEncoders(), {});

  expect(tooltip.elements.length).toBe(1);
  expect(tooltip.elements[0].getGraphicItem().attribute).toEqual({
    autoCalculatePosition: true,
    autoMeasure: true,
    childrenPickable: false,
    contentStyle: {
      key: {
        fill: '#4E5969',
        fontFamily:
          // eslint-disable-next-line max-len
          'PingFang SC,Microsoft Yahei,system-ui,-apple-system,segoe ui,Roboto,Helvetica,Arial,sans-serif, apple color emoji,segoe ui emoji,segoe ui symbol',
        fontSize: 12,
        lineHeight: 18,
        spacing: 26,
        textAlign: 'left',
        textBaseline: 'middle'
      },
      shape: {
        fill: 'black',
        size: 8,
        spacing: 6,
        symbolType: 'circle'
      },
      spaceRow: 6,
      value: {
        fill: '#4E5969',
        fontFamily:
          // eslint-disable-next-line max-len
          'PingFang SC,Microsoft Yahei,system-ui,-apple-system,segoe ui,Roboto,Helvetica,Arial,sans-serif, apple color emoji,segoe ui emoji,segoe ui symbol',
        fontSize: 12,
        lineHeight: 18,
        spacing: 0,
        textAlign: 'right',
        textBaseline: 'middle'
      }
    },
    offsetX: 10,
    offsetY: 10,
    padding: 10,
    panel: {
      cornerRadius: [3, 3, 3, 3],
      fill: 'white',
      shadow: true,
      shadowBlur: 12,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      shadowSpread: 0,
      stroke: 'white',
      visible: true
    },
    parentBounds: {
      x1: -Infinity,
      x2: Infinity,
      y1: -Infinity,
      y2: Infinity
    },
    pickable: false,
    positionX: 'right',
    positionY: 'bottom',
    titleStyle: {
      spaceRow: 6,
      value: {
        fill: '#4E5969',
        fontFamily:
          // eslint-disable-next-line max-len
          'PingFang SC,Microsoft Yahei,system-ui,-apple-system,segoe ui,Roboto,Helvetica,Arial,sans-serif, apple color emoji,segoe ui emoji,segoe ui symbol',
        fontSize: 14,
        lineHeight: 18,
        textAlign: 'left',
        textBaseline: 'middle'
      }
    },
    visible: false,
    zIndex: 500
  });
});
