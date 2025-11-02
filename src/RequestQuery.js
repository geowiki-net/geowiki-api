const Request = require('./Request')
const Filter = require('./Filter')
const async = require('async')
const RequestBBox = require('./RequestBBox')
const BoundingBox = require('boundingbox')

/**
 * A query request
 * @extends Request
 */
module.exports = class RequestQuery extends Request {
  /**
   * @param {OverpassFrontend} overpass
   * @param {string} query
   * @param {object} [options]
   * @parma {function} callback
   */
  constructor (overpass, query, options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = {}
    }

    options.query = query
    options.finalCallback = callback
    if (options.featureCallback) {
      const fcb = options.featureCallback
      options.featureCallback = (err, ob) => fcb(ob)
    } else {
      options.featureCallback = () => {}
    }

    super(overpass, options)
    this.type = 'query'

    this.filter = new Filter(options.query)
    const outStatements = this.filter.script.filter(stmt => stmt.constructor.name === 'OutStatement')

    this.requests = []
    this.elements = []
    async.eachOf(outStatements, (stmt, index, done) => {
      const queryOptions = { ...options }
      queryOptions.properties = 63 // TODO, get from out statement
      this.elements.push([])
      let request

      const data = {
        query: stmt.toQuery(),
        bounds: new BoundingBox(null),
        options: queryOptions,
        featureCallback: (err, ob) => {
          this.elements[index].push(ob.out({}))
          this.featureCallback(err, ob)
        },
        finalCallback: (err) => {
          this.requests.splice(this.requests.indexOf(request), 1)

          if (!this.requests.length) {
            this.buildResult()
            this.finish()
          }
        },
        doneFeatures: {}
      }

      request = new RequestBBox(this.overpass, data)
      this.requests.push(request)
      this.overpass.requests.push(request)
      done()
    }, (err) => {
      this.overpass._next()
    })
  }

  /**
   * abort this request and sub requests
   */
  abort () {
    this.requests.forEach(req => req.abort())
    super.abort()
  }

  willInclude () {
    return false
  }

  preprocess () {
  }

  mayFinish () {
    return !this.requests.length
  }

  buildResult () {
    this.result = {
      elements: []
    }

    this.elements.forEach(elements => {
      this.result.elements = this.result.elements.concat(elements)
    })
    console.log(this.result)
  }
}
