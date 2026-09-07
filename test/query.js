const fs = require('fs')
const assert = require('assert').strict
const async = require('async')
const deepEqualCheck = require('deep-equal-check').default

const conf = JSON.parse(fs.readFileSync('test/conf.json', 'utf8'));

const httpLoad = require('../src/httpLoad')
const OverpassFrontend = require('..')
const overpassFrontend = new OverpassFrontend(conf.url)

const queries = [
  {
    query: '[out:json];node[place];out;',
    clearCache: true,
    expectedSubRequests: 1,
  },
  {
    query: '[out:json];node[place];out;',
    expectedSubRequests: 0,
  },
  {
    query: '[out:json];node[amenity=restaurant];out;',
    expectedSubRequests: 1,
  },
  {
    query: '[out:json];node[amenity=restaurant];out;out count;way[highway=primary];out body;',
    expectedSubRequests: 1,
  },
  {
    query: '[out:json];way[building];out geom;',
    expectedSubRequests: 2,
  },
  {
    query: '[out:json];nwr[building];out geom;',
    expectedSubRequests: 1,
  },
  {
    query: '[out:json];(node[amenity=restaurant];nwr[building];);out ids;',
    expectedSubRequests: 0,
  },
  {
    query: '[out:json];(node[amenity=restaurant];nwr[building];);out meta;',
    clearCache: true,
    expectedSubRequests: 2,
  },
  {
    query: '[out:json];(node[amenity=restaurant];nwr[building];);out ids;out count;out meta;out count;out geom;',
    clearCache: true,
    expectedSubRequests: 2,
  },
]

describe('Overpass QL Queries - load expected data from Overpass API', function () {
  async.each(queries, (def, callback) => {
    it(def.query, function (done) {
      httpLoad(
        conf.url,
        null,
        def.query,
        (err, result) => {
          if (err) {
            def.expectError = true
            return done()
          }

          def.expected = result

          def.expectedElements = [{}]
          let block = 0
          def.expected.elements.forEach(el => {
            const id = el.type + '/' + el.id

            if (el.type === 'count') {
              //def.expectedElements[block].count = el
              block++
              def.expectedElements[block] = {}
            } else {
              def.expectedElements[block][id] = el
            }
          })

          def.expectedBlocks = block
          done()
        }
      )
    })
  })
})

Object.entries({
  'via-server': 'from server',
  'via-file': 'loaded from .osm file'
}).forEach(([mode, modeText]) => {
  describe('Overpass QL Queries - ' + modeText, function () {
    let overpassFrontend

    if (mode === 'via-server') {
      it('connect to server', function (done) {
        overpassFrontend = new OverpassFrontend(conf.url)
        done()
      })
    } else {
      it('wait until file is loaded', function (done) {
        this.timeout(20000)
        overpassFrontend = new OverpassFrontend('test/data.osm.bz2')
        overpassFrontend.once('load', () => done())
      })
    }

    async.each(queries, (def, callback) => {
      it(def.query, function (done) {
        let foundSubRequestCount = 0

        if (def.clearCache) {
          overpassFrontend.clearCache()
        }

        function compileListener (subRequest) {
          foundSubRequestCount++
        }

        const req = overpassFrontend.query(def.query, {}, (err, result) => {
          const errors = compareResults(def, result)

          if (errors) {
            assert.fail(errors.join('\n'))
          }
          //assert.deepEqual(def.expected, result)

          if (mode === 'via-server' && 'expectedSubRequests' in def) {
            assert.equal(foundSubRequestCount, def.expectedSubRequests, 'sub request count wrong')
          }

          req.off('subrequest-compile', compileListener)

          done()
        })

        req.on('subrequest-compile', compileListener)
      })
    })
  })
})

function compareResults (def, actual) {
  const errors = []

  let block = 0
  let done = {}
  actual.elements.forEach(el => {
    const id = el.type + '/' + el.id
    done[id] = true

    if (el.type === 'count') {
      Object.keys(def.expectedElements[block]).forEach(expId => {
        if (!(expId in done)) {
          errors.push('Expected element ' + expId + ' missing')
        }
      })

      block++
      done = {}
    } else if (id in def.expectedElements[block]) {
      if (!deepEqualCheck(el, def.expectedElements[block][id], { numberPrecision: 0.0000001 })) {
        assert.deepEqual(el, def.expectedElements[block][id], 'Items are not equal')
      }
    } else {
      errors.push('Unexpected element ' + id)
    }
  })

  Object.keys(def.expectedElements[block]).forEach(expId => {
    if (!(expId in done)) {
      errors.push('Expected element ' + expId + ' missing')
    }
  })

  if (block !== def.expectedBlocks) {
    errors.push('Wrong count of blocks: ' + block + ' ' + def.expectedBlocks)
  }

  return errors.length ? errors : null
}
