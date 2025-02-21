import type { GridLayoutCellType, ImageCloudOptions } from '../../interface';

export function hexagonalGridLayout(options: ImageCloudOptions) {
  const { imageConfig = {}, size, ratio = 0.1, layoutConfig = {} } = options;
  const { padding = 0, imageSize } = imageConfig;
  const [width, height] = size as [number, number];
  const center = { x: width / 2, y: height / 2 };
  // 六边形外接圆半径
  let radius;
  if (imageSize) {
    radius = imageSize / 2;
  } else {
    radius = (Math.min(width, height) * ratio) / 2;
  }
  if (radius - padding <= 0) {
    radius = padding + 1;
  }

  const points: { x: number; y: number }[] = [];
  const sides = 6;
  const step = (2 * Math.PI) / sides;
  for (let i = 0; i < sides; i++) {
    const angle = step * i;
    points.push({
      x: (radius - padding / 2) * Math.cos(angle),
      y: (radius - padding / 2) * Math.sin(angle)
    });
  }
  const diameter = radius * 2;
  const edgeLength = Math.sin(Math.PI / sides) * diameter;
  const cellHeight = Math.sqrt(3) * edgeLength;
  const gridSpaceX = diameter - edgeLength / 2;
  const gridSpaceY = Math.cos(Math.PI / sides) * diameter;
  const gridOffsetY = gridSpaceY / 2;
  const rows = Math.floor(height / cellHeight);
  const cols = Math.floor(width / edgeLength);
  const cellInfo: GridLayoutCellType[] = [];

  for (let r = -1; r <= rows + 1; r++) {
    for (let c = -1; c <= cols; c++) {
      // 计算六边形中心坐标
      const centerX = c * gridSpaceX;
      const centerY = r * gridSpaceY + (c % 2 ? gridOffsetY : 0);
      cellInfo.push({
        centerX,
        centerY,
        x: centerX - edgeLength,
        y: centerY - edgeLength,
        row: r,
        col: c,
        // 计算与中心点的距离
        distance: Math.sqrt(Math.pow(centerX - center.x, 2) + Math.pow(centerY - center.y, 2))
      });
    }
  }

  let cellPixelCount = 0;
  const pixelMap: boolean[] = [];
  for (let r = 0; r <= cellHeight; r++) {
    for (let c = 0; c <= edgeLength * 2; c++) {
      // 判断点(c,r)是否在六边形内
      const px = c - edgeLength; // 相对于六边形中心的x坐标
      const py = r - cellHeight / 2; // 相对于六边形中心的y坐标
      // 使用六边形的数学性质：点到中心的投影在六条边上的投影范围内
      const q2x = Math.abs(px);
      const q2y = Math.abs(py);
      const isInside = q2x <= edgeLength && q2y <= cellHeight / 2 && 2 * q2y + q2x * Math.sqrt(3) <= cellHeight;

      if (isInside) {
        cellPixelCount++;
        pixelMap.push(true);
      } else {
        pixelMap.push(false);
      }
    }
  }

  const context = Object.assign({}, layoutConfig, {
    cellHexSideLength: edgeLength,
    cellHexPoints: points,
    cellHeight,
    cellWidth: edgeLength * 2,
    cellInfo,
    cellCount: cellInfo.length,
    cellType: 'hexagonal',
    cellPixelCount,
    eachPixel: (cell: GridLayoutCellType, callback: (...args: any) => void) => {
      const { x, y } = cell;
      // 遍历六边形外接矩形内的所有点
      let index = 0;
      for (let r = 0; r <= cellHeight; r++) {
        for (let c = 0; c <= edgeLength * 2; c++) {
          if (pixelMap[index++]) {
            callback((~~y + r) * width + (~~x + c));
          }
        }
      }
    },
    clipPath: `M 1 0 L 0.5 0.866 L -0.5 0.866 L -1 0 L -0.5 -0.866 L 0.5 -0.866 Z`
  });
  return { context, imageLength: diameter - padding };
}
