import { crossProduct } from '@visactor/vutils';
import { distance, intersectionArea } from './circle-intersection';
import { SMALL } from './constant';
import type { IVennAreaStats, IVennCircle, IVennOverlapArc } from './interface';

export const getArcsFromCircles = (circles: IVennCircle[]) => {
  const areaStats: IVennAreaStats = {};
  intersectionArea(Object.values(circles), areaStats);
  const arcs = areaStats.arcs.map(
    ({ p1, p2, circle: { radius, setId }, width }) =>
      ({ p1, p2, radius, setId, largeArcFlag: width > radius } as IVennOverlapArc)
  );
  const result: IVennOverlapArc[] = [];
  let i = 0;
  let arc = arcs[0];
  while (i < arcs.length && arc) {
    const { p2 } = arc;
    result.push(arc);
    arc = arcs.find(a => distance(a.p1, p2) < SMALL);
    i++;
  }
  return result;
};

export const getPathFromArcs = (arcs: IVennOverlapArc[]) => {
  let i = 0;
  let arc = arcs[0];
  const { p1 } = arc;
  let path = `M${p1.x},${p1.y}`;
  while (arc) {
    const { p2, radius, largeArcFlag } = arc;
    path += `A${radius},${radius} 0 ${largeArcFlag ? 1 : 0},0 ${p2.x},${p2.y}`;
    arc = arcs[++i];
  }
  path += ' Z';
  return path;
};

export const getCirclesFromArcs = (arcs: IVennOverlapArc[]) => {
  return arcs.map(arc => {
    const { p1, p2, radius, largeArcFlag, setId } = arc;
    const { x: x1, y: y1 } = p1;
    const { x: x2, y: y2 } = p2;
    // 两点之间的距离
    const d = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5;
    // 中点坐标
    const mX = (x1 + x2) / 2;
    const mY = (y1 + y2) / 2;
    // 中垂线的长度
    const h = (radius ** 2 - (d / 2) ** 2) ** 0.5;
    // 圆心坐标
    let x = mX + (h * (y2 - y1)) / d;
    let y = mY - (h * (x2 - x1)) / d;
    if (crossProduct([x2 - x1, y2 - y1], [x - x1, y - y1]) > 0 || largeArcFlag) {
      x = mX - (h * (y2 - y1)) / d;
      y = mY + (h * (x2 - x1)) / d;
    }
    return { x, y, radius, setId } as IVennCircle;
  });
};
