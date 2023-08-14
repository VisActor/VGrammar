/**
 * Usage:
 *  example command: node build-menu.js path="target directory" type="tutorial" -- build menu.json for target document
 *  arguments:
 *    path: target directory path
 *    type: markdown document type, tutorial or example.
 *          Title info will be read from the first line of tutorial document or the meta info of example document
 *
 *  target directory structure:
 *    entry:
 *      zh: xx.md / dir
 *      en: xx.md / dir
 */

const fs = require('fs');
const path = require('path');

// configs
const languages = ['zh', 'en'];
const ignores = ['README.md', 'readme.md', '.DS_Store'];

// arguments
const arguments = process.argv.slice(2);

let targetDirectory = path.resolve(__dirname);
// tutorial or example document
let type = 'tutorial';
for (const argument of arguments) {
  if (argument.startsWith('path=')) {
    targetDirectory = argument.split('path=')[1];
  } else if (argument.startsWith('type=')) {
    type = argument.split('type=')[1];
  }
}
const targetEntry = targetDirectory.split('/')[targetDirectory.split('/').length - 1];
console.log(`build target: ${targetEntry}`);

if (type !== 'tutorial' && type !== 'example') {
  console.error('Invalid parameter! Type must be "tutorial" or "example".');
  return;
}

const menu = {
  menu: targetEntry,
  children: []
};

function parseExampleMeta(meta) {
  const demoMeta = {
    title: '',
    keywords: '',
    category: '',
    group: '',
    cover: '',
    link: '',
    option: ''
  };
  const keys = Object.keys(demoMeta);
  const splitMeta = meta.trim().split('\n');
  for (const line of splitMeta) {
    if (line.indexOf(':') === -1) {
      continue;
    }
    const splitLine = line.trim().split(':');
    const key = splitLine[0].trim();
    const value = splitLine.slice(1).join(':').trim();
    if (value && value !== '' && keys.includes(key)) {
      demoMeta[key] = value;
    }
  }
  return demoMeta;
}

function readMarkdownMeta(directory) {
  try {
    const file = fs.readFileSync(directory, { encoding: 'utf-8' });
    if (type === 'tutorial') {
      const firstLine = file.split('\n')[0];
      if (firstLine.startsWith('#')) {
        return firstLine.split('# ')[1].trim();
      }
      return { title: firstLine.trim() };
    } else if (type === 'example') {
      const meta = file.split('---')[1];
      return parseExampleMeta(meta);
    }
  } catch (e) {
    console.log(`Error when reading file: ${directory}`, e);
    return '';
  }
}

function readDirectory(menuItem, menuPath, directory) {
  try {
    const dir = fs.readdirSync(directory);
    for (const itemPath of dir) {
      if (ignores.includes(itemPath)) {
        continue;
      }
      const itemFullPath = path.join(directory, itemPath);
      const stat = fs.statSync(itemFullPath);
      if (stat.isDirectory()) {
        const currentItem = {
          path: itemPath,
          title: {},
          children: []
        };
        // cannot get full language info from directory name, need to modify after by users
        for (const language of languages) {
          currentItem.title[language] = itemPath;
        }
        menuItem.children.push(currentItem);
        readDirectory(currentItem, itemPath, itemFullPath);
      } else {
        const currentItem = {
          path: itemPath.replace('.md', '').trim(),
          title: {}
        };
        for (const language of languages) {
          const meta = readMarkdownMeta(itemFullPath.replace(`/${languages[0]}/`, `/${language}/`));
          currentItem.title[language] = meta.title;
          if (type === 'example') {
            currentItem.meta = meta;
          }
        }
        menuItem.children.push(currentItem);
      }
    }
  } catch (e) {
    console.error(`Error when reading directory: ${directory}`, e);
  }
}

function readEntryDirectory() {
  try {
    const dir = fs.readdirSync(targetDirectory);
    if (!languages.every(language => dir.includes(language))) {
      console.error(`Invalid entry! Entry directory must contains: ${languages.join(',')}`);
    } else {
      // read documents based on languages[0]
      readDirectory(menu, '', path.join(targetDirectory, languages[0]));
    }
  } catch (e) {
    console.error('Invalid directory! Please make sure the entry directory exists.', e);
  }
}

function writeMenu(directory) {
  try {
    const result = JSON.stringify(menu, null, 2);
    const targetPath = path.join(directory, 'menu.json');
    fs.writeFileSync(targetPath, result, { encoding: 'utf8' });
  } catch (e) {
    console.error(`Error when writing menu to file: ${targetPath}`);
    return;
  }
}

readEntryDirectory(targetDirectory);
writeMenu(targetDirectory);

console.log(`Successfully generate menu file!`);
