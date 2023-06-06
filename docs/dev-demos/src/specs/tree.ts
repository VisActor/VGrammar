/* eslint-disable no-console */
import { registerTreeTransforms, flattenNodes, flattenTreeLinks } from '@visactor/vgrammar-hierarchy';
import { registerLinkPathGlyph } from '@visactor/vgrammar';
import data from '../data/coffee.json';

registerTreeTransforms();
registerLinkPathGlyph();

export const spec = {
  width: 800,
  height: 600,
  padding: 5,

  events: [
    {
      type: 'rect:click',
      callback: (evt: any) => {
        console.log(evt);
      }
    }
  ],

  signals: [
    {
      id: 'direction',
      value: 'horizontal',
      bind: {
        input: 'select',
        options: ['horizontal', 'vertical', 'LR', 'RL', 'TB', 'BT']
      }
    },
    {
      id: 'layoutType',
      value: 'orthogonal',
      bind: {
        input: 'select',
        options: ['orthogonal', 'radial']
      }
    },
    {
      id: 'alignType',
      value: 'leaf',
      bind: {
        input: 'select',
        options: ['leaf', 'depth']
      }
    }
  ],

  data: [
    {
      id: 'data',
      values: { children: data, itemStyle: { color: '#000' } },
      transform: [
        {
          type: 'tree',
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
          alignType: { signal: 'alignType' },
          layoutType: { signal: 'layoutType' },
          direction: { signal: 'direction' },
          label: [
            { rotate: 'tangential' },
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
          all: true,
          callback: (datum: any) => {
            const res: any[] = [];
            flattenNodes(datum, res, { maxDepth: 4 });

            console.log(
              res,
              res.filter(entry => entry.x !== +entry.x || entry.y !== +entry.y)
            );
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
    },
    {
      id: 'pathData',
      source: 'data',
      transform: [
        {
          type: 'map',
          all: true,
          callback: (datum: any) => {
            const res: any[] = [];
            flattenTreeLinks(datum, res, { maxDepth: 4 });
            console.log(res);
            return res;
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
          type: 'glyph',
          glyphType: 'linkPath',
          from: { data: 'pathData' },
          key: 'key',
          encode: {
            update: {
              x0: { field: 'x0' },
              x1: { field: 'x1' },
              y0: { field: 'y0' },
              y1: { field: 'y1' },
              pathType: 'polyline',
              direction: {
                callback: (datum: any, el: any, params: any) => {
                  return params.layoutType === 'radial' ? 'radial' : params.direction;
                },
                dependency: ['direction', 'layoutType']
              },
              thickness: 1,
              round: true,
              fill: '#333'
            }
          }
        },

        {
          type: 'circle',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          encode: {
            update: {
              x: { field: 'x' },
              y: { field: 'y' },
              radius: 10,
              lineWidth: (datum: any) => {
                return datum.depth % 2 ? 1 : 2;
              },
              stroke: '#fff',
              fill: (datum: any) => {
                return datum.datum ? datum.datum[datum.datum.length - 1].itemStyle.color ?? '#ccc' : '#333';
              }
              // stroke: '#ccc'
            }
          }
        }

        // {
        //   type: 'text',
        //   from: { data: 'text' },
        //   key: 'flattenIndex',
        //   encode: {
        //     update: {
        //       x: { field: 'label.x' },
        //       y: { field: 'label.y' },
        //       textAlign: { field: 'label.textAlign' },
        //       textBaseline: { field: 'label.textBaseline' },
        //       text: (datum: any) => {
        //         return datum.datum[datum.datum.length - 1].name;
        //       },
        //       angle: { field: 'label.angle' },
        //       maxLineWidth: { field: 'label.maxLineWidth' },
        //       fill: '#333'
        //     }
        //   }
        // }
      ]
    }
  ]
};

export const binds = [
  {
    id: 'direction',
    value: 'horizontal',
    bind: {
      input: 'select',
      options: ['horizontal', 'vertical', 'LR', 'RL', 'TB', 'BT']
    }
  },
  {
    id: 'layoutType',
    value: 'orthogonal',
    bind: {
      input: 'select',
      options: ['orthogonal', 'radial']
    }
  },
  {
    id: 'alignType',
    value: 'leaf',
    bind: {
      input: 'select',
      options: ['leaf', 'depth']
    }
  }
];
