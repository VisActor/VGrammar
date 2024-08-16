import { clamp } from 'lodash';
import budgetsData from '../data/budgets.json';

export const spec = {
  width: 700,
  height: 400,
  padding: 5,
  background: '#edf1f7',


  events: [
    {
      type: '@handle:mousedown',
      target: [
        {
          target: 'dragging',
          callback: (e) => {
            console.log(e)
            return true;
          }
        },
        {
          target: 'cursor',
          callback: () => {
            return 'pointer';
          }
        }
      ]
    },
    {
      type: '@handle:click',
      callback: (e: any) => {
        if (e?.element) {
          if (e.element.states && e.element.states.includes('selected')) {
            e.element.removeState('selected');
          } else {
            e.element.addState('selected');
          }
        }
      }
    },
    {
      type: 'pointerup',
      target: [
        {
          target: 'dragging',
          callback: () => {
            return false;
          }
        },
        {
          target: 'cursor',
          callback: () => {
            return 'default';
          }
        }
      ]
    },
    {
      type: 'pointerupoutside',
      target: [
        {
          target: 'dragging',
          callback: () => {
            return false;
          }
        },
        {
          target: 'cursor',
          callback: () => {
            return 'default';
          }
        }
      ]
    },
    {
      type: 'window:mousemove',
      target: 'currentYear',
      callback: (evt: any, params: any) => {
        if (params.dragging) {
          const width = params.viewWidth;
          const scale = params.x;

          return scale.invert(clamp(evt.canvasX, 0, width));
        }
        return params.currentYear;
      },
      dependency: ['x', 'viewWidth', 'dragging', 'currentYear']
    }
  ],

  signals: [
    {
      id: 'dragging',
      value: false
    },
    {
      id: 'currentYear',
      value: 2010
    },
    {
      id: 'cursor',
      value: 'default'
    }
  ],

  data: [
    {
      id: 'budgets',
      values: budgetsData,
      transform: [
        {
          type: 'map',
          as: 'abs',
          callback: (datum: any) => {
            return Math.abs(datum.value);
          }
        },
        {
          type: 'map',
          as: 'type',
          callback: (datum: any) => {
            return datum.value < 0 ? 'deficit' : 'surplus';
          }
        }
      ]
    },
    {
      id: 'budgets-current',
      source: 'budgets',
      transform: [
        {
          type: 'filter',
          callback: (datum: any, params: { currentYear: number }) => {
            return datum.budgetYear <= params.currentYear;
          },
          dependency: ['currentYear']
        }
      ]
    },
    {
      id: 'budgets-actual',
      source: 'budgets',
      transform: [
        {
          type: 'filter',
          callback: (datum: any, params: { currentYear: number }) => {
            return datum.budgetYear <= params.currentYear && datum.forecastYear === datum.budgetYear - 1;
          },
          dependency: ['currentYear']
        }
      ]
    }
  ],

  scales: [
    {
      id: 'x',
      type: 'band',
      domain: { data: 'budgets', field: 'forecastYear' },
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.viewWidth];
        },
        dependency: ['viewWidth']
      }
    },
    {
      id: 'y',
      type: 'linear',
      zero: true,
      domain: { data: 'budgets', field: 'value' },
      range: {
        callback: (scale: any, params: any) => {
          return [params.viewHeight, 0];
        },
        dependency: ['viewHeight']
      }
    }
  ],

  axes: [
    {
      orient: 'bottom',
      scale: 'x',
      grid: true,
      domain: false,
      values: [1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018],
      tickSize: 0,
      encode: {
        grid: {
          enter: {
            stroke: 'white',
            strokeOpacity: 0.75
          }
        },
        labels: {
          update: {
            x: { scale: 'x', field: 'value' }
          }
        }
      }
    },
    {
      orient: 'right',
      scale: 'y',
      grid: true,
      domain: false,
      values: [0, -0.5, -1, -1.5],
      tickSize: 0,
      encode: {
        grid: {
          enter: {
            stroke: 'white',
            strokeOpacity: 0.75
          }
        }
        // labels: {
        //   enter: {
        //     text: { signal: "format(datum.value, '$.1f') + ' trillion'" }
        //   }
        // }
      }
    }
  ],

  marks: [
    {
      type: 'line',
      from: { data: 'budgets-actual' },
      encode: {
        update: {
          x: { scale: 'x', field: 'forecastYear' },
          y: { scale: 'y', field: 'value' },
          stroke: 'steelblue',
          lineWidth: 3
        },
        hover: {
          stroke: 'red'
        }
      }
    },
    {
      type: 'rule',
      encode: {
        hover: {
          stroke: '#000'
        },
        update: {
          y: { scale: 'y', value: 0 },
          y1: { scale: 'y', value: 0 },
          stroke: '#e0e0e0',
          lineWidth: 1,
          x: 0,
          x1: {
            callback: (signal: any, el: any, params: any) => {
              return params.x.scale(params.currentYear);
            },
            dependency: ['x', 'currentYear']
          }
        }
      }
    },
    {
      name: 'handle',
      type: 'symbol',
      encode: {
        enter: {
          y: { scale: 'y', value: 0 },
          size: 20,
          stroke: '#000',
          lineWidth: 0.5
        },
        update: {
          x: {
            callback: (signal: any, el: any, params: any) => {
              return params.x.scale(params.currentYear);
            },
            dependency: ['x', 'currentYear']
          },
          fill: {
            callback: (signal: any, el: any, params: any) => {
              return params?.dragging ? 'lemonchiffon' : '#fff';
            },
            dependency: ['dragging']
          }
        },
        hover: {
          fill: 'lemonchiffon',
          cursor: 'pointer'
        },
        selected: {
          fill: 'red'
        }
      }
    },
    {
      type: 'text',
      encode: {
        enter: {
          x: 0,
          y: 25,
          fontSize: 32,
          fontWeight: 'bold',
          fill: 'steelblue'
        },
        update: {
          // text: { signal: 'currentYear' }
          text: {
            signal: 'currentYear'
          }
        }
      }
    }
  ]
};
