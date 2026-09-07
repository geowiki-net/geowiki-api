var fs = require('fs')
var conf = JSON.parse(fs.readFileSync('test/conf.json', 'utf8'));
const packageInfo = require('../version.json')
const osmjsonMeta = {
  version: 0.6,
  generator: conf.generator + ' via ' + packageInfo.name + ' ' + packageInfo.version,
  osm3s: {},
  timestamp_osm_base: '',
  copyright: "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL."

}

if (!conf.generator) {
  console.error('Set correct "generator" string in test/conf.json!')
  process.exit(0)
}

var assert = require('assert')
var async = require('async')

var OverpassFrontend = require('..')
var overpassFrontend = new OverpassFrontend(conf.url)

describe('Overpass BBoxQuery - new "each" interface', function() {
  it('Simple queries - all nodes', function (done) {
    const expected = {
      items: [ 'n3037893169', 'n3037431649' ],
      result: {
        ...osmjsonMeta,
        bounds: { maxlat: 48.19852, maxlon: 16.33853, minlat: 48.19848, minlon: 16.33846 },
        elements: [
          { type: 'node', id: 3037431649, lat: 48.1985078, lon: 16.3384644 },
          { type: 'node', id: 3037893169, lat: 48.1984802, lon: 16.3384675, tags: { amenity: 'bench', backrest: 'yes', material: 'wood', source: 'survey' } }
        ]
      }
    }

    const parameters = {
      query: 'node',
      bbox: {
	"maxlat": 48.19852,
	"maxlon": 16.33853,
	"minlat": 48.19848,
	"minlon": 16.33846
      },
      options: {}
    }

    runTest(parameters, expected, done)
  })
})

function runTest (parameters, expected, callback) {
  var finalCalled = 0
  var found = []
  var error = ''

  var req = overpassFrontend.BBoxQuery(
    parameters.query,
    parameters.bbox,
    {
      ...parameters.options,
      each: function (result) {
        const id = result.type.substr(0, 1) + result.id
        found.push(id)

        if (expected.items.indexOf(id) === -1) {
          error += 'Unexpected result ' + id + '\n'
        }
      }
    },
    function (err, result) {
      assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
      if (err) {
        return callback(err)
      }

      if (error) {
        return callback(error)
      }

      if (found.length !== expected.items.length) {
        return callback('Wrong count of objects returned:\n' +
             'Expected: ' + expected.items.join(', ') + '\n' +
             'Found: ' + found.join(', '))
      }

      assert.equal(req.count, expected.items.length, 'Expected ' + expected.items.length + ' results')

      assert.deepEqual(result, expected.result)

      callback()
    }
  )
}

