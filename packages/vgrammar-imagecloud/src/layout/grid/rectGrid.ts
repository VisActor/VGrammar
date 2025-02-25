import type { GridLayoutCellType, ImageCloudOptions } from '../../interface';
export function rectGridLayout(options: ImageCloudOptions) {
  const { imageConfig = {}, size, ratio = 0.1, layoutConfig = {} } = options;
  const { padding = 0, imageSize } = imageConfig;
  const [width, height] = size as [number, number];
  let shortSideLength;
  if (imageSize) {
    shortSideLength = imageSize;
  } else {
    shortSideLength = Math.min(width, height) * ratio - padding * 2;
  }
  if (shortSideLength < 0) {
    shortSideLength = 1;
  }

  const cellWidth = shortSideLength;
  const cellHeight = shortSideLength;
  const rows = Math.ceil(height / (cellHeight + padding));
  const cols = Math.ceil(width / (cellWidth + padding));
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
