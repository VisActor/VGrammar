import { get } from '@visactor/vutils';

export const getter = (path: string[]): any => {
  return (obj: any) => get(obj, path);
};
