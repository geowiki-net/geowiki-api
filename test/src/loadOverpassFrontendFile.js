const OverpassFrontend = require('../..')

const all = {}

module.exports = function (file) {
  if (!(file in all)) {
    all[file] = new OverpassFrontend(file)
  }

  return all[file]
}
