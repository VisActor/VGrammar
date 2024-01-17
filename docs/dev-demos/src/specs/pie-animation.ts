/* eslint-disable no-console */
import { category20 } from '../color-utils';
export const spec = {
  width: 200,
  height: 200,

  signals: [
    {
      id: 'filterSignal',
      value: 0
    },
    {
      id: 'animationState',
      value: 'appear'
    }
  ],
  data: [
    {
      id: 'table',
      values: [
        {
          id: 1,
          field: 4,
          startAngle: 0,
          endAngle: Math.PI / 3
        },
        {
          id: 2,
          field: 6,
          startAngle: Math.PI / 3,
          endAngle: Math.PI
        },
        {
          id: 3,
          field: 10,
          startAngle: Math.PI,
          endAngle: (3 * Math.PI) / 2
        },
        {
          id: 4,
          field: 3,
          startAngle: (3 * Math.PI) / 2,
          endAngle: 2 * Math.PI
        }
      ]
    }
  ],
  scales: [
    {
      id: 'color',
      type: 'ordinal',
      domain: {
        data: 'table',
        field: 'id'
      },
      range: category20
    }
  ],
  marks: [
    {
      type: 'arc',
      from: {
        data: 'table'
      },
      animationState: { signal: 'animationState' },
      animation: {
        appear: {
          type: 'growAngleIn',
          duration: 2000,
          easing: 'linear',
          options: {
            overall: true,
            orient: 'inside'
          },
          delay: 1000
        },
        disappear: {
          type: 'growAngleOut',
          duration: 2000,
          easing: 'linear',
          options: {
            overall: true,
            orient: 'inside'
          }
        },
        state: {
          duration: 1000
        },
      },
      encode: {
        enter: {
          fill: {
            scale: 'color',
            field: 'id'
          },
          x: 100,
          y: 100
        },
        update: {
          startAngle: {
            field: 'startAngle'
          },
          endAngle: {
            field: 'endAngle'
          },
          padAngle: 0,
          innerRadius: 20,
          outerRadius: 80,
          cornerRadius: 0,
          fillOpacity: 1
        },
        hover: {
          outerRadius: 100,
          fillOpacity: 0.5
        }
      }
    }
  ],
  interactions: [
    {
      type: 'element-highlight',
      selector: 'arc',
      highlightState: 'hover'
    }
  ],
  animation: false
};

export const callback = (chartInstance: any) => {
  const disappearButton = document.createElement('button');
  disappearButton.innerText = 'disappear';
  document.getElementById('footer')?.appendChild(disappearButton);

  chartInstance.addEventListener('animationStart', (state: string) => {
    console.log('animationStart: ', state);
    if (state === 'appear') {
      chartInstance.getSignalById('animationState').value(null);
    }
  });
  chartInstance.addEventListener('animationEnd', (state: string) => {
    console.log('animationEnd: ', state);
  });
  disappearButton.addEventListener('click', () => {
    chartInstance.getSignalById('animationState').value('disappear');
    chartInstance.run();
  });
};
