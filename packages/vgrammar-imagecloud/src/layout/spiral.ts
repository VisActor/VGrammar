/* eslint-disable max-depth */
import type { ImageCollageType, SegmentationOutputType, SpiralLayoutConfig } from '../interface';
import { minInArray } from '@visactor/vutils';
import { segmentation } from '@visactor/vgrammar-util';
import { setSize } from '../util';
import { Layout } from './basic';

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
          return true;
        }
      }
    }
    return false;
  }

  doLayout(images: ImageCollageType[]) {
    const segmentationInput = this.segmentationInput;
    const segmentationOutput: SegmentationOutputType = segmentation(segmentationInput);

    if (!segmentationOutput.segmentation.regions.length) {
      return;
    }

    const { layoutConfig = {} as SpiralLayoutConfig, onSegmentationReady } = this.options;
    const size = this.options.size as [number, number];
    const {
      spiralType = 'archimedean',
      fillingTimes = 4,
      minFillingImageSize = 10
    } = layoutConfig as SpiralLayoutConfig;

    if (onSegmentationReady) {
      onSegmentationReady(segmentationOutput);
    }

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

    return [...fixedImages, ...fixedFillingImages];
  }
}

const spirals: Record<string, (size: [number, number]) => (t: number) => number[]> = {
  archimedean: archimedeanSpiral,
  rectangular: rectangularSpiral
};

function archimedeanSpiral(size: [number, number]) {
  const e = size[0] / size[1];
  return function (t: number) {
    return [e * (t *= 0.1) * Math.cos(t), t * Math.sin(t)];
  };
}

function rectangularSpiral(size: [number, number]) {
  const dy = 4;
  const dx = (dy * size[0]) / size[1];
  let x = 0;
  let y = 0;
  return function (t: number) {
    const sign = t < 0 ? -1 : 1;
    // See triangular numbers: T_n = n * (n + 1) / 2.
    switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
      case 0:
        x += dx;
        break;
      case 1:
        y += dy;
        break;
      case 2:
        x -= dx;
        break;
      default:
        y -= dy;
        break;
    }
    return [x, y];
  };
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
