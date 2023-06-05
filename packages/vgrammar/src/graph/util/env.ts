import { global } from '@visactor/vrender';
import type { IEnvironmentOptions } from '../../types';

export function configureEnvironment(options: IEnvironmentOptions) {
  if (options.mode) {
    global.setEnv(options.mode, options.modeParams || {});
  }
}
