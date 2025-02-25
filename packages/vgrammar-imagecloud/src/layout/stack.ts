import type {
  GridLayoutCellType,
  GridLayoutContext,
  ImageCollageInputType,
  SegmentationOutputType,
  StackLayoutConfig
} from '../interface';
import { Layout } from './basic';
import { field, setSize } from '../util';
import { extent, segmentation } from '@visactor/vgrammar-util';
import { rectGridLayout } from './grid/rectGrid';
import { isFunction, isNumber } from '@visactor/vutils';
import { SqrtScale } from '@visactor/vscale';

export class StackLayout extends Layout {
  private layoutContext: GridLayoutContext;

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

    const { imageConfig = {}, ratio = 0.1 } = this.options;
    const size = this.options.size as [number, number];
    const { imageSizeRange, padding = 0 } = imageConfig;
    const imageSize = isNumber(imageConfig.imageSize) ? imageConfig.imageSize : field(imageConfig.imageSize);
    const layoutMethod = rectGridLayout;
    const layoutResult = layoutMethod(Object.assign({}, this.options, { imageConfig: { imageSize: null } }));

    const { context } = layoutResult;

    // 根据 distance 排序，距离越小，越靠近画布中心，优先布局
    context.cellInfo.sort((cellA, cellB) => cellA.distance - cellB.distance);

    // TODO: 重复代码
    if (!imageSize) {
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
    } else if (imageSize && isFunction(imageSize) && imageSizeRange) {
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

    this.layoutContext = context;

    return images;
  }

  doLayout(images: ImageCollageInputType[]) {
    const segmentationInput = this.segmentationInput;
    // 对用户输入的图形进行预处理
    const segmentationOutput: SegmentationOutputType = segmentation(segmentationInput);

    if (!segmentationOutput.segmentation.regions.length) {
      return;
    }

    const { cellWidth, cellHeight, cellInfo, cellCount, eachPixel, cellPixelCount } = this.layoutContext;
    if (images.length === 0 || cellCount === 0 || cellWidth === 0 || cellHeight === 0 || cellInfo.length === 0) {
      this.isLayoutFinished = true;
      return;
    }

    const { layoutConfig = {}, onSegmentationReady } = this.options;
    const size = this.options.size as [number, number];
    const { placement = 'default', maxAngle = 45 * (Math.PI / 180) } = layoutConfig as StackLayoutConfig;

    if (onSegmentationReady) {
      onSegmentationReady(segmentationOutput);
    }

    if (placement === 'edge' || placement === 'default') {
      const { segmentation } = segmentationOutput;
      const { labels } = segmentation;

      cellInfo.forEach(cell => {
        let intersectPixelCount = 0;
        eachPixel(cell, (index: number) => {
          if (labels[index]) {
            intersectPixelCount++;
          }
        });
        cell.intersectPixels = intersectPixelCount;
      });
    }

    const imageCount = images.length;
    const maxDistance = Math.sqrt(Math.pow(size[0], 2) + Math.pow(size[1], 2));
    const imageVisible = (cell: GridLayoutCellType) => {
      const { intersectPixels } = cell;
      if (placement === 'default') {
        return intersectPixels > cellPixelCount * 0.5;
      } else if (placement === 'edge') {
        return intersectPixels > cellPixelCount * 0.1 && intersectPixels < cellPixelCount;
      }
      return true;
    };

    // 先将所有图片布局一遍
    for (let i = 0; i < imageCount; i++) {
      const image = images[i];
      const cell = cellInfo[i];
      if (cell) {
        image.x = cell.centerX - image.width / 2;
        image.y = cell.centerY - image.height / 2;
        image.visible = imageVisible(cell);
        image.cell = `${cell.row}_${cell.col}`;
        image.angle = Math.random() * (2 * maxAngle) - maxAngle;
        image.anchor = [image.x + image.width / 2, image.y + image.height / 2];
        image.zIndex = maxDistance - cell.distance;
        image.frequency = 1;
        cell.image = image;
      }
    }

    // TODO: dataIndexKey
    const key = Object.keys(images[0]).find(k => k.includes('VGRAMMAR'));
    if (imageCount < cellCount) {
      // 图片数量小于cell数量，创建重复图片用于填充剩余 cell
      for (let i = imageCount; i < cellCount; i++) {
        const image = images[i - imageCount];
        const cell = cellInfo[i];
        if (cell) {
          const repeatImage = Object.assign({}, image);
          repeatImage.x = cell.centerX - repeatImage.width / 2;
          repeatImage.y = cell.centerY - repeatImage.height / 2;
          repeatImage.anchor = [repeatImage.x + repeatImage.width / 2, repeatImage.y + repeatImage.height / 2];
          repeatImage.angle = Math.random() * (2 * maxAngle) - maxAngle;
          repeatImage.frequency += 1;
          repeatImage[key] = `${repeatImage[key]}_${repeatImage.frequency}`;
          repeatImage.visible = imageVisible(cell);
          repeatImage.cell = `${cell.row}_${cell.col}`;
          repeatImage.zIndex = maxDistance - cell.distance;
          cell.image = repeatImage;
          images.push(repeatImage);
        }
      }
    }
    this.progressiveResult = images;
  }
}
