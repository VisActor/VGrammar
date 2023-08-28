const writePrereleaseVersion = require('./set-prelease-version');
const checkAndUpdateNextBump = require('./version-policies');


function run() {
  const preReleaseName = process.argv.slice(2)[0];
  const nextBump = checkAndUpdateNextBump(false);

  writePrereleaseVersion(preReleaseName, nextBump);  
}

run()