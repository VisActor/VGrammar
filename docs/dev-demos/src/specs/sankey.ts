import { registerSankeyTransforms, formatLinkPolygon, formatLinkPath } from '@visactor/vgrammar-sankey';
import { registerLinkPathGlyph } from '@visactor/vgrammar-simple';
import data from '../data/sankey-energy.json';

registerSankeyTransforms();
registerLinkPathGlyph();

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
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' },
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
          all: true,
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
          all: true,
          callback: (datum: any) => {
            return datum[0].links;
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
          type: 'glyph',
          glyphType: 'linkPath',
          from: { data: 'links' },
          key: 'index',
          encode: {
            update: {
              x0: { field: 'x0' },
              x1: { field: 'x1' },
              y0: { field: 'y0' },
              y1: { field: 'y1' },
              thickness: { field: 'thickness' },
              round: true,
              fill: 'pink',
              fillOpacity: 0.5
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
