import type { Datum } from '@visactor/vgrammar-core';
import {
  VGRAMMAR_VENN_CIRCLE_RADIUS,
  VGRAMMAR_VENN_CIRCLE_X,
  VGRAMMAR_VENN_CIRCLE_Y,
  VGRAMMAR_VENN_DATUM_KEY,
  VGRAMMAR_VENN_DATUM_TYPE,
  VGRAMMAR_VENN_LABEL_X,
  VGRAMMAR_VENN_LABEL_Y,
  VGRAMMAR_VENN_OVERLAP_PATH
} from './constants';
import type {
  IVennCircleDatum,
  IVennOverlapDatum,
  IVennTransformMarkOptions,
  IVennTransformOptions
} from './interface';
import { computeTextCenters, normalizeSolution, scaleSolution, venn } from './utils';
import type { VennCircleName, IVennArea, IVennCircle, VennAreaName, IPoint } from './utils/interface';
import { getOverlapPath } from './utils/path';
import { array } from '@visactor/vutils';

export const transform = (
  options: IVennTransformOptions,
  upstreamData: Datum[]
): Array<IVennCircleDatum | IVennOverlapDatum> => {
  const {
    x0,
    x1,
    y0,
    y1,
    setField = 'sets',
    valueField = 'size',
    orientation = Math.PI / 2,
    orientationOrder = null
  } = options;

  let circles: Record<VennCircleName, IVennCircle> = {};
  let textCenters: Record<VennAreaName, IPoint> = {};

  if (upstreamData.length > 0) {
    const vennData = upstreamData.map(
      area =>
        ({
          sets: array(area[setField]),
          size: area[valueField]
        } as IVennArea)
    );
    let solution = venn(vennData, options);
    solution = normalizeSolution(solution, orientation, orientationOrder);
    circles = scaleSolution(solution, x1 - x0, y1 - y0, x0, y0);
    textCenters = computeTextCenters(circles, vennData);
  }

  const data = upstreamData.map(area => {
    const sets = array(area[setField]);
    const key = sets.toString();
    const textCenter = textCenters[key];
    const basicDatum = {
      ...area,
      [VGRAMMAR_VENN_DATUM_KEY]: key,
      [VGRAMMAR_VENN_LABEL_X]: textCenter?.x,
      [VGRAMMAR_VENN_LABEL_Y]: textCenter?.y
    };
    const circle = circles[key];
    if (circle) {
      return {
        ...basicDatum,
        [VGRAMMAR_VENN_DATUM_TYPE]: 'circle',
        [VGRAMMAR_VENN_CIRCLE_X]: circle.x,
        [VGRAMMAR_VENN_CIRCLE_Y]: circle.y,
        [VGRAMMAR_VENN_CIRCLE_RADIUS]: circle.radius
      };
    }
    return {
      ...basicDatum,
      [VGRAMMAR_VENN_DATUM_TYPE]: 'overlap',
      [VGRAMMAR_VENN_OVERLAP_PATH]: getOverlapPath(sets.map(name => circles[name]))
    };
  });
  return data as any;
};

export const transformMark = (
  options: IVennTransformMarkOptions,
  upstreamData: Array<IVennCircleDatum | IVennOverlapDatum>
) => {
  return upstreamData.filter(datum => datum[VGRAMMAR_VENN_DATUM_TYPE] === options.datumType);
};
