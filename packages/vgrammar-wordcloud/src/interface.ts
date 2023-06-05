export type TagItemAttribute<T> = T | ((d?: any) => T);

export type TagItemFunction<T> = (d?: any) => T;

export type Bounds = [{ x: number; y: number }, { x: number; y: number }];
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IBaseLayoutOptions {
  text?: TagItemAttribute<string | number>;
  fontFamily?: TagItemAttribute<string>;
  fontWeight?: TagItemAttribute<string>;
  fontSize?: TagItemAttribute<number>;
  fontStyle?: TagItemAttribute<string>;

  color?: TagItemAttribute<string>;

  drawOutOfBound?: boolean;
  shrink?: boolean;
  /** clip text to fit */
  clip?: boolean;
  minFontSize?: number;

  useRandomRotate?: boolean;
  minRotation?: number;
  maxRotation?: number;
  rotationSteps?: number;
  rotateRatio?: number;
  rotate?: TagItemAttribute<number>;

  random?: boolean;
  shape?: string | ((theta: number) => number);
  progressiveTime?: number;
  backgroundColor?: string;
  outputCallback?: (res: any[]) => any[];
  progressiveStep?: number;
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
}
