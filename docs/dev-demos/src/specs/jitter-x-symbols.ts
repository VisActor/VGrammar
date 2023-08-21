import type { IView } from '@visactor/vgrammar';
import data from '../data/diamond.json';

export const spec = {
  padding: { top: 25, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: data
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'table', field: 'clarity' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      }
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'sepalLength' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y1, params.viewBox.y2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'color',
      type: 'ordinal',
      domain: { data: 'table', field: 'clarity' },
      range: [
        '#6690F2',
        '#70D6A3',
        '#B4E6E2',
        '#63B5FC',
        '#FF8F62',
        '#FFDC83',
        '#BCC5FD',
        '#A29BFE',
        '#63C4C7',
        '#F68484'
      ]
    },
  ],

  marks: [
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      }
    },
    // {
    //   type: 'component',
    //   componentType: 'axis',
    //   scale: 'yscale',
    //   dependency: ['viewBox'],
    //   encode: {
    //     update: (scale, elment, params) => {
    //       return {
    //         x: params.viewBox.x1,
    //         y: params.viewBox.y1,
    //         start: { x: 0, y: params.viewBox.height() },
    //         end: { x: 0, y: 0 },
    //         verticalFactor: -1
    //       };
    //     }
    //   }
    // },

    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'xscale',
      crosshairShape: 'line',
      crosshairType: 'x',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            start: { y: params.viewBox.y1 },
            end: { y: params.viewBox.y2 }
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'yscale',
      crosshairShape: 'line',
      crosshairType: 'y',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            start: { x: params.viewBox.x1 },
            end: { x: params.viewBox.x2 }
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'legend',
      scale: 'color',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1 + params.viewBox.width() / 2 - 100,
            layout: 'horizontal',
            select: false
          };
        }
      }
    },
    {
      type: 'symbol',
      from: { data: 'table' },
      transform: [{
        type: 'jitter'
      }],
      encode: {
        update: {
          x: { scale: 'xscale', field: 'clarity', band: 0.5 },
          y: 0,
          size: 10,
          fill: { scale: 'color', field: 'clarity' }
        },
        hover: {
          fill: 'red'
        }
      }
    }
  ]
}