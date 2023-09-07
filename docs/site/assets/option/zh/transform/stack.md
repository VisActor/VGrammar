{{ target: transform-stack }}

## transform.stack(Object)

对数据进行堆积处理，可用于展示堆积柱图，堆积面积图，百分比面积图等

### type(string) = stack

将数据变换的类型设置为 `stack`，用于计算堆积数据

### orient(string) = 'positive'

可选值：'positive' | 'negative';

设置堆积计算的方向，如果值为`negative`，则从对原始数据进行逆序处理，然后再进行堆积计算

### stackField(string)

设置堆积的字段,对应的值应该为数值类型

### dimensionField(string)

设置维度字段，对应的值一般字符串类型，用于表示分类的字段

### asStack(string)

设置堆积计算后的数据保存的字段，如果没有设置，则会默认记录到`stackField`申明的字段中

### asPrevStack(string)

对于每个分类值，设置上一步对应的堆积值，如果没有设置，则不会记录

### asPercent(string)

设置每个分类值对应的占比，如果没有设置，则不会记录

### asPercentStack(string)

设置堆积计算后的百分比值，如果没有设置，则不会记录

### asPrevPercentStack(string)

设置上一步对应的堆积百分比值，如果没有设置，则不会记录

### asSum(string)

设置每个分类值对应的总和，如果没有设置，则不会记录
