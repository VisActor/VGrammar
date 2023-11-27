import { Mark } from '../../src/view/mark';
import { isNil } from '@visactor/vutils';
import { createSimpleElement, getMockedView, registerDefaultGraphics, registerDefaultTransforms } from '../util';
import { DiffState } from '../../src';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

registerDefaultTransforms();
registerDefaultGraphics();

const view = getMockedView();

test('Mark parse spec and collect dependencies', function () {
  const mark = new Mark(view as any, 'rect');

  const spec0 = {
    type: 'rect',
    id: 'bar',
    from: { data: 'table' },
    animationState: { signal: 'animationState' },
    animation: {
      enter: {
        type: 'growHeightIn',
        options: { orient: 'negative' },
        duration: 1000
      }
    },
    encode: {
      enter: {
        lineWidth: 2,
        stroke: 'black'
      },
      update: {
        x: { scale: 'xscale', field: 'category' },
        width: 40,
        y: { scale: 'yscale', field: 'amount' },
        y1: { signal: 'viewHeight' },
        fill: 'lightgreen'
      },
      hover: {
        fill: 'red',
        width: 60
      }
    },
    transform: [
      {
        type: 'markoverlap',
        direction: 1,
        delta: 50,
        deltaMul: 1,
        groupBy: 'c',
        params: {
          max: 1
        }
      },
      {
        type: 'sampling'
      }
    ]
  };
  mark.parse(spec0 as any);
  const references0 = [] as any[];
  mark.references.forEach((count, reference) => references0.push({ count, reference }));
  expect(mark.grammarSource.id()).toEqual('table');
  expect(mark.references.size).toEqual(5);
  expect(references0[0].count).toEqual(1);
  expect(references0[0].reference.id()).toEqual('table');
  expect(mark.transforms[0].type).toEqual('markoverlap');
  expect(mark.transforms[1].type).toEqual('sampling');

  const spec1 = {
    type: 'rect',
    id: 'bar',
    encode: {
      update: {
        x: { scale: 'xscale', field: 'category' },
        width: 40,
        y: { scale: 'yscale', field: 'amount' },
        y1: { signal: 'viewHeight' },
        fill: 'lightgreen'
      }
    }
  };
  mark.parse(spec1 as any);
  const references1 = [] as any[];
  mark.references.forEach((count, reference) => references1.push({ count, reference }));
  expect(isNil(mark.grammarSource)).toEqual(true);
  expect(mark.references.size).toEqual(3);
  expect(mark.transforms.length).toEqual(0);
});

test('Mark sets configs by api', function () {
  const mark = new Mark(view as any, 'rect');

  mark
    .join('table')
    .encode({
      x: { scale: 'xScale', field: 'category' },
      width: 40,
      y: { scale: 'yScale', field: 'amount' },
      y1: { signal: 'viewHeight' },
      fill: 'lightgreen'
    })
    .encodeState('hover', { fill: 'red', width: 60 })
    .animation({
      enter: {
        type: 'growHeightIn',
        options: { orient: 'negative' },
        duration: 1000
      }
    })
    .animationState({ signal: 'animationSignal' })
    .transform([
      {
        type: 'markoverlap',
        direction: 1,
        delta: 50,
        deltaMul: 1,
        groupBy: 'c',
        params: {
          max: 1
        }
      } as any
    ]);
  const references0 = [] as any[];
  mark.references.forEach((count, reference) => references0.push({ count, reference }));
  expect(mark.grammarSource.id()).toEqual('table');
  expect(mark.references.size).toEqual(5);
  expect(references0[0].count).toEqual(1);
  expect(references0[0].reference.id()).toEqual('table');
  expect(mark.transforms[0].type).toEqual('markoverlap');
});

test('Mark encode state', function () {
  let enterCount = 0;

  const mark = new Mark(view as any, 'rect');

  mark
    .join('table')
    .encode({ fill: 'green' })
    .encodeState('enter', {
      fill: () => {
        enterCount += 1;
        return 'blue';
      }
    })
    .encodeState('hover', { fill: () => 'red' });

  const element = createSimpleElement();
  element.updateData('key', [{ key: 0 }], 'key', {} as any);
  element.initGraphicItem();

  // enter
  const encoders = (mark as any)._getEncoders();
  (mark as any).evaluateEncode([element], encoders, {});
  expect(element.getGraphicAttribute('fill')).toEqual('green');
  expect(enterCount).toBe(1);

  // update
  element.diffState = DiffState.update;
  (mark as any).evaluateEncode([element], encoders, {});
  expect(element.getGraphicAttribute('fill')).toEqual('green');
  expect(enterCount).toBe(1);

  // reenter
  mark.encodeState('enter', {
    fill: () => {
      enterCount += 1;
      return 'blue';
    }
  });
  (mark as any).evaluateEncode([element], encoders, {});
  expect(element.getGraphicAttribute('fill')).toEqual('green');
  expect(enterCount).toBe(2);
});
