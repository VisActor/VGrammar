import { SankeyLayout } from '../src/layout';

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

  const layout = new SankeyLayout();
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.nodes.length).toBe(3);
  expect(result.nodes[0]).toMatchObject({
    depth: 0,
    endDepth: 1,
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
    endDepth: 0,
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
