import { registerSankeyTransforms, formatLinkPolygon, formatLinkPath } from '@visactor/vgrammar-sankey';
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
          direction: 'vertical',
          x0: { signal: '' },
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' },
          nodeAlign: { signal: 'nodeAlign' },
          nodeWidth: '30%'
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
    }
  ],
  marks: [
    {
      type: 'group',
      from: { data: 'data' },
      encode: {
        update: {
          fill: 'pink'
        }
      },

      marks: [
        {
          type: 'rect',
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

        // {
        //   type: 'polygon',
        //   from: { data: 'links' },
        //   key: 'index',
        //   encode: {
        //     update: {
        //       points: { field: 'points' },
        //       fill: 'pink',
        //       fillOpacity: 0.5
        //     }
        //   }
        // },
        {
          type: 'path',
          from: { data: 'links' },
          key: 'index',
          encode: {
            update: {
              path: { field: 'path' },
              // lineWidth: { field: 'lineWidth' },
              fill: 'pink',
              fillOpacity: 0.5
            },
            hover: {
              stroke: 'yellow'
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
