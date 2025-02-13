import { createArc, createPath, createPolygon, createRect } from '@visactor/vrender-core';
import type {
  GridLayoutCellType,
  GridLayoutConfig,
  GridLayoutContext,
  ImageCloudOptions,
  ImageCollageInputType,
  SegmentationOutputType
} from '../interface';
import { setSizeByShortSide, visualizeSegmentation } from '../util';
import { Layout } from './baisc';
import { segmentation } from '@visactor/vgrammar-util';

export class GridLayout extends Layout {
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

    const { layoutConfig = {} } = this.options;
    const { cellType = 'rect' } = layoutConfig as GridLayoutConfig;

    const layoutMethod = cellLayout[cellType] ?? cellLayout.rect;
    const layoutResult = layoutMethod(this.options);

    const { context, imageLength: shortSideLength } = layoutResult;

    images.forEach(img => setSizeByShortSide(img, shortSideLength));
    // 根据 distance 排序，距离越小，越靠近画布中心，优先布局
    context.cellInfo.sort((cellA, cellB) => cellA.distance - cellB.distance);

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

    const {
      cellWidth,
      cellHeight,
      cellInfo,
      cellCount,
      clipPathMethod,
      eachPixel: eachPixels,
      cellPixelCount
    } = this.layoutContext;
    if (images.length === 0 || cellCount === 0 || cellWidth === 0 || cellHeight === 0 || cellInfo.length === 0) {
      this.isLayoutFinished = true;
      return;
    }

    const { layoutConfig = {} } = this.options;
    const { placement = 'default' } = layoutConfig as GridLayoutConfig;
    /** debug 用 */
    visualizeSegmentation(
      segmentationOutput.segmentation.labels,
      segmentationOutput.size[0],
      segmentationOutput.size[1]
    );

    if (placement === 'edge' || placement === 'default') {
      const { segmentation, size } = segmentationOutput;
      const { labels } = segmentation;

      cellInfo.forEach(cell => {
        let intersectPixelCount = 0;
        eachPixels(cell, (index: number) => {
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
        image.clipPath = clipPathMethod(cell, image);
        image._frequency = 1;
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
          repeatImage._frequency += 1;
          repeatImage[key] = `${repeatImage[key]}_${repeatImage._frequency}`;
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
            x: cell.centerX + p.x,
            y: cell.centerY + p.y
          })),
          fill: 'red',
          fillOpacity: 0.1,
          stroke: 'red',
          lineWidth: 1,
          strokeOpacity: 0.1,
          globalZIndex: 1
        });
        this.view.renderer.stage().defaultLayer.add(polygon);
      } else {
        const path = createPath({
          x: cell.image.x,
          y: cell.image.y,
          path: this.layoutContext.clipPathMethod(cell, cell.image),
          fill: false,
          fillOpacity: 0.1,
          stroke: 'red',
          lineWidth: 1,
          strokeOpacity: 0.1,
          globalZIndex: 1
        });
        this.view.renderer.stage().defaultLayer.add(path);
      }
    }
    this.progressiveResult = images;
  }
}

const cellLayout: Record<string, (options: ImageCloudOptions) => { context: GridLayoutContext; imageLength: number }> =
  {
    rect: rectCellLayout,
    circle: circleCellLayout,
    hexagonal: hexagonalCellLayout
  };

function rectCellLayout(options: ImageCloudOptions) {
  const { imageConfig = {}, size, ratio = 0.1, layoutConfig = {} } = options;
  const { padding = 0 } = imageConfig;
  const [width, height] = size;

  let shortSideLength = Math.min(width, height) * ratio - padding * 2;
  if (shortSideLength < 0) {
    shortSideLength = 1;
  }

  const cellWidth = shortSideLength;
  const cellHeight = shortSideLength;
  const rows = Math.ceil(size[1] / (cellWidth + padding));
  const cols = Math.ceil(size[0] / (cellHeight + padding));
  const cellCounts = cols * rows;
  const center = { x: width / 2, y: height / 2 };
  const cellInfo = new Array<GridLayoutCellType>(cellCounts);
  // 初始化 cell 信息
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // 计算cell的中心点坐标
      const cellCenterX = c * cellHeight + cellWidth / 2 + padding * c;
      const cellCenterY = r * cellWidth + cellHeight / 2 + padding * r;
      // 将cell信息存储到数组中
      cellInfo[r * cols + c] = {
        centerX: cellCenterX,
        centerY: cellCenterY,
        x: cellCenterX - cellWidth / 2,
        y: cellCenterY - cellHeight / 2,
        row: r,
        col: c,
        // 计算与中心点的距离
        distance: Math.sqrt(Math.pow(cellCenterX - center.x, 2) + Math.pow(cellCenterY - center.y, 2))
      };
    }
  }
  const context = Object.assign({}, layoutConfig, {
    cellWidth,
    cellHeight,
    cellInfo,
    cellCount: cellInfo.length,
    cellType: 'rect',
    cellPixelCount: cellWidth * cellHeight,
    eachPixel: (cell: GridLayoutCellType, callback: (...args: any) => void) => {
      const { x, y } = cell;
      for (let r = 0; r < cellWidth; r++) {
        for (let c = 0; c < cellHeight && y + r <= height; c++) {
          if (x + c > width) {
            continue;
          }
          callback((~~y + r) * width + (~~x + c));
        }
      }
    },
    clipPathMethod: (cell: any, image: any) => {
      const startX = cell.x - image.x;
      const startY = cell.y - image.y;
      return `M ${startX},${startY} L ${startX + cellWidth},${startY} L ${startX + cellWidth},${
        startY + cellHeight
      } L ${startX},${startY + cellHeight} Z`;
    }
  });

  return { context, imageLength: shortSideLength };
}

function circleCellLayout(options: ImageCloudOptions) {
  const { imageConfig = {}, size, ratio = 0.1, layoutConfig = {} } = options;
  const { padding = 0 } = imageConfig;
  const [width, height] = size;
  const center = { x: width / 2, y: height / 2 };
  let circleRadius = (Math.min(width, height) * ratio) / 2 - padding;
  if (circleRadius <= 0) {
    circleRadius = 1;
  }

  const circleDiameter = circleRadius * 2; // 圆的直径

  // 六边形排列偏移量
  const rowHeight = (Math.sqrt(3) / 2) * circleDiameter; // 行间距

  const cellInfo: GridLayoutCellType[] = [];
  let index = 0;
  // 绘制六边形排列的圆
  for (let r = 0; r * rowHeight - circleRadius < height; r++) {
    const y = r * rowHeight; // 当前行的Y坐标
    const offsetX = r % 2 === 0 ? 0 : circleRadius; // 奇偶行错位
    for (let c = -1; c * circleDiameter + offsetX - circleRadius < width; c++) {
      const x = c * circleDiameter + offsetX + circleRadius + padding; // 当前圆的X坐标
      // 将cell信息存储到数组中
      cellInfo[index++] = {
        centerX: x,
        centerY: y,
        x: x - circleRadius,
        y: y - circleRadius,
        row: r,
        col: c,
        // 计算与中心点的距离
        distance: Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2))
      };
    }
  }
  let cellPixelCount = 0;
  const rSquared = circleRadius * circleRadius;
  for (let r = 0; r < circleDiameter; r++) {
    for (let c = 0; c < circleDiameter; c++) {
      const dx = r - circleRadius;
      const dy = c - circleRadius;
      if (dx * dx + dy * dy <= rSquared) {
        cellPixelCount++;
      }
    }
  }
  const context = Object.assign({}, layoutConfig, {
    cellWidth: circleDiameter,
    cellHeight: circleDiameter,
    cellInfo,
    cellCount: cellInfo.length,
    cellType: 'circle',
    cellPixelCount: cellPixelCount, // 离散化后有误差
    eachPixel: (cell: GridLayoutCellType, callback: (...args: any) => void) => {
      const { x, y } = cell;
      for (let r = 0; r < circleDiameter; r++) {
        for (let c = 0; c < circleDiameter; c++) {
          if (r + x < 0 || r + x > width || c + y > height || c + y < 0) {
            continue;
          }
          const dx = r - circleRadius;
          const dy = c - circleRadius;
          if (dx * dx + dy * dy <= rSquared) {
            callback((~~y + r) * width + (~~x + c));
          }
        }
      }
    },
    clipPathMethod: (cell: any, image: any) => {
      // 生成圆形的 SVG 路径
      const radius = circleRadius;
      const startX = cell.x - image.x + radius;
      const startY = cell.y - image.y + radius;
      return `M ${startX},${startY} m -${radius},0 a ${radius},${radius} 0 1,0 ${
        radius * 2
      },0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
    }
  });
  return { context, imageLength: circleDiameter };
}

function hexagonalCellLayout(options: ImageCloudOptions) {
  const { imageConfig = {}, size, ratio = 0.1, layoutConfig = {} } = options;
  const { padding = 0 } = imageConfig;
  const [width, height] = size;
  const center = { x: width / 2, y: height / 2 };
  // 六边形外接圆半径
  let radius = ~~(Math.min(width, height) * ratio) / 2;
  if (radius - padding <= 0) {
    radius = padding + 1;
  }

  const points = [];
  const sides = 6;
  const step = (2 * Math.PI) / sides;
  for (let i = 0; i < sides; i++) {
    const angle = step * i;
    points.push({
      x: 0 + (radius - padding) * Math.cos(angle),
      y: 0 + (radius - padding) * Math.sin(angle)
    });
  }
  const diameter = radius * 2;
  const edgeLength = Math.sin(Math.PI / sides) * diameter;
  const cellHeight = Math.sqrt(3) * edgeLength;
  const gridSpaceX = diameter - edgeLength / 2;
  const gridSpaceY = Math.cos(Math.PI / sides) * diameter;
  const gridOffsetY = gridSpaceY / 2;
  const rows = height / cellHeight;
  const cols = width / (edgeLength * 2);
  const cellInfo: GridLayoutCellType[] = [];

  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      // 计算六边形中心坐标
      const centerX = Math.floor(r * gridSpaceX);
      const centerY = Math.floor(c * gridSpaceY + (r % 2 ? gridOffsetY : 0));
      cellInfo.push({
        centerX,
        centerY,
        x: centerX - radius,
        y: centerY - radius,
        row: r,
        col: c,
        // 计算与中心点的距离
        distance: Math.sqrt(Math.pow(centerX - center.x, 2) + Math.pow(centerX - center.y, 2))
      });
    }
  }
  console.log('hex end');
  const context = Object.assign({}, layoutConfig, {
    cellHexSideLength: edgeLength,
    cellHexPoints: points,
    cellHeight: Math.sqrt(3) * edgeLength,
    cellInfo,
    cellCount: cellInfo.length,
    cellType: 'hexagonal',
    cellPixelCount: ((3 * Math.sqrt(3)) / 2) * radius ** 2,
    eachPixel: (cell: GridLayoutCellType, callback: (...args: any) => void) => {
      const { x, y } = cell;
      // 遍历六边形外接矩形内的所有点
      for (let r = -cellHeight / 2; r <= cellHeight / 2; r++) {
        for (let c = -edgeLength; c <= edgeLength; c++) {
          if (
            r >= -cellHeight / 2 &&
            r <= cellHeight / 2 &&
            Math.abs(c) <= edgeLength - (r / (cellHeight / 2)) * edgeLength
          ) {
            callback((~~x + r) * width + (~~y + c));
          }
        }
      }
    },
    clipPathMethod: (cell: any, image: any) => {
      // 生成圆形的 SVG 路径
      // const radius = radius;
      // const startX = cell.x - image.x + radius;
      // const startY = cell.y - image.y + radius;
      // return `M ${startX},${startY} m -${radius},0 a ${radius},${radius} 0 1,0 ${
      //   radius * 2
      // },0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
    }
  });
  return { context, imageLength: cellHeight };
}
