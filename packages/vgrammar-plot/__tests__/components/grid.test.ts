import type { IComponent, IMark } from '@visactor/vgrammar';
import '../util';
import { Plot } from '../../src';

test('add a grid component by api', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .line()
    .data([
      { x: 'A', y: 1 },
      { x: 'B', y: 2 }
    ])
    .encode('x', 'x')
    .encode('y', 'y')
    .grid('x', true)
    .grid('y', { tickCount: 5 });

  plot.run();

  const marks = plot.view.getGrammarsByType('mark');

  expect(marks.map(mark => (mark as IMark).markType)).toEqual([
    'group',
    'group',
    'component',
    'component',
    'component',
    'line',
    'component'
  ]);
  expect(
    marks.filter(mark => (mark as IMark).markType === 'component').map(mark => (mark as IComponent).componentType)
  ).toEqual(['grid', 'grid', 'crosshair', 'dimensionTooltip']);

  const gridXComponent = marks[2];
  const gridXSpec = gridXComponent.getSpec();
  expect(gridXSpec.gridShape).toEqual('line');
  expect(gridXSpec.gridType).toEqual('line');
  expect(gridXSpec.scale).toEqual('scale-x');
  const gridX = (gridXComponent as IMark).getGroupGraphicItem();
  expect(gridX.children[0].children.length).toEqual(2);
  expect(gridX.children[0].children[0].attribute).toEqual({
    lineDash: [4, 4],
    lineWidth: 1,
    path: 'M0,0L0,-590',
    stroke: '#f1f2f5',
    strokeOpacity: 1,
    z: 0
  });

  const gridYComponent = marks[3];
  const gridYSpec = gridYComponent.getSpec();

  expect(gridYSpec.gridShape).toEqual('line');
  expect(gridYSpec.gridType).toEqual('line');
  expect(gridYSpec.scale).toEqual('scale-y');

  const gridY = (gridYComponent as IMark).getGroupGraphicItem();
  expect(gridY.children[0].children.length).toEqual(6);
  expect(gridY.children[0].children[0].attribute).toEqual({
    lineDash: [4, 4],
    lineWidth: 1,
    path: 'M0,0L790,0',
    stroke: '#f1f2f5',
    strokeOpacity: 1,
    z: 0
  });
});

test('add a grid component by api, and the coordinate is polar', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  }).coordinate('polar');

  plot
    .line()
    .data([
      { x: 'A', y: 1 },
      { x: 'B', y: 2 }
    ])
    .encode('x', 'x')
    .encode('y', 'y')
    .grid('x', true)
    .grid('y', { tickCount: 5 });

  plot.run();

  const marks = plot.view.getGrammarsByType('mark');

  expect(marks.map(mark => (mark as IMark).markType)).toEqual([
    'group',
    'group',
    'component',
    'component',
    'component',
    'line',
    'component'
  ]);
  expect(
    marks.filter(mark => (mark as IMark).markType === 'component').map(mark => (mark as IComponent).componentType)
  ).toEqual(['grid', 'grid', 'crosshair', 'dimensionTooltip']);

  const gridXComponent = marks[2];
  const gridXSpec = gridXComponent.getSpec();
  expect(gridXSpec.gridType).toEqual('circle');
  expect(gridXSpec.gridShape).toEqual('line');
  expect(gridXSpec.scale).toEqual('scale-x');
  const gridX = (gridXComponent as IMark).getGroupGraphicItem();
  expect(gridX.children[0].children.length).toEqual(3);
  expect(gridX.children[0].children[0].attribute).toEqual({
    lineDash: [4, 4],
    lineWidth: 1,
    path: 'M690,295L395,295',
    stroke: '#f1f2f5',
    strokeOpacity: 1,
    z: 0
  });

  const gridYComponent = marks[3];
  const gridYSpec = gridYComponent.getSpec();

  expect(gridYSpec.gridType).toEqual('line');
  expect(gridYSpec.gridShape).toEqual('circle');
  expect(gridYSpec.scale).toEqual('scale-y');

  const gridY = (gridYComponent as IMark).getGroupGraphicItem();
  expect(gridY.children[0].children.length).toEqual(6);
  expect(gridY.children[0].children[0].attribute).toEqual({
    lineDash: [4, 4],
    lineWidth: 1,
    path: 'M395,295A0,0,0,0,1,395,295A0,0,0,0,1,395,295Z',
    stroke: '#f1f2f5',
    strokeOpacity: 1,
    z: 0
  });
});

test('add a grid component by spec', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot.parseSpec({
    marks: [
      {
        type: 'rect',
        data: {
          values: [
            { x: 'A', y: 1, group: 'a' },
            { x: 'B', y: 2, group: 'a' },
            { x: 'A', y: 1, group: 'b' },
            { x: 'B', y: 2, group: 'b' }
          ]
        },
        encode: { x: 'x', y: 'y', group: 'group' },
        grid: {
          x: { tickCount: 5 },
          y: true
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
    'component',
    'rect',
    'component',
    'component'
  ]);
  expect(
    marks.filter(mark => (mark as IMark).markType === 'component').map(mark => (mark as IComponent).componentType)
  ).toEqual(['grid', 'grid', 'crosshair', 'tooltip', 'dimensionTooltip']);

  const gridXComponent = marks[2];
  const gridXSpec = gridXComponent.getSpec();
  expect(gridXSpec.gridShape).toEqual('line');
  expect(gridXSpec.gridType).toEqual('line');
  expect(gridXSpec.scale).toEqual('scale-x');
  const gridX = (gridXComponent as IMark).getGroupGraphicItem();
  expect(gridX.children[0].children.length).toEqual(2);
  expect(gridX.children[0].children[0].attribute).toEqual({
    lineDash: [4, 4],
    lineWidth: 1,
    path: 'M197.5,0L197.5,-590',
    stroke: '#f1f2f5',
    strokeOpacity: 1,
    z: 0
  });

  const gridYComponent = marks[3];
  const gridYSpec = gridYComponent.getSpec();

  expect(gridYSpec.gridShape).toEqual('line');
  expect(gridYSpec.gridType).toEqual('line');
  expect(gridYSpec.scale).toEqual('scale-y');

  const gridY = (gridYComponent as IMark).getGroupGraphicItem();
  expect(gridY.children[0].children.length).toEqual(11);
  expect(gridY.children[0].children[0].attribute).toEqual({
    lineDash: [4, 4],
    lineWidth: 1,
    path: 'M0,0L790,0',
    stroke: '#f1f2f5',
    strokeOpacity: 1,
    z: 0
  });
});
