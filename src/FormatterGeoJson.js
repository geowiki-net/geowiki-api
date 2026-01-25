const packageInfo = require('../version.json')

const generator = packageInfo.name + ' ' + packageInfo.version

module.exports = class FormatterGeoJson {
  constructor (overpass) {
    this.overpass = overpass

    this.result = {
      type: 'FeatureCollection',
      generator: '',
      features: []
    }
  }

  setBounds (bounds) {
    this.result.bbox = [bounds.minlon, bounds.minlat, bounds.maxlon, bounds.maxlat]
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
    const meta = { ...this.overpass.meta ?? {} }
    delete meta.bounds
    delete meta.version

    this.result = {
      ...this.result,
      ...meta,
      generator: (meta.generator ? meta.generator + ' via ' : '') + generator
    }

    return this.result
  }
}
