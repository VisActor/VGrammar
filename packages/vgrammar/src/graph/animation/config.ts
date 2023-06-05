import { array, isFunction, isNil } from '@visactor/vutils';
import { mergeConfig } from '@visactor/vgrammar-util';
import type { IElement } from '../../types';
import type {
  IAnimationConfig,
  IAnimationTimeline,
  IAnimationTypeConfig,
  IParsedAnimationConfig,
  MarkFunctionValueType
} from '../../types/animate';
import {
  DefaultAnimationControlOptions,
  DefaultAnimationDelay,
  DefaultAnimationDuration,
  DefaultAnimationEasing,
  DefaultAnimationLoop,
  DefaultAnimationOneByOne,
  DefaultAnimationStartTime
} from '../constants';

function transformToTimelineConfig(animationConfig: IAnimationConfig): IAnimationTimeline {
  if (isNil((animationConfig as IAnimationTimeline).timeSlices)) {
    const typeConfig = animationConfig as IAnimationTypeConfig;
    // transform type animation config into timeline animation config
    return {
      startTime: typeConfig.startTime ?? DefaultAnimationStartTime,
      totalTime: typeConfig.totalTime,
      oneByOne: typeConfig.oneByOne ?? DefaultAnimationOneByOne,
      loop: typeConfig.loop ?? DefaultAnimationLoop,
      controlOptions: mergeConfig(DefaultAnimationControlOptions, typeConfig.controlOptions ?? {}),
      timeSlices: [
        {
          duration: typeConfig.duration ?? DefaultAnimationDuration,
          delay: typeConfig.delay ?? DefaultAnimationDelay,
          effects: [
            {
              type: typeConfig.type,
              channel: typeConfig.channel,
              custom: typeConfig.custom,
              easing: typeConfig.easing ?? DefaultAnimationEasing,
              customParameters: typeConfig.customParameters,
              options: typeConfig.options
            }
          ]
        }
      ]
    };
  }

  const timeSlices = array((animationConfig as IAnimationTimeline).timeSlices);
  const formattedTimeSlices = timeSlices.filter(timeSlice => {
    return timeSlice.effects && array(timeSlice.effects).filter(effect => effect.channel || effect.type).length;
  });

  if (formattedTimeSlices.length) {
    // fill up default animation config
    return {
      startTime: (animationConfig as IAnimationTimeline).startTime ?? DefaultAnimationStartTime,
      totalTime: (animationConfig as IAnimationTimeline).totalTime,
      oneByOne: (animationConfig as IAnimationTimeline).oneByOne ?? DefaultAnimationOneByOne,
      loop: (animationConfig as IAnimationTimeline).loop ?? DefaultAnimationLoop,
      controlOptions: mergeConfig(DefaultAnimationControlOptions, animationConfig.controlOptions ?? {}),
      timeSlices: formattedTimeSlices.map(timeSlice => {
        return {
          duration: timeSlice.duration,
          delay: timeSlice.delay ?? DefaultAnimationDelay,
          effects: array(timeSlice.effects)
            .filter(effect => effect.channel || effect.type)
            .map(effect => {
              return {
                type: effect.type,
                channel: effect.channel,
                custom: effect.custom,
                easing: effect.easing ?? DefaultAnimationEasing,
                customParameters: effect.customParameters,
                options: effect.options
              };
            })
        };
      }),
      partitioner: (animationConfig as IAnimationTimeline).partitioner,
      sort: (animationConfig as IAnimationTimeline).sort
    };
  }

  return;
}

export function normalizeAnimationConfig(
  config: Record<string, IAnimationConfig | IAnimationConfig[]>
): Array<IParsedAnimationConfig> {
  let normalizedConfig: Array<IParsedAnimationConfig> = [];

  Object.keys(config).forEach(state => {
    normalizedConfig = normalizedConfig.concat(normalizeStateAnimationConfig(state, config[state]));
  });
  return normalizedConfig;
}

export function normalizeStateAnimationConfig(
  state: string,
  config: IAnimationConfig | IAnimationConfig[],
  initialIndex: number = 0
): Array<IParsedAnimationConfig> {
  const normalizedConfig: Array<IParsedAnimationConfig> = [];
  let index = initialIndex;
  array(config).forEach(animationConfig => {
    const timelineConfig = transformToTimelineConfig(animationConfig);
    if (timelineConfig) {
      normalizedConfig.push({
        state,
        id: timelineConfig.id ?? `${state}-${index}`,
        timeline: timelineConfig,
        originConfig: animationConfig
      });
      index += 1;
    }
  });
  return normalizedConfig;
}

export function invokeAnimateSpec<T>(spec: MarkFunctionValueType<T>, element: IElement, parameters: any): T {
  if (isFunction(spec)) {
    return spec.call(null, element.getDatum(), element, parameters);
  }
  return spec;
}
