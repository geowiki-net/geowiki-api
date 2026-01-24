const packageInfo = require('../version.json')

module.exports = class FormatterGeoJson {
  constructor (overpass) {
    this.overpass = overpass

    this.result = {
      type: 'FeatureCollection',
      generator: packageInfo.name + ' ' + packageInfo.version,
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
    this.result = { ...this.result, ...this.overpass.meta }
    return this.result
  }
}
