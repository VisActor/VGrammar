{{ target: transform-pie }}

## transform.pie(Object)

用于计算`pie`布局，实现常见的饼图

### type(string) = pie

将数据变换的类型设置为 `pie`，用于计算`pie`布局，实现常见的饼图

### field(string)

计算饼图种的占比对应的字段

### startAngle(number)

起始角度，可以不传，默认值为`0`

### endAngle(number)

结束角度，可以不传，默认值为`2 * Math.PI`

### asStartAngle(string)

设置每个扇区 **起始角度**数据保存的字段，如果没有设置，则不存储起始角度对应的数据

### asEndAngle(string)

设置每个扇区 **结束角度**数据保存的字段，如果没有设置，则不存储结束角度对应的数据

### asMiddleAngle(string)

设置每个扇区 **中间角度**数据保存的字段，如果没有设置，则不存储中间角度对应的数据

### asRadian(string)

设置每个扇区 **弧度值** 数据保存的字段，如果没有设置，则不存储弧度对应的数据

### asRatio(string)

设置每个扇区 **占比** 数据保存的字段，如果没有设置，则不存储占比对应的数据

### asQuadrant(string)

计算每个扇区结束角度所在的象限，并将结果保存到指定的字段中；如果没有设置，则不存储象限对应的数据

### asK(string)

计算每个扇区对应的数据和最大值的比例，并将结果保存到指定的字段中；如果没有设置，则不存储比例对应的数据
