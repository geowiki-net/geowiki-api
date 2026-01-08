const DOMParser = require('@xmldom/xmldom').DOMParser
const XMLSerializer = require('@xmldom/xmldom').XMLSerializer
const Request = require('./Request')
const Filter = require('./Filter')
const async = require('async')
const RequestBBox = require('./RequestBBox')
const BoundingBox = require('boundingbox')
const packageInfo = require('../version.json')

let domParser, xmlSerializer

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
      // err is always `null`, because it will call the finalCallback instead
      options.featureCallback = (err, ob) => fcb(ob) // eslint-disable-line
    } else {
      options.featureCallback = () => {}
    }

    super(overpass, options)
    this.type = 'query'

    if (options.query.match(/^s*\[/)) { // query starts with [ - indication for query options
      options.query = parseQueryOptions(options.query, options)
      this.options = { ...this.options, ...options }
    }

    if (this.options.bbox) {
      const keys = ['minlat', 'minlon', 'maxlat', 'maxlon']
      const values = this.options.bbox.split(',').map(v => parseFloat(v))
      this.options.bbox = Object.fromEntries(keys.map((key, i) => [key, values[i]]))
    }

    this.filter = new Filter(options.query)
    this.outStatements = this.filter.script.filter(stmt => stmt.constructor.name === 'OutStatement')

    this.requests = []
    this.elements = []

    this.inputSets = {}
    this.outStatements.forEach((stmt, index) => {
      const inputSet = stmt.inputSet

      if (!(inputSet.id in this.inputSets)) {
        this.inputSets[inputSet.id] = {
          statements: [],
          properties: 0,
          features: []
        }
      }

      this.inputSets[inputSet.id].statements.push(stmt)
      this.inputSets[inputSet.id].properties |= stmt.properties()
    })

    async.each(this.inputSets, (inputSet, done) => {
      const stmt = inputSet.statements[0]
      const queryOptions = { ...this.options }
      queryOptions.properties = inputSet.properties

      const data = {
        query: stmt.toQuery(),
        bounds: new BoundingBox(queryOptions.bbox),
        options: queryOptions,
        featureCallback: (err, ob) => {
          inputSet.features.push(ob)
          this.featureCallback(err, ob)
        },
        finalCallback: (err) => {
          if (err) {
            this.abort()
            return this.finish(err)
          }

          this.requests.splice(this.requests.indexOf(request), 1)

          if (!this.requests.length) {
            if (this.options.out === 'xml') {
              this.buildResultXml()
            } else {
              this.buildResultJson()
            }
            this.finish()
          }
        },
        doneFeatures: {}
      }

      const counts = inputSet.statements.map(stmt => stmt.count())
      if (!counts.includes(null)) {
        data.limit = Math.max(...counts)
      }

      const request = new RequestBBox(this.overpass, data)
      request.on('subrequest-compile', subRequest => this.emit('subrequest-compile', subRequest))
      this.requests.push(request)
      this.overpass.requests.push(request)
      done()
    }, (err) => {
      if (err) {
        this.abort()
        this.finish(err)
        return
      }

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

  buildResultJson () {
    this.result = {
      version: '0.6',
      generator: packageInfo.name + ' ' + packageInfo.version,
      ...this.overpass.meta,
      elements: []
    }

    delete this.result.bounds
    if (this.options.bbox) {
      this.result.bounds = { ...this.options.bbox }
    }

    this.outStatements.forEach(stmt => {
      const inputSet = this.inputSets[stmt.inputSet.id]
      const outOptions = stmt.outOptions()
      const count = stmt.count()

      let features = inputSet.features
      if (count) {
        features = features.slice(0, count)
      }
      const elements = features.map(ob => ob.outJson(outOptions))

      if (outOptions.count) {
        this.result.elements.push({
          type: 'count',
          id: 0,
          tags: countElements(elements)
        })
      } else {
        this.result.elements = this.result.elements.concat(elements)
      }
    })
  }

  buildResultXml () {
    if (!domParser) {
      domParser = new DOMParser({
        errorHandler: {
          error: (err) => { throw new Error('Error parsing XML file: ' + err) },
          fatalError: (err) => { throw new Error('Error parsing XML file: ' + err) }
        }
      })
      xmlSerializer = new XMLSerializer()
    }

    const xml = domParser.parseFromString('<xml>\n<osm/>\n</xml>', 'text/xml')
    const document = xml.ownerDocument

    const osm = document.getElementsByTagName('osm')[0]
    osm.setAttribute('version', '0.6')
    osm.setAttribute('generator', packageInfo.name + ' ' + packageInfo.version)

    Object.entries(this.overpass.meta).forEach(([k, v]) => {
      if (k !== 'bounds') {
        osm.setAttribute(k, v)
      }
    })

    if (this.options.bbox) {
      const blank = document.createTextNode('\n')
      osm.appendChild(blank)

      const bounds = new BoundingBox(this.options.bbox)
      const node = document.createElement('bounds')
      node.setAttribute('minlat', bounds.minlat.toFixed(7))
      node.setAttribute('minlon', bounds.minlon.toFixed(7))
      node.setAttribute('maxlat', bounds.maxlat.toFixed(7))
      node.setAttribute('maxlon', bounds.maxlon.toFixed(7))
      osm.appendChild(node)
    }

    let blank = document.createTextNode('\n')
    osm.appendChild(blank)

    this.outStatements.forEach(stmt => {
      const inputSet = this.inputSets[stmt.inputSet.id]
      const outOptions = stmt.outOptions()
      const count = stmt.count()

      let features = inputSet.features
      if (count) {
        features = features.slice(0, count)
      }

      if (outOptions.count) {
        const element = document.createElement('count')
        element.setAttribute('id', 0)

        Object.entries(countElements(features)).forEach(([type, c]) => {
          const blank = document.createTextNode('\n  ')
          element.appendChild(blank)

          const tag = document.createElement('tag')
          tag.setAttribute('k', type)
          tag.setAttribute('v', c)
          element.appendChild(tag)
        })

        let blank = document.createTextNode('\n')
        element.appendChild(blank)

        osm.appendChild(element)

        blank = document.createTextNode('\n')
        osm.appendChild(blank)
      } else {
        features.forEach(ob => {
          const element = ob.outXml(outOptions, document)
          osm.appendChild(element)

          const blank = document.createTextNode('\n')
          osm.appendChild(blank)
        })
      }
    })

    blank = document.createTextNode('\n')
    osm.appendChild(blank)

    this.result = xmlSerializer.serializeToString(xml)
  }
}

function parseQueryOptions (query, options) {
  const m = query.match(/^\s*\[([a-z]+):([^\]]+)\]\s*;?/)

  if (m) {
    query = query.substr(m[0].length)
    options[m[1].trim()] = m[2].trim()

    query = parseQueryOptions(query, options)
  }

  return query
}

function countElements (elements) {
  return {
    nodes: elements.filter(el => el.type === 'node').length.toString(),
    ways: elements.filter(el => el.type === 'way').length.toString(),
    relations: elements.filter(el => el.type === 'relation').length.toString(),
    total: elements.length.toString()
  }
}
