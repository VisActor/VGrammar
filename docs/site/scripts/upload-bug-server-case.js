/**
 * 用于批量上传  demo 至 bug-server 的脚本。会将当前目录下所有 markdown 文件按照目录路径上传至 bug-server
 * 会保留当前的路径关系。文件夹名称为路径名称，markdown 文件名为文档名
 * 准备工作：
 * 1. 确认要上传的case组，对应到bug-server网站上，即右上角下拉列表中的内容。比如：chartspace重构组为'chartspace4'...
 * 2. 确认要上传的文件夹名称，注意在上传之前会对比当前目录下所有的文件名称 和 bugserver已经存在的case名称，如果名称和路径都相同，则已存在的case会被覆盖
 * 特别注意:
 * 在执行之前务必确认要上传的文件夹中与本地同名同路径的case是可以被覆盖的
 * 执行脚本: 第一个参数是上传地址，第二个参数是case组名称，第三个参数是 folderName
 * node upload-bug-server-case.js https://bugserver.cn.goofy.app product folderName
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 参数
const args = process.argv.slice(2);
const siteUrl = args[0];
const product = args[1];
const folderName = args[2];

// 附加的实例声明语句
const createObjectCode = `
const dom = window.BUGSERVER_CONTAINER_ID;

const siriusView = new window.sirius.View({
  container: dom,
  width: 1440,
  height: 798,
  renderer: "canvas",
  hover: true,
});

siriusView.parseSpec(spec);
siriusView.runSync();

window.BUGSERVER_SCREENSHOT(); 

// do some unmount operation
window.BUGSERVER_RELEASE(()=>{

  siriusView.release();
});
`;

// 参数判断
if (!siteUrl || !product || !folderName) {
  console.log('please enter siteUrl, product and folderName, command like this: node upload-bug-server-case.js https://xxx product folderName');
  process.exit();
}

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

async function getCaseInfo() {
  return new Promise(resolve => {
      axios({
        method: 'post',
        url: siteUrl + `/api/file/query`,
        data: {
          filter: {
            product
          },
          option: {
            projection: {
              content: 0
            }
          }
        }
      })
        .then(response => {
          if (response.status === 200) {
            const allLiveCase = parseCallBack(response.data.data);
            const filePathPattern = new RegExp(`^` + folderName.split('/').join('\/') + `(\/|$)`);
            const targetFolderLiveCase = allLiveCase.filter(d => filePathPattern.test(d.folderName));
            const targetCaseId = {};
            targetFolderLiveCase.forEach(element => {
              const targetCaseName = element.folderName + '/' + element.name;
              if(targetCaseId[targetCaseName]) {
                targetCaseId[targetCaseName].push(element._id);
              }
              else {
                targetCaseId[targetCaseName] = [element._id];
              }
            });
            resolve(targetCaseId);
          } else {
            exitWithError('get case info fail in target folder: ', folderName);
          }
          
        })
        .catch(error => {
          exitWithError('get case info fail in target folder: ', folderName, error);
        });
    });
}

async function deleteCase(targetCaseId) {
  const root = path.join(__dirname);
  await readDirAsync(root, [], null, async (path, name, dir) => {
    if (!name.endsWith('md') || name.startsWith('README')) {
      return;
    }
    targetCaseId[folderName + '/' + dir.join('/') + '/' + name.split('.')[0]]?.forEach(async (id) => {
      await _deleteDuplicateCase(id);
      console.log('delete duplicate case success!: ', [...dir], name);
    })
  });
}

async function _deleteDuplicateCase(id) {
  return new Promise(resolve => {
    axios({
      method: 'post',
      url: siteUrl + `/api/file/` + id + `/delete`, 
    })
      .then(response => {
        if (response.status === 200) {
          resolve();
        } else {
          exitWithError('delete duplicate case fail of id: ',  id);
        }
      })
      .catch(error => {
        exitWithError('delete duplicate case fail of id: ', id, error);
      });
    });
}

async function _uploadCode(path, name, dir) {
  const exampleCodeStart = '```javascript livedemo template=vgrammar'
  const exampleCodeEnd = '```';

  const specPattern = /(.*)(?=const\s+vchart\s+=)/s; 
  return new Promise(resolve => {
    fs.readFile(path + '/' + name, 'utf8', (err, data) => {
      // step1: get demo content
      if (!data) {
        data = '';
        console.log('demo content empty: ', [...dir], name);
        exitWithError('upload demo fail in read file: ', path + '/' + name);
        return;
      }

      // step2: match code block in demo content
      let demoCode = '';
      const startIndex = data.indexOf(exampleCodeStart);
      const endIndex = startIndex >= 0 ? data.indexOf(exampleCodeEnd, startIndex + exampleCodeStart.length) : -1;

      if (startIndex >= 0 && endIndex >=0) {
        demoCode = data.slice(startIndex + exampleCodeStart.length, endIndex);
      }

      if (!demoCode || demoCode.includes('VisUtils') || demoCode.includes('VRender') || demoCode.includes('VGrammarHierarchy') || demoCode.includes('VGrammarSankey') || demoCode.includes('VGrammarWordcloud') || demoCode.includes('VGrammarWordcloudShape')) {
        return resolve();
      }

      demoCode = demoCode.replace('new View', 'new window.sirius.View').replace('container: document.getElementById(CONTAINER_ID)', 'container: window.BUGSERVER_CONTAINER_ID')
        .replace('autoFit: true,', `width: 1440,
height: 798,`
).replace('runAsync()', 'runSync()').replace('window.vGrammarView = vGrammarView;', '');

demoCode += `
window.BUGSERVER_SCREENSHOT(); 
  
  // do some unmount operation
  window.BUGSERVER_RELEASE(()=>{

    vGrammarView.release();
  });
`;

      console.log('start upload demo: ', [...dir]);
      
      // step4: request to add demo code with create object code
      axios({
        method: 'post',
        url: siteUrl + `/api/file/create`,
        data: {
          file: {
            content: demoCode,
            folderName: folderName + '/' + dir.join('/'),
            name: name.split('.')[0],
            product,
            standardEndAndroidImg: null,
            standardEndIosImg: null,
            standardPhotoImg: null,
            tag: ['photo']
          }
        }
      })
        .then(response => {
          if (response.status === 200) {
            resolve();
          } else {
            exitWithError('upload demo fail in path: ',  name);
          }
        })
        .catch(error => {
          exitWithError('upload demo fail in path: ', name, error);
        });
    });
  });
}

async function uploadDemo() {
  const root = path.join(__dirname);
  await readDirAsync(root, [], null, async (path, name, dir) => {
    if (!name.endsWith('md') || name.startsWith('README')) {
      return;
    }
    await _uploadCode(path, name, dir);
    console.log('upload demo success!: ', [...dir], name);
  });
}

async function uploadExample() {
  // step1: get all of case info in target folder
  const targetCaseId = await getCaseInfo();
  console.log('targetCaseId ready', targetCaseId);
  // step2: delete duplicate name case in target folder with id
  await deleteCase(targetCaseId); 
  console.log('all duplicate case deleted');
  // step3: upload demo
  await uploadDemo();
  console.log('all demo upload');
}

uploadExample();
