const geojson2elements = require('./geojson2elements.js')

module.exports = {
  id: 'GeoJSON',

  willLoad (url, content, options) {
    return url.match(/\.geojson$/i)
  },

  load (content, options, callback) {
    const data = JSON.parse(content)

    const result = {
      version: 0.6,
      elements: []
    }

    try {
      geojson2elements(data, result.elements, options)
    } catch (e) {
      return callback(e)
    }

    callback(null, result)
  }
}
