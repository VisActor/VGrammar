import type { IElement, IGlyphElement, TypeAnimation } from '../../../types';
import { clipIn, clipOut } from './clip';
import { fadeIn, fadeOut } from './fade';
import { growCenterIn, growCenterOut, growHeightIn, growHeightOut, growWidthIn, growWidthOut } from './grow-cartesian';
import { growAngleIn, growAngleOut, growRadiusIn, growRadiusOut } from './grow-polar';
import {
  growPointsIn,
  growPointsOut,
  growPointsXIn,
  growPointsXOut,
  growPointsYIn,
  growPointsYOut
} from './grow-points';
import { growIntervalIn, growIntervalOut } from './grow-interval';
import { moveIn, moveOut } from './move';
import { scaleIn, scaleOut } from './scale';
import { update } from './update';
import { rotateIn, rotateOut } from './rotate';

export const builtInAnimations: { [type: string]: TypeAnimation<IGlyphElement> | TypeAnimation<IElement> } = {
  clipIn,
  clipOut,

  fadeIn,
  fadeOut,

  moveIn,
  moveOut,

  scaleIn,
  scaleOut,

  rotateIn,
  rotateOut,

  growCenterIn,
  growCenterOut,

  growWidthIn,
  growWidthOut,
  growHeightIn,
  growHeightOut,

  growAngleIn,
  growAngleOut,
  growRadiusIn,
  growRadiusOut,

  growPointsIn,
  growPointsOut,
  growPointsXIn,
  growPointsXOut,
  growPointsYIn,
  growPointsYOut,

  growIntervalIn,
  growIntervalOut,

  update
};
