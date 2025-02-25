import type {
  GridLayoutCellType,
  GridLayoutConfig,
  GridLayoutContext,
  ImageCloudOptions,
  ImageCollageType
} from '../../interface';
import { setSizeByShortSide } from '../../util';
import { Layout } from '../basic';
import { rectGridLayout } from './rectGrid';
import { circleGridLayout } from './circlGrid';
import { hexagonalGridLayout } from './hexagonalGrid';
import { pickWithout } from '@visactor/vutils';

const cellLayout: Record<string, (options: ImageCloudOptions) => { context: GridLayoutContext; imageLength: number }> =
  {
    rect: rectGridLayout,
    circle: circleGridLayout,
    hexagonal: hexagonalGridLayout
  };

export class GridLayout extends Layout {
  private layoutContext: GridLayoutContext;

  preProcess() {
    const images = super.preProcess();
    const { layoutConfig = {} } = this.options;
    const { cellType = 'rect' } = layoutConfig as GridLayoutConfig;

    const cellLayoutMethod = cellLayout[cellType] ?? cellLayout.rect;
    const layoutResult = cellLayoutMethod(this.options);
    const { context, imageLength: shortSideLength } = layoutResult;

    images.forEach(img => setSizeByShortSide(img, shortSideLength));
    // 根据 distance 排序，距离越小，越靠近画布中心，优先布局
    context.cellInfo.sort((cellA, cellB) => cellA.distance - cellB.distance);

    this.layoutContext = context;
    return images;
  }

  doLayout(images: ImageCollageType[]) {
    const { cellWidth, cellHeight, cellInfo, cellCount, clipPath, eachPixel, cellPixelCount } = this.layoutContext;
    if (images.length === 0 || cellCount === 0 || cellWidth === 0 || cellHeight === 0 || cellInfo.length === 0) {
      this.isLayoutFinished = true;
      return;
    }

    const { segmentationOutput } = this;
    const { layoutConfig = {} } = this.options;
    const { placement = 'default' } = layoutConfig as GridLayoutConfig;

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
    const imageVisible = (cell: GridLayoutCellType) => {
      const { intersectPixels } = cell;
      if (placement === 'default') {
        return intersectPixels >= cellPixelCount * 0.45;
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
        image.clipConfig = { shape: clipPath };
        image.frequency = 1;
        image.visible = imageVisible(cell);
        image.cell = pickWithout(cell, ['image']);
        image.distance = cell.distance;
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
          repeatImage.frequency += 1;
          repeatImage[key] = `${repeatImage[key]}_${repeatImage.frequency}`;
          repeatImage.visible = imageVisible(cell);
          repeatImage.distance = cell.distance;
          repeatImage.cell = pickWithout(cell, ['image']);
          cell.image = repeatImage;
          images.push(repeatImage);
        }
      }
    }

    return images.filter(img => img.visible);
  }
}
