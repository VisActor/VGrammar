import type { IBoundsLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isObject } from '@visactor/vutils';
import type { IEventTarget, IColor, ILayer, Stage } from '@visactor/vrender/es/core';
// eslint-disable-next-line no-duplicate-imports
import { createStage, waitForAllSubLayers } from '@visactor/vrender/es/core';
import { DragNDrop, Gesture } from '@visactor/vrender/es/kits';
import type { IViewOptions, IView, IMark, IViewEventConfig } from '../types';
import type { IRenderer } from '../types/renderer';
import { HOOK_EVENT } from './enums';

export default class CanvasRenderer implements IRenderer {
  private _width: number;
  private _height: number;

  private _view: IView;
  private _viewOptions: IViewOptions;
  private _eventConfig: IViewEventConfig;
  private _stage: Stage;
  private _layer: ILayer;
  private _dragController: DragNDrop;
  private _gestureController: Gesture;
  private _viewBox: IBoundsLike;

  constructor(view: IView) {
    this._view = view;
  }

  initialize(width: number, height: number, options: IViewOptions, eventConfig: IViewEventConfig) {
    this._width = width;
    this._height = height;
    this._viewOptions = options;
    this._eventConfig = eventConfig;

    this.initStage();

    // this method will invoke resize to size the canvas appropriately
    return this;
  }

  stage() {
    return this._stage ?? null;
  }

  canvas() {
    if (this._stage) {
      return this._stage.window.getNativeHandler().nativeCanvas;
    }
    return null;
  }

  context() {
    if (this._stage) {
      return this._stage.window.getContext().nativeContext;
    }
    return null;
  }

  combineIncrementalLayers() {
    if (this._stage) {
      waitForAllSubLayers(this._stage as any).then(() => {
        // stage might be null in current tick
        if (this._stage) {
          this._stage.defaultLayer.combineSubLayer();
        }
      });
    }
    return this;
  }

  background(color: IColor) {
    if (this._stage) {
      this._stage.background = color;
      return this;
    }
  }

  setDpr(resolution: number, redraw: boolean) {
    this._stage?.setDpr?.(resolution);
    if (redraw) {
      this.renderNextFrame();
    }
    return this;
  }

  shouldResize(width: number, height: number) {
    return width !== this._width || height !== this._height;
  }

  resize(width: number, height: number) {
    this._view.emit(HOOK_EVENT.BEFORE_STAGE_RESIZE);
    if (this.shouldResize(width, height)) {
      this._width = width;
      this._height = height;
      this._stage && this._stage.resize(width, height);
    }

    this._view.emit(HOOK_EVENT.AFTER_STAGE_RESIZE);

    return this;
  }

  setViewBox(viewBox: IBoundsLike, rerender: boolean = true) {
    if (!this._stage) {
      return this;
    }
    if (
      viewBox &&
      (!this._viewBox ||
        viewBox.x1 !== this._viewBox.x1 ||
        viewBox.x2 !== this._viewBox.x2 ||
        viewBox.y1 !== this._viewBox.y1 ||
        viewBox.y2 !== this._viewBox.y2)
    ) {
      this._viewBox = viewBox;

      // FIXME: vRender
      this._stage.setViewBox(viewBox.x1, viewBox.y1, viewBox.x2 - viewBox.x1, viewBox.y2 - viewBox.y1, rerender);
    }
    return this;
  }

  render(immediately: boolean = false) {
    this._view.emit(HOOK_EVENT.BEFORE_VRENDER_DRAW);

    this.initStage();

    // disable dirty bounds when render is called
    this._stage.disableDirtyBounds();
    this._stage.afterNextRender(this.handleAfterNextRender);

    // render immediately and skip render in next frame
    if (immediately) {
      this._stage.render();

      this._view.emit(HOOK_EVENT.AFTER_VRENDER_DRAW);
    }
    return this;
  }

  renderNextFrame() {
    this.initStage();

    this._stage.renderNextFrame();

    return this;
  }

  toCanvas() {
    if (this._stage) {
      return this._stage.toCanvas();
    }
    return null;
  }

  preventRender(tag: boolean) {
    if (this._stage) {
      this._stage.preventRender(tag);
    }
  }

  // toImageData() {
  //   if (this._stage) {
  //     return this._stage.toImageData();
  //   }
  //   return null;
  // }

  release() {
    this._view.traverseMarkTree((mark: IMark) => {
      mark.release();
    });

    if (this._dragController) {
      this._dragController.release();
    }
    if (this._gestureController) {
      this._gestureController.release();
    }

    if (this._stage !== (this._viewOptions?.stage as unknown as Stage)) {
      // don't release the stage created by outside
      this._stage.release();
    }

    this._stage = null;
    this._layer = null;
    this._dragController = null;
    this._gestureController = null;
  }

  private createStage() {
    this._view.emit(HOOK_EVENT.BEFORE_CREATE_VRENDER_STAGE);

    const viewOptions = this._viewOptions;

    const stage =
      (viewOptions.stage as unknown as Stage) ??
      createStage({
        width: this._width,
        height: this._height,
        renderStyle: viewOptions.renderStyle,
        viewBox: viewOptions.viewBox,
        dpr: viewOptions.dpr,
        canvas: viewOptions.renderCanvas,
        canvasControled: viewOptions.canvasControled,
        container: viewOptions.container,
        title: viewOptions.rendererTitle,
        beforeRender: viewOptions.beforeRender,
        afterRender: viewOptions.afterRender,
        disableDirtyBounds: true,
        autoRender: true,
        pluginList: viewOptions.pluginList,
        enableHtmlAttribute: viewOptions.enableHtmlAttribute,
        optimize: viewOptions.optimize
      });

    if (viewOptions.options3d?.enable) {
      stage.set3dOptions(viewOptions.options3d);
    }

    stage.enableIncrementalAutoRender();

    this._viewBox = viewOptions.viewBox;
    this._view.emit(HOOK_EVENT.AFTER_CREATE_VRENDER_STAGE);

    this._view.emit(HOOK_EVENT.BEFORE_CREATE_VRENDER_LAYER);
    const layer = viewOptions.layer ?? (stage.defaultLayer as ILayer);
    this._view.emit(HOOK_EVENT.AFTER_CREATE_VRENDER_LAYER);

    if (this._eventConfig?.drag) {
      // 允许 drag 事件
      this._dragController = new DragNDrop(stage as unknown as IEventTarget);
    }
    if (this._eventConfig?.gesture) {
      const gestureConfig = isObject(this._eventConfig.gesture) ? this._eventConfig.gesture : {};
      // 允许手势
      this._gestureController = new Gesture(stage as unknown as IEventTarget, gestureConfig);
    }

    return {
      stage,
      layer
    };
  }

  private initStage() {
    if (!this._stage) {
      const { stage, layer } = this.createStage();

      this._stage = stage;
      this._layer = layer;

      const background = this._view.background();
      this.background(background);
    }
  }

  private handleAfterNextRender = () => {
    if (this._stage && !this._viewOptions.disableDirtyBounds) {
      this._stage.enableDirtyBounds();
    }

    this._view.emit(HOOK_EVENT.AFTER_VRENDER_DRAW);
    this._view.emit(HOOK_EVENT.AFTER_VRENDER_NEXT_RENDER);
  };
}
