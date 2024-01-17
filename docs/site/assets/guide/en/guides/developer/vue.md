# Use in Vue

When using VGrammar in Vue, there are a few main concerns:

1.  **When to create a new visual instance**: When used in the browser, VGrammar is a graphics drawing based on Canvas, so the most basic point is to wait for the container dom element to be rendered and mounted on the dom tree before creating a visual instance;
2.  **Unmount instances in time**: Before the component is unloaded, the instance created by VGrammar needs to be unloaded to prevent memory leaks

[View the online demo](https://codesandbox.io/s/viscator-vgrammar-vue-demo-nr8pjc)

## Option API Encapsulation

When use VGrammar with the Options API, you can refer to the following core code:

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

        view.run();
        return true;
      } else if (view) {
        view.updateSpec(parseSpec(chartProps) as any);
        view.run();

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

## Composite API Encapsulation

When use VGrammar with a composite API, you can refer to the following core code:

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

    view.run();
    return true;
  } else if (view) {
    view.updateSpec(parseSpec(chartProps) as any);
    view.run();

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
