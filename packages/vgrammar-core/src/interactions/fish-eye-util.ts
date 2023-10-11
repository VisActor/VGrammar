import { extent } from '@visactor/vgrammar-util';
import type { IBaseScale } from '@visactor/vscale';
import { clamp, isNil } from '@visactor/vutils';

export const wrapFishEyeScale = (
  scale: IBaseScale,
  options?: { distortion?: number; focus?: number; radius?: number; radiusRatio?: number }
) => {
  const { distortion = 2, radiusRatio = 0.1 } = options || {};
  let focus = options?.focus ?? 0;
  const range = extent(scale.range());
  const [min, max] = range;

  if (!(scale as any).bakScale) {
    (scale as any).bakScale = scale.scale;
  }
  const radius = isNil(options?.radius) ? (max - min) * radiusRatio : options.radius;
  let k0 = Math.exp(distortion);
  k0 = (k0 / (k0 - 1)) * radius;
  const k1 = distortion / radius;
  focus = clamp(focus, min, max);
  (scale as any).scale = (input: any) => {
    const output = (scale as any).bakScale(input);
    const delta = Math.abs(output - focus);

    if (delta >= radius) {
      return output;
    }
    const k = ((k0 * (1 - Math.exp(-delta * k1))) / delta) * 0.75 + 0.25;

    return focus + (output - focus) * k;
  };

  return scale;
};

export const unwrapFishEyeScale = (scale: IBaseScale) => {
  if ((scale as any)?.bakScale) {
    scale.scale = (scale as any).bakScale;
    (scale as any).bakScale = null;
  }

  return scale;
};
