import { HOOK_EVENT } from '../graph';
import type { IView, IBaseAnimate, AnimationEvent, IMark, IAnimationConfig } from '../types';

export class ViewAnimate implements IBaseAnimate {
  private _view: IView;
  // animation start/end events are triggered on specific animation configuration
  private _animations: { config: IAnimationConfig; mark: IMark }[] = [];

  constructor(view: IView) {
    this._view = view;

    this._view.addEventListener(HOOK_EVENT.ANIMATION_START, this._onAnimationStart);
    this._view.addEventListener(HOOK_EVENT.ANIMATION_END, this._onAnimationEnd);
  }

  stop() {
    this._view.traverseMarkTree(mark => {
      mark.animate?.stop?.();
    });
    return this;
  }

  pause() {
    this._view.traverseMarkTree(mark => {
      mark.animate?.pause?.();
    });
    return this;
  }

  resume() {
    this._view.traverseMarkTree(mark => {
      mark.animate?.resume?.();
    });
    return this;
  }

  enable() {
    this._view.traverseMarkTree(mark => {
      mark.animate?.enable?.();
    });
    return this;
  }

  disable() {
    this._view.traverseMarkTree(mark => {
      mark.animate?.disable?.();
    });
    return this;
  }

  enableAnimationState(state: string | string[]) {
    this._view.traverseMarkTree(mark => {
      mark.animate?.enableAnimationState?.(state);
    });
    return this;
  }

  disableAnimationState(state: string | string[]) {
    this._view.traverseMarkTree(mark => {
      mark.animate?.disableAnimationState?.(state);
    });
    return this;
  }

  isAnimating() {
    // let isAnimating = false;
    // this._view.traverseMarkTree(mark => {
    //   isAnimating = isAnimating || mark.animate?.isAnimating?.();
    // });
    // return isAnimating;
    return this._animations.length !== 0;
  }

  animate() {
    this._view.traverseMarkTree(
      mark => {
        if (mark.isUpdated && mark.animate) {
          mark.animate.animate();
        }
        mark.cleanExitElements();
        mark.isUpdated = false;
      },
      null,
      true
    );
    return this;
  }

  private _onAnimationStart = (event: AnimationEvent) => {
    if (this._animations.length === 0) {
      this._view.emit(HOOK_EVENT.ALL_ANIMATION_START, {});
    }
    this._animations = this._animations.concat({ config: event.animationConfig, mark: event.mark });
  };

  private _onAnimationEnd = (event: AnimationEvent) => {
    this._animations = this._animations.filter(animation => {
      return animation.config !== event.animationConfig || animation.mark !== event.mark;
    });
    if (this._animations.length === 0) {
      this._view.emit(HOOK_EVENT.ALL_ANIMATION_END, {});
    }
  };

  release() {
    this._view.removeEventListener(HOOK_EVENT.ALL_ANIMATION_START, this._onAnimationStart);
    this._view.removeEventListener(HOOK_EVENT.ALL_ANIMATION_END, this._onAnimationEnd);
  }
}
