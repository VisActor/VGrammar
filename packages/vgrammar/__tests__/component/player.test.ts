import { Player } from '../../src/component/player';
import { emptyFunction, getMockedView } from '../util';

test('player', function () {
  const view = getMockedView() as any;
  const player = new Player(view).encode({
    x: 40,
    y: 340,
    size: { width: 300, height: 30 }
  });
  (player as any).graphicParent = { appendChild: emptyFunction };
  (player as any).evaluateJoin();
  (player as any).evaluateEncode(player.elements, (player as any)._getEncoders(), {});

  expect(player.elements.length).toBe(1);
  expect(player.elements[0].getGraphicItem().attribute).toEqual({
    align: 'center',
    controller: {
      backward: {
        key: 'backward',
        order: 0,
        position: 'start',
        space: 10,
        style: {
          dx: 0,
          dy: 0,
          size: 20,
          x: 0,
          y: 0
        },
        visible: true
      },
      forward: {
        key: 'forward',
        order: 0,
        position: 'end',
        space: 10,
        style: {
          dx: 0,
          dy: 0,
          size: 20,
          x: 0,
          y: 0
        },
        visible: true
      },
      pause: {
        key: 'pause',
        order: 0,
        position: 'start',
        space: 10,
        style: {
          dx: 0,
          dy: 0,
          size: 20,
          x: 0,
          y: 0
        },
        visible: true
      },
      start: {
        key: 'start',
        order: 0,
        position: 'start',
        space: 0,
        style: {
          dx: 0,
          dy: 0,
          size: 20,
          x: 0,
          y: 0
        },
        visible: true
      },
      visible: true
    },
    data: [],
    dataIndex: 0,
    interval: 1000,
    orient: 'bottom',
    size: {
      height: 30,
      width: 300
    },
    slider: {
      dx: 0,
      dy: 0,
      handlerStyle: {
        size: 16
      },
      railStyle: {
        cornerRadius: 5
      },
      space: 10,
      trackStyle: {},
      visible: true
    },
    visible: true,
    x: 40,
    y: 340
  });
});
