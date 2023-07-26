/* eslint-disable no-console */
import './style.css';
import { Plot, View } from '@visactor/vgrammar';
import { indexes } from './indexes';
import { createBinds } from './bind-helpers';

let chartInstance: any = null;

const LOCAL_STORAGE_KEY = 'VGRAMMAR_DEMOS';

const createSidebar = (node: HTMLDivElement) => {
  const specsHtml = indexes.map(entry => {
    if (entry.menu && entry.children && entry.children.length) {
      const childrenItems = entry.children.map(child => {
        return `<p class="menu-item" data-path="${child.path}"data-type="${child.type ?? 'spec'}">${child.name}</p>`;
      });

      return `<p class="menu-item menu-title">${entry.menu}</p>${childrenItems.join('')}`;
    }

    return `<p class="menu-item" data-path="${entry.path}">${entry.name}</p>`;
  });

  node.innerHTML = `
    <div>
      <p class="sidebar-title">组件列表</p>
      <div class="menu-list">
        ${specsHtml.join('')}
      </div>
    </div>
  `;
};

const resetFooterContent = (
  callback?: (chartInstance?: any, container?: HTMLDivElement) => ((e: MouseEvent) => void) | void,
  binds?: any[]
) => {
  const footerNode = document.querySelector<HTMLDivElement>('#footer')!;

  footerNode.innerHTML = '';

  if (callback) {
    callback(chartInstance);
  }

  if (binds) {
    createBinds(binds, chartInstance, footerNode);
  }
};

const createChartBySpec = (spec: any) => {
  if (chartInstance) {
    chartInstance.release();
  }
  const start = performance.now();
  const containerNode = document.getElementById('container');
  const containerRect = containerNode?.getBoundingClientRect();

  chartInstance = new View({
    width: spec.width,
    height: spec.height,
    renderer: 'canvas',
    container: 'container',
    hover: true,
    logLevel: 5
    // hooks: {
    //   beforeParseView: () => {
    //     console.log('beforeParseView');
    //   },
    //   afterParseView: () => {
    //     console.log('afterParseView');
    //   },

    //   // View
    //   beforeTransform: (key: string) => {
    //     console.log('beforeTransform', key);
    //   },
    //   afterTransform: (key: string) => {
    //     console.log('afterTransform', key);
    //   },

    //   beforeCreateVRenderStage: () => {
    //     console.log('beforeCreateVRenderStage');
    //   },
    //   afterCreateVRenderStage: () => {
    //     console.log('afterCreateVRenderStage');
    //   },
    //   beforeVRenderDraw: () => {
    //     console.log('beforeVRenderDraw');
    //   },
    //   afterVRenderDraw: () => {
    //     console.log('afterVRenderDraw');
    //   },

    //   // Scenegraph
    //   beforeCreateVRenderMark: () => {
    //     console.log('beforeCreateVRenderMark');
    //   },
    //   afterCreateVRenderMark: () => {
    //     console.log('afterCreateVRenderMark');
    //   }
    // }
  });
  chartInstance.parseSpec(spec);

  (window as any).view = chartInstance;

  chartInstance.runAsync().then(() => {
    const runFinish = performance.now();
    console.log('================ all time =====================', runFinish - start);
  });

  return chartInstance;
};

const createChartByAPI = (runner: any) => {
  if (chartInstance) {
    chartInstance.release();
  }

  chartInstance = new View({
    width: 400,
    height: 400,
    container: 'container',
    hover: true,
    logLevel: 3
  });
  (window as any).view = chartInstance;
  runner(chartInstance);

  chartInstance.run(undefined, undefined, () => {
    // do nothing
  });

  return chartInstance;
};

const createChartByPlot = (runner: any) => {
  if (chartInstance) {
    chartInstance.release();
  }

  chartInstance = new Plot({
    width: 400,
    height: 400,
    container: 'container',
  });
  (window as any).view = chartInstance;
  runner(chartInstance);

  chartInstance.render();

  return chartInstance;
};

const ACTIVE_ITEM_CLS = 'menu-item-active';
const MENU_TITLE_CLS = 'menu-title';

const handleClick = (e: { target: any }, isInit?: boolean) => {
  const triggerNode = e.target;

  if (!triggerNode || triggerNode.classList.contains(MENU_TITLE_CLS)) {
    return;
  }

  const prevActiveItems = document.getElementsByClassName(ACTIVE_ITEM_CLS);

  if (prevActiveItems && prevActiveItems.length) {
    for (let i = 0; i < prevActiveItems.length; i++) {
      const element = prevActiveItems[i];

      element.classList.remove(ACTIVE_ITEM_CLS);
    }
  }

  if (triggerNode) {
    const path = triggerNode.dataset.path;
    const type = triggerNode.dataset.type;

    triggerNode.classList.add(ACTIVE_ITEM_CLS);
    if (!isInit) {
      localStorage.setItem(LOCAL_STORAGE_KEY, `${type}:${path}`);
    }

    if (type === 'spec') {
      import(`./specs/${path}.ts`)
        .then(module => {
          createChartBySpec(module.spec);
          resetFooterContent(module.callback, module.binds);
        })
        .catch(err => {
          console.log(err);
        });
    } else if (type === 'api') {
      import(`./api/${path}.ts`)
        .then(module => {
          createChartByAPI(module.runner);
          resetFooterContent(module.callback, module.binds);
        })
        .catch(err => {
          console.log(err);
        });
    } else if (type === 'plot') {
      import(`./plot/${path}.ts`)
        .then(module => {
          createChartByPlot(module.runner);
          resetFooterContent(module.callback, module.binds);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};

const handleRelease = () => {
  if (chartInstance) {
    chartInstance.release();
  }
  chartInstance = null;
};

const initSidebarEvent = (node: HTMLDivElement) => {
  node.addEventListener('click', handleClick);
};

const initReleaseEvent = (node: HTMLButtonElement) => {
  node.addEventListener('click', handleRelease);
};

const run = () => {
  const sidebarNode = document.querySelector<HTMLDivElement>('#sidebar')!;
  const prevActivePath = localStorage.getItem(LOCAL_STORAGE_KEY);
  const releaseButton = document.querySelector<HTMLButtonElement>('#header .release-button')!;

  createSidebar(sidebarNode);
  initSidebarEvent(sidebarNode);
  initReleaseEvent(releaseButton);

  const menuItemNodes = document.getElementsByClassName('menu-item');

  handleClick(
    {
      target:
        menuItemNodes &&
        menuItemNodes.length && (
          prevActivePath ? Array.from(menuItemNodes).find(node => {
            const [type, path] = prevActivePath.split(':');

            return node.dataset.path === path && node.dataset.type === type;
          }) : menuItemNodes[0]
        )
    },
    true
  );
};

run();
