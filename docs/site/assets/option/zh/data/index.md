{{ target: data-index }}

# data(Array)

<!-- 语法元素 data, DataSpec -->

{{ use: common-grammar(
    prefix = '#',
    grammarType = 'data'
) }}

## values(Array)

原始数据配置，解析优先级最高

## source

设置数据依赖的数据源
支持类型: `string | string[] | IData | IData[];`

## transform(Array)

设置数据变换

{{ use: transform-aggregate() }}
{{ use: transform-extent() }}
{{ use: transform-filter() }}
{{ use: transform-map() }}
{{ use: transform-join() }}
{{ use: transform-unfold() }}
{{ use: transform-pick() }}
{{ use: transform-range() }}
{{ use: transform-sort() }}
{{ use: transform-stack() }}

{{ use: transform-pie() }}
{{ use: transform-funnel() }}
{{ use: transform-circlepacking }}
{{ use: transform-sankey }}
{{ use: transform-sunburst }}
{{ use: transform-tree }}
{{ use: transform-treemap }}
{{ use: transform-wordcloud }}
{{ use: transform-wordcloudshape }}
