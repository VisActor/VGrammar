/* eslint-disable no-console */
import { registerTreemapTransforms, flattenNodes } from '@visactor/vgrammar-hierarchy';
import { category20 } from '../color-utils';
import data from '../data/hierarchy.json';

registerTreemapTransforms();

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

  data: [
    {
      id: 'data',
      values: data,
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
          // maxDepth: 1,
          minVisibleArea: 15000,
          splitType: { signal: 'splitType' },
          padding: [4],
          gapWidth: [8, 4, 2],
          labelPadding: [28, 20, 16],
          labelPosition: { signal: 'labelPosition' }
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
              fill: (datum: any) => {
                return category20[datum.flattenIndex % category20.length];
              }
              // stroke: '#ccc'
            }
          }
        },

        {
          type: 'text',
          from: { data: 'flattenData' },
          key: 'flattenIndex',
          encode: {
            update: {
              x: (datum: any) => {
                if (datum.labelRect) {
                  return (datum.labelRect.x0 + datum.labelRect.x1) / 2;
                }
                return (datum.x0 + datum.x1) / 2;
              },
              y: (datum: any) => {
                if (datum.labelRect) {
                  return (datum.labelRect.y0 + datum.labelRect.y1) / 2;
                }
                return (datum.y0 + datum.y1) / 2;
              },
              text: { field: 'key' },
              fill: 'black',
              textAlign: 'center',
              textBaseline: 'middle'
            }
          }
        }
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
