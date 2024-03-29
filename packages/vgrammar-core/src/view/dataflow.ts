import type { ILogger } from '@visactor/vutils';
import type { IDataflow } from '../types/dataflow';
import { isNil, Logger } from '@visactor/vutils';
import { Heap } from '../util/grammar-heap';
import { UniqueList } from '../util/unique-list';
import type { IDataflowCallback, IGrammarBase } from '../types';

/**
 * A dataflow to run all the grammar elements
 */
export default class Dataflow implements IDataflow {
  logger: ILogger;
  private grammars: IGrammarBase[] = [];
  /** 当前排序 */
  private _curRank: number;
  /** 发生了变更的元素 */
  private _committed?: UniqueList<IGrammarBase>;
  private _heap?: Heap;
  private _beforeRunner?: IDataflowCallback;
  private _afterRunner?: IDataflowCallback;
  private _updateCounter: number;
  /** 是否完成初次渲染 */
  private _finishFirstRender?: boolean;

  constructor() {
    this.logger = Logger.getInstance();

    this._curRank = 0;

    this._committed = new UniqueList(grammar => grammar.uid);

    this._heap = new Heap((a, b) => a?.qrank - b?.qrank);
    this._beforeRunner = null;
    this._afterRunner = null;
    this._updateCounter = 0;
    this._finishFirstRender = false;
  }

  add(grammar: IGrammarBase) {
    if (!grammar) {
      return;
    }
    this._setRankOfGrammar(grammar);
    this.commit(grammar);
    if (!this.grammars.includes(grammar)) {
      this.grammars.push(grammar);

      return true;
    }

    return false;
  }

  remove(grammar: IGrammarBase) {
    if (grammar) {
      this._committed.remove(grammar);
      this._heap.remove(grammar);
      this.grammars = this.grammars.filter(storedGrammar => storedGrammar !== grammar);
    }
  }

  private _setRankOfGrammar(grammar?: IGrammarBase) {
    if (!grammar) {
      return;
    }
    grammar.rank = ++this._curRank;
  }

  private _reRank(grammar?: IGrammarBase) {
    const queue = [grammar];

    while (queue.length) {
      const cur = queue.pop();
      this._setRankOfGrammar(cur);
      const list = cur.targets;

      if (list) {
        list.forEach((entry: IGrammarBase) => {
          queue.push(entry);
          if (entry === grammar) {
            this.logger.error('Cycle detected in dataflow graph.');
          }
        });
      }
    }
  }

  private _enqueue(grammar: IGrammarBase) {
    if (!grammar) {
      return;
    }

    (grammar as any).qrank = grammar.rank;
    // push and reRank in the heap
    this._heap.push(grammar);
  }

  private _logGrammarRunInfo(grammar: IGrammarBase) {
    if (this.logger.canLogError()) {
      const debugInfos = [
        { key: 'id', value: grammar.id() },
        { key: 'name', value: grammar.name() }
      ];
      const debugStr = debugInfos.reduce((str, entry, index) => {
        if (!isNil(entry.value)) {
          return `${str}${index ? ' , ' : ''}${entry.key}: ${entry.value}`;
        }

        return str;
      }, '');

      this.logger.debug('Run Operator: ', grammar, debugStr);
    }
  }

  hasCommitted() {
    return !!this._committed.length;
  }

  // OPERATOR UPDATES
  commit(grammar: IGrammarBase) {
    // otherwise, queue for next propagation
    this._committed.add(grammar);

    return this;
  }

  private _beforeEvaluate() {
    // reRank grammar element which has higher rank than its targets
    this.grammars.forEach(grammar => {
      if (grammar.targets.some(target => target?.rank < grammar?.rank)) {
        this._reRank(grammar);
      }
    });
    // initialize priority queue, reset committed grammars
    this._committed.forEach(grammar => this._enqueue(grammar));
    this._committed = new UniqueList(grammar => grammar.uid);
  }

  private _enqueueTargets(grammar: IGrammarBase) {
    if (grammar.targets && grammar.targets.length && this._finishFirstRender) {
      grammar.targets.forEach((target: IGrammarBase) => this._enqueue(target));
    }
  }

  evaluate() {
    // invoke prerun function, if provided
    if (this._beforeRunner) {
      this._beforeRunner(this);
    }

    // exit early if there are no updates
    if (!this._committed.length) {
      this.logger.info('Dataflow invoked, but nothing to do.');
      return false;
    }

    this._updateCounter += 1;
    let count = 0;
    let grammar;
    let dt;
    let error;

    if (this.logger.canLogInfo()) {
      dt = Date.now();
      this.logger.debug(`-- START PROPAGATION (${this._updateCounter}) -----`);
    }

    this._beforeEvaluate();

    while (this._heap.size() > 0) {
      // dequeue grammar with highest priority
      grammar = this._heap.pop();

      if (!grammar) {
        continue;
      }

      // re-queue if rank changed
      if (grammar.rank !== grammar.qrank) {
        this._enqueue(grammar);
        continue;
      }

      grammar.run();

      this._logGrammarRunInfo(grammar);
      this._enqueueTargets(grammar);
      count += 1;
    }

    if (this.logger.canLogInfo()) {
      dt = Date.now() - dt;
      this.logger.info(`> ${count} grammars updated; ${dt} ms`);
    }

    if (error) {
      this.logger.error(error);
    } else if (this._afterRunner) {
      this._afterRunner(this);
    }

    this._finishFirstRender = true;

    return true;
  }

  runBefore(callback?: IDataflowCallback) {
    this._beforeRunner = callback;
  }

  runAfter(callback?: IDataflowCallback) {
    this._afterRunner = callback;
  }

  release() {
    if (this._heap) {
      this._heap.clear();
      this._heap = null;
    }

    this.logger = null;
    this._committed = null;
  }
}
