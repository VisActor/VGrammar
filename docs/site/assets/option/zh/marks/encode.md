{{ target: marks-encode }}

#${prefix} encode

设置图元的视觉通道编码，默认支持三种数据变化状态：

- `enter` 新增数据元素
- `update` 数据元素更新
- `exit` 数据元素被删除

注意，这里的数据状态是根据`mark`的`key`自动生成的，我们会针对`mark`的绑定数据，根据`key`的配置，计算数据对应的唯一标志符，数据更新后，如果对应的唯一标志符不存在了，则状态为`exit`，如果存在，则为`update`；如果之前的数据不存在改唯一标志符，则数据元素对应的状态为`enter`

默认支持一种分组视觉编码，该视觉编码只会在每个分组上执行一次：

- `group` 针对设置了 `groupBy` 的图元，对每个分组执行一次视觉编码

##${prefix} enter

设置图元在数据初始化状态执行的视觉通道映射，注意数据更新的时候不再执行

{{ use: marks-common-channels(
  prefix = '##' + ${prefix},
  type = ${type}
) }}

##${prefix} update

设置图元在数据更新状态执行的视觉通道映射

{{ use: marks-common-channels(
  prefix = '##' + ${prefix},
  type = ${type}
) }}

##${prefix} exit

设置图元在数据被删除的状态下执行的视觉通道映射

{{ use: marks-common-channels(
  prefix = '##' + ${prefix},
  type = ${type}
) }}

##${prefix} group

设置分组对应的视觉编码，图元对应的视觉通道映射

{{ use: marks-common-channels(
  prefix = '##' + ${prefix},
  type = ${type}
) }}

{{ if: ${type} === 'line' || ${type} === 'area' }}

##${prefix} connectNulls

对于`line`图元和`area`图元，设置缺失点连接线的视觉通道

{{ use: marks-common-channels(
  prefix = '##' + ${prefix},
  type = ${type}
) }}

{{ /if }}
