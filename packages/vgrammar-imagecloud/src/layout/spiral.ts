/* eslint-disable max-depth */
import type { ImageCollageInputType, SegmentationOutputType, SpiralLayoutConfig } from '../interface';
import { isFunction, isNumber, minInArray } from '@visactor/vutils';
import { SqrtScale } from '@visactor/vscale';
import { extent, segmentation } from '@visactor/vgrammar-util';
import { field, setSize } from '../util';
import { Layout } from './basic';

export class SpiralLayout extends Layout {
  // TODO:
  onImageCollageInputReady(images: any): void {
    images.forEach((img: any, i: number) => {
      if (img.status === 'fulfilled') {
        const imageElement = img.value;
        const { width, height } = imageElement;
        this.imageCollageList.push(Object.assign({}, this.data[i], { aspectRatio: width / height }));
      } else {
        //  对加载失败的图片设为不可用
        this.imageCollageList.push(Object.assign({}, this.data[i], { valid: false }));
      }
    });
  }

  preProcess() {
    const images = super.preProcess();
    const { imageConfig = {}, ratio = 0.45 } = this.options;
    const size = this.options.size as [number, number];
    const { imageSizeRange, padding = 0 } = imageConfig;
    const imageSize = isNumber(imageConfig.imageSize) ? imageConfig.imageSize : field(imageConfig.imageSize);
    if (!imageSize && !imageSizeRange) {
      // 用户没有设置图片大小，则自动计算一个统一的大小
      const imageArea = images.reduce((prev, pic) => {
        const r = pic.aspectRatio;
        return prev + (r > 1 ? 1 / r : r);
      }, 0);
      let longSideLength = ~~Math.sqrt((ratio * size[0] * size[1]) / imageArea);
      // 减掉 padding 的影响
      longSideLength = longSideLength - 2 * padding < 0 ? 1 : longSideLength - 2 * padding;
      images.forEach(img => setSize(img, longSideLength));
    } else if (imageSize && !isFunction(imageSize)) {
      // 用户指定了统一的图片大小
      images.forEach(img => setSize(img, imageSize));
    } else if (imageSizeRange) {
      // 用户指定了图片大小的范围
      const sizeScale = new SqrtScale().domain(extent(images, d => d.weight)).range(imageSizeRange);
      images.forEach(img => setSize(img, ~~sizeScale.scale(img.weight)));
    } else if (imageSize && isFunction(imageSize) && !imageSizeRange) {
      // 用户没指定图片大小范围，但指定了图片大小的对应的 key
      const a = 0.5;
      const [min, max] = extent(images, d => d.weight);
      const picArea = images.reduce((prev, img) => {
        const r = img.aspectRatio;
        const w = (img.weight - min) / (max - min);
        return prev + (r > 1 ? 1 / r : r) * (a + (1 - a) * w) ** 2;
      }, 0);
      const x = ~~Math.sqrt((ratio * size[0] * size[1]) / picArea);
      const range = [
        ~~(a * x) - padding * 2 < 0 ? 1 : ~~(a * x) - padding * 2,
        ~~x - padding * 2 < 0 ? 1 : ~~x - padding * 2
      ];

      const sizeScale = new SqrtScale().domain(extent(images, d => d.weight)).range(range);
      images.forEach(img => setSize(img, ~~sizeScale.scale(img.weight)));
    } else {
      console.warn('image cloud imageSize error');
    }

    return images;
  }

  doLayout(images: ImageCollageInputType[]) {
    const segmentationInput = this.segmentationInput;
    // 对用户输入的图形进行预处理
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

    const [width, height] = size;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxR = Math.sqrt(centerX ** 2 + centerY ** 2);
    const fixedImages = [];

    for (const image of images) {
      // o 打头的变量是计算 overlap 使用的，引入是为了实现 padding
      image._widthWithPadding = image.width + image.padding * 2;
      image._heightWithPadding = image.height + image.padding * 2;
      const dt = 1;
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
        image.frequency = 1;
        if (fit(image, fixedImages)) {
          const { x, y, width: imageWidth, height: imageHeight } = image;
          for (let r = 0; r < imageWidth; r++) {
            for (let c = 0; c < imageHeight && y + r <= height; c++) {
              if (x + c > width) {
                break;
              }
              const token = !!labels[(y + r) * width + (x + c)];
              if (!token) {
                image.visible = false;
                break;
              }
            }
          }
          if (image.visible) {
            fixedImages.push(image);
            break;
          }
        }
      }
    }

    const fillingSizeFactor = 0.5;
    const fillingSizeDelta = 1;
    const minImageWidth = minInArray(fixedImages, (a, b) => a.width - b.width).width;
    const minImageHeight = minInArray(fixedImages, (a, b) => a.height - b.height).height;
    const fixedFillingImages = [];
    // TODO: dataIndexKey
    const key = Object.keys(images[0]).find(k => k.includes('VGRAMMAR'));
    for (let i = 0; i < fillingTimes; i++) {
      const minWidth = minImageWidth * fillingSizeFactor - fillingSizeDelta * i;
      const minHeight = minImageHeight * fillingSizeFactor - fillingSizeDelta * i;
      for (const image of images) {
        const fillingImage = Object.assign({}, image, { visible: true });
        const imageSize = Math.max(minFillingImageSize, fillingImage.aspectRatio > 1 ? minWidth : minHeight);
        setSize(fillingImage, imageSize);
        fillingImage._widthWithPadding = fillingImage.width + fillingImage.padding * 2;
        fillingImage._heightWithPadding = fillingImage.height + fillingImage.padding * 2;
        const dt = 0.5;
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
          dx -= fillingImage.width / 2;
          dy -= fillingImage.height / 2;
          fillingImage.x = ~~(centerX + dx);
          fillingImage.y = ~~(centerY + dy);
          fillingImage._left = fillingImage.x + fillingImage.padding;
          fillingImage._top = fillingImage.y + fillingImage.padding;
          fillingImage._leftWithoutPadding = fillingImage.x;
          fillingImage._topWithoutPadding = fillingImage.y;

          if (fit(fillingImage, fixedFillingImages) && fit(fillingImage, fixedImages)) {
            const { x, y, width: imageWidth, height: imageHeight } = fillingImage;
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
            }
            if (!intersect) {
              image._tempFrequency = (image._tempFrequency ?? image.frequency) + 1;
              fillingImage.frequency = image._tempFrequency;
              fillingImage.visible = true;
              fillingImage[key] = `${fillingImage[key]}_${fillingImage.frequency}`;
              fixedFillingImages.push(fillingImage);
              break;
            }
          }
        }
      }
    }

    this.progressiveResult = [...fixedImages, ...fixedFillingImages];

    // filling Image

    // TODO: as 逻辑
    // const as = this.options.as ? { ...OUTPUT, ...this.options.as } : OUTPUT;
    // const modeKeyImages = [];
    // let w;
    // let t;
    // for(let i = 0; i < images.length; i++) {
    //   w = images[i];
    //   t = w.datum;
    //   t[as.x] = w.x;
    //   t[as.y] = w.y;
    //   t[as.fontFamily] = w.fontFamily;
    //   t[as.fontSize] = w.fontSize;
    //   t[as.fontStyle] = w.fontStyle;
    //   t[as.fontWeight] = w.fontWeight;
    //   t[as.angle] = degreeToRadian(w.rotate);
    //   t[as.opacity] = w.opacity;
    //   t[as.visible] = w.visible;
    //   t[as.isFillingWord] = false;
    //   t[as.color] = w.color;
    //   t.dataIndexKey = `${w.text}_${i}_keyword`;
    //   modeKeyImages.push(t);
    // }
  }
}

const spirals = {
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

function fit(image: ImageCollageInputType, fixedImages: ImageCollageInputType[]) {
  for (let i = 0; i < fixedImages.length; i++) {
    if (isOverlap(image, fixedImages[i])) {
      return false;
    }
  }
  return true;
}

// 判断矩形是否重叠
function isOverlap(a: ImageCollageInputType, b: ImageCollageInputType) {
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
