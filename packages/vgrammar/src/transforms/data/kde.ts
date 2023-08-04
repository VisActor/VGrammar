import type { KDETransformOption } from '../../types';

const SQRT2PI = Math.sqrt(Math.PI * 2);

const gaussKernel = (x: number) => Math.exp(-(x ** 2) / 2) / SQRT2PI;

const computeBandwidth = (data: number[]) => {
  const n = data.length;
  const sum = data.reduce((sum, datum) => sum + datum, 0);
  const mean = sum / n;
  const sd = Math.sqrt(data.reduce((v, datum) => v + (datum - mean) ** 2, 0) / n);
  const sortedData = data.sort((a, b) => a - b);
  const q1 = (sortedData[Math.floor(n / 4)] + sortedData[Math.ceil(n / 4)]) / 2;
  const q3 = (sortedData[Math.floor((3 * n) / 4)] + sortedData[Math.ceil((3 * n) / 4)]) / 2;
  const iqr = q3 - q1;
  return 0.9 * Math.min(sd, iqr / 1.34) * n ** -0.2;
  // OR:
  // return 1.06 * sd * n ** -0.2;
};

const kde1d = (x: number, data: number[], bandwidth: number) => {
  const n = data.length;
  return data.reduce((v, datum) => v + gaussKernel(Math.abs(x - datum) / bandwidth)) / (n * bandwidth);
};

const kde2d = (x: number, data: number[], bandwidth: number) => {
  //
};

export const transform = (options: KDETransformOption, upstreamData: any[]) => {
  if (!upstreamData || upstreamData.length === 0) {
    return upstreamData;
  }
  const field = options.field;
  const data = upstreamData.map(datum => datum[field]);
  const bandwidth = options.bandwidth ?? computeBandwidth(data);
  const as = options.as ?? 'value';

  upstreamData.forEach((datum, index) => {
    datum[as] = kde1d(data[index], data, bandwidth);
  });

  return upstreamData;
};
