import { createPath, createPolygon } from '@visactor/vrender-core';
import type {
  GridLayoutCellType,
  GridLayoutConfig,
  GridLayoutContext,
  ImageCloudOptions,
  ImageCollageType,
  SegmentationOutputType
} from '../../interface';
import { setSizeByShortSide } from '../../util';
import { Layout } from '../basic';
import { segmentation } from '@visactor/vgrammar-util';
import { rectGridLayout } from './rectGrid';
import { circleGridLayout } from './circlGrid';
import { hexagonalGridLayout } from './hexagonalGrid';

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
    const segmentationInput = this.segmentationInput;
    // 对用户输入的图形进行预处理
    const segmentationOutput: SegmentationOutputType = segmentation(segmentationInput);

    const { cellWidth, cellHeight, cellInfo, cellCount, clipPathMethod, eachPixel, cellPixelCount } =
      this.layoutContext;
    if (images.length === 0 || cellCount === 0 || cellWidth === 0 || cellHeight === 0 || cellInfo.length === 0) {
      this.isLayoutFinished = true;
      return;
    }

    const { layoutConfig = {}, onSegmentationReady } = this.options;
    const { placement = 'default' } = layoutConfig as GridLayoutConfig;

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
        image.clipPath = clipPathMethod(cell, image);
        image.frequency = 1;
        image.visible = imageVisible(cell);
        image.cell = `${cell.row}_${cell.col}`;
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
          images.push(repeatImage);
          repeatImage.visible = imageVisible(cell);
          repeatImage.cell = `${cell.row}_${cell.col}`;
          cell.image = repeatImage;
        }
      }
    }
    // TODO: remove code
    for (const cell of cellInfo) {
      if (this.layoutContext.cellType === 'hexagonal') {
        const polygon = createPolygon({
          x: cell.centerX,
          y: cell.centerY,
          points: this.layoutContext.cellHexPoints.map(p => ({
            x: p.x,
            y: p.y
          })),
          fill: false,
          fillOpacity: 0.1,
          stroke: 'red',
          lineWidth: 1,
          strokeOpacity: 0.2,
          globalZIndex: 1
        });
        this.view.renderer.stage().defaultLayer.add(polygon);
      } else {
        const path = createPath({
          x: cell.image.x,
          y: cell.image.y,
          path: this.layoutContext.clipPathMethod(cell, cell.image),
          fill: false,
          fillOpacity: 0,
          stroke: 'red',
          lineWidth: 1,
          strokeOpacity: 0.2,
          globalZIndex: 1
        });
        this.view.renderer.stage().defaultLayer.add(path);
      }
    }
    return images;
  }
}
