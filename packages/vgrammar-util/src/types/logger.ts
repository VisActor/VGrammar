export interface ILogger {
  canLogInfo: () => boolean;
  canLogDebug: () => boolean;
  canLogError: () => boolean;
  canLogWarn: () => boolean;
  level: (levelValue?: number) => this | number;
  error: (...args: any[]) => this;
  warn: (...args: any[]) => this;
  info: (...args: any[]) => this;
  debug: (...args: any[]) => this;
}
