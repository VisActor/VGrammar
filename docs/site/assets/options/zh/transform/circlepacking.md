{{ target: transform-circlepacking }}

## transform.circlePacking(Object)

对层次数据进行变换，计算 circlepacking 布局

### type(string) = circlePacking

将数据变换类型设置为 `circlePacking`，用于计算`circlePacking`布局

### nodeSort(booean|Function)

设置节点的排序，支持两种格式：

- `boolean` 类型： 值为 `false` 时，不进行排序；否则，使用默认的排序方式，即按照节点的 `value` 从大到小排序；
- `Function` 类型：自定义排序函数，接收两个节点数据，返回一个数字，对应的类型定义为：

```ts
(a: CirclePackingNodeElement, b: CirclePackingNodeElement) => number;
```

### padding

类型：`number\|number[]`
是否必传： 否

设置圆之间的间距，支持两种格式：

- `number` 给所有层级的圆都设置统一的 padding
- `number[]` 给每个层级的圆设置不同的 padding

### setRadius(Function)

自定义设置每个节点的半径，函数接收一个节点数据，返回一个半径值，对应的类型定义为：

```ts
(node: CirclePackingNodeElement) => number;
```

默认值为：

```ts
(node: CirclePackingNodeElement) => {
  return Math.sqrt(node.value);
};
```

### nodeKey(string)

类型：`string|number`

设置节点的全局唯一 key 对应的字段，如果不设置，内部会根据层级等信息自动生成

### includeRoot(boolean)=false

是否包含根节点
