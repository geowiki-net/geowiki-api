const fs = require('fs')
const package = require('./package.json')

const content = {
  name: package.name,
  version: package.version
}

fs.writeFileSync('version.json', JSON.stringify(content, null, '  '))
