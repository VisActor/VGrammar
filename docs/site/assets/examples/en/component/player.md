---
category: examples
group: component
title: Player
order: 50-2
cover: /vgrammar/preview/component-player_0.10.8.png
---

# Player

## Code Demo

```javascript livedemo template=vgrammar
const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  padding: { top: 5, right: 5, bottom: 50, left: 60 }
});
const data = vGrammarView
  .data([
    {
      name: 'Apple',
      value: 214480
    },
    {
      name: 'Google',
      value: 155506
    },
    {
      name: 'Amazon',
      value: 100764
    },
    {
      name: 'Microsoft',
      value: 92715
    }
  ])
  .id('table');

const xScale = vGrammarView
  .scale('band')
  .id('xscale')
  .domain({ data, field: 'name' })
  .depend(['viewBox'])
  .range((scale, params) => {
    return [0, params.viewBox.width()];
  })
  .configure({ padding: 0.05, round: true });

const yScale = vGrammarView
  .scale('linear')
  .id('yscale')
  .domain({ data, field: 'value' })
  .depend(['viewBox'])
  .range((scale, params) => {
    return [params.viewBox.height(), 0];
  })
  .configure({ nice: true });

const group = vGrammarView
  .group(vGrammarView.rootMark)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: params.viewBox.x1,
      y: params.viewBox.y1,
      width: params.viewBox.width(),
      height: params.viewBox.height()
    };
  });

const xAxis = vGrammarView
  .axis(group)
  .scale(xScale)
  .tickCount(-1)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: 0,
      y: params.viewBox.height(),
      start: { x: 0, y: 0 },
      end: { x: params.viewBox.width(), y: 0 }
    };
  });
const yAxis = vGrammarView
  .axis(group)
  .scale(yScale)
  .depend(['viewBox'])
  .encode((scale, elment, params) => {
    return {
      x: 0,
      y: 0,
      start: { x: 0, y: params.viewBox.height() },
      end: { x: 0, y: 0 },
      verticalFactor: -1
    };
  });

const rect = vGrammarView
  .mark('rect', group)
  .join(data)
  .depend(['yscale'])
  .encode({
    x: { scale: 'xscale', field: 'name', band: 0.25 },
    width: { scale: 'xscale', band: 0.5 },
    y: { scale: 'yscale', field: 'value' },
    y1: (datum, element, params) => {
      return params.yscale.scale(params.yscale.domain()[0]);
    },
    fill: '#6690F2'
  })
  .encodeState('hover', 'fill', 'red');

const player = vGrammarView
  .player(group)
  .playerType('discrete')
  .depend([data, 'viewBox'])
  .encode((datum, el, params) => {
    return {
      x: 0,
      y: params.viewBox.y2 + 20,
      size: { width: params.viewBox.width() },
      interval: 1000,
      data: params.table,
      controller: {
        forward: { style: { visible: false, size: 0 } },
        backward: { style: { visible: false, size: 0 } }
      }
    };
  });

let animate;

player.on('onPlay', a => {
  if (!animate) {
    animate = rect.animate.run({
      type: 'growHeightIn',
      duration: 1000,
      easing: 'linear',
      oneByOne: true,
      options: { orient: 'negative' }
    });
  } else {
    rect.animate.resume();
  }
});

player.on('onPause', a => {
  rect.animate.pause();
});

rect.on('animationEnd', () => {
  animate = null;
});

vGrammarView.run();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## Related Tutorials
