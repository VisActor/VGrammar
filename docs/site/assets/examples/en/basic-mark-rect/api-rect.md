---
category: examples
group: basic-mark-rect
title: Create Bar Chart with API Mode
order: 0-6
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vgrammar/basic-mark-rect-api-rect.png
---

# Create Bar Chart with API Mode

## Code Demonstration

```javascript livedemo template=vgrammar
const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true,
  padding: { top: 5, right: 5, bottom: 30, left: 60 }
});
const data = vGrammarView.data([
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
]);

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
const crosshair = vGrammarView;

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

vGrammarView.interaction('tooltip', {
  selector: rect,
  title: { visible: false, value: 'value' },
  content: [
    {
      key: { field: 'name' },
      value: { field: 'value' },
      symbol: {
        symbolType: 'circle',
        fill: '#6690F2'
      }
    }
  ]
});
vGrammarView.interaction('crosshair', {
  container: group,
  scale: xScale,
  crosshairType: 'x',
  crosshairShape: 'rect'
});

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## Related Tutorials
