const packageInfo = require('../version.json')

module.exports = class FormatterObject {
  constructor (overpass) {
    this.overpass = overpass

    this.result = {
      generator: packageInfo.name + ' ' + packageInfo.version,
      ...this.overpass.meta,
      elements: []
    }
    delete this.result.bounds
  }

  setBounds (bounds) {
    this.result.bounds = { ...bounds }
  }

  pushFeature (ob, outOptions) {
    this.result.elements.push(ob)
  }

  formatFeature (ob, outOptions) {
    return ob
  }

  pushCount (counts) {
    this.result.elements.push({
      type: 'count',
      id: 0,
      tags: counts
    })
  }

  finalize () {
    this.result = { ...this.result, ...this.overpass.meta }
    return this.result
  }
}
