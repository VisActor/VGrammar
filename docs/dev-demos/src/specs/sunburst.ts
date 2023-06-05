/* eslint-disable no-console */
import { registerSunburstTransforms, flattenNodes } from '@visactor/vgrammar-hierarchy';
import data from '../data/coffee.json';

registerSunburstTransforms();

export const spec = {
  width: 800,
  height: 600,
  padding: 5,

  signals: [
    {
      id: 'gapRadius',
      value: 0,
      bind: { input: 'range', min: 0, max: 20, step: 1 }
    }
  ],

  data: [
    {
      id: 'data',
      values: data,
      transform: [
        {
          type: 'sunburst',
          // width: { signal: 'viewWidth' },
          // height: { signal: 'viewHeight' },
          x0: {
            // "chartWidth + chartPad"
            callback: (params: any) => {
              return params.padding.left;
            },
            dependency: ['padding']
          },
          x1: {
            // "chartWidth + chartPad"
            callback: (params: any) => {
              return params.padding.left + params.viewWidth;
            },
            dependency: ['padding', 'viewWidth']
          },
          y0: {
            // "chartWidth + chartPad"
            callback: (params: any) => {
              return params.padding.top;
            },
            dependency: ['padding']
          },
          y1: {
            // "chartWidth + chartPad"
            callback: (params: any) => {
              return params.padding.top + params.viewHeight;
            },
            dependency: ['padding', 'viewHeight']
          },
          gapRadius: { signal: 'gapRadius' },
          innerRadius: '15%',
          outerRadius: ['35%', '70%', '72%', '80%'],
          label: [
            {
              align: 'center',
              rotate: 'tangential'
            },
            { rotate: 'radial', align: 'end' },
            { rotate: 'radial', align: 'start', offset: 10 }
          ]
        }
      ]
    },
    {
      id: 'flattenData',
      source: 'data',
      transform: [
        {
          type: 'map',
          all:true,
          callback: (datum: any) => {
            const res: any[] = [];
            flattenNodes(datum, res, { maxDepth: 100 });
            console.log(res);
            return res;
          }
        }
      ]
    },
    {
      id: 'text',
      source: 'flattenData',
      transform: [
        {
          type: 'filter',
          callback: (datum: any) => {
            return !!datum.label;
          }
        }
      ]
    }
  ],
  marks: [
    {
      type: 'group',

      marks: [
        {
          type: 'rect',
          encode: {
            update: {
              x: {
                // "chartWidth + chartPad"
                callback: (datum: any, el: any, params: any) => {
                  return params.padding.left;
                },
                dependency: ['padding']
              },
              y: {
                // "chartWidth + chartPad"
                callback: (datum: any, el: any, params: any) => {
                  return params.padding.top;
                },
                dependency: ['padding']
              },
              width: {
                signal: 'viewWidth'
              },
              height: {
                signal: 'viewHeight'
              },
              fill: '#e8e8e8'
            }
          }
        },

        {
          type: 'arc',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          encode: {
            update: {
              x: { field: 'x' },
              y: { field: 'y' },
              innerRadius: { field: 'innerRadius' },
              outerRadius: { field: 'outerRadius' },
              startAngle: { field: 'startAngle' },
              endAngle: { field: 'endAngle' },
              lineWidth: (datum: any) => {
                return datum.depth % 2 ? 1 : 2;
              },
              stroke: '#fff',
              fill: (datum: any) => {
                return datum.datum[datum.datum.length - 1]?.itemStyle?.color ?? 'red';
              }
              // stroke: '#ccc'
            }
          }
        },

        {
          type: 'text',
          from: { data: 'text' },
          key: 'flattenIndex',
          encode: {
            update: {
              x: { field: 'label.x' },
              y: { field: 'label.y' },
              textAlign: { field: 'label.textAlign' },
              textBaseline: { field: 'label.textBaseline' },
              text: (datum: any) => {
                return datum.datum[datum.datum.length - 1].name;
              },
              angle: { field: 'label.angle' },
              maxLineWidth: { field: 'label.maxLineWidth' },
              fill: '#333'
            }
          }
        }
      ]
    }
  ]
};

export const binds = [
  {
    id: 'gapRadius',
    value: 0,
    bind: { input: 'range', min: 0, max: 20, step: 1 }
  }
];
