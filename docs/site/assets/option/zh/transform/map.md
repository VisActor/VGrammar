{{ target: transform-map }}

## transform.map(Object)

对数据实现过滤变换

### type(string) = map

变换的类型

### callback

执行变换的回调函数，回调函数会拿到两个参数

{{ use: common-callback() }}

### as(string)

对数组中的每个元素执行一个变换，对变换的结果设置到`as`申明的 key 中

### all(boolean) = false

是否拿到整个数据，进行自定义的变换，默认是对数组中的某个元素进行变换
