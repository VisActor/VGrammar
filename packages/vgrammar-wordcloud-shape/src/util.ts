import { vglobal, createImage } from '@visactor/vrender';
import { isValidUrl, Logger } from '@visactor/vutils';
import type { CloudWordType, LayoutConfigType, SegmentationOutputType } from './interface';

export enum WORDCLOUD_SHAPE_HOOK_EVENT {
  BEFORE_WORDCLOUD_SHAPE_LAYOUT = 'beforeWordcloudShapeLayout',
  AFTER_WORDCLOUD_SHAPE_LAYOUT = 'afterWordcloudShapeLayout'
}

const colorList = [
  '#e5352b',
  '#e990ab',
  '#ffd616',
  '#96cbb3',
  '#91be3e',
  '#39a6dd',
  '#eb0973',
  '#949483',
  '#f47b7b',
  '#9f1f5c',
  '#ef9020',
  '#00af3e',
  '#85b7e2',
  '#29245c',
  '#00af3e'
];

export const colorListEqual = (arr0: string[], arr1: string[]) => {
  if (arr1.length === 1 && arr1[0] === '#537EF5') {
    // 填充词默认值认为与核心词一致
    return true;
  }

  if (!Array.isArray(arr0) || !Array.isArray(arr1) || arr0.length !== arr1.length) {
    return false;
  }

  for (let i = 0; i < arr0.length; i++) {
    if (arr0[i] !== arr1[i]) {
      return false;
    }
  }

  return true;
};

/**
 * 随机拟合
 */
export const fakeRandom = () => {
  let i = -1;
  const arr = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
  return () => {
    i = (i + 1) % arr.length;
    return arr[i];
  };
};

/**
 * 判断是否为中文
 */
export const isChinese = (text: string) => {
  return /^[\u4e00-\u9fa5]+$/.test(text);
};

/**
 * 计算字符长度，中文为1，符号/字母/其他字符为0.5
 */
export const calTextLength = (text: string, textLengthLimit?: number) => {
  let length = 0;
  for (const char of text) {
    isChinese(char) ? (length += 1) : (length += 0.53);
  }
  return length;
  // return length > textLengthLimit ? textLengthLimit + 1.5 : textLengthLimit;
};

/**
 * 使用 ResourceLoader 加载图片
 */
export function loadImage(url: string) {
  if (!isValidUrl(url)) {
    return null;
  }
  return new Promise((resolve, reject) => {
    const imageMark = createImage({ image: url });
    imageMark.successCallback = () => {
      if (imageMark) {
        const imgData = imageMark.resources?.get(url);
        if (imgData && imgData.state === 'success' && imgData.data) {
          resolve(imgData.data);
        } else {
          reject(new Error('image load failed' + url));
        }
      } else {
        reject(new Error('image load failed' + url));
      }
    };
    imageMark.failCallback = () => {
      // eslint-disable-next-line no-undef
      const logger = Logger.getInstance();
      logger.error('image 加载失败！', url);
    };
  });
}

/**
 * 绘制连通区域相关信息，用于 debug
 * 红色为边缘、黑方块为中心、黑色数字为面积
 */
export function paintLabels(segmentationOutput: SegmentationOutputType) {
  const {
    size,
    segmentation: { regions, labels },
    shapeBounds,
    shapeCenter
  } = segmentationOutput;
  const paintCanvas = vglobal.createCanvas({ width: size[0], height: size[1] });
  const ctx = paintCanvas.getContext('2d');
  const colorList = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'];

  for (let i = 0; i < size[1]; i++) {
    for (let j = 0; j < size[0]; j++) {
      if (labels[i * size[0] + j] === 0) {
        ctx.fillStyle = '#fff';
      } else {
        ctx.fillStyle = colorList[labels[i * size[0] + j] % colorList.length];
      }
      ctx.fillRect(j, i, 1, 1);
    }
  }

  regions.forEach((region: any) => {
    const {
      center: [x, y],
      area,
      boundary,
      maxPoint,
      label
    } = region;
    // 绘制中心点
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, 3, 3);
    ctx.font = '15px serif';
    ctx.fillText(area, x, y);

    // 绘制边缘
    for (const [x, y] of boundary) {
      ctx.fillStyle = '#f00';
      ctx.fillRect(x, y, 1, 1);
    }

    // 绘制最大点
    const [iMin, iMax, jMin, jMax] = maxPoint;
    ctx.fillStyle = '#00f';
    ctx.font = '15px serif';
    ctx.fillRect(jMin, iMin, 3, 3);
    ctx.fillText(`${label}_min`, jMin, iMin);
    ctx.fillRect(jMax, iMax, 3, 3);
    ctx.fillText(`${label}_max`, jMax, iMax);
  });

  // 绘制边界
  const { x1, y1, width, height } = shapeBounds;
  ctx.strokeStyle = '#000';
  ctx.strokeRect(x1, y1, width, height);

  // 绘制整个 shape 的中心点
  ctx.fillStyle = '#000';
  ctx.fillRect(shapeCenter[0], shapeCenter[1], 3, 3);
  ctx.fillText('shape center', shapeCenter[0], shapeCenter[1]);

  // eslint-disable-next-line no-undef
  document.body.prepend(paintCanvas);
}

/**
 * 绘制 board
 */
export function paint(board: number[], paintSize: [number, number]) {
  const curSize = paintSize;
  const imageData = new ImageData(curSize[0], curSize[1]);
  const array = imageData.data;
  const w32 = paintSize[0] >> 5;

  for (let y = 0; y < curSize[1]; y++) {
    for (let x = 0; x < w32; x++) {
      const value = board[y * w32 + x];
      const string = (value >>> 0).toString(2).padStart(32, '0');
      for (let k = 0; k < 32; k++) {
        if (string[k] === '1') {
          // 占用像素, 填充白色
          array[((x << 5) + y * curSize[0] + k) * 4 + 0] = 255;
          array[((x << 5) + y * curSize[0] + k) * 4 + 1] = 255;
          array[((x << 5) + y * curSize[0] + k) * 4 + 2] = 255;
          array[((x << 5) + y * curSize[0] + k) * 4 + 3] = 255;
        } else {
          // 未占用像素, 填充黑色
          array[((x << 5) + y * curSize[0] + k) * 4 + 0] = 0;
          array[((x << 5) + y * curSize[0] + k) * 4 + 1] = 0;
          array[((x << 5) + y * curSize[0] + k) * 4 + 2] = 0;
          array[((x << 5) + y * curSize[0] + k) * 4 + 3] = 255;
        }
        // 数组元素分割线, 填充红色, 间隔32px
        if (k === 0) {
          array[((x << 5) + y * curSize[0] + k) * 4 + 0] = 255;
          array[((x << 5) + y * curSize[0] + k) * 4 + 1] = 0;
          array[((x << 5) + y * curSize[0] + k) * 4 + 2] = 0;
          array[((x << 5) + y * curSize[0] + k) * 4 + 3] = 255;
        }
      }
    }
  }

  // eslint-disable-next-line no-undef
  const canvas = document.createElement('canvas');
  canvas.width = curSize[0];
  canvas.height = curSize[1];
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
  // eslint-disable-next-line no-undef
  document.body.prepend(canvas);
}

/**
 * 绘制单词，查看布局效果
 */
export function draw(
  words: CloudWordType[],
  fillingWords: CloudWordType[],
  layoutConfig: LayoutConfigType,
  resizeFactor: number = 1
) {
  // eslint-disable-next-line no-undef
  const canvas = document.createElement('canvas');
  const radians = Math.PI / 180;
  const { size } = layoutConfig;
  canvas.width = size[0] * resizeFactor;
  canvas.height = size[1] * resizeFactor;
  const ctx = canvas.getContext('2d');

  words.forEach(word => {
    word.visible && drawText(word);
  });
  fillingWords.forEach(word => {
    word.visible && drawText(word, '#308ebc');
  });

  // eslint-disable-next-line no-undef
  document.body.prepend(canvas);

  function drawText(word: CloudWordType, color?: string) {
    ctx.save();
    ctx.textAlign = 'center';
    // ctx.textBaseline = 'middle'
    ctx.font = word.fontStyle + ' ' + word.fontWeight + ' ' + word.fontSize * resizeFactor + 'px ' + word.fontFamily;
    // ctx.fillStyle = color || colorList[~~(Math.random() * colorList.length)]
    ctx.globalAlpha = word.opacity;
    ctx.translate(word.x * resizeFactor, word.y * resizeFactor);
    if (word.rotate) {
      ctx.rotate((word.rotate * Math.PI) / 180);
    }
    ctx.fillText(word.text, 0, word.fontSize * 0.3 * resizeFactor);
    // ctx.fillStyle = '#f00'
    // ctx.beginPath()
    // ctx.arc(0, 0, 1, 0, 2 * Math.PI)
    // ctx.fill()
    ctx.restore();
  }
}

/**
 * 绘制螺旋线
 */

export function drawSpiral(spiral: any, center: [number, number], maxR: number, size: [number, number]) {
  // eslint-disable-next-line no-undef
  const canvas = document.createElement('canvas');
  canvas.width = size[0];
  canvas.height = size[1];
  const ctx = canvas.getContext('2d');
  const dt = 1;
  let dxdy;
  let dx;
  let dy;
  let t = -dt;

  while ((dxdy = spiral((t += dt)))) {
    dx = dxdy[0];
    dy = dxdy[1];
    if (Math.min(Math.abs(dx), Math.abs(dy)) >= maxR) {
      break;
    }

    // ctx.beginPath()
    // ctx.moveTo(center[0] + dx, center[1] + dy)
    // ctx.lineTo(center[0] + dx, center[1] + dy)
    // ctx.stroke()
    ctx.fillStyle = '#f00';
    ctx.fillRect(center[0] + dx, center[1] + dy, 3, 3);
  }

  // eslint-disable-next-line no-undef
  document.body.prepend(canvas);
}

export function functor(d: any) {
  return typeof d === 'function'
    ? d
    : function () {
        return d;
      };
}
