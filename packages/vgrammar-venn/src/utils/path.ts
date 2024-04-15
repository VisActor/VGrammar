import { distance, intersectionArea } from './circle-intersection';
import { SMALL } from './constant';
import type { IVennAreaStats, IVennCircle } from './interface';

export const getOverlapPath = (circles: IVennCircle[]) => {
  const areaStats: IVennAreaStats = {};
  intersectionArea(Object.values(circles), areaStats);
  const arcs = areaStats.arcs;
  let i = 0;
  let arc = arcs[0];
  let path = `M${arc.p1.x},${arc.p1.y}`;
  const angle = 0;
  const largeArcFlag = 0;
  const sweepFlag = 0;
  while (i < areaStats.arcs.length) {
    const {
      p2,
      circle: { radius }
    } = arc;
    path += `A${radius},${radius} ${angle} ${largeArcFlag},${sweepFlag} ${p2.x},${p2.y}`;
    arc = areaStats.arcs.find(a => distance(a.p1, p2) < SMALL);
    i++;
  }
  path += ' Z';
  return path;
};
