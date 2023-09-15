/* eslint-disable no-console */
import './style.css';
import { View } from '@visactor/vgrammar';
import { Plot } from '@visactor/vgrammar-plot';
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

const performanceTimes = {
  parseViewTime: 0,
  parseViewTimeTemp: -1,

  stageResizeTime: 0,
  stageResizeTimeTemp: -1,

  evaluateDataTime: 0,
  evaluateDataTimeTemp: -1,

  evaluateScaleTime: 0,
  evaluateScaleTimeTemp: -1,

  markJoinSeq: 0,
  markJoinTime: 0,
  markJoinTimeTemp: -1,

  markUpdateSeq: 0,
  markUpdateTime: 0,
  markUpdateTimeTemp: -1,

  markStateSeq: 0,
  markStateTime: 0,
  markStateTimeTemp: -1,

  markEncodeSeq: 0,
  markEncodeTime: 0,
  markEncodeTimeTemp: -1,

  layoutTime: 0,
  layoutTimeTemp: -1,

  handleLayoutEndTime: 0,
  handleLayoutEndTimeTemp: -1,

  handleRenderEndTime: 0,
  handleRenderEndTimeTemp: -1,

  doRenderTimeTemp: -1,
  doRenderTime: 0,

  createVRenderMarkTimeTemp: -1,
  createVRenderMarkTime: 0,

  addVRenderMarkTimeTemp: -1,
  addVRenderMarkTime: -1,

  createLayerTime: 0,
  createLayerTimeTemp: -1,

  createStageTime: 0,
  createStageTimeTemp: -1,

  canopusDrawTime: 0,
  canopusDrawTimeTemp: -1,

  transformTime: {
    timeTemp: {},
    time: {},
    seq: {}
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
    enableHtmlAttribute: true,
    width: spec.width,
    height: spec.height,
    container: 'container',
    logLevel: 0,
    hooks: {
      beforeParseView: () => {
        performanceTimes.parseViewTimeTemp = performance.now();
      },
      afterParseView: () => {
        performanceTimes.parseViewTime += performance.now() - performanceTimes.parseViewTimeTemp;
        performanceTimes.parseViewTimeTemp = -1;
      },

      beforeEvaluateData: () => {
        performanceTimes.evaluateDataTimeTemp = performance.now();
      },
      afterEvaluateData: () => {
        performanceTimes.evaluateDataTime += performance.now() - performanceTimes.evaluateDataTimeTemp;
        performanceTimes.evaluateDataTimeTemp = -1;
      },

      beforeEvaluateScale: () => {
        performanceTimes.evaluateScaleTimeTemp = performance.now();
      },
      afterEvaluateScale: () => {
        performanceTimes.evaluateScaleTime += performance.now() - performanceTimes.evaluateScaleTimeTemp;
        performanceTimes.evaluateScaleTimeTemp = -1;
      },

      beforeStageResize: () => {
        performanceTimes.stageResizeTimeTemp = performance.now();
      },
      afterStageResize: () => {
        
        performanceTimes.stageResizeTime += performance.now() - performanceTimes.stageResizeTimeTemp;
        performanceTimes.stageResizeTimeTemp = -1;
      },

      beforeTransform: name => {
        performanceTimes.transformTime.timeTemp[name] = performance.now();
      },
      afterTransform: name => {
        if (typeof performanceTimes.transformTime.time[name] !== 'number') {
          performanceTimes.transformTime.time[name] = 0;
        }
        performanceTimes.transformTime.time[name] +=
          performance.now() - performanceTimes.transformTime.timeTemp[name];
        performanceTimes.transformTime.timeTemp[name] = -1;

        if (typeof performanceTimes.transformTime.seq[name] !== 'number') {
          performanceTimes.transformTime.seq[name] = 0;
        }
        performanceTimes.transformTime.seq[name]++;
      },

      // Create Canopus Stage 时间
      beforeCreateVRenderStage: () => {
        performanceTimes.createStageTimeTemp = performance.now();
      },
      afterCreateVRenderStage: () => {
        performanceTimes.createStageTime += performance.now() - performanceTimes.createStageTimeTemp;
        performanceTimes.createStageTimeTemp = -1;
      },

      // Create Canopus Mark 时间
      beforeCreateVRenderLayer: () => {
        performanceTimes.createLayerTimeTemp = performance.now();
      },
      afterCreateVRenderLayer: () => {
        performanceTimes.createLayerTime += performance.now() - performanceTimes.createLayerTimeTemp;
        performanceTimes.createLayerTimeTemp = -1;
      },

      // mark 具体执行时间
      beforeMarkJoin: () => {
        performanceTimes.markJoinTimeTemp = performance.now();
      },
      afterMarkJoin: () => {
        performanceTimes.markJoinSeq += 1;
        performanceTimes.markJoinTime += performance.now() - performanceTimes.markJoinTimeTemp;
        performanceTimes.markJoinTimeTemp = -1;
      },

      beforeMarkUpdate: () => {
        performanceTimes.markUpdateTimeTemp = performance.now();
      },
      afterMarkUpdate: () => {
        performanceTimes.markUpdateSeq += 1;
        performanceTimes.markUpdateTime += performance.now() - performanceTimes.markUpdateTimeTemp;
        performanceTimes.markUpdateTimeTemp = -1;
      },

      beforeMarkState: () => {
        performanceTimes.markStateTimeTemp = performance.now();
      },
      afterMarkState: () => {
        performanceTimes.markStateSeq += 1;
        performanceTimes.markStateTime += performance.now() - performanceTimes.markStateTimeTemp;
        performanceTimes.markStateTimeTemp = -1;
      },

      beforeMarkEncode: () => {
        performanceTimes.markEncodeTimeTemp = performance.now();
      },
      afterMarkEncode: () => {
        performanceTimes.markEncodeSeq += 1;
        performanceTimes.markEncodeTime += performance.now() - performanceTimes.markEncodeTimeTemp;
        performanceTimes.markEncodeTimeTemp = -1;
      },

      beforeDoLayout: () => {
        performanceTimes.layoutTimeTemp = performance.now();
      },
      afterDoLayout: () => {
        performanceTimes.layoutTime += performance.now() - performanceTimes.layoutTimeTemp;
        performanceTimes.layoutTimeTemp = -1;
      },
      beforeMarkLayoutEnd: () => {
        performanceTimes.handleLayoutEndTimeTemp = performance.now();
      },
      afterMarkLayoutEnd: () => {
        performanceTimes.handleLayoutEndTime += performance.now() - performanceTimes.handleLayoutEndTimeTemp;
        performanceTimes.handleLayoutEndTimeTemp = -1;
      },
      beforeMarkRenderEnd: () => {
        performanceTimes.handleRenderEndTimeTemp = performance.now();
      },
      afterMarkRenderEnd: () => {
        performanceTimes.handleRenderEndTime += performance.now() - performanceTimes.handleRenderEndTimeTemp;
        performanceTimes.handleRenderEndTimeTemp = -1;
      },

      beforeDoRender: () => {
        performanceTimes.doRenderTimeTemp = performance.now();
      },
      afterDoRender: () => {

        performanceTimes.doRenderTime += performance.now() - performanceTimes.doRenderTimeTemp;
        performanceTimes.doRenderTimeTemp = -1;
      },


      beforeCreateVRenderMark: () => {
        performanceTimes.createVRenderMarkTimeTemp = performance.now();
      },
      afterCreateVRenderMark: () => {

        performanceTimes.createVRenderMarkTime += performance.now() - performanceTimes.createVRenderMarkTimeTemp;
        performanceTimes.createVRenderMarkTimeTemp = -1;
      },

      beforeAddVRenderMark: () => {
        performanceTimes.addVRenderMarkTimeTemp = performance.now();
      },
      afterAddVRenderMark: () => {
        performanceTimes.addVRenderMarkTime += performance.now() - performanceTimes.addVRenderMarkTimeTemp;
        performanceTimes.addVRenderMarkTimeTemp = -1;
      },

      // Canopus Draw 时间
      beforeVRenderDraw: () => {
        performanceTimes.canopusDrawTimeTemp = performance.now();
      },
      afterVRenderDraw: () => {
        performanceTimes.canopusDrawTime += performance.now() - performanceTimes.canopusDrawTimeTemp;
        performanceTimes.canopusDrawTimeTemp = -1;
      }
    }
  });
  chartInstance.parseSpec(spec);

  (window as any).view = chartInstance;

  chartInstance.runAsync().then(() => {
    const runFinish = performance.now();
    console.log('================ all time =====================', runFinish - start);
    let sum = 0;
    console.table(
      Object.keys(performanceTimes).reduce((res: any, key) => {
        if (!key.includes('TimeTemp') && !key.includes('Seq') && typeof performanceTimes[key] === 'number') {
          res[key] = performanceTimes[key];
          sum += res[key];
        } else if (key === 'transformTime') {
          const time = performanceTimes.transformTime.time;

          Object.keys(time).forEach(k => {
            res[`transform-${k}-time`] = time[k];
            sum += time[k];
          })
        }

        return res;
      }, {})
    );

    console.log('sum', sum);

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
    width: 800,
    height: 600,
    container: 'container',
    logLevel: 5,
  });
  (window as any).view = chartInstance;
  runner(chartInstance);

  chartInstance.runAsync();

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
    const filePath = path.includes('.tsx') ? path :  `${path}.ts`;

    if (type === 'spec') {
      import(`./specs/${filePath}`)
        .then(module => {
          createChartBySpec(module.spec);
          resetFooterContent(module.callback, module.binds);
        })
        .catch(err => {
          console.log(err);
        });
    } else if (type === 'api') {
      import(`./api/${filePath}`)
        .then(module => {
          createChartByAPI(module.runner);
          resetFooterContent(module.callback, module.binds);
        })
        .catch(err => {
          console.log(err);
        });
    } else if (type === 'plot') {
      import(`./plot/${filePath}`)
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
  if (chartInstance && chartInstance._dataflow) {
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
