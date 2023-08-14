const fs = require('fs');
const path = require('path');

const VRender = require('@visactor/vrender');
const VGrammar = require('@visactor/vgrammar');
const VGrammarHierarchy = require('@visactor/vgrammar-hierarchy');
const VGrammarSankey = require('@visactor/vgrammar-sankey');
const VGrammarWordcloud = require('@visactor/vgrammar-wordcloud');
const VGrammarWordcloudShape = require('@visactor/vgrammar-wordcloud-shape');
const VisUtil = require('@visactor/vutils');
const Canvas = require('canvas');

const pathDir = 'preview-image';
const failFilePath = path.join(__dirname, './preview-fail.json');

function createImage(spec, path) {
  let cs = null;
  try {
    console.log('start:', path);

    if (!spec.width && !spec.height) {
      spec.width = 640;
      spec.height = 480;
    }
    cs = new VGrammar.View({
      // 声明使用的渲染环境以及传染对应的渲染环境参数
      mode: 'node',
      modeParams: Canvas,
      dpr: 2,
    });

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

    cs.parseSpec(spec);

    cs.runSync();

    const buffer = cs.getImageBuffer();
    fs.writeFileSync(path, buffer);
  } catch (_error) {
    console.log('[error] create view error', _error);
    return false;
  }
  try {
    cs?.release();
  } catch (_error) {
    console.log('[error] release error');
  }
  return true;
}

function exitWithError(msg, ...args) {
  console.log(msg, ...args);
  process.exit();
}

async function readDirAsync(path, dir, directoryCallBack, fillCallBack) {
  const pa = fs.readdirSync(path);
  for (let i = 0; i < pa.length; i++) {
    const ele = pa[i];
    const info = fs.statSync(path + '/' + ele);
    if (info.isDirectory()) {
      await directoryCallBack?.(path + '/' + ele, ele, dir);
      await readDirAsync(path + '/' + ele, [...dir, ele], directoryCallBack, fillCallBack);
    } else {
      await fillCallBack?.(path, ele, dir);
    }
  }
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

  return getSpecFromCode(code + '\n');
}

function getSpecFromCode(codeString) {
  // eslint-disable-next-line no-eval
  try {
    const fun = new Function('VGrammar', 'VGrammarHierarchy', 'VGrammarSankey', 'VGrammarWordcloud',  'VGrammarWordcloudShape', 'VisUtil', 'VRender', `
      ${codeString.substr(0, codeString.indexOf('const vGrammarView = new View'))};
      return spec;
  `);
    return fun(VGrammar, VGrammarHierarchy, VGrammarSankey, VGrammarWordcloud, VGrammarWordcloudShape, VisUtil, VRender);
  } catch (error) {
    return null;
  }
}

function spliceMd(mdString, dir, mdName) {
  const name = [...dir, mdName.substr(0, mdName.length - 3)].join('/');

  return { name, content: getCodeFromMd(mdString) };
}

async function getSpecMd(path, name, dir) {
  return new Promise(resolve => {
    fs.readFile(path + '/' + name, 'utf8', (err, data) => {
      if (!data) {
        exitWithError('markdown content empty: ', path + '/' + name);
      }
      resolve(spliceMd(data, dir, name));
    });
  });
}

function fillPath(name, dir) {
  return `./${pathDir}/${fillName(name, dir)}`;
}
function fillName(name, dir) {
  return [...dir, name.substr(0, name.indexOf('.md'))].join('-') + '.png';
}

async function createPreview() {
  const failMd = JSON.parse(
    fs.existsSync(failFilePath) ? fs.readFileSync(failFilePath, { encoding: 'utf8', flag: 'r' }) : `[]`
  );
  const root = path.join(__dirname);
  await readDirAsync(root, [], null, async (path, name, dir) => {
    if (!name.endsWith('md') || ['README.md', 'arc3d.md', 'pyramid3d.md', 'rect3d.md', 'player.md', 'api-rect.md', 'progressive-line.md', 'progressive-rect.md', 'basic-wordcloud-shape.md'].includes(name)  || dir.includes('chart-3d')) {
      return;
    }
    if (failMd.find(f => f.name === name && JSON.stringify(f.dir) === JSON.stringify(dir))) {
      return;
    }
    if (fs.existsSync(fillPath(name, dir))) {
      // fs.unlinkSync(fillPath(name, dir));
      return;
    }
    const result = await getSpecMd(path, name, dir);
    if (!result || !result.name || !result.content) {
      failMd.push({
        name,
        dir
      });
      return;
    }
    if (!createImage(result.content, fillPath(name, dir))) {
      failMd.push({
        name,
        dir
      });
      console.log('fail:', result.name, result.content.type);

    } else {
      console.log('success', result.name, result.content.type);
    }
    fs.writeFileSync(failFilePath, JSON.stringify(failMd));
  });
  console.log('failMd:', failMd);
}
createPreview();
