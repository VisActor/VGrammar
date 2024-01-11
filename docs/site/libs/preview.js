const fs = require('fs');
const path = require('path');
const VRender = require('@visactor/vrender');
const VGrammar = require('@visactor/vgrammar');
const VGrammarHierarchy = require('@visactor/vgrammar-hierarchy');
const VGrammarSankey = require('@visactor/vgrammar-sankey');
const VGrammarWordcloud = require('@visactor/vgrammar-wordcloud');
const VGrammarWordcloudShape = require('@visactor/vgrammar-wordcloud-shape');
const VGrammarPlot = require('@visactor/vgrammar-plot');
const VisUtil = require('@visactor/vutils');
const Canvas = require('canvas');
const fse = require('fs-extra');
const package = require('../../../packages/vgrammar/package.json');

const examplesDirectory = path.resolve(__dirname, '../assets/examples');
const previewDirectory = path.resolve(__dirname, '../public/vgrammar/preview');
const staticPreviewDirectory = path.resolve(__dirname, '../public/vgrammar/static-preview');
const failListName = 'failedPreviewLists.json';
const languages = ['zh', 'en'];

const version = package.version;
let staticPreviewLists = [];
const failedPreviewLists = [];
const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 480;

function getPreviewPrefix(fullPath) {
  return fullPath.replaceAll('/', '-');
}

function getPreviewName(fullPath) {
  return `${getPreviewPrefix(fullPath)}_${version}.png`;
}

async function createImage(obj, fullPath) {
  let view = null;
  let plot = null;
  try {
    if (obj.spec) {
      const spec = obj.spec;
      if (!spec.width && !spec.height) {
        spec.width = IMAGE_WIDTH;
        spec.height = IMAGE_HEIGHT;
      }
      const options = {
        // 声明使用的渲染环境以及传染对应的渲染环境参数
        mode: 'node',
        modeParams: Canvas,
        dpr: 2
      };

      if (fullPath.includes('3d')) {
        options.options3d = {
          enable: true,
          alpha: -0.5,
          beta: 0.2,
        };
        options.disableDirtyBounds = true;
      }

      view = new VGrammar.View(options);
  
      if (spec && spec.marks) {
        spec.marks.forEach(mark => {
          mark.animation = null;
  
          if (mark.marks) {
            mark.marks.forEach(childMark => {
              childMark.animation = null;
            });
          }
        })
      }
  
      view.parseSpec(spec);
    } else if (obj.view) {
      view = obj.view;
      view.width(IMAGE_WIDTH);
      view.height(IMAGE_HEIGHT);
    } else if (obj.plot) {
      plot = obj.plot;
      view = obj.plot.view;

      view.width(IMAGE_WIDTH);
      view.height(IMAGE_HEIGHT);
    }
    
    if (plot) {
      await plot.run();
    } else {
      await view.run();
    }

    const buffer = view.getImageBuffer();
    fs.writeFileSync(path.resolve(previewDirectory, getPreviewName(fullPath)), buffer);
    console.log(`Create preview for ${fullPath}`);
  } catch (error) {
    console.log(`Error when create preview for ${fullPath}`, error);
    return false;
  }
  try {
    if (plot) {
      plot.release();
    } else {
      view?.release();
    }

    plot = null;
    view = null;
  } catch (error) {
    console.log(`Error when releasing for ${fullPath}`);
  }
  return true;
}

/**
 * 从markdown中获取 demo 执行代码
 * @param {markdown 内容} mdString
 * @returns
 */
function getCodeFromMd(mdString) {
  const exampleCodeStart = '```javascript livedemo template=vgrammar'
  const exampleCodeEnd = '```';
  const startIndex = mdString.indexOf(exampleCodeStart) + exampleCodeStart.length;
  const code = mdString.slice(startIndex, mdString.indexOf(exampleCodeEnd, startIndex));

  return code.includes('const spec') ? {
    spec: getSpecFromCode(code + '\n')
  } : code.includes('new Plot(') ? {
    plot: getPlotFromCode(code + '\n')
  } : {
    view: getViewFromCode(code + '\n')
  };
}


function getSpecFromCode(codeString) {
  // eslint-disable-next-line no-eval
  try {
    const fun = new Function('VGrammar', 'VGrammarHierarchy', 'VGrammarSankey', 'VGrammarWordcloud',  'VGrammarWordcloudShape', 'VisUtil', 'VRender', 'Plot', `
      ${codeString.substr(0, codeString.indexOf('const vGrammarView = new View'))};
      return spec;
  `);
    return fun(VGrammar, VGrammarHierarchy, VGrammarSankey, VGrammarWordcloud, VGrammarWordcloudShape, VisUtil, VRender, VGrammarPlot.Plot);
  } catch (error) {
    return null;
  }
}

function getPlotFromCode(codeString) {
  // eslint-disable-next-line no-eval
  try {
    const plotRunIndex = codeString.indexOf('plot.run();')

    if (plotRunIndex >= 0) {
      let mainCode = codeString.substr(0, plotRunIndex);
      const startStr = 'const plot = new Plot({';
      const endStr = '});'

      const startIndex = mainCode.indexOf(startStr);
      const endIndex = startIndex >= 0 ? mainCode.indexOf(endStr, startIndex) : -1;

      if (startIndex >= 0 && endIndex > startIndex) {
        mainCode = `${mainCode.slice(0, startIndex)}

        const plot = new Plot({
          mode: 'node',
          modeParams: Canvas,
          dpr: 2,
        });

        ${mainCode.slice(endIndex + endStr.length)}
        

         return plot;
        `;
        
        const fun = new Function('Canvas', 'VGrammar', 'VGrammarHierarchy', 'VGrammarSankey', 'VGrammarWordcloud',  'VGrammarWordcloudShape', 'VisUtil', 'VRender', 'Plot', mainCode);
        return fun(Canvas, VGrammar, VGrammarHierarchy, VGrammarSankey, VGrammarWordcloud, VGrammarWordcloudShape, VisUtil, VRender, VGrammarPlot.Plot);
      }

    }

  } catch (error) {
    return null;
  }
}

function getViewFromCode(codeString) {
  // eslint-disable-next-line no-eval
  try {
    const viewRunIndex = codeString.indexOf('vGrammarView.run();')
    let mainCode = codeString;

    if (viewRunIndex >= 0) {
      mainCode = codeString.substr(0, viewRunIndex);
    } else {
      mainCode.replace('window.vGrammarView = vGrammarView;', '')
    }

    const startStr = 'const vGrammarView = new View';
    const endStr = '});'

    const startIndex = mainCode.indexOf(startStr);
    const endIndex = startIndex >= 0 ? mainCode.indexOf(endStr, startIndex) : -1;

    if (startIndex >= 0 && endIndex > startIndex) {
      mainCode = `${mainCode.slice(0, startIndex)}

      const vGrammarView = new VGrammar.View({
        mode: 'node',
        modeParams: Canvas,
        dpr: 2,
      });

      ${mainCode.slice(endIndex + endStr.length)}
      

       return vGrammarView;
      `;

      const fun = new Function('Canvas', 'VGrammar', 'VGrammarHierarchy', 'VGrammarSankey', 'VGrammarWordcloud',  'VGrammarWordcloudShape', 'VisUtil', 'VRender', 'Plot', mainCode);

      return fun(Canvas, VGrammar, VGrammarHierarchy, VGrammarSankey, VGrammarWordcloud, VGrammarWordcloudShape, VisUtil, VRender, VGrammarPlot.Plot);
    }

  } catch (error) {
    return null;
  }
}

function writePreviewToExample(fullPath) {
  const previewLink = `/vgrammar/preview/${getPreviewName(fullPath)}`;
  for (const language of languages) {
    const examplePath = path.resolve(examplesDirectory, language, `${fullPath}.md`);
    let example = fs.readFileSync(examplePath, { encoding: 'utf-8' });
    if (example.match(/cover:.*\n/)) {
      example = example.replace(/cover:.*\n/, `cover: ${previewLink}\n`);
    } else if (example.startsWith('---')) {
      example = example.replace(
        '---',
        `---
cover: ${previewLink}
---`
      );
    } else {
      example =
        `---
cover: ${previewLink}
---` + example;
    }
    fs.writeFileSync(examplePath, example, { encoding: 'utf-8' });
  }
}

function readExampleMenu() {
  const data = fs.readFileSync(path.resolve(examplesDirectory, 'menu.json'), { encoding: 'utf-8' });
  return JSON.parse(data);
}

async function previewMenuItem(menuItem, parentPath) {
  const fullPath = parentPath === '' ? menuItem.path : `${parentPath}/${menuItem.path}`;
  if (menuItem.children) {
    for (const childMenuItem of menuItem.children) {
      await previewMenuItem(childMenuItem, fullPath);
    }
  } else {
    const hasCopy = copyStaticPreview(fullPath);

    if (hasCopy) { return; }

    const example = fs.readFileSync(path.resolve(examplesDirectory, 'zh', `${fullPath}.md`), { encoding: 'utf-8' });
    const code = getCodeFromMd(example);
    if (!code) {
      failedPreviewLists.push(fullPath);
      return;
    }
    const res = await createImage(code, fullPath);

    if (res) {
      writePreviewToExample(fullPath);
    } else {
      failedPreviewLists.push(fullPath);
    }
  }
}

function initStaticPreviewList() {
  const filenames = fs.readdirSync(staticPreviewDirectory, { encoding: 'utf-8' });

  staticPreviewLists = filenames;
}

function copyStaticPreview(fullPath) {
  if (staticPreviewLists && fullPath) {
    const prefix = getPreviewPrefix(fullPath);
    const staticPreview = staticPreviewLists.find(name => name.includes(prefix));

    if (staticPreview) {
      const suffix = staticPreview.slice(staticPreview.lastIndexOf('.'));
      fse.copyFileSync(`${staticPreviewDirectory}/${staticPreview}`, `${previewDirectory}/${prefix}_${version}${suffix}`)

      return true;
    }
  }

  return false;
}

async function preview() {
  const examplesMenu = readExampleMenu();
  fse.emptyDirSync(previewDirectory);

  initStaticPreviewList();

  for (const menuItem of examplesMenu.children) {
    await previewMenuItem(menuItem, '');
  }
  const failPath = path.resolve(previewDirectory, failListName);
  console.log(`Failure count: ${failedPreviewLists.length}, failed list written to ${failPath}`);
  fs.writeFileSync(failPath, JSON.stringify(failedPreviewLists, null, 2));
  console.log('Preview done.');
}

preview();