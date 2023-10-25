const fs = require('fs');
const path = require('path');
const examplesDirectory = path.resolve(__dirname, '../assets/examples');

const parseModules = ['api', 'guide'];
const langs = ['zh', 'en'];



const removePrevLiveDemo = (originalMd) => {
  const reg = /([ ]+?)```javascript livedemo template=vgrammar([\s\S]+?)```([ ]+?)/g;

  return originalMd.replace(reg, (match) => {
    return '';
  });

}


const appendExampleToDocument = (originalMd, lang) => {
  const reg = /<div[\s]+class="examples-ref-container"[\s]+id="([\w-_]+)"[\s]+data-path="([\w-_\/]+)">[\s]*<\/div>/g;
  const exampleCodeStart = '```javascript livedemo template=vgrammar'
  const exampleCodeEnd = '```';

  return originalMd.replace(reg, (match, id, path) => {
    if (path) {
      const example = fs.readFileSync(`${examplesDirectory}/${lang}/${path}.md`, 'utf8');
      const startIndex = example.indexOf(exampleCodeStart);
      const endIndex = startIndex >= 0 ? example.indexOf(exampleCodeEnd, startIndex + exampleCodeStart.length) : -1;


      if (startIndex >= 0 && endIndex >= 0) {
        const code = example.slice(startIndex, endIndex + exampleCodeEnd.length);

        if (code && code.length) {
          return `${match}

${code}`;
        }
      }
    }

    return '';
  })
};


async function parseMenuItem(moduleName, menuItem, parentPath) {
  const fullPath = parentPath === '' ? menuItem.path : `${parentPath}/${menuItem.path}`;

  if (menuItem.children) {
    for (const childMenuItem of menuItem.children) {
      await parseMenuItem(moduleName, childMenuItem, fullPath);
    }
  } else {
    langs.forEach(lang => {
      const mdPath = path.resolve(__dirname, `../assets/${moduleName}`, lang, `${fullPath}.md`);
      const md = fs.readFileSync(mdPath, { encoding: 'utf-8' });
      let newMd = removePrevLiveDemo(md);
      newMd = appendExampleToDocument(newMd, lang);

      fs.writeFileSync(mdPath, newMd, { encoding: 'utf-8' })
    })
  }
}

function readMenu(moduleName) {
  const data = fs.readFileSync(path.resolve(__dirname, `../assets/${moduleName}`, 'menu.json'), { encoding: 'utf-8' });
  return JSON.parse(data);
}

async function updateExampleReferenceOfModule(moduleName) {
  const menu = readMenu(moduleName);

  for (const menuItem of menu.children) {
    await parseMenuItem(moduleName, menuItem, '');
  }
}

async function updateExampleReference() {
  for (const moduleName of parseModules) {
    await updateExampleReferenceOfModule(moduleName);
  }

}

updateExampleReference();