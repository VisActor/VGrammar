import { initBrowserEnv, initNodeEnv } from '@visactor/vrender/es/kits';
import { isBrowserEnv, isNodeEnv } from '@visactor/vrender/es/core';

export const initAutoEnv = () => {
  if (isBrowserEnv()) {
    initBrowserEnv();
  } else if (isNodeEnv()) {
    initNodeEnv();
  }
};

export { initBrowserEnv, initNodeEnv };
