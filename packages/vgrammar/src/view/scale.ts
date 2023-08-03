import { isNil } from '@visactor/vutils';
import type { IBaseScale, TickData } from '@visactor/vscale';
import type { IGrammarBase, IView } from '../types';
import type { Nil } from '../types/base';
import type { GrammarType, IScale } from '../types/grammar';
import type {
  ScaleConfigureSpec,
  ScaleCoordinate,
  ScaleData,
  ScaleFunctionType,
  ScaleSpec,
  GrammarScaleType
} from '../types/scale';
import { GrammarBase } from './grammar-base';
import { configureScale, createScale, parseScaleConfig, parseScaleDomainRange } from '../parse/scale';

export class Scale extends GrammarBase implements IScale {
  readonly grammarType: GrammarType = 'scale';

  protected declare spec: ScaleSpec;

  private scale: IBaseScale;

  constructor(view: IView, scaleType: GrammarScaleType) {
    super(view);
    this.spec.type = scaleType;
    this.scale = createScale(scaleType);
  }

  parse(spec: ScaleSpec) {
    super.parse(spec);
    this.domain(spec.domain);
    this.range(spec.range);
    this.configure(spec);

    this.commit();
    return this;
  }

  evaluate(upstream: any, parameters: any) {
    if (!this.spec.type) {
      this.spec.type = 'linear';
    }
    if (!this.scale || this.scale.type !== this.spec.type) {
      this.scale = createScale(this.spec.type);
    }
    configureScale(this.spec as ScaleSpec, this.scale, parameters);
    return this;
  }

  output() {
    return this.scale;
  }

  getScaleType() {
    return this.spec.type;
  }

  getScale() {
    return this.scale;
  }

  ticks(count?: number): TickData[] {
    return this.scale?.tickData?.(count) ?? [];
  }

  domain(domain: ScaleFunctionType<any[]> | ScaleData | Nil) {
    if (!isNil(this.spec.domain)) {
      this.detach(parseScaleDomainRange(this.spec.domain, this.view));
    }
    this.spec.domain = domain;
    this.attach(parseScaleDomainRange(domain, this.view));
    this.commit();
    return this;
  }

  range(range: ScaleFunctionType<any[]> | ScaleData | ScaleCoordinate | Nil) {
    if (!isNil(this.spec.range)) {
      this.detach(parseScaleDomainRange(this.spec.range, this.view));
    }
    this.spec.range = range;
    this.attach(parseScaleDomainRange(range, this.view));
    this.commit();
    return this;
  }

  getCoordinateAxisPosition() {
    const rangeSpec = this.spec.range as ScaleCoordinate;
    const coord = rangeSpec?.coordinate;
    if (!isNil(coord)) {
      const dim = rangeSpec.dimension;
      const isSub = rangeSpec.isSubshaft;
      const reversed = rangeSpec.reversed;
      const coordinate = this.parameters()[coord];

      return coordinate?.getVisualPositionByDimension(dim, isSub, reversed);
    }

    return null;
  }

  getCoordinateAxisPoints(baseValue?: number) {
    const rangeSpec = this.spec.range as ScaleCoordinate;
    const coord = rangeSpec?.coordinate;
    if (!isNil(coord)) {
      const dim = rangeSpec.dimension;
      const isSub = rangeSpec.isSubshaft;
      const reversed = rangeSpec.reversed;
      const coordinate = this.parameters()[coord];
      return coordinate?.getAxisPointsByDimension(dim, isSub, reversed, baseValue);
    }

    return null;
  }

  getCoordinate() {
    const rangeSpec = this.spec.range as ScaleCoordinate;
    const coord = rangeSpec?.coordinate;
    if (!isNil(coord)) {
      return this.parameters()[coord];
    }

    return null;
  }

  configure(config: ScaleConfigureSpec | Nil) {
    this.detach(parseScaleConfig(this.spec.type, config, this.view));
    if (isNil(config)) {
      this.spec = { type: this.spec.type, domain: this.spec.domain, range: this.spec.range } as ScaleSpec;
    } else {
      Object.assign(this.spec, config);
      this.attach(parseScaleConfig(this.spec.type, config, this.view));
    }
    this.commit();
    return this;
  }

  reuse(grammar: IGrammarBase) {
    if (grammar.grammarType !== this.grammarType) {
      return this;
    }
    this.scale = grammar.output();
    return this;
  }

  clear() {
    super.clear();
    this.scale = null;
  }
}
