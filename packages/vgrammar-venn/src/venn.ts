import type {
  IVennCircleDatum,
  IVennOverlapDatum,
  IVennTransformMarkOptions,
  IVennTransformOptions
} from './interface';
import { computeTextCenters, normalizeSolution, scaleSolution, venn } from './utils';
import type { VennCircleName, IVennArea, IVennCircle, VennAreaName, IPoint } from './utils/interface';
import { getOverlapPath } from './utils/path';

export const transform = (
  options: IVennTransformOptions,
  upstreamData: IVennArea[]
): Array<IVennCircleDatum | IVennOverlapDatum> => {
  const { x0, x1, y0, y1, orientation = Math.PI / 2, orientationOrder = null } = options;

  let circles: Record<VennCircleName, IVennCircle> = {};
  let textCenters: Record<VennAreaName, IPoint> = {};

  if (upstreamData.length > 0) {
    let solution = venn(upstreamData, options);
    solution = normalizeSolution(solution, orientation, orientationOrder);
    circles = scaleSolution(solution, x1 - x0, y1 - y0, x0, y0);
    textCenters = computeTextCenters(circles, upstreamData);
  }

  const data = upstreamData.map((area, index) => {
    const textCenter = textCenters[area.sets.toString()];
    const basicDatum = {
      ...area,
      labelX: textCenter?.x,
      labelY: textCenter?.y
    };
    const circle = circles[area.sets.toString()];
    if (circle) {
      return {
        ...basicDatum,
        type: 'circle',
        x: circle.x,
        y: circle.y,
        radius: circle.radius
      } as IVennCircleDatum;
    }
    return {
      ...basicDatum,
      type: 'overlap',
      path: getOverlapPath(area.sets.map(name => circles[name]))
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
