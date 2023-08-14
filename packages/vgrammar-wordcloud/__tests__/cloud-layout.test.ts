import { CloudLayout } from '../src/cloud-layout';

test('CloutLayout', async () => {
  const data = [
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 }
  ];

  const layout = new CloudLayout({ fontSize: 14, text: (datum: any) => datum.text, spiral: 'rectangular' });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBe(4);
  expect(result[0].datum).toBe(data[0]);
  expect(result[0].fontSize).toBe(14);
});

test('CloutLayout of shrink = false when words is very long', async () => {
  const data = [
    { text: 'long long long text', fontSize: 49, index: 0 },
    { text: 'aaaaaaaaaaaaaaaaaaa', fontSize: 36, index: 1 },
    { text: 'bbbbbbbbbbbbbbbbbbb', fontSize: 25, index: 2 },
    { text: 'ccccccccccccccccccc', fontSize: 13, index: 3 }
  ];

  const layout = new CloudLayout({
    fontSize: (datum: any) => datum.fontSize,
    text: (datum: any) => datum.text,
    spiral: 'rectangular',
    clip: false,
    shrink: false
  });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBe(2);
  expect(result[0].datum).toBe(data[2]);
  expect(result[0].fontSize).toBe(25);
});

test('CloutLayout of shrink = true when words is very long', async () => {
  const data = [
    { text: 'long long long text', fontSize: 49, index: 0 },
    { text: 'aaaaaaaaaaaaaaaaaaa', fontSize: 36, index: 1 },
    { text: 'bbbbbbbbbbbbbbbbbbb', fontSize: 25, index: 2 },
    { text: 'ccccccccccccccccccc', fontSize: 13, index: 3 }
  ];

  const layout = new CloudLayout({
    fontSize: (datum: any) => datum.fontSize,
    text: (datum: any) => datum.text,
    spiral: 'rectangular',
    clip: false,
    shrink: true
  });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBe(4);
  expect(result[0].datum).toBe(data[0]);
  expect(result[0].fontSize).toBe(49);
});

test('CloutLayout of enlarge = false word is simple', async () => {
  const data = [{ text: 'short', fontSize: 49, index: 0 }];

  const layout = new CloudLayout({
    fontSize: (datum: any) => datum.fontSize,
    text: (datum: any) => datum.text,
    spiral: 'archimedean',
    enlarge: true
  });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBe(1);
  expect(result[0].datum).toBe(data[0]);
  expect(result[0].fontSize).toBe(49);

  const layout01 = new CloudLayout({
    fontSize: (datum: any) => datum.fontSize,
    text: (datum: any) => datum.text,
    spiral: 'archimedean',
    enlarge: false
  });
  const result01 = layout01.layout(data, { width: 400, height: 400 });

  expect(result01[0]).toEqual(result[0]);
});

test('CloutLayout of clip word is simple', async () => {
  const data = [{ text: 'very very long long long long text', fontSize: 49, index: 0 }];

  const layout = new CloudLayout({
    fontSize: (datum: any) => datum.fontSize,
    text: (datum: any) => datum.text,
    spiral: 'archimedean',
    clip: true
  });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBe(1);
  expect(result[0].datum).toBe(data[0]);
  expect(result[0].fontSize).toBe(49);

  const layout01 = new CloudLayout({
    fontSize: (datum: any) => datum.fontSize,
    text: (datum: any) => datum.text,
    spiral: 'archimedean',
    clip: false
  });
  const result01 = layout01.layout(data, { width: 400, height: 400 });

  expect(result01.length).toBe(0);
});
