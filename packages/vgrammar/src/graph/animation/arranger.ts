import { isNil } from '@visactor/vutils';
import type { IAnimateArranger, IAnimator } from '../../types/animate';

export class Arranger implements IAnimateArranger {
  afterArranger: IAnimateArranger;
  parallelArrangers: IAnimateArranger[] = [this];

  animators: IAnimator[];
  totalTime: number = 0;
  startTime: number = 0;
  endTime: number = 0;

  constructor(animators: IAnimator[]) {
    this.animators = animators.filter(animator => !isNil(animator));
    this.totalTime = this.animators.reduce((time, animator) => {
      return Math.max(time, animator.getTotalAnimationTime());
    }, 0);
  }

  parallel(arranger: IAnimateArranger) {
    const parallelArrangers = Array.from(new Set(this.parallelArrangers.concat(arranger.parallelArrangers)));
    parallelArrangers.forEach(arranger => {
      arranger.parallelArrangers = parallelArrangers;
    });
    this.arrangeTime();
    return this;
  }

  after(arranger: IAnimateArranger) {
    this.afterArranger = arranger;
    this.arrangeTime();
    return this;
  }

  arrangeTime() {
    const parallelTime = this.parallelArrangers.reduce((time, arranger) => {
      return Math.max(time, arranger.totalTime);
    }, this.totalTime);
    const startTime = this.parallelArrangers.reduce((time, arranger) => {
      return Math.max(time, arranger.afterArranger?.endTime ?? 0);
    }, 0);

    this.parallelArrangers.forEach(arranger => {
      arranger.startTime = startTime;
      arranger.endTime = startTime + parallelTime;
      arranger.animators.forEach(animator => {
        animator.startAt(startTime);
      });
    });
  }
}
