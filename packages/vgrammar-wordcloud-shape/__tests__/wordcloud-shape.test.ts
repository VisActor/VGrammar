import { transform } from '../src/wordcloud-shape';

describe.skip('wordcloud', () => {
  test('Wordcloud shape generates wordcloud layout', async () => {
    const data = [
      { text: 'foo', size: 49, index: 0 },
      { text: 'bar', size: 36, index: 1 },
      { text: 'baz', size: 25, index: 2 },
      { text: 'abc', size: 1, index: 3 }
    ];
    const result = await transform(
      {
        size: [500, 500],
        text: { field: 'text' },
        fontSize: { field: 'size' },
        shape: 'shape_bears.png'
      },
      data
    );
    expect(result[0]).toMatchObject({
      angle: 0,
      color: '#2E62F1',
      fontFamily: 'sans-serif',
      fontSize: 117,
      fontStyle: 'normal',
      fontWeight: 'normal',
      index: 0,
      isFillingWord: false,
      opacity: 1,
      size: 49,
      text: 'foo',
      visible: true,
      y: 360
    });
    expect(Math.abs(result[0].x - 245)).toBeLessThanOrEqual(1);

    expect(result[1]).toMatchObject({
      angle: 0,
      color: '#2E62F1',
      fontFamily: 'sans-serif',
      fontSize: 107,
      fontStyle: 'normal',
      fontWeight: 'normal',
      index: 1,
      isFillingWord: false,
      opacity: 1,
      size: 36,
      text: 'bar',
      visible: true,
      y: 422
    });
    expect(Math.abs(result[1].x - 261)).toBeLessThanOrEqual(1);
    expect(result[2]).toMatchObject({
      angle: 0,
      color: '#2E62F1',
      fontFamily: 'sans-serif',
      fontSize: 61,
      fontStyle: 'normal',
      fontWeight: 'normal',
      index: 2,
      isFillingWord: false,
      opacity: 1,
      size: 25,
      text: 'baz',
      visible: true,
      x: 169
    });
    expect(Math.abs(result[2].y - 154)).toBeLessThanOrEqual(1);
    expect(result[3]).toMatchObject({
      angle: 0,
      color: '#2E62F1',
      fontFamily: 'sans-serif',
      fontSize: 58,
      fontStyle: 'normal',
      fontWeight: 'normal',
      index: 3,
      isFillingWord: false,
      opacity: 1,
      size: 1,
      text: 'abc',
      visible: true,
      y: 292
    });
    expect(Math.abs(result[3].x - 248)).toBeLessThanOrEqual(1);
  });
});
