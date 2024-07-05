import { vglobal } from '@visactor/vrender-core';

export const generateIsEmptyPixel = (backgroundColor?: string) => {
  if (!backgroundColor || backgroundColor === '#fff') {
    return (imageData: ImageData, y: number, x: number) => {
      const width = imageData.width;
      return (
        imageData.data[y * width * 4 + x * 4 + 3] === 0 ||
        (imageData.data[y * width * 4 + x * 4 + 0] === 255 &&
          imageData.data[y * width * 4 + x * 4 + 1] === 255 &&
          imageData.data[y * width * 4 + x * 4 + 2] === 255)
      );
    };
  }

  /* Determine bgPixel by creating
      another canvas and fill the specified background color. */
  // eslint-disable-next-line no-undef
  const bctx = vglobal.createCanvas({ width: 1, height: 1 }).getContext('2d');

  bctx.fillStyle = backgroundColor;
  bctx.fillRect(0, 0, 1, 1);
  const bgPixel = bctx.getImageData(0, 0, 1, 1).data;

  return (imageData: ImageData, y: number, x: number) => {
    const width = imageData.width;

    return [0, 1, 2, 3].every(i => {
      return imageData.data[(y * width + x) * 4 + i] === bgPixel[i];
    });
  };
};
