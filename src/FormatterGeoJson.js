const packageInfo = require('../version.json')

const generator = packageInfo.name + ' ' + packageInfo.version

module.exports = class FormatterGeoJson {
  constructor (overpass) {
    this.overpass = overpass

    this.result = {
      type: 'FeatureCollection',
      generator: '',
      ...this.overpass.meta,
      features: []
    }
    delete this.result.bounds
  }

  setBounds (bounds) {
    this.result.bounds = { ...bounds }
  }

  pushFeature (ob, outOptions) {
    this.result.features.push(ob.GeoJSON(outOptions))
  }

  formatFeature (ob, outOptions) {
    return ob.GeoJSON(outOptions)
  }

  pushCount (counts) {
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
