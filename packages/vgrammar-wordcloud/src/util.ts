import { isFunction } from '@visactor/vutils';

export function isSupported() {
  // eslint-disable-next-line no-undef
  const canvas = document.createElement('canvas');
  if (!canvas || !canvas.getContext) {
    return false;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return false;
  }
  if (!ctx.getImageData) {
    return false;
  }
  if (!ctx.fillText) {
    return false;
  }

  if (!Array.prototype.some) {
    return false;
  }
  if (!Array.prototype.push) {
    return false;
  }

  return true;
}

export function getMinFontSizeOfEnv() {
  // eslint-disable-next-line no-undef
  const ctx = document.createElement('canvas').getContext('2d');

  // start from 20
  let size = 20;

  // two sizes to measure
  let hanWidth;
  let mWidth;

  while (size) {
    ctx.font = size.toString(10) + 'px sans-serif';
    if (ctx.measureText('\uFF37').width === hanWidth && ctx.measureText('m').width === mWidth) {
      return size + 1;
    }

    hanWidth = ctx.measureText('\uFF37').width;
    mWidth = ctx.measureText('m').width;

    size--;
  }

  return 12;
}

export const randomHslColor = (min: number, max: number) => {
  return (
    'hsl(' +
    (Math.random() * 360).toFixed() +
    ',' +
    (Math.random() * 30 + 70).toFixed() +
    '%,' +
    (Math.random() * (max - min) + min).toFixed() +
    '%)'
  );
};

export function functor(d: any) {
  return isFunction(d)
    ? d
    : function () {
        return d;
      };
}
