import { isNil, isString, throttle } from '@visactor/vutils';
import type { FishEyeOptions, IMark, IScale, IView, InteractionEvent, ViewNavigationRange } from '../types';
import { BaseInteraction } from './base';

export class FishEye extends BaseInteraction<FishEyeOptions> {
  static type: string = 'fish-eye';
  type: string = FishEye.type;

  static defaultOptions: FishEyeOptions = {
    trigger: 'pointerenter',
    updateTrigger: 'pointermove',
    endTrigger: 'pointerleave',
    distortionX: 2,
    distortionY: 2,
    throttle: 100
  };

  options: FishEyeOptions;
  protected _inited?: boolean;
  protected _state: Partial<
    Record<'x' | 'y', { scale?: IScale; focus?: number; distortion?: number; radius?: number; radiusRatio?: number }>
  >;
  protected _isActive?: boolean;
  protected _marks?: IMark[];

  protected handleUpdate: (e: InteractionEvent) => void;

  constructor(view: IView, options?: FishEyeOptions) {
    super(view, options);
    this.options = Object.assign({}, FishEye.defaultOptions, options);
    this._marks = view.getMarksBySelector(this.options.selector);

    this.handleUpdate = throttle(this.handleUpdateInner, this.options.throttle);
  }

  protected getEvents() {
    return [
      { type: this.options.trigger, handler: this.handleStart },
      { type: this.options.updateTrigger, handler: this.handleUpdate },
      { type: this.options.endTrigger, handler: this.handleEnd },
      { type: this.options.resetTrigger, handler: this.handleReset }
    ];
  }

  protected _initStateByDim(
    dim: 'x' | 'y',
    distortion: number,
    scale?: string | IScale,
    radius?: number,
    radiusRatio?: number
  ) {
    const scaleGrammar = !isNil(scale) ? (isString(scale) ? this.view.getScaleById(scale) : scale) : null;

    this._state[dim] = { scale: scaleGrammar, distortion, radius, radiusRatio };
  }

  protected _initGrammars() {
    const { enableX, enableY, scaleX, scaleY, distortionX, distortionY, radiusRatioX, radiusRatioY, radiusX, radiusY } =
      this.options;

    this._state = {};

    if (enableX !== false) {
      this._initStateByDim('x', distortionX, scaleX, radiusX, radiusRatioX);
    }

    if (enableY !== false) {
      this._initStateByDim('y', distortionY, scaleY, radiusY, radiusRatioY);
    }

    this._inited = true;
  }

  updateView(focus?: { x: number; y: number }, e?: InteractionEvent) {
    let needUpdate = false;

    if (focus) {
      Object.keys(this._state).forEach(dim => {
        const dimState = this._state[dim];

        if (dimState.scale && dimState.focus !== focus[dim]) {
          needUpdate = true;
          // 坐标转换问题
          dimState.focus = focus[dim];
          dimState.scale.setFishEye({
            distortion: dimState.distortion,
            radius: dimState.radius,
            radiusRatio: dimState.radiusRatio,
            focus: focus[dim]
          });
          dimState.scale.commit();
        }
      });
    } else {
      Object.keys(this._state).forEach(dim => {
        const dimState = this._state[dim];

        if (dimState.scale && !isNil(dimState.focus)) {
          needUpdate = true;
          // 坐标转换问题
          dimState.focus = null;
          dimState.scale.setFishEye(null);
          dimState.scale.commit();
        }
      });
    }

    if (needUpdate) {
      this.view.runSync();
    }

    // this.dispatchEvent(type, newRange, e);
  }

  protected dispatchEvent(type: string, viewRange: ViewNavigationRange, e?: InteractionEvent) {
    this.view.emit(type, {
      viewRange,
      event: e
    });
  }

  shouldHandle(e: InteractionEvent) {
    if (this._marks) {
      return e.element && this._marks && this._marks.includes(e.element.mark);
    }
    return (e.target as any) === this.view?.renderer?.stage?.();
  }

  shouldUpdate(e: InteractionEvent) {
    if (this._marks) {
      return e.element && this._marks && this._marks.includes(e.element.mark);
    }
    const viewBox = this.view.getViewBox();
    return e.canvasX >= viewBox.x1 && e.canvasX <= viewBox.x2 && e.canvasY >= viewBox.y1 && e.canvasY <= viewBox.y2;
  }

  handleStart = (e: InteractionEvent) => {
    if (!e || !(this.options.shouldStart ? this.options.shouldStart(e) : this.shouldHandle(e))) {
      return;
    }

    if (!this._inited) {
      this._initGrammars();
    }
    if (!this._isActive) {
      this._isActive = true;
      this.updateView({ x: e.canvasX, y: e.canvasY }, e);
    }
  };

  handleUpdateInner = (e: InteractionEvent) => {
    if (!e || !(this.options.shouldUpdate ? this.options.shouldUpdate(e) : this.shouldUpdate(e))) {
      return;
    }

    this._isActive && this.updateView({ x: e.canvasX, y: e.canvasY }, e);
  };

  handleEnd = (e: InteractionEvent) => {
    if (!e || !(this.options.shouldEnd ? this.options.shouldEnd(e) : this.shouldHandle(e))) {
      return;
    }

    if (!this.options.resetTrigger && this._isActive) {
      this._isActive = false;
      this.updateView(null, e);
    }
  };

  handleReset = (e: InteractionEvent) => {
    if (!e || !(this.options.shouldReset ? this.options.shouldReset(e) : this.shouldHandle(e))) {
      return;
    }

    if (this._isActive) {
      this.updateView(null, e);
      this._isActive = false;
    }
  };

  unbind() {
    super.unbind();

    if (this._state) {
      Object.keys(this._state).forEach(dim => {
        const { scale } = this._state[dim as 'x' | 'y'];

        if (scale) {
          scale.setRangeFactor(null);
          scale.commit();
        }
      });
    }

    this._state = null;
  }
}
