/* eslint-disable no-console */
import { builtinSymbolsMap, CustomPath2D, CurveContext, StreamLight, MotionPath } from '@visactor/vrender';
import type { IMark, IView } from '@visactor/vgrammar-simple';

export const runner = (view: IView) => {
  const bar = view.mark('rect', view.rootMark).id('leftBar').encode({
    x: 50,
    y: 100,
    width: 250,
    height: 50,
    fill: 'blue'
  });
};

export const callback = (view: IView) => {
  const blurButton = document.createElement('button');
  blurButton.innerText = 'blur';
  document.getElementById('footer')?.appendChild(blurButton);

  const growCenterInButton = document.createElement('button');
  growCenterInButton.innerText = 'center grow in';
  document.getElementById('footer')?.appendChild(growCenterInButton);

  const growCenterOutButton = document.createElement('button');
  growCenterOutButton.innerText = 'center grow out';
  document.getElementById('footer')?.appendChild(growCenterOutButton);

  const streamLightButton = document.createElement('button');
  streamLightButton.innerText = 'stream light';
  document.getElementById('footer')?.appendChild(streamLightButton);

  const pathButton = document.createElement('button');
  pathButton.innerText = 'move path';
  document.getElementById('footer')?.appendChild(pathButton);

  blurButton.addEventListener('click', () => {
    const bar = view.getMarkById('leftBar') as IMark;
    bar.animate.run({
      channel: {
        blur: { from: 60, to: 0 },
        opacity: { from: 0, to: 1 }
      },
      duration: 2000,
      easing: 'linear'
    });
  });
  growCenterInButton.addEventListener('click', () => {
    const bar = view.getMarkById('leftBar') as IMark;
    bar.animate.run({
      type: 'growCenterIn',
      duration: 2000,
      easing: 'linear'
    });
  });
  growCenterOutButton.addEventListener('click', () => {
    const bar = view.getMarkById('leftBar') as IMark;
    bar.animate.run({
      type: 'growCenterOut',
      duration: 2000,
      easing: 'linear'
    });
    setTimeout(() => {
      bar.touch();
      view.runAsync();
    }, 2100);
  });
  streamLightButton.addEventListener('click', () => {
    const bar = view.getMarkById('leftBar') as IMark;
    bar.animate.run({
      custom: StreamLight,
      duration: 2000,
      easing: 'linear'
    });
  });
  pathButton.addEventListener('click', () => {
    const bar = view.getMarkById('leftBar') as IMark;
    const pathStr2 = builtinSymbolsMap.circle.pathStr;
    const cp = new CustomPath2D();
    cp.setCtx(new CurveContext(cp));
    cp.fromString(pathStr2, 50, 100, 50, 50);
    console.log(cp);

    bar.animate.run({
      custom: MotionPath,
      customParameters: { path: cp, distance: 1, initAngle: -Math.PI / 2 },
      duration: 2000,
      easing: 'linear'
    });
    setTimeout(() => {
      bar.encode('angle', 0);
      view.runAsync();
    }, 2100);
  });
};
