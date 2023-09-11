/* eslint-disable no-console */
import { SankeyLinkDatum, registerSankeyTransforms } from '@visactor/vgrammar-sankey';
import type { IElement, IView, IGlyphElement } from '@visactor/vgrammar-simple';
// eslint-disable-next-line
import { registerLinkPathGlyph } from '@visactor/vgrammar-simple';
import { category20 } from '../color-utils';
import data from '../data/hierarchy.json';
registerSankeyTransforms();
registerLinkPathGlyph();

export const spec = {
  width: 800,
  height: 600,
  padding: 5,

  events: [
    {
      type: 'click',
      callback: (e: any) => {
        console.log(e.element, e.element.getDatum());
      }
    }
  ],

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
      id: 'crossNodeAlign',
      value: 'center',
      bind: {
        input: 'select',
        options: ['center', 'start', 'end']
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
    },
    {
      id: 'direction',
      value: 'horizontal',
      bind: {
        input: 'select',
        options: ['horizontal', 'vertical']
      }
    }
  ],

  data: [
    {
      id: 'data',
      values: [
        {
          nodes: data
        }
      ],
      transform: [
        {
          type: 'sankey',
          width: { signal: 'viewWidth' },
          height: { signal: 'viewHeight' },
          nodeAlign: { signal: 'nodeAlign' },
          nodeWidth: { signal: 'nodeWidth' },
          nodeGap: { signal: 'nodeGap' },
          direction: { signal: 'direction' },
          minNodeHeight: 4,
          nodeKey: (datum: any) => datum.name,
          crossNodeAlign:  { signal: 'crossNodeAlign' },
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
            // return formatLinkPath(datum[0].links);
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
          id: 'sankeyNode',
          from: { data: 'nodes' },
          key: 'key',
          encode: {
            update: {
              x: { field: 'x0' },
              x1: { field: 'x1' },
              y: { field: 'y0' },
              y1: { field: 'y1' },
              fill: 'green'
            },
            blur: {
              fillOpacity: 0.2
            }
          },
          animationState: 'appear',
          animation: {
            appear: {
              type: 'clipIn',
              options: { clipDimension: 'y' },
              duration: 1000
            },
            enter: {
              type: 'clipIn',
              options: { clipDimension: 'y' },
              duration: 1000
            },
            exit: {
              type: 'fadeOut',
              duration: 1000,
              controlOptions: {
                stopWhenStateChange: true
              }
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
          id: 'sankeyLink',
          glyphType: 'linkPath',
          from: { data: 'links' },
          key: 'index',
          // animation: {
          //   enter: {
          //     type: 'linkPathGrowIn',
          //     duration: 2000
          //   },
          //   update: {
          //     type: 'linkPathUpdate',
          //     duration: 1000
          //   },
          //   exit: {
          //     type: 'linkPathGrowOut',
          //     duration: 2000
          //   }
          // },
          encode: {
            // update: {
            //   x0: { field: 'x0' },
            //   x1: { field: 'x1' },
            //   y0: { field: 'y0' },
            //   y1: { field: 'y1' },
            //   thickness: { field: 'thickness' },
            //   round: true,
            //   fill: (datum: any) => {
            //     return category20[datum.index];
            //   },
            //   backgroundStyle: { fillColor: '#ccc', fillOpacity: 0.2 },
            //   fillOpacity: 0.8
            // },
            update: datum => {
              return {
                direction: datum.vertical ? 'vertical' : 'horizontal',
                x0: datum.x0,
                x1: datum.x1,
                y0: datum.y0,
                y1: datum.y1,
                thickness: datum.thickness,
                fill: category20[datum.index],
                backgroundStyle: { fillColor: '#ccc', fillOpacity: 0.2 },
                fillOpacity: 0.8,
                round: true
              };
            },
            hover: {
              stroke: '#000'
            },
            blur: {
              fill: '#e8e8e8'
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
    id: 'crossNodeAlign',
    value: 'center',
    bind: {
      input: 'select',
      options: ['center', 'start', 'end']
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
  },
  {
    id: 'direction',
    value: 'horizontal',
    bind: {
      input: 'select',
      options: ['horizontal', 'vertical']
    }
  }
];

export const callback = (chartInstance: IView) => {
  const handleNodeClick = (element: IElement) => {
    const nodeDatum = element.getDatum();
    const allNodeElements = chartInstance.getMarkById('sankeyNode').elements;
    const allLinkElements = chartInstance.getMarkById('sankeyLink').elements;
    const highlightNodes: string[] = [nodeDatum.key];
    const upstreamLinks = nodeDatum.targetLinks.reduce((res: any[], link: SankeyLinkDatum) => {
      const parents = (link as any).parents;
      const len = parents.length;

      for (let i = 0; i < len; i++) {
        res.push({
          source: parents[i],
          target: parents[i + 1] ?? nodeDatum.key,
          value: link.value
        });
      }

      return res;
    }, []);

    console.log(allLinkElements, upstreamLinks, nodeDatum);

    allLinkElements.forEach(linkEl => {
      linkEl.clearStates();
      const linkDatum = linkEl.getDatum();
      const originalDatum = linkDatum.datum;
      const selectedDatum = originalDatum.filter((entry: any) =>
        entry.parents.some((par: any) => par.key === nodeDatum.key)
      );

      if (selectedDatum && selectedDatum.length) {
        console.log('下游的边', linkDatum, selectedDatum);
        // 下游link
        if (!highlightNodes.includes(linkDatum.source)) {
          highlightNodes.push(linkDatum.source);
        }

        if (!highlightNodes.includes(linkDatum.target)) {
          highlightNodes.push(linkDatum.target);
        }

        const val = selectedDatum.reduce((sum: number, d: any) => {
          return (sum += d.value);
        }, 0);
        const ratio = val / linkDatum.value;
        console.log(linkEl, ratio);

        linkEl.addState('selected', { ratio });

        return;
      }

      const upSelectedLink = upstreamLinks.find(
        (upLink: any) => upLink.source === linkDatum.source && upLink.target === linkDatum.target
      );

      if (upSelectedLink) {
        console.log('上游的边', linkDatum, upSelectedLink);
        // 点击节点的上游一层的节点
        if (!highlightNodes.includes(linkDatum.source)) {
          highlightNodes.push(linkDatum.source);
        }
        if (!highlightNodes.includes(linkDatum.target)) {
          highlightNodes.push(linkDatum.target);
        }

        linkEl.addState('selected', { ratio: upSelectedLink.value / linkDatum.value });

        return;
      }
      linkEl.useStates(['blur']);

      return;
    });

    allNodeElements.forEach(el => {
      el.clearStates();
      if (highlightNodes.includes(el.getDatum().key)) {
        //
      } else {
        el.useStates(['blur']);
      }
    });
  };

  const handleLinkClick = (element: IGlyphElement) => {
    const curLinkDatum = element.getDatum();
    const allNodeElements = chartInstance.getMarkById('sankeyNode').elements;
    const allLinkElements = chartInstance.getMarkById('sankeyLink').elements;
    const highlightNodes: string[] = [curLinkDatum.source, curLinkDatum.target];
    const upstreamLinks: Array<{ source: string, target: string, value: number }> = [];

    const parents = (curLinkDatum as any).parents;
    const len = parents.length;

    for (let i = 0; i < len - 1; i++) {
      upstreamLinks.push({
        source: parents[i],
        target: parents[i + 1],
        value: curLinkDatum.value
      });
    }


    allLinkElements.forEach(linkEl => {
      linkEl.clearStates();
      const linkDatum = linkEl.getDatum();
      const originalDatum = linkDatum.datum;

      if (linkDatum.source === curLinkDatum.source && linkDatum.target === curLinkDatum.target) {
        // 自身
        linkEl.addState('selected', { ratio: 1 });
        return;
      }


      const selectedDatum = originalDatum.filter((entry: any) =>
        entry.parents.some((par: any) => par.key === curLinkDatum.target)
      );

      if (selectedDatum && selectedDatum.length) {
        console.log('下游的边', linkDatum, selectedDatum);
        // 下游link
        if (!highlightNodes.includes(linkDatum.source)) {
          highlightNodes.push(linkDatum.source);
        }

        if (!highlightNodes.includes(linkDatum.target)) {
          highlightNodes.push(linkDatum.target);
        }

        const val = selectedDatum.reduce((sum: number, d: any) => {
          return (sum += d.value);
        }, 0);
        const ratio = val / linkDatum.value;
        console.log(linkEl, ratio);

        linkEl.addState('selected', { ratio });

        return;
      }

      const upSelectedLink = upstreamLinks.find(
        (upLink: any) => upLink.source === linkDatum.source && upLink.target === linkDatum.target
      );

      if (upSelectedLink) {
        console.log('上游的边', linkDatum, upSelectedLink);
        // 点击节点的上游一层的节点
        if (!highlightNodes.includes(linkDatum.source)) {
          highlightNodes.push(linkDatum.source);
        }
        if (!highlightNodes.includes(linkDatum.target)) {
          highlightNodes.push(linkDatum.target);
        }

        linkEl.addState('selected', { ratio: upSelectedLink.value / linkDatum.value });

        return;
      }
      linkEl.useStates(['blur']);

      return;
    });

    allNodeElements.forEach(el => {
      el.clearStates();
      if (highlightNodes.includes(el.getDatum().key)) {
        //
      } else {
        el.useStates(['blur']);
      }
    });
  };

  const handleClearEmpty = () => {
    const allNodeElements = chartInstance.getMarkById('sankeyNode').elements;
    const allLinkElements = chartInstance.getMarkById('sankeyLink').elements;

    allNodeElements.forEach(el => {
      el.clearStates();
    });
    allLinkElements.forEach(el => {
      el.clearStates();
    });
  };

  chartInstance.addEventListener('click', (e: any) => {
    if (e.element && e.element.mark.id() === 'sankeyNode') {
      handleNodeClick(e.element);
    } else if (e.element && e.element.mark.id() === 'sankeyLink') {
      handleLinkClick(e.element);
    } else {
      handleClearEmpty();
    }
  });
};
