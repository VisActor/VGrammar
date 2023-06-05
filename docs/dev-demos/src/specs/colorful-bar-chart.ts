import { category20 } from '../color-utils';

export const spec = {
  width: 400,
  height: 200,
  padding: 5,

  signals: [{ id: 'url', value: 'https://vega.github.io/vega/data/movies.json' }],

  data: [
    {
      id: 'movies',
      url: {
        signal: 'url'
      },
      transform: [
        {
          type: 'aggregate',
          groupBy: ['MPAA Rating']
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'movies', field: 'MPAA Rating' },
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.width];
        },
        dependency: ['width']
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      domain: { data: 'movies', field: 'count' },
      nice: true,
      range: {
        callback: (scale: any, params: any) => {
          return [params.height, 0];
        },
        dependency: ['height']
      }
    },
    {
      id: 'color',
      type: 'ordinal',
      domain: { data: 'movies', field: 'MPAA Rating' },
      range: category20
    }
  ],

  marks: [
    {
      type: 'rect',
      from: { data: 'movies' },
      encode: {
        enter: {
          x: { scale: 'xscale', field: 'MPAA Rating' },
          width: { scale: 'xscale', band: 1 },
          y: { scale: 'yscale', field: 'count' },
          y1: { scale: 'yscale', value: 0 }
        },
        update: {
          fill: { scale: 'color', field: 'MPAA Rating' }
        },
        hover: {
          fill: 'red'
        }
      }
    }
  ]
};
