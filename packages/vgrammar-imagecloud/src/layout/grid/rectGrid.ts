import type { GridLayoutCellType, GridLayoutConfig, ImageCloudOptions } from '../../interface';

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

  const { rectAspectRatio = 1 } = layoutConfig as GridLayoutConfig;

  let cellWidth: number;
  let cellHeight: number;
  if (rectAspectRatio > 1) {
    cellWidth = shortSideLength;
    cellHeight = shortSideLength / rectAspectRatio;
  } else {
    cellHeight = shortSideLength;
    cellWidth = shortSideLength * rectAspectRatio;
  }
  const rows = Math.ceil(height / (cellHeight + padding));
  const cols = Math.ceil(width / (cellWidth + padding));
  const cellCounts = cols * rows;
  const center = { x: width / 2, y: height / 2 };
  const cellInfo = new Array<GridLayoutCellType>(cellCounts);
  // 初始化 cell 信息
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // 计算cell的中心点坐标
      const cellCenterX = c * (cellWidth + padding) + cellWidth / 2;
      const cellCenterY = r * (cellHeight + padding) + cellHeight / 2;

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
    // 以矩形(0,0)为中心，cellWidth * cellHeight 的矩形
    clipPath: `M${-cellWidth / 2} ${-cellHeight / 2} L${cellWidth / 2} ${-cellHeight / 2} L${cellWidth / 2} ${
      cellHeight / 2
    } L${-cellWidth / 2} ${cellHeight / 2} Z`
  });

  return { context, imageLength: shortSideLength };
}
