import type { IElement } from '../../types';

function lttb(size: number, array: any[], isGroup: boolean, yfield?: string) {
  const frameSize = Math.floor(array.length / size);
  const newIndices = [];
  const len = array.length;

  let currentIndex = 0;
  let sampledIndex = 0;
  let maxArea;
  let area;
  let nextIndex;

  // First frame use the first data.
  newIndices[sampledIndex++] = currentIndex;

  for (let i = 1; i < len - 1; i += frameSize) {
    const nextFrameStart = Math.min(i + frameSize, len - 1);
    const nextFrameEnd = Math.min(i + frameSize * 2, len);

    const avgX = (nextFrameEnd + nextFrameStart) / 2;
    let avgY = 0;

    for (let idx = nextFrameStart; idx < nextFrameEnd; idx++) {
      const y = isGroup ? array[idx].y : array[idx][yfield];
      if (Number.isNaN(y)) {
        continue;
      }
      avgY += y;
    }
    avgY /= nextFrameEnd - nextFrameStart;

    const frameStart = i;
    const frameEnd = Math.min(i + frameSize, len);

    const pointAX = i - 1;
    const pointAY = isGroup ? array[currentIndex].y : array[currentIndex][yfield];

    maxArea = -1;

    nextIndex = frameStart;
    // Find a point from current frame that construct a triangel with largest area with previous selected point
    // And the average of next frame.
    for (let idx = frameStart; idx < frameEnd; idx++) {
      const y = isGroup ? array[idx].y : array[idx][yfield];
      if (Number.isNaN(y)) {
        continue;
      }
      // Calculate triangle area over three buckets
      area = Math.abs((pointAX - avgX) * (y - pointAY) - (pointAX - idx) * (avgY - pointAY));
      if (area > maxArea) {
        maxArea = area;
        nextIndex = idx; // Next a is this b
      }
    }

    newIndices[sampledIndex++] = nextIndex;

    currentIndex = nextIndex; // This a is the next a (chosen b)
  }

  // First frame use the last data.
  if (newIndices[sampledIndex - 1] !== len - 1) {
    newIndices[sampledIndex++] = len - 1;
  }

  // output newly added tuples
  const newRawIndices = newIndices.map(i => (isGroup ? array[i].i : i));
  return newRawIndices;
}

/**
 * Samples tuples passing through this operator.
 * Uses lttb sampling to maintain a trend-maintained sample.
 * @constructor
 * @param {object} options - The parameters for this operator.
 * @param {number} [options.size=1000] - The maximum number of samples.
 * @param {string} [options.xfield] - The xfield string of data.
 * @param {string} [options.yfield] - The yfield string of data.
 * @param {string} [options.groupBy] - The groupBy string of data.
 */

export const transform = (
  options: {
    size: number;
    factor?: number;
    skipfirst?: boolean;
    xfield?: string;
    yfield?: string;
    groupBy?: string;
  },
  upstreamData: IElement[]
) => {
  let size = options.size;
  const factor = options.factor || 1;

  if (Array.isArray(size)) {
    size = Math.floor(size[1] - size[0]);
  }

  size *= factor;

  // size<=0的特殊情况不采样，返回空
  if (size <= 0) {
    return [];
  }

  // 数据<size的情况，不进行采样，保留所有数据
  if (upstreamData.length <= size) {
    return upstreamData;
  }

  const skipfirst = options.skipfirst;
  // 如果是ChartSpace的第一次数据流(evaluateAsync)，不需要采样，返回一条数据供布局使用
  // 这里需要依据this.value.length判断是不是第一次数据流，
  // 以避免点击图例，updateChartData等操作清空所有label
  if (skipfirst) {
    return upstreamData.slice(0, 1);
  }

  const { yfield, groupBy } = options;

  // 处理数据source，source为采样前的原始数据
  if (upstreamData.length) {
    // 如果有groupBy，数据分组
    const groups = {};
    if (groupBy) {
      for (let i = 0, n = upstreamData.length; i < n; i++) {
        const datum = upstreamData[i];
        const groupId = datum[groupBy];
        if (groups[groupId]) {
          groups[groupId].push({ y: datum[yfield], i });
        } else {
          groups[groupId] = [];
          groups[groupId].push({ y: datum[yfield], i });
        }
      }

      // 分组采样
      let rawIndice: any[] = [];

      Object.keys(groups).forEach(groupName => {
        const group = groups[groupName];
        if (group.length <= size) {
          const indices = group.map((datum: any) => {
            return datum.i;
          });
          rawIndice = rawIndice.concat(indices);
        } else {
          const indices = lttb(size, group, true);
          rawIndice = rawIndice.concat(indices);
        }
      });

      // 采样后，整合分组数据，按照原始顺序排序
      rawIndice.sort((a, b) => a - b);

      return rawIndice.map((index: number) => upstreamData[index]);
    }
    // 非分组数据同理
    return lttb(size, upstreamData, false, yfield).map(index => upstreamData[index]);
  }

  return [];
};
