import { ACustomAnimate } from '@visactor/vrender-animate';
import type { IVennCircle, IVennOverlapArc, VennCircleName } from './utils/interface';
import { getArcsFromCircles, getCirclesFromArcs, getPathFromArcs } from './utils/path';

export class VennOverlapAnimation extends ACustomAnimate<{ path: string; arcs: IVennOverlapArc[] }> {
  protected fromCircles: Record<VennCircleName, IVennCircle>;
  protected toCircles: Record<VennCircleName, IVennCircle>;

  onBind(): void {
    this.fromCircles = {};
    getCirclesFromArcs(this.from.arcs).forEach(c => {
      this.fromCircles[c.setId] = c;
    });
    this.toCircles = {};
    getCirclesFromArcs(this.to.arcs).forEach(c => {
      this.toCircles[c.setId] = c;
    });
  }

  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    const circles: IVennCircle[] = [];
    Object.keys(this.fromCircles).forEach(key => {
      const fromC = this.fromCircles[key];
      const toC = this.toCircles[key];
      if (fromC && toC) {
        circles.push({
          radius: fromC.radius + (toC.radius - fromC.radius) * ratio,
          x: fromC.x + (toC.x - fromC.x) * ratio,
          y: fromC.y + (toC.y - fromC.y) * ratio,
          setId: key
        } as IVennCircle);
      }
    });
    const arcs = getArcsFromCircles(circles);
    out.arcs = arcs;
    out.path = getPathFromArcs(arcs);
  }
}
