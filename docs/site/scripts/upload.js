/**
 * 用于将 example 上传至 cms 的脚本。会将当前目录下所有 markdown 文件按照目录路径上传至 cms
 * 1. 会保留当前的路径关系。文件夹名称为路径名称，markdown 文件名为文档名
 * 2. 如果想要中文的文件名，请在 cms 上更新
 * 准备工作：
 * 1. 确认要上传的地址，请在 cms 上确认要上传的地址。同时在当前地址的页面设置中获取 token ，之后要设置到 Authorization 上。
 * 2. 确认文件上传到地址里的路由名称比如为 example
 * 执行脚本: 第一个参数是上传地址，第二个参数是路由名称，第三个参数是 token，不传则使用默认值（默认值不保证可用）
 * 
 * 教程: node upload.js https://data-cms.bytedance.net/ guides 59677583-a493-5305-851a-1153c93e2234 en 
 * 示例: node upload.js https://data-cms.bytedance.net/ example 02cd267d-ea09-555b-ac32-2275dd2faa17 en
 * api: node upload.js https://data-cms.bytedance.net/ API 9369d0a5-5dd6-504a-8086-66fdd3b3684f en

 */
const fs = require('fs');
const nodePath = require('path');
const axios = require('axios');

// 参数
const args = process.argv.slice(2);
const siteUrl = args[0] ?? 'https://data-cms.bytedance.net/';
const exampleRoutePath = args[1] ?? 'guides';
const Authorization = args[2] ?? '59677583-a493-5305-851a-1153c93e2234';
if (!siteUrl || !exampleRoutePath || !Authorization) {
  console.log('please enter siteUrl, route and token, command like this: node upload.js https://xxx route token');
  process.exit();
}

const rootRouteMap = {
  guides: { title: '教程文档', path: 'tutorials', en_path: 'tutorials_en' } ,
  example: { title: '图表示例', path: 'examples', en_path: 'examples_translate' },
  API: { title: 'API', path: 'api', en_path: 'api_translate' },
}
const lang = args[3] === 'en' || args[3] === '2' ? '2' : '1';
const rootPath = lang === '2' ? rootRouteMap[exampleRoutePath].en_path : rootRouteMap[exampleRoutePath].path;
const menu = exampleRoutePath === 'guides' ? [
  {
    menu: '站点指引',
    path: '',
    name: 'website-guide'
  },
  {
    menu: '快速上手',
    path: '',
    name: 'quick-start'
  },
  {
    menu: '语法元素',
    path: '',
    name: 'grammar-element'
  },
  {
    menu: '图元',
    path: 'marks',
    children: [
      {
        name: 'base',
        menu: '图元概览'
      },
      {
        name: 'basic-mark',
        menu: '基础图元'
      },
      {
        name: 'semantic-mark',
        menu: '语义图元'
      },
      {
        name: 'glyph-mark',
        menu: '组合图元'
      },
      {
        name: 'component',
        menu: '组件图元'
      }
    ]
  },
  {
    menu: '图表',
    path: '',
    name: 'chart'
  },
  {
    menu: '事件与交互',
    path: '',
    name: 'event'
  },
  {
    menu: '布局',
    path: '',
    name: 'layout'
  },
  {
    menu: '动画',
    path: '',
    name: 'animation'
  },
  {
    menu: '高级指引',
    path: '',
    name: 'advanced-guide'
  }
] : [
  {
    menu: 'View',
    path: '',
    name: 'view'
  },
  {
    menu: 'Signal',
    path: '',
    name: 'signal'
  },
  {
    menu: 'Data',
    path: '',
    name: 'data'
  },
  {
    menu: 'Scale',
    path: '',
    name: 'scale'
  },
  {
    menu: 'Coordinate',
    path: '',
    name: 'coordinate'
  },
  {
    menu: 'Projection',
    path: '',
    name: 'projection'
  },
  {
    menu: 'Mark',
    path: '',
    name: 'mark'
  },
  {
    menu: 'GroupMark',
    path: '',
    name: 'group-mark'
  },
  {
    menu: 'GlyphMark',
    path: '',
    name: 'glyph-mark'
  },
  {
    menu: 'Component',
    path: '',
    name: 'component'
  },
];

const menuMap = menu.reduce((res, entry) => {
  if (entry.children && entry.children.length) {
    entry.children.forEach(child => {
      res[child.name] = child.menu;
    });
  }

  return { ...res, [entry.name || entry.path]: entry.menu }
}, {});

// 文档站点配置，站点路径，token
// const Authorization = '59677583-a493-5305-851a-1153c93e2234';
const exampleRoute = {
  name: {
    1: (rootRouteMap[exampleRoutePath] && rootRouteMap[exampleRoutePath].title) || exampleRoutePath,
    2: exampleRoutePath
  },
  path: exampleRoutePath,
  fullPath: exampleRoutePath,
  type: 1
};

function exitWithError(msg, ...args) {
  console.log(msg, ...args);
  process.exit();
}

function parseCallBack(data) {
  if (!data) {
    return data;
  }
  if (typeof data === 'string') {
    return JSON.parse(data);
  }
  return data;
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

async function createRouteInParent(parentInfo, name, type) {
  return new Promise(resolve => {
    axios({
      method: 'post',
      url: siteUrl + 'api/open/route',
      headers: { Authorization },
      data: {
        name: {
          1: menuMap[name] || name,
          2: name
        },
        p_id: parentInfo.id,
        path: name,
        fullPath: parentInfo.path + '/' + name,
        type
      }
    })
      .then(response => {
        if (response.status === 200 && response.data.data) {
          const callBack = parseCallBack(response.data.data);
          parentInfo.children = parentInfo.children || [];
          parentInfo.children.push(callBack);
          resolve();
        } else {
          exitWithError('create path: ', name, ' error', response.status, response.statusText);
        }
      })
      .catch(error => {
        exitWithError('create path: ', name, ' error', error);
      });
  });
}

async function prepareTopPath() {
  return new Promise(resolve => {
    // get top path
    axios({
      method: 'get',
      url: siteUrl + 'api/open/site/top',
      headers: { Authorization }
    })
      .then(response => {
        if (response.status === 200 && response.data.data) {
          // check example isExist
          const callBack = parseCallBack(response.data.data);
          const examplePath = callBack.find(d => d.name['2'] === exampleRoutePath);
          if (examplePath) {
            resolve(examplePath);
          } else {
            // create example route
            axios({
              method: 'post',
              url: siteUrl + 'api/open/route',
              headers: { Authorization },
              data: exampleRoute
            })
              .then(response => {
                if (response.status === 200 && response.data.data) {
                  const callBack = parseCallBack(response.data.data);
                  resolve(callBack);
                } else {
                  exitWithError('prepare example path error', response.status, response.statusText);
                }
              })
              .catch(error => {
                exitWithError('prepare example path error', error);
              });
          }
        } else {
          exitWithError('prepare example path error', response.status, response.statusText);
        }
      })
      .catch(error => {
        exitWithError('prepare example path error', error);
      });
  });
}

async function getCurrentRoute(parentInfo) {
  return new Promise(resolve => {
    axios({
      method: 'get',
      url: siteUrl + 'api/open/site/top/' + parentInfo.id,
      headers: { Authorization }
    })
      .then(response => {
        if (response.status === 200 && response.data.data) {
          const callBack = parseCallBack(response.data.data);
          resolve(callBack[0]);
        } else {
          exitWithError('get route error', response.status, response.statusText);
        }
      })
      .catch(error => {
        exitWithError('get route error', error);
      });
  });
}

function getParentInfoInRoot(rootInfo, dir) {
  if (!dir || dir.length === 0) {
    return rootInfo;
  }
  let tempParent = rootInfo;
  for (let i = 0; i < dir.length; i++) {
    tempParent = tempParent.children.find(info => info.path === dir[i]);
    if (!tempParent) {
      return null;
    }
  }
  return tempParent;
}

const getRootPath = () => {
  return nodePath.join(__dirname, rootPath);
}

async function preparePath(routeInfo) {
  const root = getRootPath();
  await readDirAsync(root, [], async (path, name, dir) => {
    const parentInfo = getParentInfoInRoot(routeInfo, dir);
    if (!parentInfo) {
      return;
    }
    if (parentInfo.children && parentInfo.children.find(r => r.path === name)) {
      return null;
    }
    console.log('start create path: ', [...dir], name);
    await createRouteInParent(parentInfo, name, 1);
    console.log('create path success!: ', [...dir], name);
  });
}

const appendExampleToDocument = (data) => {
  const reg = /<div[\s]+class="examples-ref-container"[\s]+id="([\w-_]+)"[\s]+data-path="([\w-_\/]+)">[\s]*<\/div>/g;
  const exampleCodeStart = '```javascript livedemo template=vgrammar'
  const exampleCodeEnd = '```';

  return data.replace(reg, (match, id, path) => {
    if (path) {
      const example = fs.readFileSync(nodePath.resolve(__dirname, `./examples/${path}.md`), 'utf8');
      const startIndex = example.indexOf(exampleCodeStart);
      const endIndex = startIndex >= 0 ? example.indexOf(exampleCodeEnd, startIndex + exampleCodeStart.length) : -1;
      

      if (startIndex >= 0 && endIndex >= 0) {
        const code = example.slice(startIndex, endIndex + exampleCodeEnd.length);

        if (code && code.length) {
          return code;
        }
      }
    }

    return '';
  })
};

async function _uploadDocument(path, name, dir, docInfo) {
  return new Promise(resolve => {
    // 更新
    fs.readFile(path + '/' + name, 'utf8', (err, data) => {
      if (!data) {
        data = '';
        console.log('markdown content empty: ', [...dir], name);
        // exitWithError('uploadMarkDown fail in read fill: ', path + '/' + name);
        // return;
      }
      data = appendExampleToDocument(data);
      console.log('start upload markdown content: ', [...dir], name, docInfo.id);
      axios({
        method: 'put',
        url: siteUrl + `api/open/document/${docInfo.id}/${lang}`,
        headers: { Authorization },
        data: {
          content: data
        }
      })
        .then(response => {
          if (response.status === 200) {
            resolve();
          } else {
            exitWithError('upload markDown fail in path: ', docInfo.id, name);
          }
        })
        .catch(error => {
          exitWithError('upload markDown fail in path: ', docInfo.id, name, error);
        });
    });
  });
}

async function uploadSinglFile(routeInfo, path, name, dir) {
  if (!name.endsWith('md')) {
    return;
  }
  console.log('------------ dir:', dir, '---- path: ', path, '---- name: ', name);
  const parentInfo = getParentInfoInRoot(routeInfo, dir);
  if (!parentInfo) {
    exitWithError('uploadMarkDown fail in path: ', JSON.stringify(dir));
    return;
  }
  const pathName = name.substr(0, name.lastIndexOf('.md'));
  // 如果没有此文档，创建文档
  let docInfo = parentInfo.children?.find(r => r.path === pathName);
  if (!docInfo) {
    console.log('start create markdown: ', [...dir], name);
    await createRouteInParent(parentInfo, pathName, 2);
    console.log('create markdown success!: ', [...dir], name);
    docInfo = parentInfo.children?.find(r => r.path === pathName);
  }
  await _uploadDocument(path, name, dir, docInfo);
  console.log('upload markdown content success!: ', [...dir], name);
}

async function uploadMarkDown(routeInfo) {
  const root = getRootPath();

  await readDirAsync(root, [], null, async (path, name, dir) => {
    await uploadSinglFile(routeInfo, path, name, dir)
  });
}



async function uploadMarkDownByMenu(routeInfo) {
  const root = getRootPath();
  const list = [];

  menu.forEach(entry => {
    if (entry.children) {
      if (entry.children.length) {
        entry.children.forEach(child => {
          list.push({
            path: `${root}/${entry.path}`,
            dir: [entry.path],
            name: `${child.name}.md`
          })
        });
      }
    } else {
      list.push({
        path: `${root}`,
        dir: [],
        name: `${entry.name}.md`
      })
    } 
  });

  let i = 0;

  try {
    while (i < list.length) {
      await uploadSinglFile(routeInfo, list[i].path, list[i].name, list[i].dir);
      i++;
    }
  } catch (err) {
    console.log(err);
  }
}

async function uploadExample() {
  const rootPath = await prepareTopPath();
  console.log('root path ready');
  const routeInfo = await getCurrentRoute(rootPath);
  console.log('routeInfo ready');
  await preparePath(routeInfo);
  console.log('all path ready');

  if (exampleRoutePath === 'example') {
    await uploadMarkDownByMenu(routeInfo);
  } else {

    await uploadMarkDown(routeInfo);
  }
  console.log('all markdown upload');
}
uploadExample();
