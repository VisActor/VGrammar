import { GridLayout } from '../src/grid-layout';

test('GridLayout', async () => {
  const data = [
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 }
  ];

  const layout = new GridLayout({ fontSize: 14, text: (datum: any) => datum.text });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBe(4);
  expect(result[0].datum).toBe(data[0]);
  expect(result[0].fontSize).toBe(14);
});

test('GridLayout() when clip is false, some words will be drop', async () => {
  const data = [
    { text: 'this is a very long text i need to display', fontSize: 49, index: 0 },
    { text: 'this text is long too', fontSize: 36, index: 1 },
    { text: 'a long long text', fontSize: 25, index: 2 },
    { text: 'a simple text', fontSize: 13, index: 3 }
  ];

  const layout = new GridLayout({
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
    fontStyle: '',
    fontWeight: '',
    text: 'a simple text'
  });
});

test('GridLayout() when clip is true, some words will be drop', async () => {
  const data = [
    { text: 'this is a very long text i need to display', fontSize: 49, index: 0 },
    { text: 'this text is long too', fontSize: 36, index: 1 },
    { text: 'a long long text', fontSize: 25, index: 2 },
    { text: 'a simple text', fontSize: 13, index: 3 }
  ];

  const layout = new GridLayout({
    fontSize: (datum: any) => datum.fontSize,
    text: (datum: any) => datum.text,
    clip: true,
    fontFamily: 'sans-serif'
  });
  const result = layout.layout(data, { width: 100, height: 100 });

  expect(result.length).toBe(4);
  result.forEach((entry, index) => {
    expect(entry.datum).toBe(data[index]);
    expect(entry.text).not.toBe(data[index].text);
  });
});

test('GridLayout when canvas is not empty', async () => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'pink';
  ctx.fillRect(0, 0, 400, 400);
  ctx.fillStyle = 'white';
  ctx.fillRect(100, 100, 200, 200);

  const data = [
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 }
  ];

  const layout = new GridLayout({
    fontSize: (datum: any) => datum.fontSize,
    text: (datum: any) => datum.text,
    clip: true,
    fontFamily: 'sans-serif',
    backgroundColor: 'pink'
  });
  const result = layout.layout(data, { width: 400, height: 400, canvas });

  expect(result.length).toBe(4);
  expect(result[0].datum).toBe(data[0]);
  expect(result[0].fontSize).toBe(49);
});

test('GridLayout() of random light color', async () => {
  const data = [
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 }
  ];

  const layout = new GridLayout({ fontSize: 14, text: (datum: any) => datum.text, color: 'random-light' });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBe(4);
  expect(result[0].datum).toBe(data[0]);
  expect(result[0].fontSize).toBe(14);
  expect(result[0].color).not.toBeUndefined();
});

test('GridLayout() of random dark color', async () => {
  const data = [
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 }
  ];

  const layout = new GridLayout({ fontSize: 14, text: (datum: any) => datum.text, color: 'random-dark' });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBe(4);
  expect(result[0].datum).toBe(data[0]);
  expect(result[0].fontSize).toBe(14);
  expect(result[0].color).not.toBeUndefined();
});

test('GridLayout() of useRandomRotate', async () => {
  const data = [
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 }
  ];

  const min = 90;
  const max = 180;
  const layout = new GridLayout({
    fontSize: 14,
    text: (datum: any) => datum.text,
    rotate: null,
    useRandomRotate: true,
    maxRotation: max,
    minRotation: min,
    rotateRatio: 1
  });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBe(4);
  expect(result[0].datum).toBe(data[0]);
  expect(result[0].fontSize).toBe(14);
  expect(result[0].angle).toBeGreaterThanOrEqual(min);
  expect(result[0].angle).toBeLessThanOrEqual(max);
});

test('GridLayout() of rotate function', async () => {
  const data = [
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 }
  ];

  const layout = new GridLayout({
    fontSize: 14,
    text: (datum: any) => datum.text,
    rotate: () => 90
  });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBe(4);
  expect(result[0].datum).toBe(data[0]);
  expect(result[0].fontSize).toBe(14);
  expect(result[0].angle).toBeCloseTo(Math.PI / 2);
});

test('GridLayout() of rotate null', async () => {
  const data = [
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 }
  ];

  const layout = new GridLayout({
    fontSize: 14,
    text: (datum: any) => datum.text,
    rotate: undefined,
    color: () => 'red'
  });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBe(4);
  expect(result[0].datum).toBe(data[0]);
  expect(result[0].fontSize).toBe(14);
  expect(result[0].angle).toBe(0);
  expect(result[0].color).toBe('red');
});

test('GridLayout() of rotate  value', async () => {
  const data = [
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 }
  ];

  const layout = new GridLayout({
    fontSize: 14,
    text: (datum: any) => datum.text,
    rotate: 45
  });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBe(4);
  expect(result[0].datum).toBe(data[0]);
  expect(result[0].fontSize).toBe(14);
  expect(result[0].angle).toBeCloseTo(Math.PI / 4);
});

test('GridLayout() of progressive run by step', async () => {
  const data = [
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 }
  ];

  const layout = new GridLayout({
    fontSize: 14,
    text: (datum: any) => datum.text,
    rotate: null,
    useRandomRotate: true,
    maxRotation: Math.PI,
    minRotation: 2 * Math.PI,
    rotateRatio: 1,
    rotationSteps: 3,
    progressiveStep: 2
  });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBe(2);
  expect(result[0].datum).toBe(data[0]);
  expect(result[1].datum).toBe(data[1]);
  expect(result[0].fontSize).toBe(14);
  expect(result[0].angle).toBeGreaterThanOrEqual(Math.PI);
  expect(result[0].angle).toBeLessThanOrEqual(2 * Math.PI);

  const res01 = layout.progressiveRun();

  expect(res01.length).toBe(2);
  expect(res01[0].datum).toBe(data[2]);
  expect(res01[1].datum).toBe(data[3]);

  const res02 = layout.progressiveRun();

  expect(res02.length).toBe(4);
  expect(res02[0].datum).toBe(data[0]);
  expect(res02[1].datum).toBe(data[1]);

  const newRes = layout.layout(data, { width: 400, height: 400 });

  expect(newRes.length).toBe(2);
  expect(newRes[0].datum).toBe(data[0]);
  expect(newRes[1].datum).toBe(data[1]);
});

test('GridLayout() of progressive run by time', async () => {
  const data = [
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 },
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 },
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 },
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 },
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 },
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 },
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 },
    { text: 'foo', fontSize: 49, index: 0 },
    { text: 'bar', fontSize: 36, index: 1 },
    { text: 'baz', fontSize: 25, index: 2 },
    { text: 'abc', fontSize: 13, index: 3 }
  ];

  const layout = new GridLayout({
    fontSize: 14,
    text: (datum: any) => datum.text,
    rotate: null,
    useRandomRotate: true,
    maxRotation: Math.PI,
    minRotation: 2 * Math.PI,
    rotateRatio: 1,
    rotationSteps: 3,
    progressiveTime: 1
  });
  const result = layout.layout(data, { width: 400, height: 400 });

  expect(result.length).toBeLessThan(data.length);
});
