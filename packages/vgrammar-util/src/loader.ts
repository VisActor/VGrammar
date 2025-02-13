import { createImage } from '@visactor/vrender-core';
import { isBase64, isValidUrl, Logger } from '@visactor/vutils';

/**
 * 使用 ResourceLoader 加载图片
 */
export function loadImage(url: string) {
  if (!url || (!isValidUrl(url) && !isBase64(url) && !url.startsWith('<svg'))) {
    return null;
  }
  return new Promise((resolve, reject) => {
    const imageMark = createImage({ image: url });
    const imgData = imageMark.resources?.get(url);

    if (imgData && imgData.state === 'success' && imgData.data) {
      resolve(imgData.data);
      return;
    }

    imageMark.successCallback = () => {
      if (imageMark) {
        const imgData = imageMark.resources?.get(url);
        if (imgData && imgData.state === 'success' && imgData.data) {
          resolve(imgData.data);
        } else {
          reject(new Error('image load failed: ' + url));
        }
      } else {
        reject(new Error('image load failed: ' + url));
      }
    };
    imageMark.failCallback = () => {
      reject(new Error('image load failed: ' + url));
    };
  });
}

/**
 * 使用 ResourceLoader 加载多个图片
 */
export function loadImages(urls: string[]) {
  return Promise.allSettled(urls.map(url => loadImage(url)));
}
