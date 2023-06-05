import { morphPath, multiToOneMorph, oneToMultiMorph } from '@visactor/vrender';
import { isNil, isNumber, isValidNumber } from '@visactor/vutils';
import type { IElement, IGrammarBase, IMark, MarkSpec } from '../../types';
import type { DiffResult } from '../../types/base';
import type { IMorph, IMorphConfig, MorphData, MorphElements } from '../../types/morph';
import { invokeFunctionType, parseField } from '../../parse/util';
import { diffMultiple, diffSingle, groupData } from '../mark/differ';
import { GrammarMarkType } from '../enums';

const EmptyKey = Symbol.for('key');

export class Morph implements IMorph {
  diffGrammar<U extends IGrammarBase>(prevGrammars: U[], nextGrammars: U[]): DiffResult<U, U> {
    const key = (grammar: U) => grammar.id() ?? Symbol();
    return diffSingle(prevGrammars, nextGrammars, key);
  }

  diffMark(prevMarks: IMark[], nextMarks: IMark[], morphConfig: IMorphConfig): DiffResult<IMark[], IMark[]> {
    const diffResult: DiffResult<IMark[], IMark[]> = {
      enter: [],
      exit: [],
      update: []
    };

    let prevMorphMarks: IMark[] = [];
    let nextMorphMarks: IMark[] = [];

    // filter out marks & specs which will not morph
    prevMarks.forEach(mark => {
      if (
        morphConfig.morph &&
        (morphConfig.morphAll || mark.getMorphConfig().morph) &&
        mark.markType !== GrammarMarkType.group
      ) {
        prevMorphMarks.push(mark);
      } else {
        diffResult.exit.push({ prev: [mark] });
      }
    });
    nextMarks.forEach(mark => {
      if (
        morphConfig.morph &&
        (morphConfig.morphAll || mark.getMorphConfig().morph) &&
        mark.markType !== GrammarMarkType.group
      ) {
        nextMorphMarks.push(mark);
      } else {
        diffResult.enter.push({ next: [mark] });
      }
    });

    // 1. match by custom key
    const keyDiffResult = this.diffUpdateByGroup(
      prevMorphMarks,
      nextMorphMarks,
      mark => mark.getMorphConfig().morphKey,
      mark => mark.getMorphConfig().morphKey
    );
    prevMorphMarks = keyDiffResult.prev;
    nextMorphMarks = keyDiffResult.next;
    diffResult.update = diffResult.update.concat(keyDiffResult.update);

    // 2. match by name
    const nameDiffResult = this.diffUpdateByGroup(
      prevMorphMarks,
      nextMorphMarks,
      mark => mark.id(),
      mark => mark.id()
    );
    prevMorphMarks = nameDiffResult.prev;
    nextMorphMarks = nameDiffResult.next;
    diffResult.update = diffResult.update.concat(nameDiffResult.update);

    // 3. match by index

    // FIXME: mark index cannot be get before executing, index is decided by remove/order for now
    const prevParentGroup = groupData(prevMorphMarks, mark => mark.group?.id?.());
    const nextParentGroup = groupData(nextMorphMarks, mark => mark.group?.id?.());

    Object.keys(nextParentGroup).forEach(groupName => {
      const prevChildren = prevParentGroup.data.get(groupName);
      const nextChildren = nextParentGroup.data.get(groupName);
      if (prevChildren && nextChildren) {
        for (let i = 0; i < Math.max(prevChildren.length, nextChildren.length); i += 1) {
          const prevChild = prevChildren[i];
          const nextChild = nextChildren[i];
          if (prevChild && nextChild) {
            diffResult.update.push({ prev: [prevChild], next: [nextChild] });
          } else if (prevChild) {
            diffResult.exit.push({ prev: [prevChild] });
          } else if (nextChild) {
            diffResult.enter.push({ next: [nextChild] });
          }
        }

        prevMorphMarks = prevMorphMarks.filter(mark => !prevChildren.includes(mark));
        nextMorphMarks = nextMorphMarks.filter(mark => !nextChildren.includes(mark));
      }
    });

    // 4. handle unmatched marks
    prevMorphMarks.forEach(mark => diffResult.exit.push({ prev: [mark] }));
    nextMorphMarks.forEach(mark => diffResult.enter.push({ next: [mark] }));

    return diffResult;
  }

  private _appendMorphKeyToElements(mark: IMark) {
    const config = mark.getMorphConfig();

    if (!isNil(config.morphElementKey)) {
      const getter = parseField(config.morphElementKey);

      if (mark.elements) {
        mark.elements.forEach(el => {
          (el as any).morphKey = getter(el.getDatum());
        });
      }
    }
  }

  morph(prevMarks: IMark[], nextMarks: IMark[], morphConfig: IMorphConfig) {
    const prevElements = prevMarks.reduce((elements, mark) => {
      this._appendMorphKeyToElements(mark);

      return elements.concat(mark.elements);
    }, [] as IElement[]);
    const nextElements = nextMarks.reduce((elements, mark) => {
      this._appendMorphKeyToElements(mark);

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
        this.doMorph([], [element], morphConfig, onMorphEnd, parameters);
      });
      morphCount += 1;
    });
    diffResult.update.forEach(diff => {
      const divideCount = Math.min(diff.prev.length, diff.next.length);
      const prevDivide = this.divideElements(diff.prev, divideCount);
      const nextDivide = this.divideElements(diff.next, divideCount);
      for (let i = 0; i < divideCount; i++) {
        this.doMorph(prevDivide[i], nextDivide[i], morphConfig, onMorphEnd, parameters);
        morphCount += 1;
      }
    });
  }

  private diffUpdateByGroup<U extends IMark | MarkSpec, V extends IMark | MarkSpec>(
    prev: U[],
    next: V[],
    prevKey: (datum: U) => symbol | string,
    nextKey: (datum: V) => symbol | string
  ) {
    const prevGroup = groupData(prev, datum => prevKey(datum) ?? EmptyKey);
    const nextGroup = groupData(next, datum => nextKey(datum) ?? EmptyKey);

    let prevAfterDiff = prev;
    let nextAfterDiff = next;
    const update: { prev: U[]; next: V[] }[] = [];
    nextGroup.keys.forEach(key => {
      if (key !== EmptyKey) {
        const prevKeyData = prevGroup.data.get(key);
        const nextKeyData = nextGroup.data.get(key);
        if (prevKeyData && nextKeyData) {
          update.push({ prev: prevKeyData, next: nextKeyData });
          prevAfterDiff = prevAfterDiff.filter(datum => !prevKeyData.includes(datum));
          nextAfterDiff = nextAfterDiff.filter(datum => !nextKeyData.includes(datum));
        }
      }
    });
    return {
      prev: prevAfterDiff,
      next: nextAfterDiff,
      update
    };
  }

  private doMorph(prev: IElement[], next: IElement[], morphConfig: IMorphConfig, onEnd: () => void, parameters: any) {
    const morphData: MorphData = {
      prev: prev.map(element => element.getDatum()),
      next: next.map(element => element.getDatum())
    };
    const morphElements: MorphElements = {
      prev: prev.slice(),
      next: next.slice()
    };
    const easing = morphConfig.animation.easing;
    const delay = invokeFunctionType(morphConfig.animation.delay, parameters, morphData, morphElements);
    const duration = invokeFunctionType(morphConfig.animation.duration, parameters, morphData, morphElements);
    const oneByOne = invokeFunctionType(morphConfig.animation.oneByOne, parameters, morphData, morphElements);
    const splitPath = invokeFunctionType(morphConfig.animation.splitPath, parameters, morphData, morphElements);
    const individualDelay =
      isValidNumber(oneByOne) && oneByOne > 0
        ? (index: number) => {
            if (isNumber(oneByOne)) {
              return index * oneByOne;
            } else if (oneByOne === true) {
              return index * duration;
            }
            return 0;
          }
        : undefined;

    // if no previous item, still execute morph animation
    if ((prev.length === 1 || prev.length === 0) && next.length === 1) {
      morphPath(prev[0]?.getGraphicItem?.(), next[0].getGraphicItem(), { delay, duration, easing, onEnd });
    } else if (prev.length === 1 && next.length > 1) {
      oneToMultiMorph(
        prev[0].getGraphicItem(),
        next.map(element => element.getGraphicItem()),
        { delay, duration, easing, onEnd, individualDelay, splitPath }
      );
    } else if (prev.length > 1 && next.length === 1) {
      multiToOneMorph(
        prev.map(element => element.getGraphicItem()),
        next[0].getGraphicItem(),
        { delay, duration, easing, onEnd, individualDelay, splitPath }
      );
    }
  }

  private divideElements(elements: IElement[], count: number) {
    const divideLength = Math.floor(elements.length / count);
    return new Array(count).fill(0).map((i, index) => {
      return elements.slice(divideLength * index, index === count - 1 ? elements.length : divideLength * (index + 1));
    });
  }
}
