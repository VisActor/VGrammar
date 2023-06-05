import { formatNodeRect } from '../src/index';
import { SankeyLayout } from '../src/layout';

test('formatNodeRect()', () => {
  const data = { links: [{ source: 'A', target: 'B', value: 1 }] };

  const layout = new SankeyLayout();
  const result = layout.layout(data, { width: 200, height: 200 });
  const rects = formatNodeRect(result.nodes);

  expect(rects[0]).toMatchObject({ x: 0, y: 0, width: 24, height: 200 });
  expect(rects[1]).toMatchObject({ x: 176, y: 0, width: 24, height: 200 });
});
