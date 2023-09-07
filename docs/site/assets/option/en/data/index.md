{{ target: data-index }}

# data(Array)

<!-- Syntax element data, DataSpec -->

{{ use: common-grammar(
    prefix = '#',
    grammarType = 'data'
) }}

## values(Array)

Raw data configuration, with the highest parsing priority

## source

Set the data source that the data depends on
Supported types: `string | string[] | IData | IData[];`

## transform(Array)

Set data transformation

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