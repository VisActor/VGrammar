import type { IBoundsLike } from '@visactor/vutils';
import type { IColor, IEventTarget, Stage } from '@visactor/vrender-core';
import type { IViewEventConfig, IViewOptions } from './view';

export interface IRenderer {
  initialize: (width: number, height: number, options: IViewOptions, eventConfig: IViewEventConfig) => this;

  render: (immediately?: boolean) => this;
  renderNextFrame: () => this;
  resize: (width: number, height: number) => this;
  shouldResize: (width: number, height: number) => boolean;
  combineIncrementalLayers: () => this;
  preventRender: (tag: boolean) => void;

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

export interface IStageEventPlugin<T> {
  new (taget: IEventTarget, cfg?: T): {
    release: () => void;
  };
}
