import * as VRender from '@visactor/vrender';
import * as VGrammar from '@visactor/vgrammar';
import * as VGrammarHierarchy from '@visactor/vgrammar-hierarchy';
import * as VGrammarSankey from '@visactor/vgrammar-sankey';
import * as VGrammarWordcloud from '@visactor/vgrammar-wordcloud';
import * as VGrammarWordcloudShape from '@visactor/vgrammar-wordcloud-shape';
import * as VisUtil from '@visactor/vutils';
import { menus } from './menu';
import { default as MarkdownIt } from 'markdown-it';
import { colorSchemeForLight, colorSchemeForDark } from './utils';

(window as any).VRender = VRender;
(window as any).VGrammarView = VGrammar.View;
(window as any).VGrammar = VGrammar;
(window as any).VGrammarHierarchy = VGrammarHierarchy;
(window as any).VGrammarSankey = VGrammarSankey;
(window as any).VGrammarWordcloud = VGrammarWordcloud;
(window as any).VGrammarWordcloudShape = VGrammarWordcloudShape;
(window as any).CONTAINER_ID = 'chart';
(window as any).colorSchemeForLight = colorSchemeForLight;
(window as any).colorSchemeForDark = colorSchemeForDark;
(window as any).VisUtil = VisUtil;


const md = new MarkdownIt();

const TAB_CLS = 'tab-title';
const ACTIVE_TAB_CLS = 'tab-title-active';
const ACTIVE_ITEM_CLS = 'menu-item-active';
const ITEM_CLS = 'menu-item';
const LOCAL_STORAGE_TAB_KEY = 'VGRAMMAR_DEMO_TAB';
const LOCAL_STORAGE_PAGE_KEY = 'VGRAMMAR_DEMO_PAGE';

const evaluateCode = (code: string) => {
  // eslint-disable-next-line no-console
  if (!code) {
    return;
  }
  try {
    Function(code)(window);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

const handleSwitchMarkdown = (tab, path, name) => {
  if ((window as any).vGrammarView) {
    (window as any).vGrammarView.release();
    const chartDiv = document.getElementById('chart');

    if (chartDiv as HTMLElement) {
      (chartDiv as HTMLElement).innerHTML = '';
    }
    (window as any).vGrammarView = null;
  }
  const fileName = `./${tab}${path ? '/' + path : ''}/${name}.md`;

  import(fileName)
    .then(module => {
      // eslint-disable-next-line no-console
      console.info('%c %s', 'color: #1890ff;font-weight: bold', `当前 demo 路径：${fileName}`);

      (document.getElementById('article') as HTMLElement).innerHTML = module.html;

      const jsCodeElements = document.getElementsByClassName('language-ts');
      const hasRuntimeCode = jsCodeElements && jsCodeElements.length && tab === 'examples';
      const exampleContainer = document.getElementById('chartContainer');

      if (exampleContainer) {
        exampleContainer.style.display = hasRuntimeCode ? 'block' : 'none';
      }

      if (hasRuntimeCode) {
        const jsCode = jsCodeElements[0].innerHTML;
        evaluateCode(md.utils.unescapeAll(jsCode));
      }
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
}

const updateMenu = (triggerNode: any, activeClassName) => {
  const prevActiveItems = document.getElementsByClassName(activeClassName);

  if (prevActiveItems && prevActiveItems.length) {
    for (let i = 0; i < prevActiveItems.length; i++) {
      const element = prevActiveItems[i];

      element.classList.remove(activeClassName);
    }
  }
  triggerNode.classList.add(activeClassName);
}

const handleSwithTab = (tabKey: string) => {
  const menuListContainer = document.getElementsByClassName('menu-list');

  if (menuListContainer && menuListContainer.length) {
    menuListContainer[0].innerHTML = getMenuListHtml(tabKey).menuHtml;
  }

  switchToDefaultPage(true);
}

const handleClick = (e: { target: any }, isInit?: boolean) => {
  const triggerNode = e.target;

  if (triggerNode && triggerNode.classList.contains(ITEM_CLS)) {
    const path = triggerNode.dataset.path;
    const name = triggerNode.dataset.name;
    const tab = triggerNode.dataset.tab;

    if (name && tab) {
      updateMenu(triggerNode, ACTIVE_ITEM_CLS);
      if (!isInit) {
        localStorage.setItem(LOCAL_STORAGE_PAGE_KEY, name);
      }

      handleSwitchMarkdown(
        tab, 
        path, 
        name
      );
    }
  }

  if (triggerNode && triggerNode.classList.contains(TAB_CLS)) {
    const key = triggerNode.dataset.key;

    if (key) {
      updateMenu(triggerNode, ACTIVE_TAB_CLS);
      if (!isInit) {
        localStorage.setItem(LOCAL_STORAGE_TAB_KEY, key);
      }

      handleSwithTab(key);
    }
  }

};

const initSidebarEvent = (node: HTMLDivElement) => {
  node.addEventListener('click', handleClick);
};

const getMenuListHtml = (key?: string | null) => {
  let activeMenu = key ? menus.find(entry => entry.key === key) : null;

  if (!activeMenu) {
    activeMenu = menus[0];
  }

  return {
    tabHtml: menus.map(entry => {
      return `<p class="${TAB_CLS} ${entry.key === activeMenu?.key ? ACTIVE_TAB_CLS : ''}" data-key="${entry.key}">${entry.title}</p>`
    }).join(''),
    menuHtml: activeMenu.menu.map(entry => {
      if (entry.menu && entry.children && entry.children.length) {
        const childrenItems = entry.children.map(child => {
          return `<p class="${ITEM_CLS}" data-path="${child.path ?? entry.path}" data-name="${child.name}" data-tab="${activeMenu!.key}">
            ${child.menu ?? child.name}
          </p>`;
        });
  
        return `<p class="${ITEM_CLS} menu-title">${entry.menu}</p>${childrenItems.join('')}`;
      }
  
      return `<p class="${ITEM_CLS}" data-name="${entry.name}" data-tab="${activeMenu!.key}">${entry.menu ?? entry.name}</p>`;
    }).join('')
  };
}

const createSidebar = (node: HTMLDivElement, prevActiveTab?: string | null) => {
  const { tabHtml, menuHtml } = getMenuListHtml(prevActiveTab)

  node.innerHTML = `
    <div>
      <div class="sidebar-title">
        ${tabHtml}
      </div>
      <div class="menu-list">
        ${menuHtml}
      </div>
    </div>
  `;
};

const switchToDefaultPage = (forceFirst?: boolean) => {
  const menuItemNodes = document.querySelectorAll(`.${ITEM_CLS}:not(.menu-title)`);
  if (!menuItemNodes || !menuItemNodes.length) {
    return;
  }

  if (forceFirst) {
    handleClick(
      {
        target: menuItemNodes[0]
      },
      true
    );
  } else {
    const prevActivePath = localStorage.getItem(LOCAL_STORAGE_PAGE_KEY);
  
    handleClick(
      {
        target:
          ([...menuItemNodes].find(node => {
            return prevActivePath && (node as any).dataset.name === prevActivePath;
          }) ||
            menuItemNodes[0])
      },
      true
    );
  }


};

const run = () => {
  const sidebarNode = document.querySelector<HTMLDivElement>('#sidebar')!;
  const prevActiveTab = localStorage.getItem(LOCAL_STORAGE_TAB_KEY);

  createSidebar(sidebarNode, prevActiveTab);
  initSidebarEvent(sidebarNode);

  switchToDefaultPage();
};

run();
