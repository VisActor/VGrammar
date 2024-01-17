import { array, EventEmitter, isNil, isString, isValid } from '@visactor/vutils';
import type { GrammarType, IGrammarBase, IView, IGrammarTask, BaseEventHandler } from '../types';
import { parseOptions } from '../parse/option';
import { parseFunctionType } from '../parse/util';
import type { Nil } from '../types/base';
import { HOOK_EVENT } from '../graph/enums';

let grammarBaseId = -1;

export abstract class GrammarBase extends EventEmitter implements IGrammarBase {
  readonly grammarType: GrammarType;

  readonly uid: number;
  protected _id: string;
  protected _name: string;

  protected spec: any = {};

  view: IView;
  rank: number;

  // FIXME: adapt current implementation of dataflow, refactor after dataflow design is finished
  grammarSource: IGrammarBase;
  references: Map<IGrammarBase, number> = new Map();
  targets: IGrammarBase[] = [];
  transforms: IGrammarTask[] = [];

  constructor(view: IView) {
    super();
    this.view = view;
    this.uid = ++grammarBaseId;
  }

  parse(spec: any): this {
    this.id(spec.id);
    this.name(spec.name);
    this.depend(spec.dependency);
    return this;
  }

  depend(grammars: IGrammarBase[] | IGrammarBase | string[] | string) {
    if (this.spec?.dependency) {
      const lastGrammars = array(this.spec.dependency).map(grammar => {
        return isString(grammar) ? this.view.getGrammarById(grammar) : grammar;
      });
      this.detach(lastGrammars);
    }
    this.spec.dependency = grammars;
    const currentGrammars = array(grammars).map(grammar => {
      return isString(grammar) ? this.view.getGrammarById(grammar) : grammar;
    });
    this.attach(currentGrammars);

    this.commit();
    return this;
  }

  addEventListener(type: string, handler: BaseEventHandler, options?: any) {
    let callback = handler;
    if (!(options && options.trap === false)) {
      callback = handler;
      (callback as any).raw = handler;
    }
    if (options && options.target) {
      (callback as any).target = options.target;
    }
    this.on(type, callback);
    return this;
  }

  removeEventListener(type: string, handler?: BaseEventHandler) {
    if (handler) {
      this.off(type, handler);
    } else {
      this.off(type);
    }
    return this;
  }

  emit<T extends EventEmitter.EventNames<string | symbol>>(
    event: T,
    ...args: EventEmitter.EventArgs<string | symbol, T>
  ): boolean {
    this.view?.emit?.(event, ...args);
    return super.emit(event, ...args);
  }

  emitGrammarEvent<T extends EventEmitter.EventNames<string | symbol>>(
    event: T,
    ...args: EventEmitter.EventArgs<string | symbol, T>
  ): boolean {
    return super.emit(event, ...args);
  }

  abstract evaluate(upstream: any, parameters: any): this | this;
  abstract output(): any;

  evaluateTransform(transforms: IGrammarTask[], upstream: any, parameters: any) {
    if (!transforms || !transforms.length) {
      return upstream;
    }
    let currentUpstreamData = upstream;
    let i = 0;
    const n = transforms.length;

    while (i < n) {
      const task = transforms[i];

      this.emit(HOOK_EVENT.BEFORE_TRANSFORM, task.type);
      currentUpstreamData = task.transform(
        task.isRawOptions ? task.options : parseOptions(task.options, parameters),
        currentUpstreamData,
        parameters,
        this.view
      );
      i++;
      this.emit(HOOK_EVENT.AFTER_TRANSFORM, task.type);
    }

    return currentUpstreamData;
  }

  set(value: any): boolean {
    // do nothing
    return false;
  }

  id(): string;
  id(id: string): this;
  id(id?: string) {
    if (arguments.length) {
      this.view.grammars.unrecord(this);
      this._id = id;
      this.view.grammars.record(this);
      return this;
    }
    return this._id;
  }

  name(): string;
  name(name: string): this;
  name(name?: string) {
    if (arguments.length) {
      this._name = name;
      return this;
    }
    return this._name;
  }

  attach(reference: IGrammarBase | IGrammarBase[], count: number = 1) {
    array(reference)
      .filter(ref => !isNil(ref))
      .forEach(ref => {
        if (isNil(reference)) {
          return;
        }
        if (!ref.targets.includes(this)) {
          ref.targets.push(this);
        }
        this.references.set(ref, (this.references.get(ref) ?? 0) + count);
      });
    return this;
  }

  detach(reference: IGrammarBase | IGrammarBase[], count: number = 1) {
    array(reference)
      .filter(ref => !isNil(ref))
      .forEach(ref => {
        const refCount = this.references.get(ref) - count;
        if (refCount > 0) {
          this.references.set(ref, refCount - 1);
        } else {
          this.references.delete(ref);
          if (ref.targets.includes(this)) {
            ref.targets = ref.targets.filter(target => target !== this);
          }
        }
      });
    return this;
  }

  detachAll() {
    this.references.forEach((count, ref) => {
      this.detach(ref, count);
    });
  }

  link(source: IGrammarBase) {
    this.grammarSource = source;
  }

  run() {
    const upstream = this.grammarSource?.output();
    const parameters = this.parameters();
    return this.evaluate(upstream, parameters);
  }

  commit() {
    this.view.commit(this);
  }

  parameters() {
    const params: any = {};
    this.references.forEach((count, ref) => {
      // upstream reference with no valid id will not be recorded in parameters
      if (isValid(ref.id())) {
        params[ref.id() as string] = ref.output();
      }
    });
    return params;
  }

  getSpec() {
    return this.spec;
  }

  reuse(grammar: IGrammarBase) {
    return this;
  }

  clear() {
    this.spec = null;
    this.view = null;
  }

  release() {
    this.clear();
  }

  protected setFunctionSpec<T>(spec: T | Nil, specField: string) {
    if (!isNil(this.spec[specField])) {
      this.detach(parseFunctionType(this.spec[specField], this.view));
    }
    this.spec[specField] = spec;
    this.attach(parseFunctionType(spec, this.view));
    this.commit();
    return this;
  }
}
