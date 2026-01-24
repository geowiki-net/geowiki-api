const packageInfo = require('../version.json')

const generator = packageInfo.name + ' ' + packageInfo.version

module.exports = class FormatterJson {
  constructor (overpass) {
    this.overpass = overpass

    this.result = {
      version: '0.6',
      generator: '',
      ...this.overpass.meta,
      elements: []
    }
    delete this.result.bounds
  }

  setBounds (bounds) {
    this.result.bounds = { ...bounds }
  }

  pushFeature (ob, outOptions) {
    this.result.elements.push(ob.outJson(outOptions))
  }

  formatFeature (ob, outOptions) {
    return ob.outJson(outOptions)
  }

  pushCount (counts) {
    this.result.elements.push({
      type: 'count',
      id: 0,
      tags: counts
    })
  }

  finalize () {
    const meta = this.overpass.meta ?? {}

    this.result = {
      ...this.result,
      ...meta,
      generator: (meta.generator ? meta.generator + ' via ' : '') + generator
    }

    return this.result
  }
}
