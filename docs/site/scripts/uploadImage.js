const fs = require('fs');
const path = require('path');
const Tos = require('@byted-service/tos');

const pathDir = 'preview-image';

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

async function getMd(path, name, old, coverName) {
  return new Promise(resolve => {
    fs.readFile(path + '/' + name, 'utf8', (err, data) => {
      if (!data) {
        exitWithError('markdown content empty: ', path + '/' + name);
      }
      resolve(
        data.replace(
          `cover: http://tosv.byted.org/obj/bit-cloud/${old}`,
          `cover: http://tosv.byted.org/obj/bit-cloud/${coverName}`
        )
      );
    });
  });
}

function fillPath(name, dir, suffix) {
  return `./${pathDir}/${fillName(name, dir, suffix)}`;
}
function fillName(name, dir, suffix) {
  return [...dir, name.substr(0, name.indexOf('.md'))].join('-') + '.' + suffix;
}

async function replaceCover() {
  const root = path.join(__dirname);

  const options = {
    bucket: 'bit-cloud',
    // TOS 帐号“个人秘钥”和“Bucket专用秘钥” SDK调用方法介绍
    // 用【Bucket专用秘钥】accessKey
    signatureVersion: 'sign_plain',
    accessKey: 'KI2QXY1VYG24ENIZMACQ',

    idleTimeout: 60000, //(单位:毫秒) 设置为60秒; 如果不设置，默认值也是0秒，即:不超时 (Node.js版本>v13.x HTTP处理请求超时时间)
    reqTimeout: 10000, // (单位:毫秒) 设置为10秒; 如果不设置，默认值也是10秒(TOS处理请求超时时间)

    endpoints: 'tos-cn-north.byted.org' // 不依赖consul，将通过公司内网TLB进行路由客户请求
  };

  // 初始化 tosClient
  const tosClient = new Tos(options); // 初始化1次即可复用 (不要反复初始化)

  await readDirAsync(root, [], null, async (path, name, dir) => {
    if (!name.endsWith('md') || name === 'README.md') {
      return;
    }
    let suffix = 'png';
    if (!fs.existsSync(fillPath(name, dir, suffix))) {
      suffix = 'gif';
      if (!fs.existsSync(fillPath(name, dir, suffix))) {
        console.log(fillName(name, dir, 'md'), ' no preview');
        return;
      }
    }
    const fPath = root + '/preview-image/' + fillName(name, dir, suffix);
    const fTosUrl = 'vchart/preview/' + [...dir, name.substr(0, name.indexOf('.md')) + '.' + suffix].join('/');
    // console.log(path + '/' + name.substr(0, name.indexOf('.md')) + '.' + suffix);
    // console.log(fPath);
    // console.log(fTosUrl);
    // const oldName = fillName(name, dir, suffix);
    // const newMd = await getMd(path, name, oldName, fTosUrl);

    // 上传
    const rPut = await tosClient.uploadFile(fPath, fTosUrl);
    // 删除
    // const rDel = await tosClient.delete(fTosUrl);

    // fs.writeFileSync(path + '/' + name, newMd);
  });

  // 释放 tosClient
  tosClient.destroy(); // 最后释放资源 (初始化与destroy要成对匹配)
}
replaceCover();
