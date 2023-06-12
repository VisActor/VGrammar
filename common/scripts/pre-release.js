/**
 * prelease 
 */

const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function getPackageJson(pkgJsonPath) {
  const pkgJson = fs.readFileSync(pkgJsonPath, { encoding: 'utf-8' })
  return JSON.parse(pkgJson);
}


function run() {
  const preReleaseName = process.argv.slice(2)[0] || 'alpha'
  const cwd = process.cwd();

  if (typeof preReleaseName === 'string' && preReleaseName) {
    const preReleaseType = preReleaseName.includes('.') ? preReleaseName.split('.')[0] : 'alpha'; 

    spawnSync('sh', ['-c', `rush build --only tag:package`], {
      stdio: 'inherit',
      shell: false,
    });

    spawnSync('sh', ['-c', `rush publish --apply --prerelease-name ${preReleaseName} --partial-prerelease`], {
      stdio: 'inherit',
      shell: false,
    });

    spawnSync('sh', ['-c', `rush publish --publish --include-all --tag ${preReleaseType}`], {
      stdio: 'inherit',
      shell: false,
    });

    const rushJson = getPackageJson(`${cwd}/rush.json`)
    const package = rushJson.projects.find((project) => project.packageName === '@visactor/vgrammar');
    
    if (package) {
      const pkgJsonPath = path.resolve(package.projectFolder, 'package.json')
      const pkgJson = getPackageJson(pkgJsonPath)

      spawnSync('sh', ['-c', `git add --all`], {
        stdio: 'inherit',
        shell: false,
      });

      spawnSync('sh', ['-c', `git commit -m "build: prerelease version ${pkgJson.version}"`], {
        stdio: 'inherit',
        shell: false,
      });
    }
  }
}

run()

