import { FastLayout } from '../src/fast-layout';

test('FastLayout', async () => {
  const data = [
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 }
  ];

  const layout = new FastLayout({ fontSize: 14, text: (datum: any) => datum.text });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBe(4);
  expect(result[0].datum).toBe(data[0]);
  expect(result[0].fontSize).toBe(14);
});

test('FastLayout() when clip is false, some lone words will be drop', async () => {
  const data = [
    { text: 'this is a very long text i need to display', fontSize: 49, index: 0 },
    { text: 'this text is long too', fontSize: 36, index: 1 },
    { text: 'a long long text', fontSize: 25, index: 2 },
    { text: 'a simple text', fontSize: 13, index: 3 }
  ];

  const layout = new FastLayout({
    fontSize: (datum: any) => datum.fontSize,
    text: (datum: any) => datum.text,
    clip: false,
    fontFamily: 'sans-serif'
  });
  const result = layout.layout(data, { width: 100, height: 100 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    angle: 0,
    datum: data[3],
    fontFamily: 'sans-serif',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: 'normal',
    text: 'a simple text',
    x: 50,
    y: 50
  });
});

test('FastLayout() when clip is true, some lone words will be clip shortter', async () => {
  const data = [
    { text: 'this is a very long text i need to display', fontSize: 49, index: 0 },
    { text: 'this text is long too', fontSize: 36, index: 1 },
    { text: 'a long long text', fontSize: 25, index: 2 },
    { text: 'a simple text', fontSize: 13, index: 3 }
  ];

  const layout = new FastLayout({
    fontSize: (datum: any) => datum.fontSize,
    text: (datum: any) => datum.text,
    clip: true,
    fontFamily: 'sans-serif'
  });
  const result = layout.layout(data, { width: 100, height: 100 });

  expect(result.length).toBe(4);
});
