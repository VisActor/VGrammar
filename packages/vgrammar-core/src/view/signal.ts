import { isArray, isNil } from '@visactor/vutils';
import type { SignalFunctionType, SignalSpec } from '../types/signal';
import type { GrammarType, IGrammarBase, ISignal } from '../types/grammar';
import { GrammarBase } from './grammar-base';
import { invokeFunctionType } from '../parse/util';
import type { Nil } from '../types/base';

export class Signal<T> extends GrammarBase implements ISignal<T> {
  readonly grammarType: GrammarType = 'signal';

  protected spec: SignalSpec<T> = { value: null, update: null };

  private _signal: T;

  parse(spec: SignalSpec<T>) {
    super.parse(spec);
    this.value(spec.value);
    this.update(spec.update);

    this.commit();
    return this;
  }

  evaluate(upstream: any, parameters: any) {
    this._signal = this.spec.update ? invokeFunctionType(this.spec.update, parameters, this._signal) : this.spec.value;

    this.spec.value = this._signal;
    return this;
  }

  output() {
    return this._signal;
  }

  getValue() {
    return this.output();
  }

  set(value: T) {
    if (isArray(value) && isArray(this.value) && value.length === this.value.length) {
      for (let i = 0; i < value.length; i++) {
        if (this.value[i] !== value[i]) {
          this._signal = value;
          this.spec.value = value;

          return true;
        }
      }
      return false;
    }
    if (this._signal !== value) {
      this._signal = value;
      this.spec.value = value;

      return true;
    }
    return false;
  }

  update(update: SignalFunctionType<T> | Nil): this {
    // clear value spec if update is valid
    if (!isNil(update)) {
      this.value(undefined);
    }
    return this.setFunctionSpec(update, 'update');
  }

  value(value: T | Nil): this {
    // clear update spec if value is valid
    if (!isNil(value)) {
      this.update(undefined);
    }
    this.spec.value = value;
    this.commit();
    return this;
  }

  reuse(grammar: IGrammarBase) {
    if (grammar.grammarType !== this.grammarType) {
      return this;
    }
    this._signal = grammar.output();
    return this;
  }

  clear() {
    super.clear();
    this._signal = null;
  }
}
