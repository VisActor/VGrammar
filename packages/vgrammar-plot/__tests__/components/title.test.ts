import type { IComponent, IMark } from '@visactor/vgrammar-core';
import '../util';
import { Plot } from '../../src';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

test('add a title component by api', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .interval()
    .data([
      { x: 'A', y: 1 },
      { x: 'B', y: 2 }
    ])
    .encode('x', 'x')
    .encode('y', 'y')
    .title({ text: 'this is a title' });

  plot.run();

  const marks = plot.view.getGrammarsByType('mark');

  expect(marks.map(mark => (mark as IMark).markType)).toEqual([
    'group',
    'group',
    'component',
    'component',
    'rect',
    'component',
    'component'
  ]);
  expect(
    marks.filter(mark => (mark as IMark).markType === 'component').map(mark => (mark as IComponent).componentType)
  ).toEqual(['crosshair', 'title', 'tooltip', 'dimensionTooltip']);

  const titleComponent = marks[3];

  expect(titleComponent.getSpec().title).toEqual('this is a title');
});

test('add a title component by spec', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot.parseSpec({
    marks: [
      {
        type: 'area',
        data: {
          values: [
            { x: 'A', y: 1, group: 'a' },
            { x: 'B', y: 2, group: 'a' },
            { x: 'A', y: 1, group: 'b' },
            { x: 'B', y: 2, group: 'b' }
          ]
        },
        encode: { x: 'x', y: 'y', group: 'group' },
        title: {
          text: 'this is a title',
          subtext: 'this is a subtext'
        }
      }
    ]
  });

  plot.run();

  const marks = plot.view.getGrammarsByType('mark');

  expect(marks.map(mark => (mark as IMark).markType)).toEqual([
    'group',
    'group',
    'component',
    'component',
    'area',
    'component'
  ]);
  expect(
    marks.filter(mark => (mark as IMark).markType === 'component').map(mark => (mark as IComponent).componentType)
  ).toEqual(['crosshair', 'title', 'dimensionTooltip']);

  const titleComponent = marks[3];

  expect(titleComponent.getSpec().title).toEqual('this is a title');
  expect(titleComponent.getSpec().subTitle).toEqual('this is a subtext');
});
