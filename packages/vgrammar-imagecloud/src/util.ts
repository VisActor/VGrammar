import type { FieldOption, ImageCollageInputType, SegmentationOutputType, TagItemAttribute } from './interface';
import { isFunction } from '@visactor/vutils';

export enum IMAGECLOUD_HOOK_EVENT {
  BEFORE_IMAGECLOUD_LAYOUT = 'beforeImagecloudLayout',
  AFTER_IMAGECLOUD_LAYOUT = 'afterImagecloudLayout',
  AFTER_IMAGECLOUD_DRAW = 'afterImagecloudDraw'
}

/**
 * 随机拟合
 */
export const fakeRandom = () => {
  let i = -1;
  const arr = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
  return () => {
    i = (i + 1) % arr.length;
    return arr[i];
  };
};

export function setSize(image: ImageCollageInputType, longSideLength: number) {
  if (image.aspectRatio > 1) {
    image.width = longSideLength;
    image.height = ~~(longSideLength / image.aspectRatio);
  } else {
    image.height = longSideLength;
    image.width = ~~(longSideLength * image.aspectRatio);
  }
}

export function setSizeByShortSide(image: ImageCollageInputType, shortSideLength: number) {
  if (image.aspectRatio > 1) {
    image.height = shortSideLength;
    image.width = ~~(shortSideLength * image.aspectRatio);
  } else {
    image.width = shortSideLength;
    image.height = ~~(shortSideLength / image.aspectRatio);
  }
}

// FIXME: 重复代码
/**
 * 取数逻辑
 */
export const field = <T>(option: FieldOption | TagItemAttribute<T>) => {
  if (!option) {
    return null;
  }
  if (typeof option === 'string' || typeof option === 'number') {
    return () => option;
  } else if (isFunction(option)) {
    return option as (datum: any) => T;
  }
  return (datum: any) => datum[(option as FieldOption).field];
};

export function visualizeSegmentation(labels: number[], canvasWidth = 500, canvasHeight = 500) {
  // 获取 Canvas 元素
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // 设置 Canvas 尺寸
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 创建 ImageData 对象以存储像素数据
  const imageData = ctx.createImageData(canvasWidth, canvasHeight); // 宽度和高度

  // 填充 ImageData 的像素数据
  for (let i = 0; i < labels.length; i++) {
    const color = labels[i] === 0 ? 255 : 0; // 0 为白色 (255, 255, 255)，1 为黑色 (0, 0, 0)

    // 每个像素在 ImageData 中占 4 个字节 (RGBA)
    const pixelIndex = i * 4;
    imageData.data[pixelIndex] = color; // 红色通道
    imageData.data[pixelIndex + 1] = color; // 绿色通道
    imageData.data[pixelIndex + 2] = color; // 蓝色通道
    imageData.data[pixelIndex + 3] = 255; // Alpha 通道 (不透明)
  }

  // 将 ImageData 绘制到 Canvas 上
  ctx.putImageData(imageData, 0, 0);

  // 放大 Canvas 显示效果
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;

  document.getElementById('container').appendChild(canvas);
}
