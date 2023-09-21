import { vglobal } from '@visactor/vrender-core';
import type { IEnvironmentOptions } from '../../types';

export function configureEnvironment(options: IEnvironmentOptions) {
  if (options.mode) {
    vglobal.setEnv(options.mode, options.modeParams || {});
  }
}
