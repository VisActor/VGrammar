import type { ImageCollageType } from './interface';

export enum IMAGECLOUD_HOOK_EVENT {
  BEFORE_IMAGECLOUD_LAYOUT = 'beforeImagecloudLayout',
  AFTER_IMAGECLOUD_LAYOUT = 'afterImagecloudLayout',
  AFTER_IMAGECLOUD_DRAW = 'afterImagecloudDraw'
}

export function setSize(image: ImageCollageType, longSideLength: number) {
  if (image.aspectRatio > 1) {
    image.width = longSideLength;
    image.height = ~~(longSideLength / image.aspectRatio);
  } else {
    image.height = longSideLength;
    image.width = ~~(longSideLength * image.aspectRatio);
  }
}

export function setSizeByShortSide(image: ImageCollageType, shortSideLength: number) {
  if (image.aspectRatio > 1) {
    image.height = shortSideLength;
    image.width = ~~(shortSideLength * image.aspectRatio);
  } else {
    image.width = shortSideLength;
    image.height = ~~(shortSideLength / image.aspectRatio);
  }
}
