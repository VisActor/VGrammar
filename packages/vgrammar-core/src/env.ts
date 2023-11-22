import { initBrowserEnv, initNodeEnv } from '@visactor/vrender-kits';
import { isBrowserEnv, isNodeEnv } from '@visactor/vrender-core';

export const initAutoEnv = () => {
  if (isBrowserEnv()) {
    initBrowserEnv();
  } else if (isNodeEnv()) {
    initNodeEnv();
  }
};

export { initBrowserEnv, initNodeEnv };
