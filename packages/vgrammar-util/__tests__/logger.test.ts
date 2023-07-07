import { Logger, setLogLevel, setLogger, getLogger, clearLogger } from '../src';
import { jest } from '@jest/globals';

test('getLogger() and clearLogger()', function () {
  const logger1 = getLogger();
  const logger2 = getLogger(2);
  const logger3 = getLogger();

  expect(logger1).toBe(logger2);
  expect(logger2).toBe(logger3);
  expect(logger1.level()).toBe(2);

  clearLogger();

  const logger4 = getLogger(3);

  expect(logger4).not.toBe(logger2);
  expect(logger4.level()).toBe(3);

  clearLogger();

  const logger5 = getLogger();

  expect(logger5.level()).toBe(0);
  expect(logger5).not.toBe(logger2);
  expect(logger5).not.toBe(logger3);
  expect(logger5).not.toBe(logger4);

  clearLogger();

  const logger6 = getLogger(undefined, 'error');
  expect(logger6.level()).toBe(0);
  expect(logger6).not.toBe(logger2);
  expect(logger6).not.toBe(logger3);
  expect(logger6).not.toBe(logger4);
  expect(logger6).not.toBe(logger5);

  setLogLevel(2);
  expect(logger6.level()).toBe(2);
});

test('setLogger()', () => {
  const customLogger = {
    canLogInfo() {
      return true;
    },
    canLogDebug() {
      return true;
    },
    canLogError() {
      return true;
    },
    canLogWarn() {
      return true;
    },
    level() {
      return 0;
    },
    error() {
      return customLogger;
    },
    warn() {
      return customLogger;
    },
    info() {
      return customLogger;
    },
    debug() {
      return customLogger;
    }
  };

  setLogger(customLogger);

  expect(getLogger()).toBe(customLogger);
});

test('Logger(0)', () => {
  const logger = new Logger();
  const logSpy = jest.spyOn(global.console, 'log');
  const errorSpy = jest.spyOn(global.console, 'error');
  const warnSpy = jest.spyOn(global.console, 'warn');

  expect(logger.level()).toBe(0);
  expect(logger.canLogError()).toBeFalsy();
  expect(logger.canLogWarn()).toBeFalsy();
  expect(logger.canLogInfo()).toBeFalsy();
  expect(logger.canLogDebug()).toBeFalsy();
  logger.info('info');
  logger.debug('debug');
  logger.warn('warn');
  logger.error('error');
  expect(logSpy).not.toHaveBeenCalled();
  logSpy.mockRestore();
  expect(errorSpy).not.toHaveBeenCalled();
  errorSpy.mockRestore();
  expect(warnSpy).not.toHaveBeenCalled();
  warnSpy.mockRestore();
});

test('Logger(1)', () => {
  const logger = new Logger();
  const logSpy = jest.spyOn(global.console, 'log');
  const errorSpy = jest.spyOn(global.console, 'error');
  const warnSpy = jest.spyOn(global.console, 'warn');

  logger.level(1);
  expect(logger.level()).toBe(1);
  expect(logger.canLogError()).toBeTruthy();
  expect(logger.canLogWarn()).toBeFalsy();
  expect(logger.canLogInfo()).toBeFalsy();
  expect(logger.canLogDebug()).toBeFalsy();

  logger.error('error');
  logger.info('info');
  logger.debug('debug');
  logger.warn('warn');
  expect(errorSpy).toHaveBeenCalled();
  expect(errorSpy).toHaveBeenCalledTimes(1);
  expect(logSpy).not.toHaveBeenCalled();
  expect(warnSpy).not.toHaveBeenCalled();
  logSpy.mockRestore();
  errorSpy.mockRestore();
  warnSpy.mockRestore();
});

test('Logger(2)', () => {
  const logger = new Logger();
  const logSpy = jest.spyOn(global.console, 'log');
  const errorSpy = jest.spyOn(global.console, 'error');
  const warnSpy = jest.spyOn(global.console, 'warn');

  logger.level(2);
  expect(logger.level()).toBe(2);
  expect(logger.canLogError()).toBeTruthy();
  expect(logger.canLogWarn()).toBeTruthy();
  expect(logger.canLogInfo()).toBeFalsy();
  expect(logger.canLogDebug()).toBeFalsy();

  logger.info('test');
  logger.debug('test');
  logger.warn('test');
  logger.error('test');
  expect(errorSpy).toHaveBeenCalled();
  expect(errorSpy).toHaveBeenCalledTimes(1);
  expect(warnSpy).toHaveBeenCalled();
  expect(warnSpy).toHaveBeenCalledTimes(1);
  expect(logSpy).not.toHaveBeenCalled();

  logSpy.mockRestore();
  errorSpy.mockRestore();
  warnSpy.mockRestore();
});

test('Logger(3)', () => {
  const logger = new Logger();
  const logSpy = jest.spyOn(global.console, 'log');
  const errorSpy = jest.spyOn(global.console, 'error');
  const warnSpy = jest.spyOn(global.console, 'warn');

  logger.level(3);
  expect(logger.level()).toBe(3);
  expect(logger.canLogError()).toBeTruthy();
  expect(logger.canLogWarn()).toBeTruthy();
  expect(logger.canLogInfo()).toBeTruthy();
  expect(logger.canLogDebug()).toBeFalsy();

  logger.info('test');
  logger.debug('test');
  logger.warn('test');
  logger.error('test');
  expect(errorSpy).toHaveBeenCalled();
  expect(errorSpy).toHaveBeenCalledTimes(1);
  expect(warnSpy).toHaveBeenCalled();
  expect(warnSpy).toHaveBeenCalledTimes(1);
  expect(logSpy).toHaveBeenCalled();
  expect(logSpy).toHaveBeenCalledTimes(1);

  logSpy.mockRestore();
  errorSpy.mockRestore();
  warnSpy.mockRestore();
});

test('Logger(4)', () => {
  const logger = new Logger();
  const logSpy = jest.spyOn(global.console, 'log');
  const errorSpy = jest.spyOn(global.console, 'error');
  const warnSpy = jest.spyOn(global.console, 'warn');

  logger.level(4);
  expect(logger.level()).toBe(4);
  expect(logger.canLogError()).toBeTruthy();
  expect(logger.canLogWarn()).toBeTruthy();
  expect(logger.canLogInfo()).toBeTruthy();
  expect(logger.canLogDebug()).toBeTruthy();

  logger.info('test');
  logger.debug('test');
  logger.warn('test');
  logger.error('test');
  expect(errorSpy).toHaveBeenCalled();
  expect(errorSpy).toHaveBeenCalledTimes(1);
  expect(warnSpy).toHaveBeenCalled();
  expect(warnSpy).toHaveBeenCalledTimes(1);
  expect(logSpy).toHaveBeenCalled();
  expect(logSpy).toHaveBeenCalledTimes(2);

  logSpy.mockRestore();
  errorSpy.mockRestore();
  warnSpy.mockRestore();
});
