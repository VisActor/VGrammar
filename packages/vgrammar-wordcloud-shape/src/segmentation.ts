import type { CloudWordType, SegmentationOutputType } from './interface';

/**
 * 移除图像中的白边
 */
export function removeBorder(
  image: any,
  canvas: HTMLCanvasElement | any,
  isEmptyPixel: (imageData: ImageData, i: number, j: number) => boolean
) {
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  const width = canvas.width;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let top = 0;
  let bottom = imageData.height;
  let left = 0;
  let right = imageData.width;

  const rowBlank = (width: number, y: number) => {
    for (let x = 0; x < width; ++x) {
      if (!isEmptyPixel(imageData, y, x)) {
        return false;
      }
    }
    return true;
  };

  const columnBlank = (x: number, y0: number, y1: number) => {
    for (let y = y0; y < y1; ++y) {
      if (!isEmptyPixel(imageData, y, x)) {
        return false;
      }
    }
    return true;
  };

  while (top < bottom && rowBlank(width, top)) {
    ++top;
  }
  while (bottom - 1 > top && rowBlank(width, bottom - 1)) {
    --bottom;
  }
  while (left < right && columnBlank(left, top, bottom)) {
    ++left;
  }
  while (right - 1 > left && columnBlank(right - 1, top, bottom)) {
    --right;
  }

  const trimmed = ctx.getImageData(left, top, right - left, bottom - top);
  canvas.width = trimmed.width;
  canvas.height = trimmed.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(trimmed, 0, 0);

  return canvas;
}

/**
 * 调整图像大小和位置，将图像按照长边缩放到适应画布大小，并且居中
 * 此处让图片占满画布，padding 不是这个 transform 需要考虑的
 */
export function scaleAndMiddleShape(image: any, size: [number, number]) {
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
