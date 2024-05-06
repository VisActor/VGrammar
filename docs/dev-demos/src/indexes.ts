export const indexes = [
  {
    menu: 'mark',
    children: [
      {
        path: 'group-mark',
        name: 'group-mark'
      },
      {
        path: 'text.tsx',
        name: 'text',
      },
      {
        path: 'line-mark',
        name: 'line-mark'
      },
      {
        path: 'area-mark',
        name: 'area-mark'
      },
      {
        path: 'polygon-mark',
        name: 'polygon-mark'
      },
      {
        path: 'image-mark',
        name: 'image-mark'
      }
    ]
  },
  {
    menu: 'layout',
    children: [
      {
        path: 'layout-demo',
        name: 'layout-demo'
      },
      {
        path: 'grid-bar',
        name: '栅格布局',
        type: 'api'
      },
      {
        path: 'layout-data-update',
        name: '布局流程数据更新示例',
        type: 'api'
      }
    ]
  },
  {
    menu: 'data',
    children: [
      {
        path: 'kde-bar',
        name: 'kde & bin',
        type: 'api'
      },
      {
        path: 'contour',
        name: 'kde2d & contour',
        type: 'api'
      },
      {
        path: 'data',
        name: 'data load & parse',
        type: 'api'
      }
    ]
  },
  {
    menu: 'rect',
    children: [
      {
        path: 'bar-chart',
        name: '带trigger柱图'
      },
      {
        path: 'group-bar-chart',
        name: '分组柱图'
      },
      {
        path: 'simple-bar-chart',
        name: '简单柱图'
      },
      {
        path: 'bidirectional-bar',
        name: '双向柱图'
      },
      {
        path: 'colorful-bar-chart',
        name: '多颜色填充柱图'
      },
      {
        path: 'interval-chart',
        name: 'interval'
      },
      {
        path: 'cell-chart',
        name: '色块图'
      },
      {
        path: 'stack',
        name: '堆积柱图',
        type: 'api'
      }
    ]
  },
  {
    menu: 'area',
    children: [
      {
        path: 'simple-area-chart',
        name: '简单面积图'
      },
      {
        path: 'stream',
        name: '河流图',
        type: 'api'
      }
    ]
  },
  {
    menu: 'pie',
    children: [
      {
        path: 'pie',
        name: '简单饼图',
        type: 'api'
      }
    ]
  },
  {
    menu: 'line',
    children: [
      {
        path: 'line-chart',
        name: '线图'
      },
      {
        path: 'line-chart-segments',
        name: '分段线图'
      },
      {
        path: 'line-chart-sampling',
        name: '线图数据采样'
      },
      {
        path: 'line-chart-overlap',
        name: '线图防重叠'
      },
    ]
  },
  {
    menu: 'symbol',
    children: [
      {
        path: 'symbol-chart',
        name: '简单散点图'
      },
      {
        path: 'relation-chart',
        name: '相关性图表'
      },
      {
        path: 'relation-chart-right',
        name: '相关性-右侧'
      },
      {
        path: 'relation-chart-top',
        name: '相关性-顶部'
      },
      {
        path: 'jitter-x-symbols',
        name: '扰动散点'
      }
    ]
  },

  // {
  //   menu: 'map',
  //   children: [
  //     {
  //       path: 'country-unemployment',
  //       name: '美国失业率'
  //     }
  //   ]
  // },

  {
    menu: 'interaction',
    children: [
      {
        path: 'budget-forecasts',
        name: '[交互]budget-forecasts'
      },
      {
        path: 'zoomable-scatter-plot',
        name: '[交互]zoomable-scatter-plot'
      },
      {
        path: 'state-encode',
        name: '[交互]特殊交互示例',
        type: 'api'
      },
      {
        path: 'use-states',
        name: '[交互]useStates示例',
        type: 'api'
      },
      {
        path: 'multi-states',
        name: '[交互]多状态',
        type: 'api'
      },
      {
        path: 'drill-down',
        name: '[交互]drill-down & roll-up',
        type: 'api'
      },
      {
        path: 'datazoom-bar',
        name: '[交互]datazoom & roam'
      },
      {
        path: 'roam-filter-bar',
        name: '[交互]roam bar and filter data'
      },
      {
        path: 'roam-scale-bar',
        name: '[交互]roam bar and filter data'
      },
      {
        path: 'fish-eye-bubbles',
        name: '[交互]fish-eye-bubbles'
      }
    ]
  },

  {
    menu: 'animation',
    children: [
      {
        path: 'bar-animation',
        name: '[动画]柱状图'
      },
      {
        path: 'pie-animation',
        name: '[动画]饼图'
      },
      {
        path: 'area-animation',
        name: '[动画]面积图'
      },
      {
        path: 'arrange-animate',
        name: '[动画]动画编排',
        type: 'api'
      },
      {
        path: 'text-animate',
        name: '[动画]文字复杂动画',
        type: 'api'
      },
      {
        path: 'gauge-animate',
        name: '[动画]仪表动画',
        type: 'api'
      },
      {
        path: 'wave-animate',
        name: '[动画]波浪&涟漪动画',
        type: 'api'
      },
      {
        path: 'rect-animation',
        name: '[动画]rect动画测试',
        type: 'api'
      },
      {
        path: 'line-animation',
        name: '[动画]line动画测试',
        type: 'api'
      },
      {
        path: 'clip-animate',
        name: '[动画]clip动画测试',
        type: 'api'
      }
    ]
  },
  {
    menu: 'api',
    children: [
      {
        path: 'bar',
        name: '[API]柱状图',
        type: 'api'
      },
      {
        path: 'line',
        name: '[API]折线图',
        type: 'api'
      },
      {
        path: 'polar-line',
        name: '[API]极坐标系折线图',
        type: 'api'
      }
    ]
  },
  {
    menu: 'wordcloud',
    children: [
      {
        path: 'wordcloud',
        name: '词云'
      },
      {
        path: 'wordcloud-fast',
        name: '词云快速布局'
      },
      {
        path: 'wordcloud-fast-3d',
        name: '词云快速布局3d版本'
      }
    ]
  },
  {
    menu: 'sankey',
    children: [
      {
        path: 'sankey',
        name: 'sankey'
      },
      {
        path: 'sankey-vertical',
        name: 'sankey-vertical'
      },
      {
        path: 'sankey-label',
        name: 'sankey-label'
      },
      {
        path: 'sankey-hierarchy',
        name: 'sankey-hierarchy'
      },
      {
        path: 'sankey-gap',
        name: 'sankey-gap'
      }
    ]
  },
  {
    menu: 'hierarchy',
    children: [
      {
        path: 'treemap',
        name: 'treemap'
      },
      {
        path: 'treemap-color',
        name: 'treemap-color'
      },
      {
        path: 'sunburst',
        name: 'sunburst'
      },
      {
        path: 'circle-packing',
        name: 'circle-packing'
      },
      {
        path: 'circle-packing-image',
        name: 'circle-packing-image'
      },
      {
        path: 'tree',
        name: 'tree'
      }
    ]
  },
  {
    menu: 'venn',
    children: [
      {
        path: 'venn3',
        name: 'venn3'
      },
      {
        path: 'venn4',
        name: 'venn4'
      }
    ]
  },
  {
    menu: 'wordcloud-shape',
    children: [
      {
        path: 'wordcloud-shape',
        name: '形状词云'
      },
      {
        path: 'wordcloud-shape-linear-color',
        name: '形状词云颜色插值'
      }
    ]
  },
  {
    menu: 'glyph',
    children: [
      {
        path: 'glyph',
        name: 'glyph 测试',
        type: 'api'
      },
      {
        path: 'boxplot',
        name: 'boxplot',
        type: 'api'
      },
      {
        path: 'violin',
        name: 'violin',
        type: 'api'
      }
    ]
  },
  {
    menu: 'coordinate',
    children: [
      {
        path: 'coordinate-polar',
        name: '[Coordinate]极坐标系',
        type: 'api'
      }
    ]
  },
  {
    menu: 'api-test',
    children: [
      {
        path: 'api-test',
        name: '[API-TEST]mark api()测试',
        type: 'api'
      },
      {
        path: 'remove',
        name: '[API-TEST]view.remove&addModel()测试',
        type: 'api'
      },
      {
        path: 'api-usage',
        name: '[API-TEST]api使用形式测试',
        type: 'api'
      },
      {
        path: 'grammar-rank',
        name: '[API-TEST]api声明顺序测试',
        type: 'api'
      },
      {
        path: 'update-spec',
        name: '[API-TEST]updateSpec()测试'
      },
      {
        path: 'update-api',
        name: '[API-TEST]update api测试',
        type: 'api'
      }
    ]
  },
  {
    menu: '大数据渲染',
    children: [
      {
        path: 'large-bar-chart',
        name: '大数据柱图'
      },
      {
        path: 'large-group-bar-chart',
        name: '大数据分组柱图'
      },
      {
        path: 'large-group-line-chart',
        name: '大数据分组线图'
      },
      {
        path: 'large-group-area-chart',
        name: '大数据分组面积图'
      },
      {
        path: 'large-group-symbol-chart',
        name: '大数据分组散点图'
      },
      {
        path: 'large-glyph',
        name: '大数据glyph'
      },
      {
        path: 'large-boxplot',
        name: '大数据箱线图',
        type: 'api'
      },
      {
        path: 'large-bar-group-encode',
        name: '分组柱图-group-encode'
      },
      {
        path: 'large-line-group-encode',
        name: '分组线图-group-encode'
      },
    ]
  },
  {
    menu: '组件',
    children: [
      {
        path: 'legend',
        name: '[组件]图例',
        type: 'api'
      },
      {
        path: 'slider',
        name: '[组件]slider & datazoom',
        type: 'api'
      },
      {
        path: 'player',
        name: '[组件]player',
        type: 'api'
      },
      {
        path: 'tooltip',
        name: '[组件]tooltip',
        type: 'api'
      },
      {
        path: 'title',
        name: '[组件]title',
        type: 'api'
      },
      {
        path: 'scrollbar',
        name: '[组件]scrollbar',
        type: 'api'
      },
      {
        path: 'scrollbar-filter',
        name: '[组件]scrollbar-filter',
        type: 'api'
      },
      {
        path: 'brush',
        name: '[组件]brush',
        type: 'api'
      }
    ]
  },
  {
    menu: 'other',
    children: [
      {
        path: 'geo-path',
        name: 'geo-path',
      },
      {
        path: 'projections',
        name: 'projections',
      },
      {
        path: 'projections-2',
        name: 'projections-2',
      }
    ]
  },
  {
    menu: 'Plot',
    children: [
      {
        path: 'interval',
        name: 'Interval图元',
        type: 'plot'
      },
      {
        path: 'line',
        name: 'Line图元',
        type: 'plot'
      },
      {
        path: 'bar-race',
        name: '动态条形图',
        type: 'plot'
      },
      {
        path: 'polar-interval',
        name: '极坐标系下的柱图',
        type: 'plot'
      },
      {
        path: 'area',
        name: 'area',
        type: 'plot'
      },

      {
        path: 'sankey',
        name: 'sankey',
        type: 'plot'
      },

      {
        path: 'sunburst',
        name: 'sunburst',
        type: 'plot'
      },

      {
        path: 'treemap',
        name: 'treemap',
        type: 'plot'
      },

      {
        path: 'circle-packing',
        name: 'circle-packing',
        type: 'plot'
      },

      {
        path: 'tree',
        name: 'tree',
        type: 'plot'
      },

      {
        path: 'wordcloud',
        name: 'wordcloud',
        type: 'plot'
      },

      {
        path: 'wordcloud-shape',
        name: 'wordcloud-shape',
        type: 'plot'
      },
    ]
  }
];
