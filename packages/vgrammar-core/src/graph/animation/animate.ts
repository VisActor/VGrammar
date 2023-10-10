import { array, isNil, isNumber } from '@visactor/vutils';
import type {
  IAnimate,
  IAnimationConfig,
  IAnimationParameters,
  IAnimationTimeline,
  IAnimationTimeSlice,
  IAnimationUnit,
  IAnimator,
  IParsedAnimationConfig
} from '../../types/animate';
import { Animator } from './animator';
import { invokeAnimateSpec, normalizeAnimationConfig, normalizeStateAnimationConfig } from './config';
import { DefaultAnimationParameters, ImmediateAnimationState } from '../constants';
import type { AnimationEvent, IElement, IMark, MarkFunctionType } from '../../types';
import { invokeFunctionType } from '../../parse/util';
import { Arranger } from './arranger';
import { DiffState, HOOK_EVENT } from '../enums';

export class Animate implements IAnimate {
  mark: IMark;
  state: MarkFunctionType<string> | null = null;
  configs: Array<IParsedAnimationConfig>;
  immediateConfigs: Array<IParsedAnimationConfig> = [];

  private isEnabled: boolean = true;
  private disabledStates: string[] = [];
  // store animator by animation state
  private animators: Map<string, IAnimator[]> = new Map();
  // count animation for each elements
  private elementRecorder: WeakMap<
    IElement,
    {
      prevState: string;
      count: { [state: string]: number };
    }
  > = new WeakMap();
  private timelineCount: Record<string, number> = {};
  // record: IAnimationRecord;

  constructor(mark: IMark, config: Record<string, IAnimationConfig | IAnimationConfig[]>) {
    this.mark = mark;
    this.configs = normalizeAnimationConfig(config ?? {});
  }

  updateConfig(config: Record<string, IAnimationConfig | IAnimationConfig[]>) {
    this.configs = normalizeAnimationConfig(config ?? {});
  }

  updateState(state: MarkFunctionType<string> | null) {
    this.state = state;
  }

  animate() {
    if (!this.isEnabled || !this.configs || !this.configs.length) {
      return;
    }

    const elements = this.mark.getAllElements();
    const parameters = this.mark.parameters();

    elements.forEach(element => {
      // TODO: if element is restored, clear isReserved flag
      if (element.isReserved && element.diffState !== DiffState.exit) {
        element.isReserved = false;
      }
      // clear previous animation when animation state changed
      const prevElementState = this.elementRecorder.get(element)?.prevState;
      const needStopAnimation = this.configs.some(config => {
        return (
          prevElementState !== element.diffState &&
          config.state === prevElementState &&
          config.timeline.controlOptions.stopWhenStateChange
        );
      });
      if (needStopAnimation) {
        // do not clear exit element in case it will animate
        this.clearElementAnimation(element, false);
      }
    });

    this.configs.forEach(config => {
      this.animateByTimeline(config, elements, parameters);
    });

    this.mark.cleanExitElements();

    return this;
  }

  runAnimationByState(animationState: string) {
    if (!this.isEnabled) {
      return;
    }

    // FIXME: maybe do nothing if state animation is already running
    // if (this.animators.get(animationState)?.length > 0) { return; }

    const stateConfigs = this.configs.filter(config => config.state === animationState);
    const elements = this.mark.getAllElements();
    const parameters = this.mark.parameters();

    const animators = stateConfigs.reduce((animators, config) => {
      return animators.concat(this.animateByTimeline(config, elements, parameters, true));
    }, [] as IAnimator[]);

    return new Arranger(animators);
  }
  stopAnimationByState(animationState: string) {
    const animators = this.animators.get(animationState);
    if (animators) {
      animators.forEach(animator => animator.stop());
    }
    return this;
  }
  pauseAnimationByState(animationState: string) {
    const animators = this.animators.get(animationState);
    if (animators) {
      animators.forEach(animator => animator.pause());
    }
    return this;
  }
  resumeAnimationByState(animationState: string) {
    const animators = this.animators.get(animationState);
    if (animators) {
      animators.forEach(animator => animator.resume());
    }
    return this;
  }

  run(config: IAnimationConfig | IAnimationConfig[]) {
    if (!this.isEnabled) {
      return;
    }

    const parsedConfigs = normalizeStateAnimationConfig(ImmediateAnimationState, config, this.immediateConfigs.length);
    this.immediateConfigs = this.immediateConfigs.concat(parsedConfigs);
    const elements = this.mark.getAllElements();
    const parameters = this.mark.parameters();

    const animators = parsedConfigs.reduce((animators, config) => {
      return animators.concat(this.animateByTimeline(config, elements, parameters, true));
    }, [] as IAnimator[]);

    return new Arranger(animators);
  }
  stop() {
    // map will be cleared in animator callback
    this.animators.forEach(animators => {
      animators.forEach(animator => animator.stop());
    });
    return this;
  }
  pause() {
    this.animators.forEach(stateAnimators => stateAnimators.forEach(animator => animator.pause()));
    return this;
  }
  resume() {
    this.animators.forEach(stateAnimators => stateAnimators.forEach(animator => animator.resume()));
    return this;
  }
  reverse() {
    /** Animation scheduler api, resume the recorded animations */
    return this;
  }
  restart() {
    /** Animation scheduler api, resume current animations */
    return this;
  }
  record() {
    /** Animation scheduler api, start to record a timestamp */
    return this;
  }
  recordEnd() {
    /** Animation scheduler api, end to record a timestamp */
    return this;
  }

  isAnimating() {
    let isAnimating = false;
    this.animators.forEach(animators => {
      isAnimating = isAnimating || animators.some(animator => animator.isAnimating);
    });
    return isAnimating;
  }

  isElementAnimating(element: IElement) {
    const stateAnimationCounts = this.elementRecorder.get(element)?.count;
    return isNil(stateAnimationCounts) || Object.values(stateAnimationCounts).every(count => count === 0);
  }

  getAnimatorCount() {
    let count = 0;
    this.animators.forEach(animators => (count += animators.length));
    return count;
  }

  getAllAnimators() {
    const allAnimators: IAnimator[] = [];
    this.animators.forEach(animators => {
      allAnimators.push(...animators);
    });
    return allAnimators;
  }

  getElementAnimators(element: IElement | IElement[], animationState?: string) {
    const elements = array(element);
    let animators: IAnimator[] = [];
    if (animationState) {
      animators = this.animators.get(animationState) ?? [];
    } else {
      this.animators.forEach(stateAnimators => {
        animators = animators.concat(stateAnimators);
      });
    }
    return animators.filter(animator => elements.includes(animator.element));
  }

  enable() {
    this.isEnabled = true;
    return this;
  }
  disable() {
    this.isEnabled = false;
    this.stop();
    this.animators.clear();
    return this;
  }
  enableAnimationState(state: string | string[]) {
    const states = array(state);
    this.disabledStates = this.disabledStates.filter(state => !states.includes(state));
    return this;
  }
  disableAnimationState(state: string | string[]) {
    const states = array(state);
    this.disabledStates = this.disabledStates.concat(states);
    return this;
  }

  release() {
    this.stop();
    // we need to clear map
    this.animators.clear();

    this.configs = null;
    this.animators = null;
    this.elementRecorder = null;
    this.timelineCount = null;
  }

  private animateByTimeline(
    config: IParsedAnimationConfig,
    elements: IElement[],
    parameters: any,
    forceState: boolean = false
  ) {
    const animators: IAnimator[] = [];
    const animatedElements = elements.filter(element => {
      // do not animate on element which is running exit animation
      // if an element is reserved, it should be set for exit animation and will be removed
      const checkExit = !(element.isReserved && element.diffState === DiffState.exit);
      // do not check animation state if forceState is set
      const state = this.getAnimationState(element);
      const checkDisabled = !this.disabledStates.includes(state);
      const checkState = forceState || state === config.state;
      // filter elements by partitioner config
      const checkPartitioner =
        !config.timeline.partitioner || config.timeline.partitioner(element.getDatum(), element, parameters);
      return checkExit && checkDisabled && checkState && checkPartitioner;
    });

    if (animatedElements.length) {
      if (isNil(this.timelineCount[config.id])) {
        this.timelineCount[config.id] = 0;
      }

      if (config.timeline.sort) {
        animatedElements.sort((elementA, elementB) => {
          return config.timeline.sort(elementA.getDatum(), elementB.getDatum(), elementA, elementB, parameters);
        });
      }
      const width = this.mark.view.width();
      const height = this.mark.view.height();
      animatedElements.forEach((element, index) => {
        const animationParameters: IAnimationParameters = {
          width,
          height,
          group: this.mark.group ?? null,
          mark: this.mark,
          view: this.mark.view,
          elementCount: animatedElements.length,
          elementIndex: index
        };
        // add animation parameter into parameters
        const mergedParameters = Object.assign({ [DefaultAnimationParameters]: animationParameters }, parameters);
        const animationUnit = this.getAnimationUnit(
          config.timeline,
          element,
          index,
          animatedElements.length,
          mergedParameters
        );
        animators.push(this.animateElement(config, animationUnit, element, animationParameters, mergedParameters));
      });
    }
    return animators;
  }

  private animateElement(
    config: IParsedAnimationConfig,
    animationUnit: IAnimationUnit,
    element: IElement,
    animationParameters: IAnimationParameters,
    parameters: any
  ) {
    // create animator
    const animator = new Animator(element, animationUnit, config);

    // start animating
    animator.animate(animationParameters, parameters);
    // return when animator has no valid animation
    if (!animator.isAnimating) {
      return;
    }
    if (element.diffState === DiffState.exit) {
      element.isReserved = true;
    }

    const isFirstAnimator = this.timelineCount[config.id] === 0;

    this.timelineCount[config.id] += 1;
    const elementRecord = this.elementRecorder.get(element) ?? { prevState: config.state, count: {} };
    elementRecord.prevState = config.state;
    elementRecord.count[config.state] = (elementRecord.count[config.state] ?? 0) + 1;
    this.elementRecorder.set(element, elementRecord);
    const stateData = this.animators.get(config.state);
    if (!stateData) {
      this.animators.set(config.state, [animator]);
    } else {
      stateData.push(animator);
    }
    // this.animators.set(config.state, (this.animators.get(config.state) ?? []).concat(animator));
    // invoke callback when animation finish
    animator.callback(() => {
      this.handleAnimatorEnd(animator);
    });

    // FIXME: handle multiple timelines with same animation state
    // emit animation start event
    const animationEvent: AnimationEvent = {
      mark: this.mark,
      animationState: config.state,
      animationConfig: config.originConfig
    };
    if (isFirstAnimator) {
      this.mark.emit(HOOK_EVENT.ANIMATION_START, animationEvent);
    }
    this.mark.emit(HOOK_EVENT.ELEMENT_ANIMATION_START, animationEvent, element);

    return animator;
  }

  private getAnimationState(element: IElement): string {
    const customState = invokeFunctionType(this.state, this.mark.parameters(), element.getDatum(), element);
    return customState ?? element.diffState;
  }

  private getAnimationUnit(
    timeline: IAnimationTimeline,
    element: IElement,
    index: number,
    elementCount: number,
    parameters: any
  ): IAnimationUnit {
    const timeSlices: IAnimationTimeSlice[] = [];
    const startTime = invokeAnimateSpec(timeline.startTime, element, parameters);
    const totalTime = invokeAnimateSpec(timeline.totalTime, element, parameters);
    const oneByOne = invokeAnimateSpec(timeline.oneByOne, element, parameters);
    const loop = invokeAnimateSpec(timeline.loop, element, parameters);

    let loopTime = 0;
    (timeline.timeSlices as IAnimationTimeSlice[]).forEach(timeSlice => {
      const delay = invokeAnimateSpec(timeSlice.delay, element, parameters);
      const duration = invokeAnimateSpec(timeSlice.duration, element, parameters) ?? totalTime / elementCount;
      const effects = array(timeSlice.effects).map(effect =>
        Object.assign({}, effect, {
          customParameters: invokeAnimateSpec(effect.customParameters, element, parameters)
        })
      );
      timeSlices.push({
        effects,
        duration,
        delay
      });
      loopTime += delay + duration;
    });

    const oneByOneDelay = isNumber(oneByOne) ? oneByOne : oneByOne === true ? loopTime : 0;
    return {
      initialDelay: startTime,
      loopCount: isNumber(loop) ? loop : loop === true ? Infinity : 1,
      loopDelay: oneByOneDelay * index,
      loopDelayAfter: oneByOneDelay * (elementCount - index - 1),
      loopAnimateDuration: loopTime,
      loopDuration: loopTime + oneByOneDelay * (elementCount - 1),
      totalTime,
      timeSlices
    };
  }

  private clearElementAnimation(element: IElement, clearElement: boolean = true) {
    this.animators.forEach(animators => {
      animators.forEach(animator => {
        if (animator.element === element) {
          // if previous animation state is exit, modify graphic item channel to start
          if (animator.animationOptions.state === DiffState.exit) {
            animator.stop('start', false);
          } else {
            animator.stop('end', false);
          }
          this.handleAnimatorEnd(animator, clearElement);
        }
      });
    });
    this.elementRecorder.delete(element);
  }

  private clearAllElements() {
    const elements = this.mark.getAllElements();
    if (elements) {
      elements.forEach((element, i) => {
        // only update mark in previous invocation
        this.clearElement(element, i === elements.length - 1);
      });
    }
  }

  private clearElement(element: IElement, updateMark: boolean = true) {
    this.clearElementAnimation(element);
    // element might already be released
    if (element.getGraphicItem()) {
      // if element stops animating or needs to be removed, clear all cached attributes
      element.clearGraphicAttributes();
      // remove element from mark if exit animation is finished
      if (element.diffState === DiffState.exit) {
        element.isReserved = false;
      }
      if (updateMark) {
        this.mark.cleanExitElements();
      }
      // TODO: waiting for vRender to optimize bound cache logic, otherwise this line
      //  will cause huge performance waste in multiple animation like appear & disappear.
      // if (updateMark) mark.updateBounds();
    }
  }

  private handleAnimatorEnd(animator: IAnimator, clearElement: boolean = true) {
    const element = animator.element;
    const animationOptions = animator.animationOptions;
    const animationState = animationOptions.state;
    const isImmediateAnimation = animationState === ImmediateAnimationState;

    // sub element animation count
    const stateAnimationCounts = this.elementRecorder.get(element).count;
    stateAnimationCounts[animationState] -= 1;
    // FIXME: maybe delete zero animationState
    // if (stateAnimationCounts[animationState] === 0) {
    //   delete stateAnimationCounts[animationState];
    // }

    this.animators.set(
      animationState,
      this.animators.get(animationState).filter(ani => ani !== animator)
    );
    if (this.animators.get(animationState).length === 0) {
      this.animators.delete(animationState);
    }
    this.timelineCount[animationOptions.id] -= 1;
    const isLastAnimator = this.timelineCount[animationOptions.id] === 0;

    const originAnimationConfig = isImmediateAnimation
      ? this.immediateConfigs.find(config => config.id === animationOptions.id).originConfig
      : this.configs.find(config => config.id === animationOptions.id).originConfig;
    if (isLastAnimator) {
      delete this.timelineCount[animationOptions.id];
      // delete config when immediate executed animation is finished
      if (isImmediateAnimation) {
        this.immediateConfigs = this.immediateConfigs.filter(config => config.id !== animationOptions.id);
      }
    }

    if (clearElement) {
      if (Object.keys(this.timelineCount).length === 0) {
        this.clearAllElements();
      } else if (animationState === DiffState.exit && stateAnimationCounts[DiffState.exit] === 0) {
        // if all exit animations are finished
        this.clearElement(element);
      }
    }

    // emit animation end event
    const animationEvent: AnimationEvent = {
      mark: this.mark,
      animationState,
      animationConfig: originAnimationConfig
    };
    if (isLastAnimator) {
      this.mark.emit(HOOK_EVENT.ANIMATION_END, animationEvent);
    }
    this.mark.emit(HOOK_EVENT.ELEMENT_ANIMATION_END, animationEvent, element);
  }
}
