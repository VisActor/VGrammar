import { ScaleEnum } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import type { IBandLikeScale, IBaseScale } from '@visactor/vscale';

export function isBandLikeScale(scale: IBaseScale) {
  return scale && (scale.type === ScaleEnum.Band || scale.type === ScaleEnum.Point);
}

export function getBandWidthOfScale(scale: IBaseScale) {
  if (!scale) {
    return undefined;
  }

  return scale.type === ScaleEnum.Band
    ? (scale as IBandLikeScale).bandwidth()
    : scale.type === ScaleEnum.Point
    ? (scale as IBandLikeScale).step()
    : undefined;
}

export function getScaleRangeRatio(scale: IBaseScale, input: any) {
  const range = scale.range();
  return (scale.scale(input) - range[0]) / (range[range.length - 1] - range[0]);
}
