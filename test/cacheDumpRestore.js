const fs = require('fs')
const conf = JSON.parse(fs.readFileSync('test/conf.json', 'utf8'));

if (!conf.generator) {
  console.error('Set correct "generator" string in test/conf.json!')
  process.exit(0)
}

const assert = require('assert')
const async = require('async')

const OverpassFrontend = require('../src/OverpassFrontend')
const overpassFrontend = new OverpassFrontend(conf.url)
const restoredFrontend = new OverpassFrontend(conf.url)
let cache
let resultingObjects = {}

describe('Test cache dump and restore', function() {
  it('Load some data into the cache', function (done) {
    const req = overpassFrontend.BBoxQuery(
      "(node[amenity=restaurant];nwr[building];)",
      {
	"minlat": 48.19813,
	"minlon": 16.33798,
	"maxlat": 48.20045,
	"maxlon": 16.34023,
      },
      {
        properties: OverpassFrontend.GEOM | OverpassFrontend.MEMBERS | OverpassFrontend.META
      },
      function (err, result) {
        resultingObjects[result.id] = result.GeoJSON()
      },
      function (err) {
        assert.equal(err, null)
        done(err)
      }
    )
  })

  it('Retrieve cache dump', function (done) {
    cache = JSON.stringify(overpassFrontend.cacheDump())
    // console.log(cache)
    fs.writeFileSync('/tmp/cache.json', cache)

    done()
  })

  it('Restore cache dump to new OverpassFrontend', function (done) {
    restoredFrontend.cacheRestore(JSON.parse(cache))

    done()
  })

  it('Load data in same bbox (restaurants) - check result', function (done) {
    var expectedSubRequestCount = 0 // it's in the cache, so no query required
    var expected = ['n442972880', 'n442542985']
    var found = []
    var foundSubRequestCount = 0
    var error = ''

    function compileListener (subRequest) {
      foundSubRequestCount++
    }

    const request = restoredFrontend.BBoxQuery(
      "node[amenity=restaurant]",
      {
	"minlat": 48.19813,
	"minlon": 16.33798,
	"maxlat": 48.20045,
	"maxlon": 16.34023,
      },
      {
        properties: OverpassFrontend.GEOM | OverpassFrontend.MEMBERS
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }

        assert.deepEqual(result.GeoJSON(), resultingObjects[result.id], 'Cache object should equal original object')
      },
      function (err) {
        request.off('subrequest-compile', compileListener)

        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')
        assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')

        done()
      }
    )

    request.on('subrequest-compile', compileListener)
  })

  it('Load data in same bbox (buildings) - check result', function (done) {
    var expectedSubRequestCount = 0 // it's in the cache, so no query required
    var expected = ['w173478235', 'w174711686', 'w314245157', 'w314245164', 'w86273627',  'w247954703', 'w314245171', 'w86273639',  'w172236247', 'w172236259', 'w174711685', 'w174711687', 'w174711688', 'w174711689', 'w174711690', 'w174711691', 'w174711692', 'w174711693', 'w174711694', 'w174711695', 'w175757153', 'w175757154', 'w175757161', 'w175757162', 'w175757163', 'w175757164', 'w175757172', 'w175757173', 'w175757174', 'w175757175', 'w125586430', 'r1283879', 'r2293454', 'r2293455', 'r2293456', 'r2293460', 'r2334391', 'r2346549']
    var found = []
    var foundSubRequestCount = 0
    var error = ''

    function compileListener (subRequest) {
      foundSubRequestCount++
    }

    const request = restoredFrontend.BBoxQuery(
      "nwr[building]",
      {
	"minlat": 48.19813,
	"minlon": 16.33798,
	"maxlat": 48.20045,
	"maxlon": 16.34023,
      },
      {
        properties: OverpassFrontend.GEOM | OverpassFrontend.MEMBERS
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }

        assert.deepEqual(result.GeoJSON(), resultingObjects[result.id], 'Cache object should equal original object')
      },
      function (err) {
        request.off('subrequest-compile', compileListener)

        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')
        assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')

        done()
      }
    )

    request.on('subrequest-compile', compileListener)
  })
})
