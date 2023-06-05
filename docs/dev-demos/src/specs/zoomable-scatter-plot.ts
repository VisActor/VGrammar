import { last } from '@visactor/vutils';
import { slice, clamp } from 'lodash';
import { extent } from '@visactor/vgrammar-util';
import normalData from '../data/normal-2d.json';

export const spec = {
  
  description: 'An interactive scatter plot example supporting pan and zoom.',
  width: 500,
  height: 300,
  padding: {
    top: 10,
    left: 40,
    bottom: 20,
    right: 10
  },
  autosize: 'none',

  config: {
    axis: {
      domain: false,
      tickSize: 3,
      tickColor: '#888',
      labelFont: 'Monaco, Courier New'
    }
  },
  events: [
    { type: 'touchend', target: 'down', callback: () => null },
    {
      merge: ['mousedown', 'touchend'],
      target: 'down',
      callback: (event: any) => {
        return [event.canvasX, event.canvasY];
      }
    },

    {
      merge: ['mousedown', 'touchstart', 'touchend'],
      target: [
        {
          callback: (evt: any, params: any) => {
            const { xdom } = params;
            return slice(xdom);
          },
          target: 'xcur'
        },
        {
          callback: (evt: any, params: any) => {
            const { ydom } = params;
            return slice(ydom);
          },
          target: 'ycur'
        }
      ],
      dependency: ['xdom', 'ydom']
    },
    {
      type: 'window:mousemove',
      between: [{ type: 'mousedown' }, { source: 'window', type: 'mouseup' }],
      target: [
        {
          target: 'delta',
          callback: (event: any, params: any) => {
            const { down } = params;
            const x = event.canvasX;
            const y = event.canvasY;
            return down ? [down[0] - x, y - down[1]] : [0, 0];
          }
        },
        {
          target: 'xdom',
          callback: (event: any, params: any) => {
            const { xcur, delta, width } = params;
            const span = last(xcur) - xcur[0];
            return [xcur[0] + (span * delta[0]) / width, xcur[1] + (span * delta[0]) / width];
          }
        },
        {
          target: 'ydom',
          callback: (event: any, params: any) => {
            const { ycur, delta, height } = params;
            const span = last(ycur) - ycur[0];

            return [ycur[0] + (span * delta[1]) / height, ycur[1] + (span * delta[1]) / height];
          }
        }
      ],
      dependency: ['down', 'delta', 'width', 'height', 'xcur', 'ycur']
    },
    {
      type: 'touchmove',
      consume: true,
      filter: {
        callback: event => {
          return event.isPrimary;
        }
      },
      target: [
        {
          target: 'delta',
          callback: (event: any, params: any) => {
            const { down } = params;
            const x = event.canvasX;
            const y = event.canvasY;
            return down ? [down[0] - x, y - down[1]] : [0, 0];
          }
        },
        {
          target: 'xdom',
          callback: (event: any, params: any) => {
            const { xcur, delta, width } = params;
            const span = last(xcur) - xcur[0];
            return [xcur[0] + (span * delta[0]) / width, xcur[1] + (span * delta[0]) / width];
          }
        },
        {
          target: 'ydom',
          callback: (event: any, params: any) => {
            const { ycur, delta, height } = params;
            const span = last(ycur) - ycur[0];

            return [ycur[0] + (span * delta[1]) / height, ycur[1] + (span * delta[1]) / height];
          }
        }
      ],
      dependency: ['down', 'delta', 'width', 'height', 'xcur', 'ycur']
    },
    {
      type: 'wheel',
      target: 'anchor',
      callback: (event: any, params: any) => {
        const x = event.canvasX;
        const y = event.canvasY;
        const xscale = params.xscale;
        const yscale = params.yscale;
        return [xscale.invert(x), yscale.invert(y)];
      },
      dependency: ['xscale', 'yscale']
    },
    {
      type: 'touchstart',
      filter: event => {
        return event.isPrym;
      },
      target: 'anchor',
      dependency: ['xdom', 'ydom'],
      callback: (evt: any, params: any) => {
        const { xdom, ydom } = params;
        return [(xdom[0] + xdom[1]) / 2, (ydom[0] + ydom[1]) / 2];
      }
    },
    {
      type: 'wheel',
      target: [
        {
          target: 'zoom',
          callback: (event: any, params: any) => {
            return Math.pow(1.001, event.deltaY * Math.pow(16, event.deltaMode));
          }
        },
        {
          target: 'xdom',
          callback: (event: any, params: any) => {
            const { anchor, xdom, zoom } = params;
            return [anchor[0] + (xdom[0] - anchor[0]) * zoom, anchor[0] + (xdom[1] - anchor[0]) * zoom];
          }
        },
        {
          target: 'ydom',
          callback: (event: any, params: any) => {
            const { anchor, ydom, zoom } = params;
            return [anchor[1] + (ydom[0] - anchor[1]) * zoom, anchor[1] + (ydom[1] - anchor[1]) * zoom];
          }
        }
      ],
      dependency: ['anchor', 'xdom', 'ydom', 'zoom']
    },
    {
      type: 'touchstart',
      filter: event => {
        return !event.isPrimary;
      },
      target: 'dist1',
      callback: event => {
        const t = event.touches;
        const dx = t[0].clientX - t[1].clientX;
        const dy = t[0].clientY - t[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
      }
    },
    {
      type: 'touchmove',
      target: [
        {
          target: 'dist2',
          callback: event => {
            const t = event.touches;
            const dx = t[0].clientX - t[1].clientX;
            const dy = t[0].clientY - t[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
          }
        },
        // {
        //   target: 'dist1',
        //   callback: event => {
        //     const t = event.touches;
        //     const dx = t[0].clientX - t[1].clientX;
        //     const dy = t[0].clientY - t[1].clientY;
        //     return Math.sqrt(dx * dx + dy * dy);
        //   }
        // },
        {
          target: 'zoom',
          callback: (event: any, params: any) => {
            return params.dist1 / params.dist2;
          }
        }
      ],
      filter: event => {
        return !event.isPrimary;
      },
      dependency: ['dist1', 'dist2']
    }
  ],

  signals: [
    {
      id: 'margin',
      value: 20
    },
    {
      id: 'xoffset',
      update: {
        callback: (signal: any, params: any) => {
          const { height, padding } = params;
          return -(height + padding.bottom);
        },
        dependency: ['height', 'padding']
      }
    },
    {
      id: 'yoffset',
      update: {
        callback: (signal: any, params: any) => {
          const { width, padding } = params;
          return -(width + padding.left);
        },
        dependency: ['width', 'padding']
      }
    },
    {
      id: 'xrange',
      update: {
        callback: (signal: any, params: any) => {
          const { width } = params;
          return [0, width];
        },
        dependency: ['width']
      }
    },
    {
      id: 'yrange',
      update: {
        callback: (signal: any, params: any) => {
          const { height } = params;
          return [height, 0];
        },
        dependency: ['height']
      }
    },
    {
      id: 'down',
      value: null
    },
    {
      id: 'xcur',
      value: null
    },
    {
      id: 'ycur',
      value: null
    },
    {
      id: 'delta',
      value: [0, 0]
    },

    {
      id: 'anchor',
      value: [0, 0]
    },
    {
      id: 'zoom',
      value: 1
    },
    {
      id: 'dist1',
      value: 0
    },
    {
      id: 'dist2',
      value: 0
    },
    {
      id: 'xdom',
      value: extent(normalData.map(obj => obj.u))
    },
    {
      id: 'ydom',
      value: extent(normalData.map(obj => obj.v))
    },
    {
      id: 'size',
      update: {
        callback: (signal: any, params: any) => {
          const { xdom } = params;
          const span = last(xdom) - xdom[0];

          return clamp(20 / span, 1, 20);
        },
        dependency: ['xdom']
      }
    }
  ],

  data: [
    {
      id: 'points',
      values: normalData
    }
  ],

  scales: [
    {
      id: 'xscale',
      zero: false,
      domain: {
        signal: 'xdom'
      },
      range: {
        signal: 'xrange'
      }
    },
    {
      id: 'yscale',
      zero: false,
      domain: {
        signal: 'ydom'
      },
      range: {
        signal: 'yrange'
      }
    }
  ],

  axes: [
    {
      scale: 'xscale',
      orient: 'bottom',
      offset: {
        signal: 'xoffset'
      }
    },
    {
      scale: 'yscale',
      orient: 'right',
      offset: {
        signal: 'yoffset'
      }
    }
  ],

  marks: [
    {
      type: 'symbol',
      from: { data: 'points' },
      clip: true,
      encode: {
        enter: {
          fillOpacity: 0.6,
          fill: 'steelblue'
        },
        update: {
          x: { scale: 'xscale', field: 'u' },
          y: { scale: 'yscale', field: 'v' },
          size: {
            signal: 'size'
          }
        },
        hover: { fill: { value: 'firebrick' } },
        leave: { fill: { value: 'steelblue' } },
        select: {
          size: {
            signal: 'size'
          }
        },
        release: {
          size: {
            signal: 'size'
          }
        }
      }
    }
  ]
};
