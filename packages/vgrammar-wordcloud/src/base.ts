import { degreeToRadian, isFunction, isNil, merge } from '@visactor/vutils';
import type { IProgressiveTransformResult } from '@visactor/vgrammar';
import type { IBaseLayoutOptions, TagItemFunction, TagOutputItem } from './interface';
import { getShapeFunction } from './shapes';
import { functor, randomHslColor } from './util';

export abstract class BaseLayout<T extends IBaseLayoutOptions> implements IProgressiveTransformResult {
  static defaultOptions: Partial<IBaseLayoutOptions> = {
    fontFamily: '"Trebuchet MS", "Heiti TC", "微軟正黑體", ' + '"Arial Unicode MS", "Droid Fallback Sans", sans-serif',
    fontWeight: 'normal',
    color: 'random-dark',
    fontStyle: 'normal',
    minFontSize: 12, // 0 to disable
    drawOutOfBound: false,
    shrink: false,

    minRotation: -Math.PI / 2,
    maxRotation: Math.PI / 2,
    rotationSteps: 0,
    rotateRatio: 0.1,

    random: false,

    shape: 'circle',
    progressiveTime: 0,
    progressiveStep: 0,
    backgroundColor: '#fff'
  };

  options: Partial<T>;

  shape: (theta: number) => number;
  getTextFontWeight: TagItemFunction<string>;
  getTextFontSize: TagItemFunction<number>;
  getTextFontFamily: TagItemFunction<string>;
  getText: TagItemFunction<string | number>;
  getTextColor: TagItemFunction<string>;
  getTextFontStyle: TagItemFunction<string>;
  getTextRotate: TagItemFunction<number>;
  outputCallback: (res: any[]) => any[];

  /* ================== runtime vars ================== */
  escapeTime?: number;
  result: TagOutputItem[];
  data?: any[];
  currentStepIndex?: number;
  progressiveIndex?: number;
  progressiveResult?: TagOutputItem[];

  constructor(options: Partial<T>) {
    this.options = merge({}, BaseLayout.defaultOptions, options);

    if (!isFunction(this.options.shape)) {
      this.shape = getShapeFunction(this.options.shape as string);
    } else {
      this.shape = this.options.shape;
    }

    /* function for getting the font-weight of the text */
    this.getText = functor(this.options.text) ?? ((d: any) => d);
    this.getTextFontWeight = functor(this.options.fontWeight);
    this.getTextFontSize = functor(this.options.fontSize);
    this.getTextFontStyle = functor(this.options.fontStyle);
    this.getTextFontFamily = functor(this.options.fontFamily);
    this.outputCallback = this.options.outputCallback ?? ((res: any[]) => res);

    switch (this.options.color) {
      case 'random-dark':
        this.getTextColor = () => {
          return randomHslColor(10, 50);
        };
        break;

      case 'random-light':
        this.getTextColor = () => {
          return randomHslColor(50, 90);
        };
        break;

      default:
        this.getTextColor = functor(this.options.color);
        break;
    }

    if (!isNil(this.options.rotate)) {
      this.getTextRotate = isFunction(this.options.rotate)
        ? (d: any) => degreeToRadian((this.options.rotate as (d: any) => number)(d) ?? 0)
        : () => degreeToRadian((this.options.rotate as number) ?? 0);
    } else if (this.options.useRandomRotate) {
      const rotationRange = Math.abs(this.options.maxRotation - this.options.minRotation);
      const rotationSteps = Math.abs(Math.floor(this.options.rotationSteps));
      const minRotation = Math.min(this.options.maxRotation, this.options.minRotation);

      this.getTextRotate = () => {
        if (this.options.rotateRatio === 0) {
          return 0;
        }

        if (Math.random() > this.options.rotateRatio) {
          return 0;
        }

        if (rotationRange === 0) {
          return minRotation;
        }

        if (rotationSteps > 0) {
          // Min rotation + zero or more steps * span of one step
          return minRotation + (Math.floor(Math.random() * rotationSteps) * rotationRange) / (rotationSteps - 1);
        }
        return minRotation + Math.random() * rotationRange;
      };
    } else {
      this.getTextRotate = () => 0;
    }
  }

  /* Return true if we had spent too much time */
  exceedTime() {
    if (this.options.progressiveStep > 0) {
      return this.progressiveIndex >= ((this.currentStepIndex ?? 0) + 1) * this.options.progressiveStep;
    }

    return this.options.progressiveTime > 0 && new Date().getTime() - this.escapeTime > this.options.progressiveTime;
  }

  progressiveRun() {
    if (this.options.progressiveStep > 0) {
      this.currentStepIndex = (this.currentStepIndex ?? 0) + 1;
    } else if (this.options.progressiveTime > 0) {
      this.escapeTime = Date.now();
    }

    if (this.data && this.progressiveIndex && this.progressiveIndex < this.data.length) {
      this.progressiveResult = [];
      const len = this.data.length;
      let i = this.progressiveIndex;

      while (i < len) {
        const drawn = this.layoutWord(i);

        i++;
        this.progressiveIndex = i;
        if (this.exceedTime()) {
          break;
        }
      }

      return this.progressiveResult;
    }

    return this.result;
  }

  abstract layoutWord(i: number): boolean;
  abstract layout(
    data: any[],
    config: { width: number; height: number; origin?: [number, number]; canvas?: HTMLCanvasElement }
  ): any[];

  initProgressive() {
    this.progressiveIndex = -1;
    if (this.options.progressiveStep > 0) {
      this.currentStepIndex = 0;
    } else if (this.options.progressiveTime > 0) {
      this.escapeTime = Date.now();
    }

    this.progressiveResult = [];
  }

  output() {
    return this.result ? this.outputCallback(this.result) : null;
  }

  progressiveOutput() {
    return this.progressiveResult ? this.outputCallback(this.progressiveResult) : null;
  }

  unfinished() {
    return this.data && this.data.length && !isNil(this.progressiveIndex) && this.progressiveIndex < this.data.length;
  }

  release() {
    this.data = null;
    this.result = null;
    this.progressiveIndex = null;
    this.progressiveResult = null;
  }
}
