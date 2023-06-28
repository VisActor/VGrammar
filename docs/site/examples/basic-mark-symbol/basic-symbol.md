---
category: examples
group: basic-mark-symbol
title: 基础散点图
cover:
---

# 基础散点图

`Symbol` 图元可以用于绘制常见的散点图，将两个数值变量分别映射到 `Symbol`图元的`x`通道和`y`通道,

## 代码演示

```javascript livedemo template=vgrammar
const spec = {
  padding: { top: 25, right: 5, bottom: 30, left: 60 },

  data: [
    {
      id: 'table',
      values: [
        {
          sepalLength: 5.1,
          sepalWidth: 3.5,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.7,
          sepalWidth: 3.2,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.1,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.6,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.9,
          petalLength: 1.7,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.4,
          petalLength: 1.4,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.4,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.4,
          sepalWidth: 2.9,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3.1,
          petalLength: 1.5,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.7,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3.4,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3,
          petalLength: 1.4,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 4.3,
          sepalWidth: 3,
          petalLength: 1.1,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 4,
          petalLength: 1.2,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 4.4,
          petalLength: 1.5,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.9,
          petalLength: 1.3,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.5,
          petalLength: 1.4,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 3.8,
          petalLength: 1.7,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.8,
          petalLength: 1.5,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.4,
          petalLength: 1.7,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.7,
          petalLength: 1.5,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.6,
          petalLength: 1,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.3,
          petalLength: 1.7,
          petalWidth: 0.5,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3.4,
          petalLength: 1.9,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.4,
          petalLength: 1.6,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 3.5,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 3.4,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.7,
          sepalWidth: 3.2,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3.1,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3.4,
          petalLength: 1.5,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 4.1,
          petalLength: 1.5,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 4.2,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3.1,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.2,
          petalLength: 1.2,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 3.5,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 3.6,
          petalLength: 1.4,
          petalWidth: 0.1,
          species: 'setosa'
        },
        {
          sepalLength: 4.4,
          sepalWidth: 3,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.4,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.5,
          petalLength: 1.3,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 4.5,
          sepalWidth: 2.3,
          petalLength: 1.3,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 4.4,
          sepalWidth: 3.2,
          petalLength: 1.3,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.5,
          petalLength: 1.6,
          petalWidth: 0.6,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.8,
          petalLength: 1.9,
          petalWidth: 0.4,
          species: 'setosa'
        },
        {
          sepalLength: 4.8,
          sepalWidth: 3,
          petalLength: 1.4,
          petalWidth: 0.3,
          species: 'setosa'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 3.8,
          petalLength: 1.6,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 4.6,
          sepalWidth: 3.2,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5.3,
          sepalWidth: 3.7,
          petalLength: 1.5,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 5,
          sepalWidth: 3.3,
          petalLength: 1.4,
          petalWidth: 0.2,
          species: 'setosa'
        },
        {
          sepalLength: 7,
          sepalWidth: 3.2,
          petalLength: 4.7,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 3.2,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.1,
          petalLength: 4.9,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.3,
          petalLength: 4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 2.8,
          petalLength: 4.6,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.8,
          petalLength: 4.5,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 3.3,
          petalLength: 4.7,
          petalWidth: 1.6,
          species: 'versicolor'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 2.4,
          petalLength: 3.3,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 6.6,
          sepalWidth: 2.9,
          petalLength: 4.6,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.2,
          sepalWidth: 2.7,
          petalLength: 3.9,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5,
          sepalWidth: 2,
          petalLength: 3.5,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.9,
          sepalWidth: 3,
          petalLength: 4.2,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.2,
          petalLength: 4,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.9,
          petalLength: 4.7,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.9,
          petalLength: 3.6,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.1,
          petalLength: 4.4,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 3,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 4.1,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 2.2,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.5,
          petalLength: 3.9,
          petalWidth: 1.1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.9,
          sepalWidth: 3.2,
          petalLength: 4.8,
          petalWidth: 1.8,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.8,
          petalLength: 4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.5,
          petalLength: 4.9,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.8,
          petalLength: 4.7,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.9,
          petalLength: 4.3,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.6,
          sepalWidth: 3,
          petalLength: 4.4,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 6.8,
          sepalWidth: 2.8,
          petalLength: 4.8,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3,
          petalLength: 5,
          petalWidth: 1.7,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.9,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.6,
          petalLength: 3.5,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.4,
          petalLength: 3.8,
          petalWidth: 1.1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.4,
          petalLength: 3.7,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 3.9,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.7,
          petalLength: 5.1,
          petalWidth: 1.6,
          species: 'versicolor'
        },
        {
          sepalLength: 5.4,
          sepalWidth: 3,
          petalLength: 4.5,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6,
          sepalWidth: 3.4,
          petalLength: 4.5,
          petalWidth: 1.6,
          species: 'versicolor'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.1,
          petalLength: 4.7,
          petalWidth: 1.5,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.3,
          petalLength: 4.4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 3,
          petalLength: 4.1,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.5,
          petalLength: 4,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.5,
          sepalWidth: 2.6,
          petalLength: 4.4,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 3,
          petalLength: 4.6,
          petalWidth: 1.4,
          species: 'versicolor'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.6,
          petalLength: 4,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 5,
          sepalWidth: 2.3,
          petalLength: 3.3,
          petalWidth: 1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.7,
          petalLength: 4.2,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 3,
          petalLength: 4.2,
          petalWidth: 1.2,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.9,
          petalLength: 4.2,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 2.9,
          petalLength: 4.3,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 5.1,
          sepalWidth: 2.5,
          petalLength: 3,
          petalWidth: 1.1,
          species: 'versicolor'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.8,
          petalLength: 4.1,
          petalWidth: 1.3,
          species: 'versicolor'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 3.3,
          petalLength: 6,
          petalWidth: 2.5,
          species: 'virginica'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 5.1,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 7.1,
          sepalWidth: 3,
          petalLength: 5.9,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.9,
          petalLength: 5.6,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3,
          petalLength: 5.8,
          petalWidth: 2.2,
          species: 'virginica'
        },
        {
          sepalLength: 7.6,
          sepalWidth: 3,
          petalLength: 6.6,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 4.9,
          sepalWidth: 2.5,
          petalLength: 4.5,
          petalWidth: 1.7,
          species: 'virginica'
        },
        {
          sepalLength: 7.3,
          sepalWidth: 2.9,
          petalLength: 6.3,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 2.5,
          petalLength: 5.8,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 7.2,
          sepalWidth: 3.6,
          petalLength: 6.1,
          petalWidth: 2.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3.2,
          petalLength: 5.1,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.7,
          petalLength: 5.3,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 6.8,
          sepalWidth: 3,
          petalLength: 5.5,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 5.7,
          sepalWidth: 2.5,
          petalLength: 5,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.8,
          petalLength: 5.1,
          petalWidth: 2.4,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 3.2,
          petalLength: 5.3,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3,
          petalLength: 5.5,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 3.8,
          petalLength: 6.7,
          petalWidth: 2.2,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 2.6,
          petalLength: 6.9,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6,
          sepalWidth: 2.2,
          petalLength: 5,
          petalWidth: 1.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.2,
          petalLength: 5.7,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 5.6,
          sepalWidth: 2.8,
          petalLength: 4.9,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 2.8,
          petalLength: 6.7,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.7,
          petalLength: 4.9,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.3,
          petalLength: 5.7,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 7.2,
          sepalWidth: 3.2,
          petalLength: 6,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 2.8,
          petalLength: 4.8,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 3,
          petalLength: 4.9,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.8,
          petalLength: 5.6,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 7.2,
          sepalWidth: 3,
          petalLength: 5.8,
          petalWidth: 1.6,
          species: 'virginica'
        },
        {
          sepalLength: 7.4,
          sepalWidth: 2.8,
          petalLength: 6.1,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 7.9,
          sepalWidth: 3.8,
          petalLength: 6.4,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 2.8,
          petalLength: 5.6,
          petalWidth: 2.2,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.8,
          petalLength: 5.1,
          petalWidth: 1.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.1,
          sepalWidth: 2.6,
          petalLength: 5.6,
          petalWidth: 1.4,
          species: 'virginica'
        },
        {
          sepalLength: 7.7,
          sepalWidth: 3,
          petalLength: 6.1,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 3.4,
          petalLength: 5.6,
          petalWidth: 2.4,
          species: 'virginica'
        },
        {
          sepalLength: 6.4,
          sepalWidth: 3.1,
          petalLength: 5.5,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6,
          sepalWidth: 3,
          petalLength: 4.8,
          petalWidth: 1.8,
          species: 'virginica'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.1,
          petalLength: 5.4,
          petalWidth: 2.1,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.1,
          petalLength: 5.6,
          petalWidth: 2.4,
          species: 'virginica'
        },
        {
          sepalLength: 6.9,
          sepalWidth: 3.1,
          petalLength: 5.1,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 5.8,
          sepalWidth: 2.7,
          petalLength: 5.1,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 6.8,
          sepalWidth: 3.2,
          petalLength: 5.9,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3.3,
          petalLength: 5.7,
          petalWidth: 2.5,
          species: 'virginica'
        },
        {
          sepalLength: 6.7,
          sepalWidth: 3,
          petalLength: 5.2,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 6.3,
          sepalWidth: 2.5,
          petalLength: 5,
          petalWidth: 1.9,
          species: 'virginica'
        },
        {
          sepalLength: 6.5,
          sepalWidth: 3,
          petalLength: 5.2,
          petalWidth: 2,
          species: 'virginica'
        },
        {
          sepalLength: 6.2,
          sepalWidth: 3.4,
          petalLength: 5.4,
          petalWidth: 2.3,
          species: 'virginica'
        },
        {
          sepalLength: 5.9,
          sepalWidth: 3,
          petalLength: 5.1,
          petalWidth: 1.8,
          species: 'virginica'
        }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'linear',
      domain: { data: 'table', field: 'sepalWidth' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.x1, params.viewBox.x2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'sepalLength' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.y1, params.viewBox.y2];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'color',
      type: 'ordinal',
      domain: { data: 'table', field: 'species' },
      range: [
        '#6690F2',
        '#70D6A3',
        '#B4E6E2',
        '#63B5FC',
        '#FF8F62',
        '#FFDC83',
        '#BCC5FD',
        '#A29BFE',
        '#63C4C7',
        '#F68484'
      ]
    },
    {
      id: 'shape',
      type: 'ordinal',
      domain: { data: 'table', field: 'species' },
      range: ['circle', 'diamond', 'cross']
    }
  ],

  marks: [
    {
      type: 'component',
      componentType: 'axis',
      scale: 'xscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y2,
            start: { x: 0, y: 0 },
            end: { x: params.viewBox.width(), y: 0 }
          };
        }
      }
    },
    {
      type: 'component',
      componentType: 'axis',
      scale: 'yscale',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            start: { x: 0, y: params.viewBox.height() },
            end: { x: 0, y: 0 },
            verticalFactor: -1
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'xscale',
      crosshairShape: 'line',
      crosshairType: 'x',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            start: { y: params.viewBox.y1 },
            end: { y: params.viewBox.y2 }
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'crosshair',
      scale: 'yscale',
      crosshairShape: 'line',
      crosshairType: 'y',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            start: { x: params.viewBox.x1 },
            end: { x: params.viewBox.x2 }
          };
        }
      }
    },

    {
      type: 'component',
      componentType: 'legend',
      scale: 'color',
      dependency: ['viewBox'],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1 + params.viewBox.width() / 2 - 100,
            layout: 'horizontal',
            select: false
          };
        }
      }
    },
    {
      type: 'symbol',
      from: { data: 'table' },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'sepalWidth' },
          y: { scale: 'yscale', field: 'sepalLength' },
          size: 10,
          shape: { scale: 'shape', field: 'species' },
          fill: { scale: 'color', field: 'species' }
        },
        hover: {
          fill: 'red'
        }
      }
    }
  ]
};

const vGrammarView = new View({
  autoFit: true,
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});
vGrammarView.parseSpec(spec);

vGrammarView.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = vGrammarView;
```

## 相关教程
