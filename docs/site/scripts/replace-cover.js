const fs = require('fs');
const path = require('path');

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

async function getMd(path, name, coverName) {
  return new Promise(resolve => {
    fs.readFile(path + '/' + name, 'utf8', (err, data) => {
      if (!data) {
        exitWithError('markdown content empty: ', path + '/' + name);
      }

      const coverIndex = data.indexOf('cover:');
      const lastLineIndex = data.lastIndexOf('---');

      if (coverIndex >= 0 && lastLineIndex >= 0 && coverIndex < lastLineIndex) {
        resolve(data.replace(data.slice(coverIndex, lastLineIndex), `cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vgrammar/${coverName}
`))
      }

      resolve(data);
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
    const coverName = fillName(name, dir, suffix);
    // console.log(coverName);
    const newMd = await getMd(path, name, coverName);
    fs.writeFileSync(path + '/' + name, newMd);
  });
}
replaceCover();
