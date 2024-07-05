export type TagItemAttribute<T> = T | ((d?: any) => T);

export type TagItemFunction<T> = (d?: any, i?: number) => T;

export type Bounds = [{ x: number; y: number }, { x: number; y: number }];
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HtmlShape {
  type: 'html';
  backgroundColor?: string;
  getDom: (width: number, height: number) => HTMLCanvasElement;
}

export interface IBaseLayoutOptions {
  text?: TagItemAttribute<string | number>;
  fontFamily?: TagItemAttribute<string>;
  fontWeight?: TagItemAttribute<string>;
  fontSize?: TagItemAttribute<number>;
  fontStyle?: TagItemAttribute<string>;

  color?: 'random-dark' | 'random-light' | TagItemAttribute<string>;

  drawOutOfBound?: boolean;
  /**
   * shrink to fit when the words are to many or to great
   */
  shrink?: boolean;
  /** clip text to fit */
  clip?: boolean;
  minFontSize?: number;

  useRandomRotate?: boolean;
  minRotation?: number;
  maxRotation?: number;
  rotationSteps?: number;
  rotateRatio?: number;
  rotate?: TagItemAttribute<number> | number[];

  random?: boolean;
  randomVisible?: boolean;
  shape?: string | ((theta: number) => number) | HtmlShape;
  progressiveTime?: number;
  outputCallback?: (res: any[]) => any[];
  progressiveStep?: number;

  repeatFill?: boolean;

  fillTextFontSize?: number;

  maxFailCount?: number;
  maxSingleWordTryCount?: number;
}

/** the output type of layout */
export interface TagOutputItem {
  /** original input data */
  datum: any;
  x: number;
  y: number;
  fontFamily: string;
  fontSize: number;
  fontStyle: string;
  fontWeight: string;
  angle: number;
  width: number;
  height: number;
  text: string;
  color?: string;
}
