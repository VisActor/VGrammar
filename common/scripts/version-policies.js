
const fs = require('fs')
const path = require('path')

const readVersionPolicies = (
) => {
  const filePath = path.join(__dirname, '../config/rush/version-policies.json');
  return JSON.parse(fs.readFileSync(filePath).toString())
}

const parseNextBumpFromVersion = (
  versionString
) => {
  if (versionString.indexOf('.0.0') > 0) {
    return 'major';
  }

  if (versionString.indexOf('.0') > 0) {
    return 'minor';
  }

  return 'patch'
}

const writeNextBump = (
  nextBump,
) => {
  const json = readVersionPolicies();
  console.log(json)
  const curNextBump = json[0].nextBump

  if (nextBump !== curNextBump) {
    json[0].nextBump = nextBump;
    fs.writeFileSync(path.join(__dirname, '../config/rush/version-policies.json'), JSON.stringify(json))
  }
}

const readNextBumpFromChanges = () => {
 const filenames = fs.readdirSync(path.join(__dirname, '../changes/@visactor/vgrammar'));

 if (filenames && filenames.length) {
  const changeType = [];

  filenames.forEach(fileName => {
    const json = JSON.parse(fs.readFileSync(fileName).toString());

    if (json.changes && json.changes.length) {
      json.changes.forEach(change => {
        if (change.type && !changeType.includes(change.type)) {
          changeType.push(change.type);
        }
      })
    }
  });

  return changeType.includes('major') ? 'major' : changeType.includes('minor') ? 'minor' : 'patch';
 } else {
  process.exit(1);
 }
}

const checkAndUpdateNextBump = (isPre, version) => {
  if (isPre) {
    writeNextBump('prerelease');
  } else if (version) {
    writeNextBump(parseNextBumpFromVersion(version));
  } else {
    writeNextBump(readNextBumpFromChanges());
  }
}

module.exports = checkAndUpdateNextBump;
