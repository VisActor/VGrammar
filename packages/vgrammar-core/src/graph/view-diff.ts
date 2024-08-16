import type { IGrammarBase, IMark, IRunningConfig, MarkSpec } from '../types';
import type { DiffResult } from '../types/base';
import type { IViewDiff } from '../types/morph';
import { diffSingle, groupData } from './mark/differ';
import { GrammarMarkType } from './enums';

const EmptyKey = Symbol.for('key');

export class ViewDiff implements IViewDiff {
  diffGrammar<U extends IGrammarBase>(prevGrammars: U[], nextGrammars: U[]): DiffResult<U, U> {
    const key = (grammar: U) => grammar.id() ?? Symbol();
    return diffSingle(prevGrammars, nextGrammars, key);
  }

  diffMark(prevMarks: IMark[], nextMarks: IMark[], runningConfig: IRunningConfig): DiffResult<IMark[], IMark[]> {
    const diffResult: DiffResult<IMark[], IMark[]> = {
      enter: [],
      exit: [],
      update: []
    };

    let prevDiffMarks: IMark[] = [];
    let nextDiffMarks: IMark[] = [];

    // filter out marks & specs which will not morph
    prevMarks.forEach(mark => {
      if (
        // group mark does not support reusing or morphing
        mark.markType !== GrammarMarkType.group &&
        ((runningConfig.morph && mark.getMorphConfig().morph) || runningConfig.morphAll || runningConfig.reuse)
      ) {
        prevDiffMarks.push(mark);
      } else {
        diffResult.exit.push({ prev: [mark] });
      }
    });
    nextMarks.forEach(mark => {
      if (
        mark.markType !== GrammarMarkType.group &&
        ((runningConfig.morph && mark.getMorphConfig().morph) || runningConfig.morphAll || runningConfig.reuse)
      ) {
        nextDiffMarks.push(mark);
      } else {
        diffResult.enter.push({ next: [mark] });
      }
    });

    // 1. match by custom key
    const keyDiffResult = this.diffUpdateByGroup(
      prevDiffMarks,
      nextDiffMarks,
      mark => mark.getMorphConfig().morphKey,
      mark => mark.getMorphConfig().morphKey
    );
    prevDiffMarks = keyDiffResult.prev;
    nextDiffMarks = keyDiffResult.next;
    diffResult.update = diffResult.update.concat(keyDiffResult.update);

    // 2. match by name
    const nameDiffResult = this.diffUpdateByGroup(
      prevDiffMarks,
      nextDiffMarks,
      mark => mark.id(),
      mark => mark.id()
    );
    prevDiffMarks = nameDiffResult.prev;
    nextDiffMarks = nameDiffResult.next;
    diffResult.update = diffResult.update.concat(nameDiffResult.update);

    // 3. match by index

    // FIXME: mark index cannot be get before executing, index is decided by remove/order for now
    const prevParentGroup = groupData(prevDiffMarks, mark => mark.group?.id?.());
    const nextParentGroup = groupData(nextDiffMarks, mark => mark.group?.id?.());

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

        prevDiffMarks = prevDiffMarks.filter(mark => !prevChildren.includes(mark));
        nextDiffMarks = nextDiffMarks.filter(mark => !nextChildren.includes(mark));
      }
    });

    // 4. handle unmatched marks
    prevDiffMarks.forEach(mark => diffResult.exit.push({ prev: [mark] }));
    nextDiffMarks.forEach(mark => diffResult.enter.push({ next: [mark] }));

    return diffResult;
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
}
