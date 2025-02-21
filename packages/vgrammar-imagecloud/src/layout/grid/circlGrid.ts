import type { GridLayoutCellType, ImageCloudOptions } from '../../interface';

export function circleGridLayout(options: ImageCloudOptions) {
  const { imageConfig = {}, size, ratio = 0.1, layoutConfig = {} } = options;
  const { padding = 0, imageSize = 0 } = imageConfig;
  const [width, height] = size as [number, number];
  const center = { x: width / 2, y: height / 2 };
  let circleRadius = 0;
  if (imageSize) {
    circleRadius = imageSize / 2;
  } else {
    circleRadius = (Math.min(width, height) * ratio) / 2;
  }
  if (circleRadius - padding <= 0) {
    circleRadius = padding + 1;
  }

  const circleDiameter = circleRadius * 2; // 圆的直径

  // 六边形排列偏移量
  const rowHeight = (Math.sqrt(3) / 2) * circleDiameter + padding; // 行间距

  const cellInfo: GridLayoutCellType[] = [];
  let index = 0;
  // 绘制六边形排列的圆
  for (let r = 0; r * rowHeight - circleRadius < height; r++) {
    const y = r * rowHeight; // 当前行的Y坐标
    const offsetX = r % 2 === 0 ? 0 : circleRadius; // 奇偶行错位
    for (let c = -1; c * (circleDiameter + padding) + offsetX - circleRadius < width; c++) {
      const x = c * (circleDiameter + padding) + offsetX + circleRadius; // 当前圆的X坐标
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
    cellPixelCount,
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
    clipPath: `M 1 0 A 1 1 0 1 0 -1 0 A 1 1 0 1 0 1 0 Z`
  });
  return { context, imageLength: circleDiameter };
}
