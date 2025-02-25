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
