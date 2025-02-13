/**
 * 移除图像中的白边
 */
export function removeBorder(
  image: any,
  canvas: HTMLCanvasElement | any,
  isEmptyPixel: (imageData: ImageData, i: number, j: number) => boolean
) {
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  const width = canvas.width;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let top = 0;
  let bottom = imageData.height;
  let left = 0;
  let right = imageData.width;

  const rowBlank = (width: number, y: number) => {
    for (let x = 0; x < width; ++x) {
      if (!isEmptyPixel(imageData, y, x)) {
        return false;
      }
    }
    return true;
  };

  const columnBlank = (x: number, y0: number, y1: number) => {
    for (let y = y0; y < y1; ++y) {
      if (!isEmptyPixel(imageData, y, x)) {
        return false;
      }
    }
    return true;
  };

  while (top < bottom && rowBlank(width, top)) {
    ++top;
  }
  while (bottom - 1 > top && rowBlank(width, bottom - 1)) {
    --bottom;
  }
  while (left < right && columnBlank(left, top, bottom)) {
    ++left;
  }
  while (right - 1 > left && columnBlank(right - 1, top, bottom)) {
    --right;
  }

  const trimmed = ctx.getImageData(left, top, right - left, bottom - top);
  canvas.width = trimmed.width;
  canvas.height = trimmed.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(trimmed, 0, 0);

  return canvas;
}

/**
 * 调整图像大小和位置，将图像按照长边缩放到适应画布大小，并且居中
 * 此处让图片占满画布，padding 不是这个 transform 需要考虑的
 */
export function scaleAndMiddleShape(image: any, size: [number, number]) {
  const width = image.width;
  const height = image.height;
  let scale = size[0] / width;
  if (height * scale > size[1]) {
    scale = size[1] / height;
  }

  const newWidth = Math.floor(scale * width);
  const newHeight = Math.floor(scale * height);
  // 图片绘制时的坐标
  const x = (size[0] - newWidth) / 2;
  const y = (size[1] - newHeight) / 2;

  return {
    x,
    y,
    width: newWidth,
    height: newHeight,
    scale
  };
}
