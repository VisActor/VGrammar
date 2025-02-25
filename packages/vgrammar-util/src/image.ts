import type { GeometricMaskShape, TextShapeMask } from './types/wordcloud';
import type { IPointLike } from '@visactor/vutils';
import type { SegmentationInputType } from './types';
import { vglobal } from '@visactor/vrender-core';
import { getMaxRadiusAndCenter, getShapeFunction } from './shapes';
import { isValid, isValidNumber, polarToCartesian } from '@visactor/vutils';

export const generateIsEmptyPixel = (
  backgroundColor?: string,
  options?: {
    threshold?: number;
    invert?: boolean;
  }
) => {
  const { threshold, invert = false } = options ?? {};

  if (!backgroundColor || backgroundColor === '#fff') {
    return (imageData: ImageData, y: number, x: number) => {
      const width = imageData.width;
      // 透明
      if (imageData.data[y * width * 4 + x * 4 + 3] === 0) {
        return !invert;
      }
      // 白色
      const r = imageData.data[y * width * 4 + x * 4 + 0];
      const g = imageData.data[y * width * 4 + x * 4 + 1];
      const b = imageData.data[y * width * 4 + x * 4 + 2];
      if (r === 255 && g === 255 && b === 255) {
        return !invert;
      }

      // 其他颜色
      if (isValidNumber(threshold)) {
        const grayValue = 0.3 * r + 0.59 * g + 0.11 * b;
        return invert ? grayValue <= threshold : grayValue >= threshold;
      }

      return false;
    };
  }

  /* Determine bgPixel by creating
      another canvas and fill the specified background color. */
  // eslint-disable-next-line no-undef
  const bctx = vglobal.createCanvas({ width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });

  bctx.fillStyle = backgroundColor;
  bctx.fillRect(0, 0, 1, 1);
  const bgPixel = bctx.getImageData(0, 0, 1, 1).data;
  return (imageData: ImageData, y: number, x: number) => {
    const width = imageData.width;

    return [0, 1, 2, 3].every(i => {
      return invert
        ? imageData.data[(y * width + x) * 4 + i] !== bgPixel[i]
        : imageData.data[(y * width + x) * 4 + i] === bgPixel[i];
    });
  };
};

export const generateMaskCanvas = (
  shape: TextShapeMask | GeometricMaskShape,
  width: number,
  height: number,
  cacheCanvas?: HTMLCanvasElement,
  invert: boolean = false
) => {
  let { backgroundColor = '#fff' } = shape;
  let { fill: foregroundColor = '#000' } = shape;

  if (invert) {
    [backgroundColor, foregroundColor] = [foregroundColor, backgroundColor];
  }

  const maskCanvas =
    cacheCanvas ||
    vglobal.createCanvas({
      width,
      height,
      dpr: 1
    });
  const tempContext = maskCanvas.getContext('2d', { willReadFrequently: true });
  if (cacheCanvas) {
    const prevWidth = cacheCanvas.width;
    const prevHeight = cacheCanvas.height;
    tempContext.clearRect(0, 0, prevWidth, prevHeight);
    cacheCanvas.style.width = `${width}px`;
    cacheCanvas.style.height = `${height}px`;
    cacheCanvas.width = width;
    cacheCanvas.height = height;
  }
  tempContext.fillStyle = backgroundColor;
  tempContext.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

  if ((shape as TextShapeMask).type === 'text') {
    drawTextMask(shape as TextShapeMask, foregroundColor, maskCanvas.width, maskCanvas.height, tempContext);
  } else if ((shape as GeometricMaskShape).type === 'geometric') {
    drawGeometricMask(shape as GeometricMaskShape, foregroundColor, maskCanvas.width, maskCanvas.height, tempContext);
  }

  return maskCanvas;
};

const drawTextMask = (
  shape: TextShapeMask,
  fillColor: string,
  width: number,
  height: number,
  ctx: CanvasRenderingContext2D
) => {
  const {
    fontFamily = 'sans-serif',
    fontWeight = 'normal',
    fontStyle = 'normal',
    fontVariant = 'normal',
    text,
    hollow
  } = shape;

  let baseFontSize = 12;

  ctx.font = `${fontStyle} ${fontVariant} ${fontWeight} ${baseFontSize}px ${fontFamily}`;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = fillColor;
  const textMetrics = ctx.measureText(text);
  /** 斜体计算字体宽度存在不准的情况，暂时通过方法来解决 */
  const scale = fontStyle !== 'normal' ? 1.1 : 1;
  const actualWidth =
    isValid(textMetrics.actualBoundingBoxRight) && isValid(textMetrics.actualBoundingBoxLeft)
      ? Math.ceil(scale * (Math.abs(textMetrics.actualBoundingBoxRight) + Math.abs(textMetrics.actualBoundingBoxLeft)))
      : 0;
  const textWidth = Math.max(Math.ceil(textMetrics.width), actualWidth, baseFontSize);

  if (hollow) {
    ctx.globalCompositeOperation = 'xor';
  }
  if (textWidth > width) {
    const scale = Math.min(width / textWidth, height / baseFontSize);
    ctx.fillText(text, width / 2, height / 2);
    ctx.scale(scale, scale);
  } else {
    baseFontSize = Math.floor((baseFontSize * width) / textWidth);
    baseFontSize = Math.min(baseFontSize, height);

    ctx.font = `${fontStyle} ${fontVariant} ${fontWeight} ${baseFontSize}px ${fontFamily}`;
    ctx.fillText(text, Math.floor(width / 2), Math.floor(height / 2));
  }
};

export const generatePoints = (center: IPointLike, radius: number, startAngle: number = 0, count: number) => {
  const angle = (2 * Math.PI) / count;
  return new Array(count).fill(0).map((entry, index) => {
    return polarToCartesian(center, radius, startAngle + index * angle);
  });
};

export const generateCardioidPoints = (center: IPointLike, radius: number, startAngle: number = 0, count: number) => {
  const angle = (2 * Math.PI) / count;
  const func = getShapeFunction('cardioid');

  return new Array(count).fill(0).map((entry, index) => {
    const theta = startAngle + index * angle;
    const r = radius * func(theta);
    const res = polarToCartesian(center, r, theta);
    return res;
  });
};

export const drawRegularPolygon = (ctx: CanvasRenderingContext2D, points: IPointLike[]) => {
  ctx.beginPath();
  points.forEach((p: IPointLike, index: number) => {
    if (index === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  });

  ctx.closePath();
  ctx.fill();
};

export const drawCardioid = (ctx: CanvasRenderingContext2D, points: IPointLike[]) => {
  ctx.beginPath();
  let prev: IPointLike;
  points.forEach((p: IPointLike, index: number) => {
    if (index === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.bezierCurveTo(p.x, p.y, prev.x, prev.y, p.x, p.y);
    }
    prev = p;
  });

  ctx.closePath();
  ctx.fill();
};

const drawGeometricMask = (
  shape: GeometricMaskShape,
  fillColor: string,
  width: number,
  height: number,
  ctx: CanvasRenderingContext2D
) => {
  const { hollow } = shape;
  const { center, maxRadius } = getMaxRadiusAndCenter(shape.shape, [width, height]);

  ctx.fillStyle = fillColor;

  if (hollow) {
    ctx.globalCompositeOperation = 'xor';
  }
  const cx = center[0];
  const cy = center[1];

  if (shape.shape === 'cardioid') {
    drawCardioid(ctx, generateCardioidPoints({ x: cx, y: cy }, maxRadius, 0, 100));
  } else if (shape.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(cx, cy, maxRadius, 0, 2 * Math.PI, true);
    ctx.fill();
  } else if (shape.shape === 'diamond') {
    drawRegularPolygon(ctx, generatePoints({ x: cx, y: cy }, maxRadius, -Math.PI / 2, 4));
  } else if (shape.shape === 'square') {
    drawRegularPolygon(ctx, generatePoints({ x: cx, y: cy }, maxRadius, -Math.PI / 4, 4));
  } else if (shape.shape === 'pentagon') {
    drawRegularPolygon(ctx, generatePoints({ x: cx, y: cy }, maxRadius, Math.PI / 2, 5));
  } else if (shape.shape === 'triangle' || shape.shape === 'triangleUpright') {
    drawRegularPolygon(ctx, generatePoints({ x: cx, y: cy }, maxRadius, -Math.PI / 2, 3));
  } else if (shape.shape === 'triangleForward') {
    drawRegularPolygon(ctx, generatePoints({ x: cx, y: cy }, maxRadius, 0, 3));
  } else if (shape.shape === 'star') {
    const outterPoints = generatePoints({ x: cx, y: cy }, maxRadius, -Math.PI / 2, 5);
    const innerPoints = generatePoints(
      { x: cx, y: cy },
      maxRadius / (2 * Math.cos(Math.PI / 5)),
      -Math.PI / 2 + Math.PI / 5,
      5
    );
    const points = [];
    for (let i = 0; i < 5; i++) {
      points.push(outterPoints[i]);
      points.push(innerPoints[i]);
    }
    drawRegularPolygon(ctx, points);
  } else {
    ctx.fillRect(0, 0, width, height);
  }
};

interface LabelMap {
  [key: number]: any;
}

/**
 * 求图像连通区域的个数、面积、边界、中心点
 * @param {*} shape 图像 base64
 * @param {*} size 画布大小
 */
export function segmentation(segmentationInput: SegmentationInputType) {
  const { size, maskCanvas } = segmentationInput;
  const ctx = maskCanvas.getContext('2d', { willReadFrequently: true });
  const imageData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
  // 保存分组标签，0 是背景(像素为白色或透明度为 0)，>1 的分组
  const labels = new Array(size[0] * size[1]).fill(0);
  // 当前的种子标签
  let curLabel = 1;
  // 四连通位置偏移
  const offset = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1]
  ];
  // 当前连通域中的单位域队列
  let queue = [];
  // 注意此处，i 为行数即 y，j为x，下同
  for (let i = 0; i < size[1]; i++) {
    for (let j = 0; j < size[0]; j++) {
      // 当前单位域已被标记或者属于背景区域, 则跳过
      if (labels[i * size[0] + j] !== 0 || segmentationInput.isEmptyPixel(imageData, i, j)) {
        continue;
      }

      labels[i * size[0] + j] = curLabel;
      // 加入当前域队列
      queue.push([i, j]);

      // 遍历当前域队列
      for (let k = 0; k < queue.length; k++) {
        // 四连通范围内检查未标记的前景单位域
        for (let m = 0; m < 4; m++) {
          let row: number = queue[k][0] + offset[m][0];
          let col: number = queue[k][1] + offset[m][1];

          // 防止坐标溢出图像边界
          row = row < 0 ? 0 : row >= size[1] ? size[1] - 1 : row;
          col = col < 0 ? 0 : col >= size[0] ? size[0] - 1 : col;

          // 邻近单位域未标记并且属于前景区域, 标记并加入队列
          if (labels[row * size[0] + col] === 0 && !segmentationInput.isEmptyPixel(imageData, row, col)) {
            labels[row * size[0] + col] = curLabel;
            queue.push([row, col]);
          }
        }
      }

      // 一个完整连通域查找完毕，标签更新
      curLabel++;
      // 清空队列
      queue = [];
    }
  }

  /**
   * 使用一次扫描线算法，识别出连通域的边界、面积、最大的边界点以求的最大半径
   * 边界：二值图像发生突变的地方
   * 面积：连通域中的像素个数
   * ratio: 连通区域的大致宽高比
   */
  const boundaries: LabelMap = {};
  const areas: LabelMap = {};
  const centers: LabelMap = {};
  const maxPoints: LabelMap = {};
  const maxR: LabelMap = {};
  const ratios: LabelMap = {};
  // 存储形状的范围
  const shapeBounds = {
    x1: Infinity,
    x2: -Infinity,
    y1: Infinity,
    y2: -Infinity,
    width: 0,
    height: 0
  };
  const boundaryPixels: [number, number][] = [];

  for (let i = 0; i < size[1]; i++) {
    for (let j = 0; j < size[0]; j++) {
      const label = labels[i * size[0] + j];
      if (label === 0) {
        continue;
      }

      // 当前像素为边界
      if (isBoundaryPixel(i, j)) {
        boundaryPixels.push([i, j]);

        boundaries[label] = boundaries[label] || [];
        boundaries[label].push([j, i]);

        if (!maxPoints[label]) {
          maxPoints[label] = [Infinity, -Infinity, Infinity, -Infinity];
        }
        if (i < maxPoints[label][0]) {
          maxPoints[label][0] = i;
        }
        if (i > maxPoints[label][1]) {
          maxPoints[label][1] = i;
        }
        if (j < maxPoints[label][2]) {
          maxPoints[label][2] = j;
        }
        if (j > maxPoints[label][3]) {
          maxPoints[label][3] = j;
        }

        // 更新 bounds
        if (j < shapeBounds.x1) {
          shapeBounds.x1 = j;
        }
        if (j > shapeBounds.x2) {
          shapeBounds.x2 = j;
        }
        if (i < shapeBounds.y1) {
          shapeBounds.y1 = i;
        }
        if (i > shapeBounds.y2) {
          shapeBounds.y2 = i;
        }
      }

      // 计算面积
      areas[label] = (areas[label] || 0) + 1;
    }
  }

  // 用于计算整个 shape 的中心点
  const allBoundaries = [];

  // 计算中心点
  for (const label in boundaries) {
    const boundary = boundaries[label];
    // 计算多边形重心
    const x = ~~(boundary.reduce((acc: any, cur: any) => acc + cur[0], 0) / boundary.length);
    const y = ~~(boundary.reduce((acc: any, cur: any) => acc + cur[1], 0) / boundary.length);
    centers[label] = [x, y];
    allBoundaries.push(...boundary);

    const [yMin, yMax, xMin, xMax] = maxPoints[label];

    maxR[label] = ~~Math.max(
      Math.sqrt((x - xMin) ** 2 + (y - yMin) ** 2),
      Math.sqrt((x - xMax) ** 2 + (y - yMax) ** 2),
      Math.sqrt((x - xMin) ** 2 + (y - yMax) ** 2),
      Math.sqrt((x - xMax) ** 2 + (y - yMin) ** 2)
    );

    ratios[label] = (xMax - xMin) / (yMax - yMin);
  }

  const regions = Object.keys(centers).map((key: any) => ({
    label: key - 1,
    boundary: boundaries[key],
    area: areas[key],
    center: centers[key],
    maxPoint: maxPoints[key],
    maxR: maxR[key],
    ratio: ratios[key]
  }));

  // 计算整个 shape 的一些属性
  shapeBounds.width = shapeBounds.x2 - shapeBounds.x1 + 1;
  shapeBounds.height = shapeBounds.y2 - shapeBounds.y1 + 1;

  const x = ~~(allBoundaries.reduce((acc, cur) => acc + cur[0], 0) / allBoundaries.length);
  const y = ~~(allBoundaries.reduce((acc, cur) => acc + cur[1], 0) / allBoundaries.length);

  const shapeMaxR = ~~Math.max(
    Math.sqrt((x - shapeBounds.x1) ** 2 + (y - shapeBounds.y1) ** 2),
    Math.sqrt((x - shapeBounds.x2) ** 2 + (y - shapeBounds.y2) ** 2),
    Math.sqrt((x - shapeBounds.x1) ** 2 + (y - shapeBounds.y2) ** 2),
    Math.sqrt((x - shapeBounds.x2) ** 2 + (y - shapeBounds.y1) ** 2)
  );
  const shapeRatio = shapeBounds.width / shapeBounds.height;
  const shapeArea = Object.keys(areas).reduce((acc, key) => (acc += areas[key]), 0);
  // 输出到 config 上
  const segmentation = {
    regions,
    labels,
    labelNumber: curLabel - 1
  };

  if (segmentationInput.blur) {
    const blur = segmentationInput.blur;
    // 对原图进行高斯模糊
    const blurredLabels = gaussianBlur(labels, size[0], size[1], blur);
    // 绘制边缘，边缘粗细为 blur 大小
    const edgeMask = drawContour(labels, boundaryPixels, size[0], size[1], Math.ceil(blur / 2));
    // 从 edgeMask 上选择模糊的像素，合并到 blurred_labels 中
    edgeMask.forEach((value: number, index: number) => {
      // 是边缘像素
      if (value === 1) {
        labels[index] = blurredLabels[index];
      }
    });
  }

  return Object.assign(segmentationInput, {
    segmentation,
    shapeBounds,
    shapeMaxR,
    shapeRatio,
    shapeCenter: [x, y],
    shapeArea
  });

  /**
   * 用四联通去判断是否是边缘像素
   * @param {*} i
   * @param {*} j
   */
  function isBoundaryPixel(i: number, j: number) {
    // 四连通位置偏移
    const offset = [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1]
    ];

    // 当 i,j 非背景，且是画布边缘时，则为 boundary
    if (i === 0 || j === 0 || i === size[1] - 1 || j === size[0] - 1) {
      return true;
    }

    // 其他情况用四连通去判断
    for (let k = 0; k < 4; k++) {
      let row = i + offset[k][0];
      let col = j + offset[k][1];

      // 防止坐标溢出图像边界
      row = row < 0 ? 0 : row >= size[1] ? size[1] - 1 : row;
      col = col < 0 ? 0 : col >= size[0] ? size[0] - 1 : col;

      if (labels[row * size[0] + col] === 0) {
        return true;
      }
    }
    return false;
  }
}

// 添加辅助函数：生成一维高斯核
function generateGaussianKernel1D(size: number, sigma: number) {
  const kernel = new Array(size * 2 + 1).fill(0);
  const center = size;
  let sum = 0;

  for (let x = -size; x <= size; x++) {
    const g = Math.exp(-(x * x) / (2 * sigma * sigma));
    kernel[x + center] = g;
    sum += g;
  }

  // 归一化
  for (let i = 0; i < kernel.length; i++) {
    kernel[i] /= sum;
  }

  return kernel;
}

// 高斯模糊实现
function gaussianBlur(labels: number[], width: number, height: number, blur: number) {
  const sigma = blur / 3;
  const size = Math.ceil(blur / 2);

  // 生成一维高斯核
  const kernel = generateGaussianKernel1D(size, sigma);

  // 创建临时数组存储中间结果
  const temp = new Array(labels.length).fill(0);
  const result = new Array(labels.length).fill(0);

  // 水平方向模糊
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let i = -size; i <= size; i++) {
        const curX = Math.min(Math.max(x + i, 0), width - 1);
        sum += labels[y * width + curX] * kernel[i + size];
      }
      temp[y * width + x] = sum;
    }
  }

  // 垂直方向模糊
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let sum = 0;
      for (let i = -size; i <= size; i++) {
        const curY = Math.min(Math.max(y + i, 0), height - 1);
        sum += temp[curY * width + x] * kernel[i + size];
      }
      // 保持值在 0-1 之间，不需要取整
      result[y * width + x] = Math.max(0, Math.min(1, sum));
    }
  }

  return result;
}

/**
 * 绘制轮廓函数，类似 OpenCV 中的 drawContours
 * @param labels 标签数组
 * @param thickness 轮廓粗细
 * @returns 轮廓掩码数组
 */
function drawContour(
  labels: number[],
  boundaryPixels: [number, number][],
  width: number,
  height: number,
  thickness = 1
) {
  const result = new Array(labels.length).fill(0);
  // 根据 thickness 参数绘制轮廓
  for (const [i, j] of boundaryPixels) {
    // 将边界像素标记为 1
    result[i * width + j] = 1;

    // 如果 thickness > 1，则扩展轮廓
    if (thickness > 1) {
      // 在边界像素周围创建一个方形区域
      for (let di = -thickness + 1; di <= thickness - 1; di++) {
        for (let dj = -thickness + 1; dj <= thickness - 1; dj++) {
          // 计算距离，只保留在指定厚度内的像素
          const distance = Math.sqrt(di * di + dj * dj);
          if (distance < thickness) {
            const ni = i + di;
            const nj = j + dj;

            // 检查是否越界
            if (ni >= 0 && ni < height && nj >= 0 && nj < width) {
              // 只在非背景区域绘制轮廓
              result[ni * width + nj] = 1;
            }
          }
        }
      }
    }
  }

  return result;
}
