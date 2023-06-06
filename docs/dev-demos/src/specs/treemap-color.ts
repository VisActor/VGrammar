/* eslint-disable no-console */
import { registerTreemapTransforms, flattenNodes } from '@visactor/vgrammar-hierarchy';
import { ColorUtil } from '@visactor/vutils';
import { category20 } from '../color-utils';
import data from '../data/disk.json';

registerTreemapTransforms();

export const spec = {
  width: 800,
  height: 600,
  padding: 5,

  events: [
    {
      type: 'rect:click',
      callback: (evt: any) => {
        console.log(evt.element);
      }
    }
  ],

  signals: [
    {
      id: 'splitType',
      value: 'binary',
      bind: {
        input: 'select',
        options: ['binary', 'slice', 'dice', 'sliceDice', 'squarify']
      }
    },
    {
      id: 'gapWidth',
      value: 8,
      bind: { input: 'range', min: 0, max: 20, step: 1 }
    },
    {
      id: 'labelPadding',
      value: 10,
      bind: { input: 'range', min: 1, max: 20, step: 1 }
    },
    {
      id: 'labelPosition',
      value: 'top',
      bind: {
        input: 'select',
        options: ['top', 'bottom', 'left', 'right']
      }
    }
  ],

  scales: [
    {
      id: 'rectColor',
      type: 'ordinal',
      domain: { data: 'original', field: 'name' },
      range: category20
    }
  ],

  data: [
    {
      id: 'original',
      values: data
    },
    {
      id: 'data',
      source: 'original',
      transform: [
        {
          type: 'treemap',
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
          minVisibleArea: 300,
          minChildrenVisibleSize: 20,
          splitType: { signal: 'splitType' },
          gapWidth: [8, 4, 2]
          // labelPadding: [28, 20, 16],
          // labelPosition: { signal: 'labelPosition' }
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
            flattenNodes(datum, res);
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
          type: 'rect',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          encode: {
            update: {
              x: { field: 'x0' },
              x1: { field: 'x1' },
              y: { field: 'y0' },
              y1: { field: 'y1' },
              fill: {
                callback: (datum: any, el: any, params: any) => {
                  if (datum.depth === 0) {
                    return '#777';
                  }
                  const color = params.rectColor.scale(datum.datum[0].name);
                  const rgb = new ColorUtil.Color(color).color;
                  const hsl = ColorUtil.rgbToHsl(rgb.r, rgb.g, rgb.b);

                  return new ColorUtil.Color(`hsl(${hsl.h}, ${hsl.s}, ${30 + datum.depth * 10})`).toString();
                },
                dependency: ['rectColor']
              }
            }
          }
        }

        // {
        //   type: 'text',
        //   from: { data: 'flattenData' },
        //   key: 'flattenIndex',
        //   encode: {
        //     update: {
        //       x: (datum: any) => {
        //         if (datum.labelRect) {
        //           return (datum.labelRect.x0 + datum.labelRect.x1) / 2;
        //         }
        //         return (datum.x0 + datum.x1) / 2;
        //       },
        //       y: (datum: any) => {
        //         if (datum.labelRect) {
        //           return (datum.labelRect.y0 + datum.labelRect.y1) / 2;
        //         }
        //         return (datum.y0 + datum.y1) / 2;
        //       },
        //       text: { field: 'key' },
        //       fill: 'black',
        //       textAlign: 'center',
        //       textBaseline: 'middle'
        //     }
        //   }
        // }
      ]
    }
  ]
};

export const binds = [
  {
    id: 'splitType',
    value: 'binary',
    bind: {
      input: 'select',
      options: ['binary', 'slice', 'dice', 'sliceDice', 'squarify', 'resquarify']
    }
  },
  {
    id: 'gapWidth',
    value: 8,
    bind: { input: 'range', min: 0, max: 20, step: 1 }
  },
  {
    id: 'labelPadding',
    value: 10,
    bind: { input: 'range', min: 1, max: 20, step: 1 }
  },
  {
    id: 'labelPosition',
    value: 'top',
    bind: {
      input: 'select',
      options: ['top', 'bottom', 'left', 'right']
    }
  }
];
