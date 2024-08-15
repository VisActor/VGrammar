import { HOOK_EVENT } from '../graph/enums';
import type { IView, AnimationEvent, IMark, IAnimationConfig, IViewAnimate } from '../types';

export class ViewAnimate implements IViewAnimate {
  private _view: IView;
  // animation start/end events are triggered on specific animation configuration
  private _animations: { config: IAnimationConfig; mark: IMark }[] = [];
  private _additionalAnimateMarks: IMark[] = [];
  private isEnabled: boolean = true;

  constructor(view: IView) {
    this._view = view;

    this._view.addEventListener(HOOK_EVENT.ANIMATION_START, this._onAnimationStart);
    this._view.addEventListener(HOOK_EVENT.ANIMATION_END, this._onAnimationEnd);
  }

  stop() {
    this._view.traverseMarkTree(mark => {
      mark.animate && mark.animate.stop?.();
    });
    this._additionalAnimateMarks.forEach(mark => {
      // if mark is not released
      if (mark.view && mark.animate) {
        mark.animate.stop?.();
      }
    });
    // clear all additional animate marks after animations are stopped
    this._additionalAnimateMarks = [];
    return this;
  }

  pause() {
    this._view.traverseMarkTree(mark => {
      mark.animate && mark.animate.pause?.();
    });
    this._additionalAnimateMarks.forEach(mark => {
      // if mark is not released
      if (mark.view && mark.animate) {
        mark.animate.pause?.();
      }
    });
    return this;
  }

  resume() {
    this._view.traverseMarkTree(mark => {
      mark.animate && mark.animate.resume?.();
    });
    this._additionalAnimateMarks.forEach(mark => {
      // if mark is not released
      if (mark.view && mark.animate) {
        mark.animate.resume?.();
      }
    });
    return this;
  }

  enable() {
    this.isEnabled = true;
    this._view.traverseMarkTree(mark => {
      mark.animate && mark.animate.enable?.();
    });
    return this;
  }

  disable() {
    this.isEnabled = false;
    this._view.traverseMarkTree(mark => {
      mark.animate && mark.animate.disable?.();
    });
    // stop all addition animations when animate is disabled
    this._additionalAnimateMarks.forEach(mark => {
      // if mark is not released
      if (mark.view && mark.animate) {
        mark.animate.stop?.();
      }
    });
    // clear all additional animate marks after animations are stopped
    this._additionalAnimateMarks = [];
    return this;
  }

  enableAnimationState(state: string | string[]) {
    this._view.traverseMarkTree(mark => {
      mark.animate && mark.animate.enableAnimationState?.(state);
    });
    return this;
  }

  disableAnimationState(state: string | string[]) {
    this._view.traverseMarkTree(mark => {
      mark.animate && mark.animate.disableAnimationState?.(state);
    });
    return this;
  }

  isAnimating() {
    return (
      this._animations.length !== 0 || this._additionalAnimateMarks.some(mark => mark?.animate?.isAnimating() || false)
    );
  }

  animate() {
    if (!this.isEnabled) {
      return this;
    }

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

  animateAddition(additionMark: IMark) {
    const animate = additionMark.animate?.animate();

    if (animate && animate.isAnimating()) {
      this._additionalAnimateMarks.push(additionMark);
    }
    return this;
  }

  private _onAnimationStart = (event: AnimationEvent) => {
    this._additionalAnimateMarks = this._additionalAnimateMarks.filter(mark => mark?.animate?.isAnimating());

    if (this._animations.length === 0 && this._additionalAnimateMarks.length === 0) {
      this._view.emit(HOOK_EVENT.ALL_ANIMATION_START, {});
    }
    this._animations = this._animations.concat({ config: event.animationConfig, mark: event.mark });
  };

  private _onAnimationEnd = (event: AnimationEvent) => {
    this._additionalAnimateMarks = this._additionalAnimateMarks.filter(mark => mark?.animate?.isAnimating());

    this._animations = this._animations.filter(animation => {
      return animation.config !== event.animationConfig || animation.mark !== event.mark;
    });
    if (this._animations.length === 0 && this._additionalAnimateMarks.length === 0) {
      this._view.emit(HOOK_EVENT.ALL_ANIMATION_END, {});
    }
  };

  release() {
    this._additionalAnimateMarks = [];
    this._animations = [];
    this._view.removeEventListener(HOOK_EVENT.ALL_ANIMATION_START, this._onAnimationStart);
    this._view.removeEventListener(HOOK_EVENT.ALL_ANIMATION_END, this._onAnimationEnd);
    this._view = null;
  }
}
