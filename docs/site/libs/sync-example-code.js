const fs = require('fs');
const path = require('path');
const examplesDirectory = path.resolve(__dirname, '../assets/examples');

const updatedLang = 'zh';
const langs = ['zh', 'en'];

const extractCode = (md) => {
  const res =  /```javascript livedemo template=vgrammar([\s\S]+?)```/g.exec(md);

  return res ? res[0] : null;
}

const syncCode = (prevMd, updateCode) => {
  return prevMd.replace(/```javascript livedemo template=vgrammar([\s\S]+?)```/g, (match) => {
    return updateCode
  });
};


async function parseMenuItem(moduleName, menuItem, parentPath) {
  const fullPath = parentPath === '' ? menuItem.path : `${parentPath}/${menuItem.path}`;

  if (menuItem.children) {
    for (const childMenuItem of menuItem.children) {
      await parseMenuItem(moduleName, childMenuItem, fullPath);
    }
  } else {
    const updatePath = path.resolve(__dirname, `../assets/${moduleName}`, updatedLang, `${fullPath}.md`);
    const updateMd = fs.readFileSync(updatePath, { encoding: 'utf-8' });
    const updateCode = extractCode(updateMd);

    if (!updateCode) {
      console.log(`[Error] can't read code in ${updatePath}`)
      return;
    }
    langs.forEach(lang => {
      if (lang === updatedLang) { return; }
      const mdPath = path.resolve(__dirname, `../assets/${moduleName}`, lang, `${fullPath}.md`);
      const md = fs.readFileSync(mdPath, { encoding: 'utf-8' });
      const newMd = syncCode(md, updateCode);

      fs.writeFileSync(mdPath, newMd, { encoding: 'utf-8' })
    })
  }
}

function readMenu(moduleName) {
  const data = fs.readFileSync(path.resolve(__dirname, `../assets/${moduleName}`, 'menu.json'), { encoding: 'utf-8' });
  return JSON.parse(data);
}


async function syncExamples() {
  const menu = readMenu('examples');

  for (const menuItem of menu.children) {
    await parseMenuItem('examples', menuItem, '');
  }
}

syncExamples();