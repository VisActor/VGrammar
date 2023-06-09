import { isString } from '@visactor/vutils';
import type { IScale } from '../types';
import type { IScaleComponent, ScaleComponentSpec } from '../types/component';
import { Component } from '../view/component';

export abstract class ScaleComponent extends Component implements IScaleComponent {
  protected declare spec: ScaleComponentSpec;

  protected parseAddition(spec: ScaleComponentSpec) {
    super.parseAddition(spec);
    this.scale(spec.scale);
    return this;
  }

  scale(scale?: IScale | string) {
    if (this.spec.scale) {
      const lastScaleGrammar = isString(this.spec.scale) ? this.view.getScaleById(this.spec.scale) : this.spec.scale;
      this.detach(lastScaleGrammar);
      this.spec.scale = undefined;
    }
    const scaleGrammar = isString(scale) ? this.view.getScaleById(scale) : scale;
    this.spec.scale = scaleGrammar;
    this.attach(scaleGrammar);

    this._updateComponentEncoders();

    this.commit();
    return this;
  }
}
