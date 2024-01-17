---
category: examples
group: animate
title: Loop Animation
order: 60-1
cover: /vgrammar/preview/animate-loop-animate_0.7.6.gif
---

# Loop Animation

Loop animations can bring excellent display effects in scenarios like large-screen displays.

## Code Demonstration

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 5, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
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
        },
        {
          name: 'Coca-Cola',
          value: 66341
        },
        {
          name: 'Samsung',
          value: 59890
        },
        {
          name: 'Toyota',
          value: 53404
        },
        {
          name: 'Mercedes-Benz',
          value: 48601
        },
        {
          name: 'Facebook',
          value: 45168
        },
        {
          name: "McDonald's",
          value: 43417
        },
        {
          name: 'Intel',
          value: 43293
        },
        {
          name: 'IBM',
          value: 42972
        },
        {
          name: 'BMW',
          value: 41006
        },
        {
          name: 'Disney',
          value: 39874
        },
        {
          name: 'Cisco',
          value: 34575
        },
        {
          name: 'GE',
          value: 32757
        },
        {
          name: 'Nike',
          value: 30120
        },
        {
          name: 'Louis Vuitton',
          value: 28152
        },
        {
          name: 'Oracle',
          value: 26133
        },
        {
          name: 'Honda',
          value: 23682
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'value' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y2, params.viewBox.y1];
      },
      nice: true
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xscale',
      tickCount: -1,
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            start: { x: 0, y: params.viewBox.height() },
            end: { x: 0, y: 0 },
            verticalFactor: -1
          };
        }
      }
    },
    {
      type: 'rect',
      id: 'bar',
      from: { data: 'table' },
      dependency: ['yscale'],
      encode: {
        update: {
          x: { scale: 'xscale', field: 'name' },
          width: { scale: 'xscale', band: 1 },
          y: { scale: 'yscale', field: 'value' },
          y1: (datum, element, params) => {
            return params.yscale.scale(params.yscale.domain()[0]);
          },
          fill: '#6690F2',
          stroke: 'black',
          lineWidth: 0
        }
      },
      animation: {
        loop: [
          // loop opacity
          {
            loop: true,
            oneByOne: 100,
            timeSlices: [
              {
                effects: {
                  channel: {
                    fillOpacity: { to: 0.3 }
                  },
                  easing: 'linear'
                },
                duration: 200
              },
              {
                effects: {
                  channel: {
                    fillOpacity: { to: 0.3 }
                  },
                  easing: 'linear'
                },
                duration: 400
              },
              {
                effects: {
                  channel: {
                    fillOpacity: { to: 1 }
                  },
                  easing: 'linear'
                },
                duration: 200
              }
            ]
          },
          // loop height
          {
            loop: true,
            oneByOne: 100,
            channel: ['y'],
            custom: (ratio, from, to, nextAttributes, datum, element) => {
              const y = from.y;
              const changedHeight = 50;
              if (ratio <= 0.25) {
                nextAttributes.y = y - changedHeight * (ratio / 0.25);
              } else if (ratio <= 0.75) {
                nextAttributes.y = y - changedHeight;
              } else {
                nextAttributes.y = y - changedHeight + (changedHeight * (ratio - 0.75)) / 0.25;
              }
            },
            easing: 'linear',
            duration: 800
          }
        ]
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.run().then(() => {
  vGrammarView.getMarkById('bar').animate.runAnimationByState('loop');
});

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## Related Tutorials
