import type { CloudWordType, SegmentationInputType, SegmentationOutputType } from './interface';
import { loadImage } from './util';

export async function loadAndHandleImage(segmentationInput: SegmentationInputType): Promise<CanvasImageSource> {
  const shapeImage = (await loadImage(segmentationInput.shapeUrl)) as CanvasImageSource;

  if (segmentationInput.removeWhiteBorder && shapeImage) {
    return removeBorder(shapeImage, segmentationInput.tempCanvas, segmentationInput.tempCtx);
  }

  return shapeImage;
}

/**
 * 求图像连通区域的个数、面积、边界、中心点
 * @param {*} shape 图像 base64
 * @param {*} size 画布大小
 */
export function segmentation(shapeImage: CanvasImageSource, segmentationInput: SegmentationInputType) {
  const { size, tempCanvas, tempCtx: ctx } = segmentationInput;
  const shapeConfig = scaleAndMiddleShape(shapeImage, size);
  //   config.shapeConfig = shapeConfig

  tempCanvas.width = size[0];
  tempCanvas.height = size[1];
  ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
  ctx.drawImage(shapeImage, shapeConfig.x, shapeConfig.y, shapeConfig.width, shapeConfig.height);
  const imageData = ctx.getImageData(0, 0, size[0], size[1]);
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
      if (labels[i * size[0] + j] !== 0 || isEmptyPixel(imageData, i, j)) {
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
          if (labels[row * size[0] + col] === 0 && !isEmptyPixel(imageData, row, col)) {
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
  const boundaries = {};
  const areas = {};
  const centers = {};
  const maxPoints = {}; // 存储顺序为 iMin, iMax, jMin, jMax
  const maxR = {};
  const ratios = {};
  // 存储形状的范围
  const shapeBounds = {
    x1: Infinity,
    x2: -Infinity,
    y1: Infinity,
    y2: -Infinity,
    width: 0,
    height: 0
  };

  for (let i = 0; i < size[1]; i++) {
    for (let j = 0; j < size[0]; j++) {
      const label = labels[i * size[0] + j];
      if (label === 0) {
        continue;
      }

      // 当前像素为边界
      if (isBoundaryPixel(i, j)) {
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
      areas[label] = areas[label] || 0;
      areas[label]++;
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
  return Object.assign(segmentationInput, {
    segmentation,
    shapeConfig,
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

/**
 * 判断一个像素是否是前景
 * 即 白色像素 or 透明度为 0
 * @param {*} i
 * @param {*} j
 */
function isEmptyPixel(imageData: ImageData, i: number, j: number) {
  const width = imageData.width;
  return (
    imageData.data[i * width * 4 + j * 4 + 3] === 0 ||
    (imageData.data[i * width * 4 + j * 4 + 0] === 255 &&
      imageData.data[i * width * 4 + j * 4 + 1] === 255 &&
      imageData.data[i * width * 4 + j * 4 + 2] === 255)
  );
}

/**
 * 移除图像中的白边
 */
function removeBorder(image: any, canvas: HTMLCanvasElement | any, ctx: CanvasRenderingContext2D | null) {
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  const width = canvas.width;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let top = 0;
  let bottom = imageData.height;
  let left = 0;
  let right = imageData.width;

  while (top < bottom && rowBlank(imageData, width, top)) {
    ++top;
  }
  while (bottom - 1 > top && rowBlank(imageData, width, bottom - 1)) {
    --bottom;
  }
  while (left < right && columnBlank(imageData, width, left, top, bottom)) {
    ++left;
  }
  while (right - 1 > left && columnBlank(imageData, width, right - 1, top, bottom)) {
    --right;
  }

  const trimmed = ctx.getImageData(left, top, right - left, bottom - top);
  canvas.width = trimmed.width;
  canvas.height = trimmed.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(trimmed, 0, 0);

  return canvas;
}

function rowBlank(imageData: ImageData, width: number, y: number) {
  for (let x = 0; x < width; ++x) {
    if (!isEmptyPixel(imageData, y, x)) {
      return false;
    }
  }
  return true;
}

function columnBlank(imageData: ImageData, width: number, x: number, top: number, bottom: number) {
  for (let y = top; y < bottom; ++y) {
    if (!isEmptyPixel(imageData, y, x)) {
      return false;
    }
  }
  return true;
}

/**
 * 调整图像大小和位置，将图像按照长边缩放到适应画布大小，并且居中
 * 此处让图片占满画布，padding 不是这个 transform 需要考虑的
 */
function scaleAndMiddleShape(image: any, size: [number, number]) {
  const width = image.width;
  const height = image.height;
  let scale = size[0] / width;
  if (height * scale > size[1]) {
    scale = size[1] / height;
  }

  const newWidth = Math.floor(scale * width);
  const newHeight = Math.floor(scale * height);
  // 图片绘制时的坐标
  const x = (size[0] - newWidth) / 2;
  const y = (size[1] - newHeight) / 2;

  return {
    x,
    y,
    width: newWidth,
    height: newHeight,
    scale
  };
}
/**
 * 将单词分配到不同的区域内
 *
 * 先使用相对简单的分配逻辑，即根据区域面积来决定分配到的单词的 权重大小和数量
 * @param {*} words
 * @param {*} config
 */
export function allocateWords(words: CloudWordType[], segmentationOutput: SegmentationOutputType) {
  const {
    segmentation: { regions }
  } = segmentationOutput;
  let areaMax = -Infinity;
  let totalArea = 0;
  let areaMaxIndex = 0;

  // 查找最大面积的区域，同时计算总的面积
  regions.forEach((region: any, index: number) => {
    const area = region.area;
    if (area > areaMax) {
      areaMax = area;
      areaMaxIndex = index;
    }
    totalArea += area;
  });

  // 根据每个区域的面积大小给每个区域分配单词数量和权重限制
  let wordsSum = 0;
  regions.forEach((region: any) => {
    const area = region.area;
    const regionNum = Math.ceil((area / totalArea) * words.length);
    const regionWeight = area / areaMax;

    region.words = [];
    region.regionNum = regionNum;
    region.regionWeight = regionWeight;
    wordsSum += regionNum;
  });
  // 如果有未分配的单词， 则分配到面积最大区域
  if (wordsSum < words.length) {
    regions[areaMaxIndex].wordsNum += words.length - wordsSum;
  }

  // 对单词进行分配，先分配面积最大的区域
  let currIndex = areaMaxIndex;
  const regionNums = regions.map((region: any) => region.regionNum);
  words.forEach((word: any) => {
    // 记录总的失败次数
    let failCounter = 0;
    // 记录失败次数，超过区域的数量，则更新一下所有区域的权重上限
    let updateCounter = 0;
    word.regionIndex = -1;

    do {
      if (regionNums[currIndex] > 0 && word.weight <= regions[currIndex].regionWeight) {
        word.regionIndex = currIndex;
        regions[currIndex].words.push(word);
        regionNums[currIndex]--;
        currIndex = (currIndex + 1) % regions.length;
        break;
      }
      currIndex = (currIndex + 1) % regions.length;

      failCounter++;
      updateCounter++;
      // 如果没有找到合适的区域，则更新所有区域的权重
      if (updateCounter > regions.length + 1) {
        regions.forEach((region: any) => {
          // 这里 0.15 是经验值，可以后续根据业务场景调整
          region.regionWeight += 0.15;
        });
        updateCounter = 0;
      }
    } while (word.regionIndex === -1 && failCounter < regions.length * 3);

    // 未分配则分配为 area 最大的区域
    if (word.regionIndex === -1) {
      word.regionIndex = areaMaxIndex;
      regions[areaMaxIndex].words.push(word);
      regionNums[areaMaxIndex]--;
    }
  });

  // 对每个区域里的单词根据权重进行排序
  regions.forEach((region: any) => {
    region.words.sort((a: CloudWordType, b: CloudWordType) => b.weight - a.weight);
  });
}
