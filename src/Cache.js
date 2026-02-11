const LokiJS = require('lokijs')

const timestamp = require('./timestamp')
const BBoxQueryCache = require('./BBoxQueryCache')

module.exports = class Cache {
  constructor (options = {}) {
    const db = new LokiJS()
    this.db = db.addCollection('osm', { unique: ['id'] })
    this.bboxQueryCache = new BBoxQueryCache(this)

    this.clear()
  }

  clear () {
    this.elements = {}
    this.elementsMemberOf = {}
    this.updateTimestamp()
    this.db.clear()
    this.bboxQueryCache.clear()

    // Set default properties
    this.hasStretchLon180 = false
  }

  updateTimestamp () {
    this.timestamp = timestamp()
  }
}
