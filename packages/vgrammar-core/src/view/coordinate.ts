import type { IBaseCoordinate, CoordinateType } from '@visactor/vgrammar-coordinate';
import type { Nil } from '../types/base';
import type { GrammarType, ICoordinate, IGrammarBase, IView } from '../types';
import type { CoordinateFunctionType, CoordinateSpec } from '../types/coordinate';
import { GrammarBase } from './grammar-base';
import { configureCoordinate, createCoordinate } from '../parse/coordinate';

export class Coordinate extends GrammarBase implements ICoordinate {
  readonly grammarType: GrammarType = 'coordinate';

  protected spec: CoordinateSpec = {
    type: 'cartesian'
  };

  private coordinate: IBaseCoordinate;

  constructor(view: IView, coordinateType: CoordinateType) {
    super(view);
    this.spec.type = coordinateType;
    this.coordinate = createCoordinate(coordinateType);
  }

  parse(spec: CoordinateSpec) {
    super.parse(spec);
    this.start(spec.start);
    this.end(spec.end);
    this.origin(spec.origin);

    this.translate(spec.translate);
    this.rotate(spec.rotate);
    this.scale(spec.scale);
    this.transpose(spec.transpose);

    this.commit();
    return this;
  }

  evaluate(upstream: any, parameters: any) {
    if (!this.coordinate || this.coordinate.type !== this.spec.type) {
      this.coordinate = createCoordinate(this.spec.type);
    }
    configureCoordinate(this.spec as CoordinateSpec, this.coordinate, parameters);
    return this;
  }

  output() {
    return this.coordinate;
  }

  // coordinate attributes

  start(start: CoordinateFunctionType<[number, number]> | Nil) {
    return this.setFunctionSpec(start, 'start');
  }

  end(end: CoordinateFunctionType<[number, number]> | Nil) {
    return this.setFunctionSpec(end, 'end');
  }

  origin(origin: CoordinateFunctionType<[number, number]> | Nil) {
    return this.setFunctionSpec(origin, 'origin');
  }

  // coordinate transforms

  translate(offset: CoordinateFunctionType<[number, number]> | Nil) {
    return this.setFunctionSpec(offset, 'translate');
  }

  rotate(angle: CoordinateFunctionType<number> | Nil) {
    return this.setFunctionSpec(angle, 'rotate');
  }

  scale(ratio: CoordinateFunctionType<[number, number]> | Nil) {
    return this.setFunctionSpec(ratio, 'scale');
  }

  transpose(isTransposed: CoordinateFunctionType<boolean> | Nil) {
    return this.setFunctionSpec(isTransposed, 'transpose');
  }

  reuse(grammar: IGrammarBase) {
    if (grammar.grammarType !== this.grammarType) {
      return this;
    }
    this.coordinate = grammar.output();
    return this;
  }

  clear() {
    super.clear();
    this.coordinate = null;
  }
}
