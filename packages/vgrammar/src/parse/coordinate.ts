import { isNil } from '@visactor/vutils';
import type {
  CoordinateType,
  CoordinateTransform,
  IPolarCoordinate,
  ICartesianCoordinate
} from '@visactor/vgrammar-coordinate';
// eslint-disable-next-line no-duplicate-imports
import { CartesianCoordinate, PolarCoordinate } from '@visactor/vgrammar-coordinate';
import type { IGrammarBase, IView } from '../types';
import type { CoordinateSpec } from '../types/coordinate';
import { invokeFunctionType, parseFunctionType } from './util';

export function createCoordinate(type: CoordinateType) {
  switch (type) {
    case 'cartesian':
      return new CartesianCoordinate();
    case 'polar':
      return new PolarCoordinate();
    default:
      return new CartesianCoordinate();
  }
}

export function parseCoordinate(spec: CoordinateSpec, view: IView) {
  const parsedKeys = ['start', 'end', 'origin', 'translate', 'rotate', 'scale', 'transpose'];
  let dependencies: IGrammarBase[] = [];
  parsedKeys.forEach(key => {
    dependencies = dependencies.concat(parseFunctionType(spec[key], view));
  });
  return dependencies;
}

export function configureCoordinate(
  spec: CoordinateSpec,
  coordinate: IPolarCoordinate | ICartesianCoordinate,
  parameters: any
) {
  !isNil(spec.start) &&
    (coordinate as ICartesianCoordinate).start(invokeFunctionType(spec.start, parameters) ?? [0, 0]);
  !isNil(spec.end) && (coordinate as ICartesianCoordinate).end(invokeFunctionType(spec.end, parameters) ?? [0, 0]);
  !isNil(spec.origin) && (coordinate as IPolarCoordinate).origin(invokeFunctionType(spec.origin, parameters) ?? [0, 0]);

  const transforms: CoordinateTransform[] = [];
  if (!isNil(spec.translate)) {
    const translate = invokeFunctionType(spec.translate, parameters);
    transforms.push({ type: 'translate', offset: { x: translate?.[0] ?? 0, y: translate?.[1] ?? 0 } });
  }
  if (!isNil(spec.rotate)) {
    const rotate = invokeFunctionType(spec.rotate, parameters);
    transforms.push({ type: 'rotate', angle: rotate ?? 0 });
  }
  if (!isNil(spec.scale)) {
    const scale = invokeFunctionType(spec.scale, parameters);
    transforms.push({ type: 'scale', scale: { x: scale?.[0] ?? 1, y: scale?.[1] ?? 1 } });
  }
  if (!isNil(spec.transpose)) {
    const transpose = invokeFunctionType(spec.transpose, parameters);
    if (transpose) {
      transforms.push({ type: 'transpose' });
    }
  }
  coordinate.applyTransforms(transforms);
}
