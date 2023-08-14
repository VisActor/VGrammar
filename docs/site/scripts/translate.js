/**
 * 用于本地调用GPT接口自动翻译文档
 * 
 * 原理:
 * 1. 为了避免GPT token限流，翻译前自动删除并保存```javascript livedemo```中包裹的内容，并在翻译后插入
 * 2. 为了增加翻译准确性和专业性，prompt中附加'可视化专家' 和 语法不要出现任何错误 的设定
 * 
 * 生成结果:
 * 翻译后的结果将会保存在 当前文件夹名 + '_translate'的文件夹下，路径保持一致
 * 
 * 使用方法：
 * 在需要翻译的本地文件夹下执行 node translate.js
 */
const fs = require('fs');
const nodePath = require('path');
const axios = require('axios');
const args = process.argv.slice(2);
const rootPath = args[0] ?? 'tutorials';

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

function createFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

async function _postToGPT(path, name, dir, root) {
  return new Promise(resolve => {
    fs.readFile(path + '/' + name, 'utf8', async (err, data) => {
      // step1: get tutorials content
      if (!data) {
        data = '';
        console.log('tutorials content empty: ', [...dir], name);
        exitWithError('translate tutorials fail in read file: ', path + '/' + name);
        return;
      }


      // step2:  delete livedemo
      const demoPattern = /```javascript livedemo([\s\S]*?)```/g;
      const markdownText = data.replace(demoPattern, '```javascript livedemo\n```')

      // step3: record demoCodeBlocks
      const demoCodeBlocks = [];
      let match;
      while ((match = demoPattern.exec(data)) !== null) {
        demoCodeBlocks.push(match[0]);
      }

      // step4: define prompt
      const prompt = '请帮我翻译下列文件 中文翻译成英文 保留markdown格式 javascript livedemo内的内容不翻译 文件内容如下：' + markdownText

      console.log('start post to gpt: ', [...dir], name);
      
      // step5: request to GPT with tutorials content
      await axios({
        method: 'post',
        url: 'https://search.bytedance.net/gpt/openapi/offline/v2/crawl?ak=VCI9ME8CRUfhhB31KwerODNJ90oty3TM',
        headers: {
          'Content-Type': 'application/json' 
        },
        data: {
          "messages": [{
              "role": "system",
              "content": "你是一个前端可视化图表库文档翻译专家，能够将用户输入的markdown格式的文档翻译成英文。\n你必须遵循以下几点要求：\n1. 将翻译结果以markdown格式输出\n2. 翻译结果尽可能准确，不要有任何语法错误\n3. 以```包裹的内容不做任何处理，不要进行翻译'"
              // "content": '请帮我翻译用户给出的markdown格式的内容，中文翻译成英文，保留markdown格式 ```javascript livedemo```内的内容不翻译',
          }, {
            role: 'user',
            // content: '你好'
            content: prompt
          }],

          "model": "gpt-4",  // 对应模型名称，必填
          "max_tokens": 2000,
          "temperature": 1,
          "top_p": 1,
          "logit_bias": {},
          "n": 1,
          "stream": false
        }
      })
      .then(response => {
        if (response.status === 200) {

          // save to file
          const targetFolder = root + '_translate/'  + dir.join('/') + '/'

          // step1: create target folder（if not exist）
          createFolder(targetFolder);
          // step2: process translate content: add demo blocks
          const lineBreak = process.platform === 'win32' ? '\r\n' : '\n';

          // step3: add demo to result
          const translateContent = response.data.choices[0].message.content;
          let matchIndex = -1;


          let translateContentAndDemo = translateContent.replace(demoPattern, (match) => {
              matchIndex++;
            return demoCodeBlocks[matchIndex];
          })
          const startText = '---';
          const gptStartIndex = translateContentAndDemo.indexOf(startText);

          if (gptStartIndex >= 0) {
            translateContentAndDemo = translateContentAndDemo.slice(gptStartIndex, translateContentAndDemo.length)
          }


          fs.writeFileSync(`${targetFolder}/${name}`, translateContentAndDemo.replace(/\n/g, lineBreak));

          // console.log('response have saved to ', `${targetFolder}/${name}`);
          
          resolve();
        } else {
          exitWithError('translate tutorials fail in path: ',  name);
        }
      })
      .catch(error => {
        exitWithError('translate tutorials fail in path: ', name, error);
      });
    });
  });
}


async function translateTutorials() {
  const root = nodePath.join(__dirname, rootPath);
  console.log('root', root)
  await readDirAsync(root, [], null, async (path, name, dir) => {
    if (!name.endsWith('md') || fs.existsSync(nodePath.resolve(__dirname, `./${rootPath}_translate/${dir && dir.length ?  dir.join('/') : ''}/${name}`))) {
      return;
    }
    await _postToGPT(path, name, dir, root);
    console.log('translate tutorials success!: ', [...dir], name);
  });
}

translateTutorials();
