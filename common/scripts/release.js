/**
 * prelease 
 */

const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function getPackageJson(pkgJsonPath) {
  const pkgJson = fs.readFileSync(pkgJsonPath, { encoding: 'utf-8' })
  return JSON.parse(pkgJson)
}


function run() {
  const cwd = process.cwd();

  spawnSync('sh', ['-c', `rush version --bump`], {
    stdio: 'inherit',
    shell: false,
  });

  spawnSync('sh', ['-c', `rush update`], {
    stdio: 'inherit',
    shell: false,
  });

  const rushJson = getPackageJson(`${cwd}/rush.json`);
  const package = rushJson.projects.find((project) => project.name === '@visactor/vgrammar');

  if (package) {
    const pkgJsonPath = path.resolve(project.projectFolder, 'package.json')
    const pkgJson = getPackageJson(pkgJsonPath)

    spawnSync('sh', ['-c', `git tag v${pkgJson.versopn}`], {
      stdio: 'inherit',
      shell: false,
    });

    spawnSync('sh', ['-c', 'rush publish --publish --include-all'], {
      stdio: 'inherit',
      shell: false,
    });

    spawnSync('sh', ['-c', `git add --all`], {
      stdio: 'inherit',
      shell: false,
    });

    spawnSync('sh', ['-c', `git commit -m "build: publish version ${pkgJson.version}"`], {
      stdio: 'inherit',
      shell: false,
    });

    spawnSync('sh', ['-c', `git push origin v${pkgJson.version}`], {
      stdio: 'inherit',
      shell: false,
    });
  }
}

run()

