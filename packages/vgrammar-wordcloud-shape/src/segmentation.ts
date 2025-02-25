import type { CloudWordType, SegmentationOutputType } from './interface';

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
