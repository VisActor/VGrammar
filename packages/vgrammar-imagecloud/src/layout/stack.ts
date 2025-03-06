import type { GridLayoutCellType, GridLayoutContext, ImageCollageType, StackLayoutConfig } from '../interface';
import { Layout } from './basic';
import { rectGridLayout } from './grid/rectGrid';

export class StackLayout extends Layout {
  private layoutContext: GridLayoutContext;

  preProcess() {
    const images = super.preProcess();
    const { imageConfig = {}, ratio = 0.1 } = this.options;
    const cellLayoutMethod = rectGridLayout;
    this.layoutContext = cellLayoutMethod(
      Object.assign({}, this.options, { imageConfig: { imageSize: null } })
    ).context;

    // 根据 distance 排序，距离越小，越靠近画布中心，优先布局
    this.layoutContext.cellInfo.sort((cellA, cellB) => cellA.distance - cellB.distance);
    return this.calculateImageSize(images, imageConfig, ratio);
  }

  doLayout(images: ImageCollageType[]) {
    const { segmentationOutput } = this;

    const { cellWidth, cellHeight, cellInfo, cellCount, eachPixel, cellPixelCount } = this.layoutContext;
    if (images.length === 0 || cellCount === 0 || cellWidth === 0 || cellHeight === 0 || cellInfo.length === 0) {
      this.isLayoutFinished = true;
      return;
    }

    const { layoutConfig = {} } = this.options;
    const size = this.options.size as [number, number];
    const { placement = 'default', maxAngle = 45 * (Math.PI / 180) } = layoutConfig as StackLayoutConfig;

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
        image.distance = cell.distance;
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
          repeatImage.distance = cell.distance;
          repeatImage.zIndex = maxDistance - cell.distance;
          cell.image = repeatImage;
          images.push(repeatImage);
        }
      }
    }
    return images.filter(img => img.visible);
  }
}
