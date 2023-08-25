# 在 Vue 中使用

在 Vue 中使用 VGrammar 的时候，主要需要关心一下几点：

1. **新建可视化实例的时机**：在浏览器中使用时，VGrammar 是基于 Canvas 实现的图形绘制，所以最基础的一点就是需要等待容器 dom 元素渲染完成，挂载到 dom 树上后，再去创建可视化实例；
2. **及时卸载可视化实例**：当组件被卸载之前，需要卸载 VGrammar 创建的实例，防止造成内存泄露

[查看在线 demo](https://codesandbox.io/s/viscator-vgrammar-vue-demo-nr8pjc)

## 选项式 API 封装

使用选项式(Options) API 封装 VGrammar 的时候，可以参考下列核心代码：

```vue
<script lang="ts">
import { defineComponent } from 'vue';
import { View, IView, IElement, IScale } from '@visactor/vgrammar';
import type { PropType } from 'vue';

interface BarChartProps {
  colors?: string[];
  data?: any[];
}

export default defineComponent({
  props: {
    colors: Object as PropType<BarChartProps['colors']>,
    data: Object as PropType<BarChartProps['data']>
  },

  setup() {
    let view: IView | null = null;
    const parseSpec = (chartProps: BarChartProps) => {
      return {
        // this is a spec
      };
    };

    const createOrUpdateChart = (chartProps: BarChartProps) => {
      const container = document.getElementById('barchart-container');
      if (container && !view) {
        view = new View({
          autoFit: true,
          container: container,
          hover: true
        });
        view.parseSpec(parseSpec(chartProps) as any);

        view.runAsync();
        return true;
      } else if (view) {
        view.updateSpec(parseSpec(chartProps) as any);
        view.runAsync();

        return true;
      }
      return false;
    };

    const releaseView = () => {
      if (view) {
        view.release();
        view = null;
      }
    };

    return {
      createOrUpdateChart,
      releaseView
    };
  },

  mounted() {
    this.createOrUpdateChart({ colors: this.colors, data: this.data });
  },

  updated() {
    this.createOrUpdateChart({ colors: this.colors, data: this.data });
  },

  beforeUnmount() {
    this.releaseView();
  }
});
</script>

<template>
  <h1>this is a demo of barchart</h1>

  <div class="barchart-container" id="barchart-container"></div>
</template>

<style scoped>
.barchart-container {
  width: 100%;
  height: 400px;
}
</style>
```

## 组合式 API 封装

使用组合式 API 封装 VGrammar 的时候，可以参考下列核心代码：

```vue
<script setup lang="ts">
import { onMounted, onBeforeUnmount, onUpdated } from 'vue';
import { View, IView, IElement, registerBasicTransforms } from '@visactor/vgrammar';
import { registerTreemapTransforms } from '@visactor/vgrammar-hierarchy';
import { getTreemapData } from '../data/treemap-data';

interface TreemapProps {
  colors?: string[];
}

const props = defineProps<TreemapProps>();

let view: IView;

function parseSpec(chartProps: TreemapProps) {
  return {
    //
  };
}

function createOrUpdateChart(chartProps: TreemapProps) {
  const container = document.getElementById('treemap-container');
  if (container && !view) {
    view = new View({
      autoFit: true,
      container: container,
      hover: true
    });
    view.parseSpec(parseSpec(chartProps) as any);

    view.runAsync();
    return true;
  } else if (view) {
    view.updateSpec(parseSpec(chartProps) as any);
    view.runAsync();

    return true;
  }
  return false;
}

onMounted(() => {
  registerTreemapTransforms();
  registerBasicTransforms();

  createOrUpdateChart(props);
});

onUpdated(() => {
  createOrUpdateChart(props);
});

onBeforeUnmount(() => {
  if (view) {
    view.release();
  }
});
</script>

<template>
  <h1>this is a demo of treemap</h1>

  <div class="treemap-container" id="treemap-container"></div>
</template>

<style scoped>
.treemap-container {
  width: 100%;
  height: 400px;
}
</style>
```
