// TODO: morph animation 没有移到 vrender-animation
// import { morphPath, multiToOneMorph, oneToMultiMorph } from '@visactor/vrender-core';
import { isNil, isNumber, isValidNumber } from '@visactor/vutils';
import type { IElement, IMark, IRunningConfig } from '../../types';
import type { MorphData, MorphElements } from '../../types/morph';
import { invokeFunctionType, parseField } from '../../parse/util';
import { diffMultiple } from '../mark/differ';

const doMorph = (
  prev: IElement[],
  next: IElement[],
  runningConfig: IRunningConfig,
  onEnd: () => void,
  parameters: any
) => {
  const morphData: MorphData = {
    prev: prev.map(element => element.getDatum()),
    next: next.map(element => element.getDatum())
  };
  const morphElements: MorphElements = {
    prev: prev.slice(),
    next: next.slice()
  };
  const easing = runningConfig.animation.easing;
  const delay = invokeFunctionType(runningConfig.animation.delay, parameters, morphData, morphElements);
  const duration = invokeFunctionType(runningConfig.animation.duration, parameters, morphData, morphElements);
  const oneByOne = invokeFunctionType(runningConfig.animation.oneByOne, parameters, morphData, morphElements);
  const splitPath = invokeFunctionType(runningConfig.animation.splitPath, parameters, morphData, morphElements);
  const individualDelay =
    isValidNumber(oneByOne) && (oneByOne as number) > 0
      ? (index: number) => {
          if (isNumber(oneByOne)) {
            return index * (oneByOne as number);
          } else if (oneByOne === true) {
            return index * duration;
          }
          return 0;
        }
      : undefined;

  // if no previous item, still execute morph animation
  if ((prev.length === 1 || prev.length === 0) && next.length === 1) {
    // morphPath(prev[0]?.getGraphicItem?.(), next[0].getGraphicItem(), { delay, duration, easing, onEnd });
  } else if (prev.length === 1 && next.length > 1) {
    // oneToMultiMorph(
    //   prev[0].getGraphicItem(),
    //   next.map(element => element.getGraphicItem()),
    //   { delay, duration, easing, onEnd, individualDelay, splitPath }
    // );
  } else if (prev.length > 1 && next.length === 1) {
    // multiToOneMorph(
    //   prev.map(element => element.getGraphicItem()),
    //   next[0].getGraphicItem(),
    //   { delay, duration, easing, onEnd, individualDelay, splitPath }
    // );
  }
};

const divideElements = (elements: IElement[], count: number) => {
  const divideLength = Math.floor(elements.length / count);
  return new Array(count).fill(0).map((i, index) => {
    return elements.slice(divideLength * index, index === count - 1 ? elements.length : divideLength * (index + 1));
  });
};

const appendMorphKeyToElements = (mark: IMark) => {
  const config = mark.getMorphConfig();

  if (!isNil(config.morphElementKey)) {
    const getter = parseField(config.morphElementKey);

    if (mark.elements) {
      mark.elements.forEach(el => {
        (el as any).morphKey = getter(el.getDatum());
      });
    }
  }
};

export const morph = (prevMarks: IMark[], nextMarks: IMark[], runningConfig: IRunningConfig) => {
  const prevElements = prevMarks.reduce((elements, mark) => {
    appendMorphKeyToElements(mark);

    return elements.concat(mark.elements);
  }, [] as IElement[]);
  const nextElements = nextMarks.reduce((elements, mark) => {
    appendMorphKeyToElements(mark);

    return elements.concat(mark.elements);
  }, [] as IElement[]);

  const key = (element: IElement) => (element as any).morphKey ?? element.key;
  const diffResult = diffMultiple(prevElements, nextElements, key);

  // disable normal animations of previous marks
  prevMarks.forEach(mark => mark.animate?.disable?.());
  nextMarks.forEach(mark => mark.animate?.disable?.());

  const parameters = prevMarks.concat(nextMarks).reduce((parameters, mark) => {
    Object.assign(parameters, mark.parameters());
    return parameters;
  }, {});

  let morphCount = 0;
  const onMorphEnd = () => {
    morphCount -= 1;
    if (morphCount === 0) {
      nextMarks.forEach(mark => {
        mark.animate?.enable?.();
      });
    }
  };
  // no animation for exit result
  diffResult.enter.forEach(diff => {
    diff.next.forEach(element => {
      doMorph([], [element], runningConfig, onMorphEnd, parameters);
    });
    morphCount += 1;
  });
  diffResult.update.forEach(diff => {
    const divideCount = Math.min(diff.prev.length, diff.next.length);
    const prevDivide = divideElements(diff.prev, divideCount);
    const nextDivide = divideElements(diff.next, divideCount);
    for (let i = 0; i < divideCount; i++) {
      doMorph(prevDivide[i], nextDivide[i], runningConfig, onMorphEnd, parameters);
      morphCount += 1;
    }
  });
};
