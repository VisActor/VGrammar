import { crossProduct } from '@visactor/vutils';
import { distance, intersectionArea } from './circle-intersection';
import { SMALL } from './constant';
import type { IVennAreaStats, IVennCircle, IVennOverlapArc } from './interface';

export const getArcsFromCircles = (circles: IVennCircle[]) => {
  const areaStats: IVennAreaStats = {};
  intersectionArea(Object.values(circles), areaStats);
  const arcs = areaStats.arcs.map(
    ({ p1, p2, circle: { radius, setId } }) => ({ p1, p2, radius, setId } as IVennOverlapArc)
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
    const { p2, radius } = arc;
    path += `A${radius},${radius} 0 0,0 ${p2.x},${p2.y}`;
    arc = arcs[++i];
  }
  path += ' Z';
  return path;
};

export const getArcsFromPath = (path: string) => {
  const arcs: Partial<IVennOverlapArc>[] = [];
  const segments = path.split('A');
  const m = segments[0];
  let i = m.indexOf(',');
  arcs.push({
    p1: { x: +m.slice(1, i), y: +m.slice(i + 1) }
  });
  for (i = 1; i < segments.length; i++) {
    const s = segments[i].split(',');
    arcs[i - 1].radius = +s[0];
    const p2x = +s[2].slice(2);
    const p2y = +s[3].split(' ')[0];
    arcs[i - 1].p2 = { x: p2x, y: p2y };
    if (i < segments.length - 1) {
      arcs.push({
        p1: { x: p2x, y: p2y }
      });
    }
  }
  return arcs as IVennOverlapArc[];
};

export const getCirclesFromArcs = (arcs: IVennOverlapArc[]) => {
  return arcs.map(arc => {
    const { p1, p2, radius, setId } = arc;
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
    if (crossProduct([x2 - x1, y2 - y1], [x - x1, y - y1]) > 0) {
      x = mX - (h * (y2 - y1)) / d;
      y = mY + (h * (x2 - x1)) / d;
    }
    return { x, y, radius, setId } as IVennCircle;
  });
};
