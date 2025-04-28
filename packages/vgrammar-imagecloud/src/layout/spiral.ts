/* eslint-disable max-depth */
import type { ImageCollageType, SegmentationOutputType, SpiralLayoutConfig } from '../interface';
import { minInArray } from '@visactor/vutils';
import { setSize } from '../util';
import { Layout } from './basic';
import { spirals } from '@visactor/vgrammar-util';
export class SpiralLayout extends Layout {
  preProcess() {
    const images = super.preProcess();
    const { imageConfig = {}, ratio = 0.45 } = this.options;
    return this.calculateImageSize(images, imageConfig, ratio);
  }

  private tryPlaceImage(
    image: ImageCollageType,
    size: [number, number],
    spiralType: string,
    segmentationOutput: SegmentationOutputType,
    fixedImages: ImageCollageType[],
    dt: number = 1
  ) {
    const [width, height] = size;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxR = Math.sqrt(centerX ** 2 + centerY ** 2);
    const spiral = spirals[spiralType](size);
    let t = -dt;
    let dx;
    let dy;

    const { segmentation } = segmentationOutput;
    const { labels } = segmentation;

    while (([dx, dy] = spiral((t += dt)))) {
      if (Math.min(Math.abs(dx), Math.abs(dy)) >= maxR) {
        break;
      }
      dx -= image.width / 2;
      dy -= image.height / 2;
      image.visible = true;
      image.x = ~~(centerX + dx);
      image.y = ~~(centerY + dy);
      image._left = image.x + image.padding;
      image._top = image.y + image.padding;
      image._leftWithoutPadding = image.x;
      image._topWithoutPadding = image.y;

      if (fit(image, fixedImages)) {
        const { x, y, width: imageWidth, height: imageHeight } = image;
        let intersect = false;
        for (let r = 0; r < imageWidth; r++) {
          for (let c = 0; c < imageHeight && y + r <= height; c++) {
            if (x + c > width) {
              continue;
            }
            const token = !!labels[(y + r) * width + (x + c)];
            if (!token) {
              intersect = true;
              break;
            }
          }
          if (intersect) {
            break;
          }
        }
        if (!intersect) {
          // 检查四个顶点
          const corners = [
            { x: image.x, y: image.y },
            { x: image.x + image.width, y: image.y },
            { x: image.x, y: image.y + image.height },
            { x: image.x + image.width, y: image.y + image.height }
          ];
          let allCornersInShape = true;
          for (const corner of corners) {
            if (!labels[corner.y * width + corner.x]) {
              allCornersInShape = false;
              break;
            }
          }
          if (!allCornersInShape) {
            continue;
          }
          return true;
        }
      }
    }
    return false;
  }

  doLayout(images: ImageCollageType[]) {
    const { segmentationOutput } = this;
    const { layoutConfig = {} as SpiralLayoutConfig } = this.options;
    const size = this.options.size as [number, number];
    const {
      spiralType = 'archimedean',
      fillingTimes = 4,
      minFillingImageSize = 10
    } = layoutConfig as SpiralLayoutConfig;

    const fixedImages = [];
    const key = Object.keys(images[0]).find(k => k.includes('VGRAMMAR'));

    // 放置主要图片
    for (const image of images) {
      image._widthWithPadding = image.width + image.padding * 2;
      image._heightWithPadding = image.height + image.padding * 2;
      image.frequency = 1;

      if (this.tryPlaceImage(image, size, spiralType, segmentationOutput, fixedImages)) {
        fixedImages.push(image);
      }
    }

    // 填充小图片
    const fillingSizeFactor = 0.5;
    const fillingSizeDelta = 1;
    const minImageWidth = minInArray(fixedImages, (a, b) => a.width - b.width).width;
    const minImageHeight = minInArray(fixedImages, (a, b) => a.height - b.height).height;
    const fixedFillingImages = [];

    for (let i = 0; i < fillingTimes; i++) {
      const minWidth = minImageWidth * fillingSizeFactor - fillingSizeDelta * i;
      const minHeight = minImageHeight * fillingSizeFactor - fillingSizeDelta * i;

      for (const image of images) {
        const fillingImage = Object.assign({}, image, { visible: true });
        const imageSize = Math.max(minFillingImageSize, fillingImage.aspectRatio > 1 ? minWidth : minHeight);
        setSize(fillingImage, imageSize);
        fillingImage._widthWithPadding = fillingImage.width + fillingImage.padding * 2;
        fillingImage._heightWithPadding = fillingImage.height + fillingImage.padding * 2;

        if (
          this.tryPlaceImage(
            fillingImage,
            size,
            spiralType,
            segmentationOutput,
            [...fixedFillingImages, ...fixedImages],
            0.5
          )
        ) {
          image._tempFrequency = (image._tempFrequency ?? image.frequency) + 1;
          fillingImage.frequency = image._tempFrequency;
          fillingImage.distance = Math.sqrt(
            Math.pow(fillingImage.x - size[0] / 2, 2) + Math.pow(fillingImage.y - size[1] / 2, 2)
          );
          fillingImage[key] = `${fillingImage[key]}_${fillingImage.frequency}`;
          fixedFillingImages.push(fillingImage);
        }
      }
    }
    return [...fixedImages, ...fixedFillingImages].filter(image => image.visible);
  }
}

function fit(image: ImageCollageType, fixedImages: ImageCollageType[]) {
  for (let i = 0; i < fixedImages.length; i++) {
    if (isOverlap(image, fixedImages[i])) {
      return false;
    }
  }
  return true;
}

// 判断矩形是否重叠
function isOverlap(a: ImageCollageType, b: ImageCollageType) {
  if (
    a._leftWithoutPadding + a._widthWithPadding < b._leftWithoutPadding ||
    a._topWithoutPadding + a._heightWithPadding < b._topWithoutPadding ||
    a._leftWithoutPadding > b._leftWithoutPadding + b._widthWithPadding ||
    a._topWithoutPadding > b._topWithoutPadding + b._heightWithPadding
  ) {
    return false;
  }
  return true;
}
