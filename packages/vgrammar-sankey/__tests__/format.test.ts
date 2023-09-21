import {
  formatNodeRect,
  formatLinkPolygon,
  formatLinkPath,
  getBoundsOfNodes,
  getAlignStartTexts,
  getAlignEndTexts
} from '../src/index';
import { SankeyLayout } from '../src/layout';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

test('formatNodeRect()', () => {
  const data = { links: [{ source: 'A', target: 'B', value: 1 }] };

  const layout = new SankeyLayout();
  const result = layout.layout(data, { width: 200, height: 200 });
  const rects = formatNodeRect(result.nodes);

  expect(rects[0]).toMatchObject({ x: 0, y: 0, width: 24, height: 200 });
  expect(rects[1]).toMatchObject({ x: 176, y: 0, width: 24, height: 200 });
});

test('formatLinkPolygon()', () => {
  const data = { links: [{ source: 'A', target: 'B', value: 1 }] };

  const layout = new SankeyLayout();
  const result = layout.layout(data, { width: 200, height: 200 });
  const links = formatLinkPolygon(result.links);

  expect(links.length).toBe(1);
  expect(links[0].datum).toEqual({ source: 'A', target: 'B', value: 1 });
  expect(links[0].points).toEqual([
    { x: 24, y: 0 },
    { x: 176, y: 0 },
    { x: 176, y: 200 },
    { x: 24, y: 200 }
  ]);
});

test('formatLinkPolygon() of vertical', () => {
  const data = { links: [{ source: 'A', target: 'B', value: 1 }] };

  const layout = new SankeyLayout({ direction: 'vertical' });
  const result = layout.layout(data, { width: 200, height: 200 });
  const links = formatLinkPolygon(result.links);

  expect(links.length).toBe(1);
  expect(links[0].datum).toEqual({ source: 'A', target: 'B', value: 1 });
  expect(links[0].points).toEqual([
    { y: 24, x: 0 },
    { y: 176, x: 0 },
    { y: 176, x: 200 },
    { y: 24, x: 200 }
  ]);
});

test('formatLinkPath()', () => {
  const data = { links: [{ source: 'A', target: 'B', value: 1 }] };

  const layout = new SankeyLayout();
  const result = layout.layout(data, { width: 200, height: 200 });
  const links = formatLinkPath(result.links, true);

  expect(links.length).toBe(1);
  expect(links[0].datum).toEqual({ source: 'A', target: 'B', value: 1 });
  expect((links[0].path as string).replace(/[\s\n\r]+/g, '')).toBe(
    `M24,0C100,0,100,0,176,0L176,200C100,200,100,200,24,200Z`
  );
});

test('formatLinkPath() of vertical', () => {
  const data = { links: [{ source: 'A', target: 'B', value: 1 }] };

  const layout = new SankeyLayout({ direction: 'vertical' });
  const result = layout.layout(data, { width: 200, height: 200 });
  const links = formatLinkPath(result.links, true);

  expect(links.length).toBe(1);
  expect(links[0].datum).toEqual({ source: 'A', target: 'B', value: 1 });
  expect((links[0].path as string).replace(/[\s\n\r]+/g, '')).toEqual(
    'M0,24C0,100,0,100,0,176L200,176C200,100,200,100,200,24Z'
  );
});

test('getBoundsOfNodes()', () => {
  const data = {
    links: [
      { source: 'A', target: 'B', value: 1 },
      { source: 'A', target: 'C', value: 2 },
      { source: 'C', target: 'E', value: 1 },
      { source: 'C', target: 'F', value: 1 }
    ]
  };

  const layout = new SankeyLayout();
  const result = layout.layout(data, { width: 200, height: 200 });
  const bounds = getBoundsOfNodes(result.nodes);

  expect(bounds.x0).toBeCloseTo(0);
  expect(bounds.x1).toBeCloseTo(200);
  expect(bounds.y0).toBeCloseTo(0);
  expect(bounds.y1).toBeCloseTo(200);
  expect(bounds.width).toBeCloseTo(200);
  expect(bounds.height).toBeCloseTo(200);
});

test('getAlignStartTexts()', () => {
  const data = {
    links: [
      { source: 'A', target: 'B', value: 1 },
      { source: 'A', target: 'C', value: 2 },
      { source: 'C', target: 'E', value: 1 },
      { source: 'C', target: 'F', value: 1 }
    ]
  };

  const layout = new SankeyLayout();
  const result = layout.layout(data, { width: 200, height: 200 });
  const startTexts = getAlignStartTexts(result.nodes);
  const endTexts = getAlignEndTexts(result.nodes);

  expect(startTexts.length).toBe(5);
  expect(startTexts[0].x).toBeCloseTo(12);
  expect(startTexts[0].y).toBeCloseTo(188.97948490133564);
  expect(endTexts.length).toBe(5);
  expect(endTexts[0].x).toBeCloseTo(12);
  expect(endTexts[0].y).toBeCloseTo(188.97948490133564);
});
