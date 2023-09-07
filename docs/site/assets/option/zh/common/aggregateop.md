{{ target: common-aggregateop }}

聚合函数支持的类型有如下的：

- 'count' - 计数
- 'missing' - 缺失值的个数
- 'valid' - 合法值的个数
- 'sum' - 求和
- 'product' - 乘积
- 'mean' - 平均值
- 'average' - 平均值
- 'variance' - 方差
- 'variancep' - 方差比
- 'stdev' - 标准差
- 'stdevp' - 标准差比
- 'stderr' - 标准误差
- 'distinct' - 去重的个数
- 'ci0' - 对原始数据进行 1000 次采样，计算置信度为 95%的 置信区间的下区间值
- 'ci1' - 对原始数据进行 1000 次采样，计算置信度为 95%的 置信区间的上区间值
- 'median' - 中位数
- 'q1' - 1/4 分位数
- 'q3' - 3/4 分位数
- 'min' - 最小值
- 'max' - 最大值
- 'argmin' - 最小值对应的整个数组元素
- 'argmax' - 最大值对应的整个数据元素
