import { isNil, isValidNumber } from '@visactor/vutils';
import type { IAnimate as IGraphicAnimate } from '@visactor/vrender';
// eslint-disable-next-line no-duplicate-imports
import { ACustomAnimate, Animate, AnimateGroup, AnimateMode } from '@visactor/vrender';
import type {
  IAnimationChannelInterpolator,
  IAnimationCustomConstructor,
  IAnimationTimeline,
  IAnimator,
  IAnimatorOptions,
  IAnimationUnit,
  IAnimationParameters,
  IAnimationTimeSlice,
  IElement,
  IAnimationEffect
} from '../../types';
import { AttributeAnimate, channelAnimationAttributes, CustomInterpolator, typeAnimationAttributes } from './attribute';

Animate.mode |= AnimateMode.SET_ATTR_IMMEDIATELY;

let GlobalAnimatorId = 0;

const isCustomAnimateCtor = (custom?: IAnimationChannelInterpolator | IAnimationCustomConstructor) => {
  return !isNil(custom) && custom.prototype instanceof ACustomAnimate;
};

export class Animator implements IAnimator {
  id: number = GlobalAnimatorId++;
  element: IElement;
  animationOptions: IAnimatorOptions;
  isAnimating: boolean = false;

  private unit: IAnimationUnit;
  private runnings: IGraphicAnimate[] = [];
  private callbackFunction: (...args: any[]) => any;

  constructor(
    element: IElement,
    unit: IAnimationUnit,
    animationOptions: {
      state: string;
      timeline: IAnimationTimeline;
      id: string;
    }
  ) {
    this.element = element;
    this.animationOptions = animationOptions;
    this.unit = unit;
  }

  callback(callbackFunction: (...args: any[]) => void): this {
    this.callbackFunction = callbackFunction;
    return this;
  }

  animate(animationParameters: IAnimationParameters, parameters: any): this {
    this.isAnimating = true;

    this.animateElement(animationParameters, parameters);

    // if no valid running, end animating immediately
    if (this.runnings.length === 0) {
      this.animationEnd();
    }
    return this;
  }

  stop(stopState: 'start' | 'end' = 'end', invokeCallback: boolean = true): this {
    // FIXME: wait for VRender to fix 'end' parameter
    this.runnings.forEach(running => running.stop(stopState));
    this.animationEnd(invokeCallback);
    return this;
  }

  pause(): this {
    this.runnings.forEach(running => running.pause());
    return this;
  }

  resume(): this {
    this.runnings.forEach(running => running.resume());
    return this;
  }

  startAt(startTime: number): this {
    this.runnings.forEach(running => {
      const initialDelay = this.unit.initialDelay;
      running.startAt(initialDelay + startTime);
    });
    return this;
  }

  getTotalAnimationTime() {
    const timeLineDuration = this.unit.initialDelay + this.unit.loopDuration * this.unit.loopCount;
    return this.unit.totalTime ?? timeLineDuration;
  }

  private animationEnd(invokeCallback: boolean = true) {
    this.isAnimating = false;
    this.runnings = null;
    if (invokeCallback) {
      this.callbackFunction?.call(null);
    }
  }

  private animateElement(animationParameters: IAnimationParameters, parameters: any) {
    const graphicAnimate: IGraphicAnimate = this.element.getGraphicItem().animate();
    this.runnings.push(graphicAnimate);
    // initialDelay is only used at first loop
    graphicAnimate.startAt(this.unit.initialDelay);
    // execute loop animation
    graphicAnimate.wait(this.unit.loopDelay);
    this.unit.timeSlices.forEach(timeSlice => {
      this.animateTimeSlice(graphicAnimate, timeSlice, animationParameters, parameters);
    });
    graphicAnimate.wait(this.unit.loopDelayAfter);

    graphicAnimate.loop(this.unit.loopCount - 1);

    if (isValidNumber(this.unit.totalTime)) {
      // FIXME: use VRender api instead after VRender refactor is finished
      setTimeout(() => {
        if (graphicAnimate) {
          graphicAnimate.stop('end');
        }
      }, this.unit.totalTime);
    }

    graphicAnimate.onEnd(() => {
      this.runnings = this.runnings.filter(running => running !== graphicAnimate);
      if (this.runnings.length === 0) {
        this.animationEnd();
      }
    });
  }

  private animateTimeSlice(
    graphicAnimate: IGraphicAnimate,
    timeSlice: IAnimationTimeSlice,
    animationParameters: IAnimationParameters,
    parameters: any
  ) {
    const delay = timeSlice.delay as number;
    const duration = timeSlice.duration as number;
    const effects = timeSlice.effects as IAnimationEffect[];

    // wait in loop animation before animation starts
    if (delay > 0) {
      graphicAnimate.wait(delay);
    }

    if (effects.length < 0) {
      graphicAnimate.wait(duration);
    } else {
      const customAnimates = effects
        .map((effect, index) => {
          const attributes =
            (effect.type
              ? typeAnimationAttributes(this.element, effect, animationParameters, parameters)
              : channelAnimationAttributes(this.element, effect, animationParameters, parameters)) ?? {};
          const customOption = attributes?.custom || effect?.custom;
          const customParametersOption = attributes?.customParameters || effect?.customParameters;

          if (
            attributes.from &&
            Object.keys(attributes.from).length &&
            this.unit &&
            this.animationOptions.timeline.controlOptions.immediatelyApply &&
            this.element.mark.markType !== 'component'
          ) {
            this.element.getGraphicItem().setAttributes(attributes.from);
          }

          const isCustomAnimate = isCustomAnimateCtor(customOption);
          const isCustomInterpolator = !isNil(customOption) && !isCustomAnimateCtor(customOption);

          if (isCustomInterpolator) {
            return new CustomInterpolator(attributes.from, attributes.to, duration, effect.easing, {
              interpolator: customOption as IAnimationChannelInterpolator,
              element: this.element,
              parameters: customParametersOption
            });
          } else if (isCustomAnimate) {
            return new (customOption as IAnimationCustomConstructor)(
              attributes.from,
              attributes.to,
              duration,
              effect.easing,
              customParametersOption
            );
          } else if (attributes.to) {
            return new AttributeAnimate(attributes.from, attributes.to, duration, effect.easing);
          }
        })
        .filter(animate => !isNil(animate));

      if (customAnimates.length === 1) {
        graphicAnimate.play(customAnimates[0]);
      } else {
        graphicAnimate.play(new AnimateGroup(duration, customAnimates));
      }
    }
  }
}
