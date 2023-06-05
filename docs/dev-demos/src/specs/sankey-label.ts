import {
  registerSankeyTransforms,
  SankeyNodeElement,
  formatLinkPath,
  getAlignStartTexts,
  getAlignEndTexts
} from '@visactor/vgrammar-sankey';
import data from '../data/sankey-energy.json';
registerSankeyTransforms();

export const spec = {
  width: 800,
  height: 600,
  padding: 5,

  signals: [
    {
      id: 'nodeAlign',
      value: 'justify',
      bind: {
        input: 'select',
        options: ['justify', 'center', 'start', 'end', 'left', 'right']
      }
    },
    {
      id: 'nodeGap',
      value: 8,
      bind: { input: 'range', min: 0, max: 20, step: 1 }
    },
    {
      id: 'nodeWidth',
      value: 10,
      bind: { input: 'range', min: 1, max: 20, step: 1 }
    }
  ],

  data: [
    {
      id: 'data',
      values: data,
      transform: [
        {
          type: 'sankey',
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
          // width: { signal: 'viewWidth' },
          // height: { signal: 'viewHeight' },
          nodeAlign: { signal: 'nodeAlign' },
          nodeWidth: { signal: 'nodeWidth' },
          nodeGap: { signal: 'nodeGap' },
          minNodeHeight: 4
        }
      ]
    },
    {
      id: 'nodes',
      source: 'data',
      transform: [
        {
          type: 'map',
          all:true,
          callback: (datum: any) => {
            return datum[0].nodes;
          }
        }
      ]
    },
    {
      id: 'links',
      source: 'data',
      transform: [
        {
          type: 'map',
          all:true,
          callback: (datum: any) => {
            return formatLinkPath(datum[0].links);
          }
        }
      ]
    },
    {
      id: 'left-texts',
      source: 'data',
      transform: [
        {
          type: 'map',
          all:true,
          callback: (datum: any) => {
            return getAlignEndTexts(datum[0].columns[0]);
          }
        }
      ]
    },
    {
      id: 'right-texts',
      source: 'data',
      transform: [
        {
          type: 'map',
          all:true,
          callback: (datum: any) => {
            const columns = datum[0].columns;
            return getAlignStartTexts(columns[columns.length - 1]);
          }
        }
      ]
    }
  ],
  marks: [
    {
      type: 'group',
      from: { data: 'data' },
      layout: {
        display: 'relative',
        updateViewSignals: true
      },
      encode: {
        update: {
          // x: {
          //   // "chartWidth + chartPad"
          //   callback: (datum: any, el: any, params: any) => {
          //     return params.padding.left;
          //   },
          //   dependency: ['padding', 'viewHeight']
          // },
          // y: {
          //   // "chartWidth + chartPad"
          //   callback: (datum: any, el: any, params: any) => {
          //     return params.padding.top;
          //   },
          //   dependency: ['padding', 'viewHeight']
          // },
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' }
          // fill: 'pink'
        }
      },

      marks: [
        {
          type: 'rect',
          layout: {
            position: 'content'
          },
          from: { data: 'nodes' },
          key: 'key',
          encode: {
            update: {
              x: { field: 'x0' },
              x1: { field: 'x1' },
              y: { field: 'y0' },
              y1: { field: 'y1' },
              fill: 'green'
            }
          }
        },
        {
          type: 'path',
          layout: {
            position: 'content'
          },
          from: { data: 'links' },
          key: 'index',
          encode: {
            update: {
              path: { field: 'path' },
              fill: 'pink',
              fillOpacity: 0.5
            }
          }
        },

        {
          type: 'text',
          layout: {
            position: 'left'
          },
          from: { data: 'left-texts' },
          key: 'key',
          encode: {
            update: {
              x: {
                field: 'x'
              },
              y: {
                field: 'y'
              },
              textAlign: 'end',
              text: { field: 'datum.name' },
              fill: 'black',
              stroke: '#fff',
              textBaseline: 'middle'
            }
          }
        },

        {
          type: 'text',
          layout: {
            position: 'right'
          },
          from: { data: 'right-texts' },
          key: 'key',
          encode: {
            update: {
              x: {
                field: 'x'
              },
              y: {
                field: 'y'
              },
              textAlign: 'start',
              text: { field: 'datum.name' },
              fill: 'black',
              stroke: '#fff',
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
    id: 'nodeAlign',
    value: 'justify',
    bind: {
      input: 'select',
      options: ['justify', 'center', 'start', 'end', 'left', 'right']
    }
  },
  {
    id: 'nodeGap',
    value: 8,
    bind: { input: 'range', min: 0, max: 20, step: 1 }
  },
  {
    id: 'nodeWidth',
    value: 10,
    bind: { input: 'range', min: 1, max: 20, step: 1 }
  }
];
