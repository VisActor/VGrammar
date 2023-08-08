import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { PointService, array, isNumber } from '@visactor/vutils';
import type { KDETransformOption } from '../../types';

const defaultBins = 256;
const defaultAs = ['x', 'kde'];
const defaultAs2d = ['x', 'y', 'kde'];
const SQRT2PI = Math.sqrt(Math.PI * 2);
const SQRT2PI2 = Math.sqrt((Math.PI * 2) ** 2);

// Only use gauss kernel for now
const gaussKernel = (x: number, dimension: number = 1) => {
  const sp = dimension === 1 ? SQRT2PI : dimension === 2 ? SQRT2PI2 : Math.sqrt((Math.PI * 2) ** dimension);
  return Math.exp(-(x ** 2) / 2) / sp;
};

// A rule-of-thumb bandwidth estimator, referring to: https://en.wikipedia.org/wiki/Kernel_density_estimation#A_rule-of-thumb_bandwidth_estimator
const ruleOfThumbBandwidth = (data: IPointLike[], dimension: number = 1) => {
  const n = data.length;
  const sum = data.reduce((sum, datum) => sum + datum.x, 0);
  const mean = sum / n;
  const sd = Math.sqrt(data.reduce((v, datum) => v + (datum.x - mean) ** 2, 0) / n);
  const sortedData = data.sort((a, b) => a.x - b.x);
  const q1 = (sortedData[Math.floor(n / 4)].x + sortedData[Math.ceil(n / 4)].x) / 2;
  const q3 = (sortedData[Math.floor((3 * n) / 4)].x + sortedData[Math.ceil((3 * n) / 4)].x) / 2;
  const iqr = q3 - q1;
  return 0.9 * Math.min(sd, iqr / 1.34) * n ** -0.2;
  // OR:
  // return 1.06 * sd * n ** -0.2;
};

// Adaptive bandwidth, referring to: https://www.osti.gov/biblio/1372602
const scottBandwidth = (data: IPointLike[], dimension: number = 1) => {
  const n = data.length;
  return n ** (-1 / (dimension + 4));
};

// referring to: https://en.wikipedia.org/wiki/Kernel_density_estimation#Definition
const kde1d = (targetDatum: IPointLike, data: IPointLike[], bandwidth: number) => {
  const n = data.length;
  const kSum = data.reduce((v, datum) => {
    const distance = Math.abs(targetDatum.x - datum.x);
    return v + gaussKernel(distance / bandwidth, 1);
  }, 0);
  return kSum / (n * bandwidth);
};

// referring to: https://en.wikipedia.org/wiki/Multivariate_kernel_density_estimation#Definition
const kde2d = (targetDatum: IPointLike, data: IPointLike[], bandwidth: number) => {
  const n = data.length;
  // Notice here is h^2 which is different from kde1d
  const khSum = data.reduce((v, datum) => {
    const distance = PointService.distancePP(targetDatum, datum);
    return v + gaussKernel(distance / bandwidth ** 2, 1);
  }, 0);
  return khSum / (n * bandwidth ** 2);
};

export const transform = (options: KDETransformOption, upstreamData: any[]) => {
  if (!upstreamData || upstreamData.length === 0) {
    return upstreamData;
  }
  const dimension = options.dimension ?? '1d';
  const field = array(options.field);
  const bins = array(options.bins ?? defaultBins);
  const as = array(options.as);

  if (dimension === '1d') {
    const data = upstreamData.map(datum => ({ x: datum[field[0]] } as IPointLike));
    const bandwidth = options.bandwidth ?? ruleOfThumbBandwidth(data);
    const min = data.reduce((min, datum) => Math.min(min, datum.x), data[0].x);
    const max = data.reduce((max, datum) => Math.max(max, datum.x), data[0].x);

    const extentMin = options.extent?.[0] ?? min;
    const extentMax = options.extent?.[1] ?? max;
    const extent = [
      isNumber(extentMin) ? extentMin : extentMin.x ?? min,
      isNumber(extentMax) ? extentMax : extentMax.x ?? max
    ];
    const step = (extent[1] - extent[0]) / bins[0];
    const kdeResult = new Array(bins[0]).fill(0).map((v, index) => {
      const value = Math.min(extent[0] + step * (index + 0.5), extent[1]);
      return {
        [as[0] ?? defaultAs[0]]: value,
        [as[1] ?? defaultAs[0]]: kde1d({ x: value } as IPointLike, data, bandwidth)
      };
    });

    return kdeResult;
  } else if (dimension === '2d') {
    const data = upstreamData.map(datum => ({ x: datum[field[0]], y: datum[field[1]] } as IPointLike));
    const bandwidth = options.bandwidth || scottBandwidth(data, 2);

    const min = data.reduce((min, datum) => ({ x: Math.min(min.x, datum.x), y: Math.min(min.y, datum.y) }), data[0]);
    const max = data.reduce((max, datum) => ({ x: Math.max(max.x, datum.x), y: Math.max(max.y, datum.y) }), data[0]);

    const extentMin = options.extent?.[0] ?? min;
    const extentMax = options.extent?.[1] ?? max;
    const extent = [
      isNumber(extentMin) ? { x: extentMin, y: extentMin } : { x: extentMin.x ?? min.x, y: extentMin.y ?? min.y },
      isNumber(extentMax) ? { x: extentMax, y: extentMax } : { x: extentMax.x ?? max.x, y: extentMax.y ?? max.y }
    ];
    const binsX = bins[0];
    const binsY = bins[1] ?? bins[0];
    const stepX = (extent[1].x - extent[0].x) / binsX;
    const stepY = (extent[1].y - extent[0].y) / binsY;
    const kdeResult: any[] = [];
    for (let yIndex = 0; yIndex < binsY; yIndex++) {
      for (let xIndex = 0; xIndex < binsX; xIndex++) {
        const x = Math.min(extent[0].x + stepX * (xIndex + 0.5), extent[1].x);
        const y = Math.min(extent[0].y + stepY * (yIndex + 0.5), extent[1].y);
        kdeResult.push({
          [as[0] ?? defaultAs2d[0]]: x,
          [as[1] ?? defaultAs2d[1]]: y,
          [as[2] ?? defaultAs2d[2]]: kde2d({ x, y }, data, bandwidth)
        });
      }
    }
    return kdeResult;
  }

  return [];
};
