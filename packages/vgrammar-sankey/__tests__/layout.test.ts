import { SankeyLayout } from '../src/layout';
import { hierarchyData, hierarchyData01 } from './data';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

test('layout data { links }', () => {
  const data = { links: [{ source: 'A', target: 'B', value: 1 }] };

  const layout = new SankeyLayout();
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.nodes.length).toBe(2);
  expect(result.nodes[0]).toMatchObject({
    depth: 0,
    endDepth: 1,
    index: 0,
    key: 'A',
    layer: 0,
    value: 1,
    x0: 0,
    x1: 24,
    y0: 0,
    y1: 200
  });
  expect(result.nodes[1]).toMatchObject({
    depth: 1,
    endDepth: 0,
    index: 1,
    key: 'B',
    layer: 1,
    value: 1,
    x0: 176,
    x1: 200,
    y0: 0,
    y1: 200
  });

  expect(result.links[0]).toMatchObject({
    index: 0,
    y0: 100,
    y1: 100
  });
});

test('layout data { nodes, links }', () => {
  const data = {
    nodes: [
      {
        value: 100
      },
      { value: 50 },
      { value: 30 }
    ],
    links: [
      { source: 0, target: 1, value: 50 },
      { source: 0, target: 2, value: 30 }
    ]
  };

  const layout = new SankeyLayout({ nodeAlign: 'start' });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.nodes.length).toBe(3);
  expect(result.nodes[0]).toMatchObject({
    depth: 0,
    index: 0,
    key: 0,
    layer: 0,
    value: 100,
    x0: 0,
    x1: 24,
    y1: 200
  });
  expect(result.nodes[0].y0).toBeCloseTo(0);
  expect(result.nodes[1]).toMatchObject({
    depth: 1,
    index: 1,
    key: 1,
    layer: 1,
    value: 50,
    x0: 176,
    x1: 200,
    y0: 0
  });

  expect(result.nodes[0].y1).toBeCloseTo(200);

  expect(result.links[0]).toMatchObject({
    index: 0,
    y1: 50,
    thickness: 100
  });
  expect(result.links[0].y0).toBeCloseTo(50);
});

test('layout data { nodes, links } when dropIsolatedNode = true', () => {
  const data = {
    nodes: [
      {
        value: 100
      },
      { value: 50 },
      { value: 30 },
      { value: 50 }
    ],
    links: [
      { source: 0, target: 1, value: 50 },
      { source: 0, target: 2, value: 30 }
    ]
  };

  const layout = new SankeyLayout({ nodeAlign: 'start' });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.nodes.length).toBe(3);
});

test('layout data { nodes, links } when dropIsolatedNode = false', () => {
  const data = {
    nodes: [
      {
        value: 100
      },
      { value: 50 },
      { value: 30 },
      { value: 50 }
    ],
    links: [
      { source: 0, target: 1, value: 50 },
      { source: 0, target: 2, value: 30 }
    ]
  };

  const layout = new SankeyLayout({ nodeAlign: 'start', dropIsolatedNode: false });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.nodes.length).toBe(4);
});

test('layout width nodeKey', () => {
  const data = {
    nodes: [
      {
        key: 'A',
        value: 100
      },
      { value: 50, key: 'B' },
      { value: 30, key: 'C' }
    ],
    links: [
      { source: 'A', target: 'B', value: 50 },
      { source: 'A', target: 'C', value: 30 }
    ]
  };

  const layout = new SankeyLayout({
    nodeKey: datum => {
      return (datum as any).key;
    }
  });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.nodes.length).toBe(3);
  expect(result.nodes[0]).toMatchObject({
    depth: 0,
    endDepth: 1,
    index: 0,
    key: 'A',
    layer: 0,
    value: 100,
    x0: 0,
    x1: 24,
    y1: 200
  });
  expect(result.nodes[0].y0).toBeCloseTo(0);
  expect(result.nodes[1]).toMatchObject({
    depth: 1,
    endDepth: 0,
    index: 1,
    key: 'B',
    layer: 1,
    value: 50,
    x0: 176,
    x1: 200,
    y0: 0
  });

  expect(result.nodes[0].y1).toBeCloseTo(200);

  expect(result.links[0]).toMatchObject({
    index: 0,
    y1: 50,
    thickness: 100
  });
  expect(result.links[0].y0).toBeCloseTo(50);
});

test('vertical layout', () => {
  const data = { links: [{ source: 'A', target: 'B', value: 1 }] };

  const layout = new SankeyLayout({ direction: 'vertical' });
  const result = layout.layout(data, { width: 200, height: 100 });

  expect(result.nodes.length).toBe(2);
  expect(result.nodes[0]).toMatchObject({
    depth: 0,
    endDepth: 1,
    index: 0,
    key: 'A',
    layer: 0,
    value: 1,
    x0: 0,
    x1: 200,
    y0: 0,
    y1: 24
  });
  expect(result.nodes[1]).toMatchObject({
    depth: 1,
    endDepth: 0,
    index: 1,
    key: 'B',
    layer: 1,
    value: 1,
    x0: 0,
    x1: 200,
    y0: 76,
    y1: 100
  });

  expect(result.links[0]).toMatchObject({
    index: 0,
    x0: 100,
    x1: 100
  });
});

test('hierarchy data which has no value in node', () => {
  const data = { nodes: hierarchyData01 };

  const layout = new SankeyLayout({ nodeKey: (datum: any) => datum.name });
  const result = layout.layout(data, { width: 800, height: 400 });

  expect(result.nodes.length).toBe(11);
  expect(result.nodes[0]).toMatchObject({
    depth: 0,
    endDepth: 3,
    index: 0,
    key: 'A',
    layer: 0,
    value: 65
  });
  expect(result.nodes[1]).toMatchObject({
    depth: 1,
    endDepth: 2,
    index: 0,
    key: '上面',
    layer: 1,
    value: 195
  });

  expect(result.links.length).toBe(17);
  expect(result.links[0].key).toBe('A-上面');
  expect(result.links[result.links.length - 1].key).toBe('C-下面');
});

test('hierarchy data', () => {
  const data = { nodes: hierarchyData };

  const layout = new SankeyLayout({ nodeKey: (datum: any) => datum.name });
  const result = layout.layout(data, { width: 800, height: 400 });

  expect(result.nodes.length).toBe(11);
  expect(result.nodes[0]).toMatchObject({
    depth: 0,
    endDepth: 3,
    index: 0,
    key: 'A',
    layer: 0,
    value: 100
  });
  expect(result.nodes[1]).toMatchObject({
    depth: 1,
    endDepth: 2,
    index: 0,
    key: '上面',
    layer: 1,
    value: 175
  });

  expect(result.links.length).toBe(17);
  expect(result.links[0].key).toBe('A-上面');
  expect(result.links[result.links.length - 1].key).toBe('C-下面');
});

test('vertical', () => {
  const data = {
    links: [
      { source: 'A', target: 'B', value: 1 },
      { source: 'A', target: 'C', value: 2 },
      { source: 'C', target: 'E', value: 1 },
      { source: 'C', target: 'F', value: 1 }
    ]
  };

  const layout = new SankeyLayout({ minLinkHeight: 5, direction: 'vertical' });
  const result = layout.layout(data, { width: 200, height: 100 });

  expect(result.nodes.length).toBe(5);
  expect(result.nodes[0]).toMatchObject({
    depth: 0,
    endDepth: 2,
    index: 0,
    key: 'A',
    layer: 0,
    value: 3
  });
  expect(result.nodes[1]).toMatchObject({
    depth: 1,
    endDepth: 0,
    index: 1,
    key: 'B',
    layer: 2,
    value: 1
  });

  expect(result.links[0]).toMatchObject({
    index: 0,
    y0: 24,
    y1: 76
  });
});

test('layout when set nodeGap by function', () => {
  const data = {
    nodes: [
      {
        value: 100
      },
      { value: 50 },
      { value: 30 }
    ],
    links: [
      { source: 0, target: 1, value: 50 },
      { source: 0, target: 2, value: 30 }
    ]
  };

  const layout = new SankeyLayout({
    nodeAlign: 'center',
    crossNodeAlign: 'start',
    gapPosition: 'start',
    nodeGap: node => {
      return node.index === 0 ? 20 : 10;
    }
  });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.nodes.length).toBe(3);
  expect(result.nodes[0]).toMatchObject({
    depth: 0,
    index: 0,
    key: 0,
    layer: 0,
    value: 100,
    x0: 0,
    x1: 24,
    y1: 200
  });
  expect(result.nodes[0].y0).toBeCloseTo(20);
  expect(result.nodes[1]).toMatchObject({
    depth: 1,
    index: 1,
    key: 1,
    layer: 1,
    value: 50,
    x0: 176,
    x1: 200,
    y0: 10
  });

  expect(result.nodes[0].y1).toBeCloseTo(200);

  expect(result.links[0]).toMatchObject({
    index: 0,
    y1: 55,
    thickness: 90
  });
  expect(result.links[0].y0).toBeCloseTo(65);
});

test('layout when  divideNodeValueToLink = true', () => {
  const data = {
    nodes: [
      {
        value: 100
      },
      { value: 50 },
      { value: 30 }
    ],
    links: [
      { source: 0, target: 1 },
      { source: 0, target: 2 }
    ]
  };

  const layout = new SankeyLayout({
    nodeAlign: 'right',
    crossNodeAlign: 'end',
    gapPosition: 'end',
    divideNodeValueToLink: true
  });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.nodes.length).toBe(3);
  expect(result.nodes[0]).toMatchObject({
    depth: 0,
    index: 0,
    key: 0,
    layer: 0,
    value: 100,
    x0: 0,
    x1: 24,
    y1: 200
  });
  expect(result.nodes[0].y0).toBeCloseTo(0);
  expect(result.nodes[1]).toMatchObject({
    depth: 1,
    index: 1,
    key: 1,
    layer: 1,
    value: 50,
    x0: 176,
    x1: 200,
    y0: 0
  });

  expect(result.nodes[0].y1).toBeCloseTo(200);

  expect(result.links[0]).toMatchObject({
    index: 0,
    y1: 50,
    thickness: 100
  });
  expect(result.links[0].y0).toBeCloseTo(50);
});

test('hierarchy data sankey can be sort', () => {
  const data = { nodes: hierarchyData01 };

  const layout = new SankeyLayout({
    nodeKey: (datum: any) => datum.name,
    linkSortBy: (a: any, b: any) => {
      return a.value - b.value;
    }
  });
  const result = layout.layout(data, { width: 800, height: 400 });

  expect(result.nodes.length).toBe(11);
  expect(result.nodes[0].sourceLinks.map(link => link.value)).toEqual([0, 30, 35]);
});

test('horizontal inverse', () => {
  const data = {
    links: [
      { source: 'A', target: 'B', value: 1 },
      { source: 'A', target: 'C', value: 2 },
      { source: 'C', target: 'E', value: 1 },
      { source: 'C', target: 'F', value: 1 }
    ]
  };

  const layout = new SankeyLayout({ minLinkHeight: 5, inverse: true });
  const result = layout.layout(data, { width: 200, height: 100 });

  expect(result.nodes.length).toBe(5);
  expect(result.nodes[0]).toMatchObject({
    depth: 0,
    endDepth: 2,
    index: 0,
    key: 'A',
    layer: 0,
    value: 3
  });
  expect(result.nodes[1]).toMatchObject({
    depth: 1,
    endDepth: 0,
    index: 1,
    key: 'B',
    layer: 2,
    value: 1
  });

  expect(result.links[0]).toMatchObject({
    index: 0,
    x0: 176,
    x1: 24
  });
});

test('vertical inverse', () => {
  const data = {
    links: [
      { source: 'A', target: 'B', value: 1 },
      { source: 'A', target: 'C', value: 2 },
      { source: 'C', target: 'E', value: 1 },
      { source: 'C', target: 'F', value: 1 }
    ]
  };

  const layout = new SankeyLayout({ minLinkHeight: 5, direction: 'vertical', inverse: true });
  const result = layout.layout(data, { width: 200, height: 100 });

  expect(result.nodes.length).toBe(5);
  expect(result.nodes[0]).toMatchObject({
    depth: 0,
    endDepth: 2,
    index: 0,
    key: 'A',
    layer: 0,
    value: 3
  });
  expect(result.nodes[1]).toMatchObject({
    depth: 1,
    endDepth: 0,
    index: 1,
    key: 'B',
    layer: 2,
    value: 1
  });

  expect(result.links[0]).toMatchObject({
    index: 0,
    y0: 76,
    y1: 24
  });
});
