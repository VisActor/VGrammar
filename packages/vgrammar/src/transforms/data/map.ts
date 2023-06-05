import { isNil } from '@visactor/vutils';

export const transform = (
  options: { callback: (entry: any, params?: any) => any; as?: string; all?: boolean },
  upstreamData: any[],
  params?: any
) => {
  const func = options.callback;
  const as = options.as;

  if (!options.all) {
    upstreamData.forEach(entry => {
      const data = func(entry, params);

      if (!isNil(as)) {
        if (isNil(entry)) {
          return;
        }
        entry[as] = data;
      }

      return data;
    });

    return upstreamData;
  }
  const data = func(upstreamData, params);

  if (isNil(as) || isNil(upstreamData)) {
    return data;
  }

  (upstreamData as any)[as] = data;

  return upstreamData;
};
