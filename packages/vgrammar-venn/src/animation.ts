import { ACustomAnimate } from '@visactor/vrender-core';
import type { IVennCircle } from './utils/interface';
import { getArcsFromCircles, getArcsFromPath, getCirclesFromArcs, getPathFromArcs } from './utils/path';

export class VennOverlapAnimation extends ACustomAnimate<{ path: string }> {
  protected fromCircles: IVennCircle[];
  protected toCircles: IVennCircle[];

  onBind(): void {
    this.fromCircles = getCirclesFromArcs(getArcsFromPath(this.from.path));
    this.toCircles = getCirclesFromArcs(getArcsFromPath(this.to.path));
  }

  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    const circles = this.fromCircles.map((fromC, i) => {
      const toC = this.toCircles[i];
      return {
        radius: fromC.radius + (toC.radius - fromC.radius) * ratio,
        x: fromC.x + (toC.x - fromC.x) * ratio,
        y: fromC.y + (toC.y - fromC.y) * ratio
      } as IVennCircle;
    });
    out.path = getPathFromArcs(getArcsFromCircles(circles));
  }
}
