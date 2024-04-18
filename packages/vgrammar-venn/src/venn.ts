import type { Datum } from '@visactor/vgrammar-core';
import type {
  IVennCircleDatum,
  IVennCommonDatum,
  IVennOverlapDatum,
  IVennTransformMarkOptions,
  IVennTransformOptions
} from './interface';
import { computeTextCenters, normalizeSolution, scaleSolution, venn } from './utils';
import type { VennCircleName, IVennArea, IVennCircle, VennAreaName, IPoint } from './utils/interface';
import { getArcsFromCircles, getPathFromArcs } from './utils/path';
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
      datum: area,
      sets,
      key,
      size: area[valueField],
      labelX: textCenter?.x,
      labelY: textCenter?.y
    } as IVennCommonDatum;
    const circle = circles[key];
    if (circle) {
      return {
        ...basicDatum,
        type: 'circle',
        x: circle.x,
        y: circle.y,
        radius: circle.radius
      } as IVennCircleDatum;
    }
    const arcs = getArcsFromCircles(sets.map(name => circles[name]));
    return {
      ...basicDatum,
      type: 'overlap',
      x: 0,
      y: 0,
      path: getPathFromArcs(arcs),
      arcs
    } as IVennOverlapDatum;
  });
  return data;
};

export const transformMark = (
  options: IVennTransformMarkOptions,
  upstreamData: Array<IVennCircleDatum | IVennOverlapDatum>
) => {
  return upstreamData.filter(datum => datum.type === options.datumType);
};
