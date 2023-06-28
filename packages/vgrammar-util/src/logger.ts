/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-util/src/logger.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { isNumber } from '@visactor/vutils';
import type { ILogger } from './types';

function log(method: string, level: any, input: any) {
  const args = [level].concat([].slice.call(input));

  // eslint-disable-next-line prefer-spread, no-undef
  console[method].apply(console, args); // eslint-disable-line no-console
}

export enum LoggerLevel {
  None = 0,
  Error = 1,
  Warn = 2,
  Info = 3,
  Debug = 4
}

export class Logger implements ILogger {
  private _level: number;

  private _method: string;

  constructor(level: number = LoggerLevel.None, method?: string) {
    this._level = level;
    this._method = method;
  }

  canLogInfo() {
    return this._level >= LoggerLevel.Info;
  }

  canLogDebug() {
    return this._level >= LoggerLevel.Debug;
  }

  canLogError() {
    return this._level >= LoggerLevel.Error;
  }

  canLogWarn() {
    return this._level >= LoggerLevel.Error;
  }

  level(): number;
  level(levelValue: number): this;
  level(levelValue?: number) {
    if (arguments.length) {
      this._level = +levelValue;
      return this;
    }

    return this._level;
  }

  error(...args: any[]) {
    if (this._level >= LoggerLevel.Error) {
      log(this._method ?? 'error', 'ERROR', args);
    }
    return this;
  }

  warn(...args: any[]) {
    if (this._level >= LoggerLevel.Warn) {
      log(this._method || 'warn', 'WARN', args);
    }
    return this;
  }

  info(...args: any[]) {
    if (this._level >= LoggerLevel.Info) {
      log(this._method || 'log', 'INFO', args);
    }
    return this;
  }

  debug(...args: any[]) {
    if (this._level >= LoggerLevel.Debug) {
      log(this._method || 'log', 'DEBUG', args);
    }
    return this;
  }
}

let defaultLogger: Logger = null;

export const setLogger = (logger: Logger) => {
  defaultLogger = logger;
};

export const setLogLevel = (level: number) => {
  if (defaultLogger) {
    defaultLogger.level(level);
  } else {
    defaultLogger = new Logger(level);
  }
};

export const clearLogger = () => {
  defaultLogger = null;
};

export const getLogger = (level?: number, method?: string) => {
  if (defaultLogger && isNumber(level)) {
    defaultLogger.level(level);
  } else if (!defaultLogger) {
    defaultLogger = new Logger(level, method);
  }

  return defaultLogger;
};
