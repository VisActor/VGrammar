import type { IBoundsLike } from '@visactor/vutils';
import type { IColor, Stage } from '@visactor/vrender';
import type { IViewEventConfig, IViewOptions } from './view';

export interface IRenderer {
  initialize: (width: number, height: number, options: IViewOptions, eventConfig: IViewEventConfig) => this;

  render: () => this;
  renderNextFrame: () => this;
  resize: (width: number, height: number) => this;
  shouldResize: (width: number, height: number) => boolean;
  combineIncrementalLayers: () => this;

  setDpr: (resolution: number, redraw: boolean) => this;
  background: (color: IColor) => this;
  setViewBox: (viewBox: IBoundsLike, rerender: boolean) => this;

  stage: () => Stage;
  canvas: () => HTMLCanvasElement;
  context: () => CanvasRenderingContext2D;

  toCanvas: () => HTMLCanvasElement;
  // toImageData: () => Promise<ImageData | undefined>;

  release: () => void;
}
