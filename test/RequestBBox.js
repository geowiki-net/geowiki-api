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

describe('Overpass BBoxQuery', function() {
  it('Simple queries - all nodes', function (done) {
    var finalCalled = 0
    var expected = [ 'n3037893169', 'n3037431649' ]
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: { maxlat: 48.19852, maxlon: 16.33853, minlat: 48.19848, minlon: 16.33846 },
      elements: [
        { type: 'node', id: 3037431649, lat: 48.1985078, lon: 16.3384644 },
        { type: 'node', id: 3037893169, lat: 48.1984802, lon: 16.3384675, tags: { amenity: 'bench', backrest: 'yes', material: 'wood', source: 'survey' } }
      ]
    }
    var found = []
    var error = ''

    var req = overpassFrontend.BBoxQuery(
      "node",
      {
	"maxlat": 48.19852,
	"maxlon": 16.33853,
	"minlat": 48.19848,
	"minlon": 16.33846
      },
      {
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        assert.equal(req.count, expected.length, 'Expected ' + expected.length + ' results')

        assert.deepEqual(result, expectedFinal)

        done()
      }
    )
  })

  it('Simple queries - all nodes (outOptions "ids")', function (done) {
    overpassFrontend.clearCache()
    var finalCalled = 0
    var expected = [ 'n3037893169', 'n3037431649' ]
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: { maxlat: 48.19852, maxlon: 16.33853, minlat: 48.19848, minlon: 16.33846 },
      elements: [
        { type: 'node', id: 3037431649 },
        { type: 'node', id: 3037893169 }
      ]
    }
    var found = []
    var error = ''

    var req = overpassFrontend.BBoxQuery(
      "node",
      {
	"maxlat": 48.19852,
	"maxlon": 16.33853,
	"minlat": 48.19848,
	"minlon": 16.33846
      },
      {
        out: 'json',
        outOptions: 'ids'
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        assert.equal(req.count, expected.length, 'Expected ' + expected.length + ' results')

        assert.deepEqual(result, expectedFinal)

        done()
      }
    )
  })

  it('Simple queries - all nodes (outOptions "ids geom")', function (done) {
    var finalCalled = 0
    var expected = [ 'n3037893169', 'n3037431649' ]
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: { maxlat: 48.19852, maxlon: 16.33853, minlat: 48.19848, minlon: 16.33846 },
      elements: [
        { type: 'node', id: 3037431649, lat: 48.1985078, lon: 16.3384644 },
        { type: 'node', id: 3037893169, lat: 48.1984802, lon: 16.3384675 }
      ]
    }
    var found = []
    var error = ''

    var req = overpassFrontend.BBoxQuery(
      "node",
      {
	"maxlat": 48.19852,
	"maxlon": 16.33853,
	"minlat": 48.19848,
	"minlon": 16.33846
      },
      {
        out: 'json',
        outOptions: 'ids geom'
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        assert.equal(req.count, expected.length, 'Expected ' + expected.length + ' results')

        assert.deepEqual(result, expectedFinal)

        done()
      }
    )
  })

  it('Simple queries - all restaurants', function (done) {
    var finalCalled = 0
    var expected = [ 'n441576820', 'n442066582', 'n442972880', 'n1467109667', 'n355123976', 'n1955278832', 'n441576823', 'n2083468740', 'n2099023017', 'w369989037', 'w370577069' ]
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: {"minlon":16.335,"minlat":48.195,"maxlon":16.345,"maxlat":48.2},
      elements: [
        {"type":"node","id":441576820,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"6","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","cuisine":"chinese","name":"Zum Westbahnhof"},"lat":48.1980578,"lon":16.3371068},
        {"type":"node","id":442066582,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"5","addr:postcode":"1150","addr:street":"Gerstnerstraße","amenity":"restaurant","cuisine":"chinese","name":"Tsing Tao","website":"www.tsingtao-vienna.com"},"lat":48.1956833,"lon":16.336853},
        {"type":"node","id":442972880,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"2","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","name":"Pulkautaler Weinhaus","phone":"+43 1 7898537","website":"www.pulkautaler-weinhaus.at","wheelchair":"no"},"lat":48.1983304,"lon":16.3380221},
        {"type":"node","id":1467109667,"tags":{"amenity":"restaurant","name":"Vienna Spezialitäten"},"lat":48.1952368,"lon":16.337205},
        {"type":"node","id":355123976,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"127","addr:postcode":"1060","addr:street":"Mariahilfer Straße","amenity":"restaurant","cuisine":"asian","name":"Yellow","website":"http://yellow.co.at","wheelchair":"yes"},"lat":48.1952219,"lon":16.3403939},
        {"type":"node","id":1955278832,"tags":{"addr:country":"AT","addr:housenumber":"29","addr:postcode":"1060","addr:street":"Bürgerspitalgasse","amenity":"restaurant","cuisine":"south_american","name":"Pa'ti ya!","website":"fb.me/patiyaenviena","wheelchair":"no"},"lat":48.1950584,"lon":16.3405197},
        {"type":"node","id":441576823,"tags":{"addr:city":"Wien","addr:housenumber":"15","addr:postcode":"1150","addr:street":"Löhrgasse","amenity":"restaurant","name":"Fuenfhauser Stueberl"},"lat":48.1995985,"lon":16.3366001},
        {"type":"node","id":2083468740,"tags":{"amenity":"restaurant","cuisine":"chinese","name":"Chinazentrum"},"lat":48.1988427,"lon":16.3412368},
        {"type":"node","id":2099023017,"tags":{"addr:housenumber":"5","addr:postcode":"1070","addr:street":"Stollgasse","amenity":"restaurant","cuisine":"italian","name":"Restaurante Fiore Pizzeria & Vegan"},"lat":48.198721,"lon":16.3416572},
        {"type":"way","id":369989037,"tags":{"amenity":"restaurant","indoor":"yes","layer":"1","level":"1","name":"Wiener Wald"},"nodes":[3966187466,3965914141,3966187471,3966187468,3966187466]},
        {"type":"way","id":370577069,"tags":{"amenity":"restaurant","indoor":"yes","layer":"-1","level":"-1","name":"Merkur Restaurant","wheelchair":"yes"},"nodes":[3966420036,3966420031,3966420030,3966420027,3966420028,3742742818,3966420039,3966420036]},
      ]
    }
    var found = []
    var error = ''

    var req = overpassFrontend.BBoxQuery(
      "(node[amenity=restaurant];way[amenity=restaurant];relation[amenity=restaurant];)",
      {
	"maxlat": 48.200,
	"maxlon": 16.345,
	"minlat": 48.195,
	"minlon": 16.335
      },
      {
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        assert.equal(req.count, expected.length, 'Expected ' + expected.length + ' results')

        assert.deepEqual(result, expectedFinal)

        done()
      }
    )
  })

  it('Bug: Query without results does not call finalCallback', function (done) {
    var expected = []
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: { maxlat: 48.19953, maxlon: 15.33506, minlat: 48.198, minlon: 15.32581 },
      elements: []
    }
    var expectedMembers = []
    var found = []
    var foundMembers = []
    var error = ''
    var bbox = {
	"maxlat": 48.19953,
	"maxlon": 15.33506,
	"minlat": 48.19800,
	"minlon": 15.32581,
      }

    var expectedSubRequestCount = 1
    var foundSubRequestCount = 0

    function compileListener (subRequest) {
      foundSubRequestCount++
    }

    var request = overpassFrontend.BBoxQuery(
      "relation[type=route][route=bicycle]",
      bbox,
      {
        "members": true,
        "properties": OverpassFrontend.TAGS | OverpassFrontend.MEMBERS,
        "memberProperties": OverpassFrontend.ALL,
        "memberBounds": bbox,
        "memberCallback": function (err, result) {
          foundMembers.push(result.id)

          if (expectedMembers.indexOf(result.id) === -1) {
            error += 'Unexpected member result ' + result.id + '\n'
          }
        }
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        if (foundMembers.length !== expectedMembers.length) {
          return done('Wrong count of member objects returned:\n' +
               'Expected: ' + expectedMembers.join(', ') + '\n' +
               'Found: ' + foundMembers.join(', '))
        }

        assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')
        assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')

        request.off('subrequest-compile', compileListener)

        assert.deepEqual(result, expectedFinal)

        done()
      }
    )

    request.on('subrequest-compile', compileListener)
  })
})

describe('Overpass BBoxQuery - with filter', function() {
  it('Simple queries - all restaurants with additional filter (has cuisine tag)', function (done) {
    overpassFrontend.clearCache()

    var expected = [ 'n441576820', 'n442066582', 'n355123976', 'n1955278832', 'n2083468740', 'n2099023017' ]
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: {"minlon":16.335,"minlat":48.195,"maxlon":16.345,"maxlat":48.2},
      elements: [
        {"type":"node","id":441576820,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"6","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","cuisine":"chinese","name":"Zum Westbahnhof"},"lat":48.1980578,"lon":16.3371068},
        {"type":"node","id":442066582,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"5","addr:postcode":"1150","addr:street":"Gerstnerstraße","amenity":"restaurant","cuisine":"chinese","name":"Tsing Tao","website":"www.tsingtao-vienna.com"},"lat":48.1956833,"lon":16.336853},
        {"type":"node","id":355123976,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"127","addr:postcode":"1060","addr:street":"Mariahilfer Straße","amenity":"restaurant","cuisine":"asian","name":"Yellow","website":"http://yellow.co.at","wheelchair":"yes"},"lat":48.1952219,"lon":16.3403939},
        {"type":"node","id":1955278832,"tags":{"addr:country":"AT","addr:housenumber":"29","addr:postcode":"1060","addr:street":"Bürgerspitalgasse","amenity":"restaurant","cuisine":"south_american","name":"Pa'ti ya!","website":"fb.me/patiyaenviena","wheelchair":"no"},"lat":48.1950584,"lon":16.3405197},
        {"type":"node","id":2083468740,"tags":{"amenity":"restaurant","cuisine":"chinese","name":"Chinazentrum"},"lat":48.1988427,"lon":16.3412368},
        {"type":"node","id":2099023017,"tags":{"addr:housenumber":"5","addr:postcode":"1070","addr:street":"Stollgasse","amenity":"restaurant","cuisine":"italian","name":"Restaurante Fiore Pizzeria & Vegan"},"lat":48.198721,"lon":16.3416572},
      ]
    }
    var found = []
    var error = ''

    var expectedSubRequestCount = 1
    var foundSubRequestCount = 0

    function compileListener (subRequest) {
      foundSubRequestCount++
    }

    var request = overpassFrontend.BBoxQuery(
      "(node[amenity=restaurant];way[amenity=restaurant];relation[amenity=restaurant];)",
      {
	"maxlat": 48.200,
	"maxlon": 16.345,
	"minlat": 48.195,
	"minlon": 16.335
      },
      {
        'filter': [
          {
            'key': 'cuisine',
            'op': 'has_key'
          }
        ]
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')
        assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')

        request.off('subrequest-compile', compileListener)

        assert.deepEqual(result, expectedFinal)

        done()
      }
    )

    request.on('subrequest-compile', compileListener)
  })

  it('Simple queries - all restaurants with additional filter (has cuisine tag) (fully cached)', function (done) {
    var expected = [ 'n441576820', 'n442066582', 'n355123976', 'n1955278832', 'n2083468740', 'n2099023017' ]
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: {"minlon":16.335,"minlat":48.195,"maxlon":16.345,"maxlat":48.2},
      elements: [
        {"type":"node","id":441576820,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"6","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","cuisine":"chinese","name":"Zum Westbahnhof"},"lat":48.1980578,"lon":16.3371068},
        {"type":"node","id":442066582,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"5","addr:postcode":"1150","addr:street":"Gerstnerstraße","amenity":"restaurant","cuisine":"chinese","name":"Tsing Tao","website":"www.tsingtao-vienna.com"},"lat":48.1956833,"lon":16.336853},
        {"type":"node","id":355123976,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"127","addr:postcode":"1060","addr:street":"Mariahilfer Straße","amenity":"restaurant","cuisine":"asian","name":"Yellow","website":"http://yellow.co.at","wheelchair":"yes"},"lat":48.1952219,"lon":16.3403939},
        {"type":"node","id":1955278832,"tags":{"addr:country":"AT","addr:housenumber":"29","addr:postcode":"1060","addr:street":"Bürgerspitalgasse","amenity":"restaurant","cuisine":"south_american","name":"Pa'ti ya!","website":"fb.me/patiyaenviena","wheelchair":"no"},"lat":48.1950584,"lon":16.3405197},
        {"type":"node","id":2083468740,"tags":{"amenity":"restaurant","cuisine":"chinese","name":"Chinazentrum"},"lat":48.1988427,"lon":16.3412368},
        {"type":"node","id":2099023017,"tags":{"addr:housenumber":"5","addr:postcode":"1070","addr:street":"Stollgasse","amenity":"restaurant","cuisine":"italian","name":"Restaurante Fiore Pizzeria & Vegan"},"lat":48.198721,"lon":16.3416572},
      ]
    }
    var found = []
    var error = ''

    var expectedSubRequestCount = 0
    var foundSubRequestCount = 0

    function compileListener (subRequest) {
      foundSubRequestCount++
    }

    var request = overpassFrontend.BBoxQuery(
      "(node[amenity=restaurant];way[amenity=restaurant];relation[amenity=restaurant];)",
      {
	"maxlat": 48.200,
	"maxlon": 16.345,
	"minlat": 48.195,
	"minlon": 16.335
      },
      {
        'filter': [
          {
            'key': 'cuisine',
            'op': 'has_key'
          }
        ]
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')
        assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')

        request.off('subrequest-compile', compileListener)

        assert.deepEqual(result, expectedFinal)

        done()
      }
    )

    request.on('subrequest-compile', compileListener)
  })

  it('Simple queries - all restaurants with additional filter (cuisine=chinese) (fully cached)', function (done) {
    var expected = [ 'n441576820', 'n442066582', 'n2083468740' ]
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: {"minlon":16.335,"minlat":48.195,"maxlon":16.345,"maxlat":48.2},
      elements: [
        {"type":"node","id":441576820,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"6","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","cuisine":"chinese","name":"Zum Westbahnhof"},"lat":48.1980578,"lon":16.3371068},
        {"type":"node","id":442066582,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"5","addr:postcode":"1150","addr:street":"Gerstnerstraße","amenity":"restaurant","cuisine":"chinese","name":"Tsing Tao","website":"www.tsingtao-vienna.com"},"lat":48.1956833,"lon":16.336853},
        {"type":"node","id":2083468740,"tags":{"amenity":"restaurant","cuisine":"chinese","name":"Chinazentrum"},"lat":48.1988427,"lon":16.3412368},
      ]
    }
    var found = []
    var error = ''

    var expectedSubRequestCount = 0
    var foundSubRequestCount = 0

    function compileListener (subRequest) {
      foundSubRequestCount++
    }

    var request = overpassFrontend.BBoxQuery(
      "(node[amenity=restaurant];way[amenity=restaurant];relation[amenity=restaurant];)",
      {
	"maxlat": 48.200,
	"maxlon": 16.345,
	"minlat": 48.195,
	"minlon": 16.335
      },
      {
        'filter': [
          {
            'key': 'cuisine',
            'op': '=',
            'value': 'chinese',
          }
        ]
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')
        assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')

        request.off('subrequest-compile', compileListener)

        assert.deepEqual(result, expectedFinal)

        done()
      }
    )

    request.on('subrequest-compile', compileListener)
  })

  it('Simple queries - all restaurants without additional filter (partly cached because of filter)', function (done) {
    var expected = [ 'n441576820', 'n442066582', 'n442972880', 'n1467109667', 'n355123976', 'n1955278832', 'n441576823', 'n2083468740', 'n2099023017', 'w369989037', 'w370577069' ]
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: {"minlon":16.335,"minlat":48.195,"maxlon":16.345,"maxlat":48.2},
      elements: [
        {"type":"node","id":441576820,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"6","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","cuisine":"chinese","name":"Zum Westbahnhof"},"lat":48.1980578,"lon":16.3371068},
        {"type":"node","id":442066582,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"5","addr:postcode":"1150","addr:street":"Gerstnerstraße","amenity":"restaurant","cuisine":"chinese","name":"Tsing Tao","website":"www.tsingtao-vienna.com"},"lat":48.1956833,"lon":16.336853},
        {"type":"node","id":355123976,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"127","addr:postcode":"1060","addr:street":"Mariahilfer Straße","amenity":"restaurant","cuisine":"asian","name":"Yellow","website":"http://yellow.co.at","wheelchair":"yes"},"lat":48.1952219,"lon":16.3403939},
        {"type":"node","id":1955278832,"tags":{"addr:country":"AT","addr:housenumber":"29","addr:postcode":"1060","addr:street":"Bürgerspitalgasse","amenity":"restaurant","cuisine":"south_american","name":"Pa'ti ya!","website":"fb.me/patiyaenviena","wheelchair":"no"},"lat":48.1950584,"lon":16.3405197},
        {"type":"node","id":2083468740,"tags":{"amenity":"restaurant","cuisine":"chinese","name":"Chinazentrum"},"lat":48.1988427,"lon":16.3412368},
        {"type":"node","id":2099023017,"tags":{"addr:housenumber":"5","addr:postcode":"1070","addr:street":"Stollgasse","amenity":"restaurant","cuisine":"italian","name":"Restaurante Fiore Pizzeria & Vegan"},"lat":48.198721,"lon":16.3416572},
        {"type":"node","id":442972880,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"2","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","name":"Pulkautaler Weinhaus","phone":"+43 1 7898537","website":"www.pulkautaler-weinhaus.at","wheelchair":"no"},"lat":48.1983304,"lon":16.3380221},
        {"type":"node","id":1467109667,"tags":{"amenity":"restaurant","name":"Vienna Spezialitäten"},"lat":48.1952368,"lon":16.337205},
        {"type":"node","id":441576823,"tags":{"addr:city":"Wien","addr:housenumber":"15","addr:postcode":"1150","addr:street":"Löhrgasse","amenity":"restaurant","name":"Fuenfhauser Stueberl"},"lat":48.1995985,"lon":16.3366001},
        {"type":"way","id":369989037,"tags":{"amenity":"restaurant","indoor":"yes","layer":"1","level":"1","name":"Wiener Wald"},"nodes":[3966187466,3965914141,3966187471,3966187468,3966187466]},
        {"type":"way","id":370577069,"tags":{"amenity":"restaurant","indoor":"yes","layer":"-1","level":"-1","name":"Merkur Restaurant","wheelchair":"yes"},"nodes":[3966420036,3966420031,3966420030,3966420027,3966420028,3742742818,3966420039,3966420036]},
      ]
    }
    var found = []
    var error = ''

    var expectedSubRequestCount = 1
    var foundSubRequestCount = 0

    function compileListener (subRequest) {
      foundSubRequestCount++
    }

    var request = overpassFrontend.BBoxQuery(
      "(node[amenity=restaurant];way[amenity=restaurant];relation[amenity=restaurant];)",
      {
	"maxlat": 48.200,
	"maxlon": 16.345,
	"minlat": 48.195,
	"minlon": 16.335
      },
      {},
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')
        assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')

        request.off('subrequest-compile', compileListener)

        assert.deepEqual(result, expectedFinal)

        done()
      }
    )

    request.on('subrequest-compile', compileListener)
  })

  it('Simple queries - all restaurants with additional filter (has cuisine tag; cached by previous full request)', function (done) {
    var expected = [ 'n441576820', 'n442066582', 'n355123976', 'n1955278832', 'n2083468740', 'n2099023017' ]
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: {"minlon":16.335,"minlat":48.195,"maxlon":16.345,"maxlat":48.2},
      elements: [
        {"type":"node","id":441576820,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"6","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","cuisine":"chinese","name":"Zum Westbahnhof"},"lat":48.1980578,"lon":16.3371068},
        {"type":"node","id":442066582,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"5","addr:postcode":"1150","addr:street":"Gerstnerstraße","amenity":"restaurant","cuisine":"chinese","name":"Tsing Tao","website":"www.tsingtao-vienna.com"},"lat":48.1956833,"lon":16.336853},
        {"type":"node","id":355123976,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"127","addr:postcode":"1060","addr:street":"Mariahilfer Straße","amenity":"restaurant","cuisine":"asian","name":"Yellow","website":"http://yellow.co.at","wheelchair":"yes"},"lat":48.1952219,"lon":16.3403939},
        {"type":"node","id":1955278832,"tags":{"addr:country":"AT","addr:housenumber":"29","addr:postcode":"1060","addr:street":"Bürgerspitalgasse","amenity":"restaurant","cuisine":"south_american","name":"Pa'ti ya!","website":"fb.me/patiyaenviena","wheelchair":"no"},"lat":48.1950584,"lon":16.3405197},
        {"type":"node","id":2083468740,"tags":{"amenity":"restaurant","cuisine":"chinese","name":"Chinazentrum"},"lat":48.1988427,"lon":16.3412368},
        {"type":"node","id":2099023017,"tags":{"addr:housenumber":"5","addr:postcode":"1070","addr:street":"Stollgasse","amenity":"restaurant","cuisine":"italian","name":"Restaurante Fiore Pizzeria & Vegan"},"lat":48.198721,"lon":16.3416572},
      ]
    }
    var found = []
    var error = ''

    var expectedSubRequestCount = 0
    var foundSubRequestCount = 0

    function compileListener (subRequest) {
      foundSubRequestCount++
    }

    var request = overpassFrontend.BBoxQuery(
      "(node[amenity=restaurant];way[amenity=restaurant];relation[amenity=restaurant];)",
      {
	"maxlat": 48.200,
	"maxlon": 16.345,
	"minlat": 48.195,
	"minlon": 16.335
      },
      {
        'filter': [
          {
            'key': 'cuisine',
            'op': 'has_key'
          }
        ]
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')
        assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')

        request.off('subrequest-compile', compileListener)

        assert.deepEqual(result, expectedFinal)

        done()
      }
    )

    request.on('subrequest-compile', compileListener)
 })

 describe('bbox query', function() {
    it('should return a list of node features', function(done) {
      var finalCalled = 0
      var found = []
      var expected = [ 'n3037893162', 'n3037893163', 'n3037893164' ]
      var expectedFinal = {
        ...osmjsonMeta,
        bounds: {"minlon":16.3384616,"minlat":48.1990347,"maxlon":16.3386118,"maxlat":48.1991437},
        elements: [
          {"type":"node","id":3037893162,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1991041,"lon":16.3385091},
          {"type":"node","id":3037893163,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1990879,"lon":16.3385273},
          {"type":"node","id":3037893164,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1990726,"lon":16.3385408},
        ]
      }
      var expectedSubRequestCount = 1
      var foundSubRequestCount = 0

      function compileListener (subrequest) {
        foundSubRequestCount++
      }

      var request = overpassFrontend.BBoxQuery(
        'node[amenity=bench];',
        {
          minlon: 16.3384616,
          minlat: 48.1990347,
          maxlon: 16.3386118,
          maxlat: 48.1991437
        },
        {
          properties: OverpassFrontend.TAGS
        },
        function(err, result, index) {
          found.push(result.id)

          if(expected.indexOf(result.id) == -1)
            assert.fail('Object ' + result.id + ' should not be found!')
        },
        function(err, result) {
          assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
          assert.equal(expected.length, found.length, 'Wrong count of objects found!')
          assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')
          assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')

          assert.deepEqual(result, expectedFinal)

          request.off('subrequest-compile', compileListener)
          done()
        }
      )

      request.on('subrequest-compile', compileListener)
    })

    it('should return a list of node features (2nd try, partly cached)', function(done) {
      return done() // disabled until https://github.com/Turfjs/turf/issues/1393 is fixed
      var finalCalled = 0
      var found = []
      var expected = [ 'n3037893162', 'n3037893163', 'n3037893164', 'n3037893159', 'n3037893160' ]
      var expectedFinal = {
        ...osmjsonMeta,
      }

      var expectedSubRequestCount = 0
      var foundSubRequestCount = 0

      function compileListener (subrequest) {
        foundSubRequestCount++
      }

      var request = overpassFrontend.BBoxQuery(
        'node[amenity=bench];',
        {
          minlon: 16.3382616,
          minlat: 48.1990347,
          maxlon: 16.3386118,
          maxlat: 48.1991437
        },
        {
          properties: OverpassFrontend.TAGS
        },
        function(err, result, index) {
          found.push(result.id)

          if(expected.indexOf(result.id) == -1)
            assert.fail('Object ' + result.id + ' should not be found!')
        },
        function(err, result) {

          printResult(result)
          assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
          assert.deepEqual(expected.sort(), found.sort(), 'Wrong count of objects found!')
          assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')
          assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')

          assert.deepEqual(result, expectedFinal)

          request.off('subrequest-compile', compileListener)
          done()
        }
      )

      request.on('subrequest-compile', compileListener)
    })

    it('should return a list of node features (3rd try, partly cached)', function(done) {
      var finalCalled = 0
      var found = []
      var expected = [ 'n3037893162', 'n3037893163', 'n3037893164' ]
      var expectedFinal = {
        ...osmjsonMeta,
        bounds: {"minlon":16.3384816,"minlat":48.1990547,"maxlon":16.3386018,"maxlat":48.1991237},
        elements: [
          {"type":"node","id":3037893162,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1991041,"lon":16.3385091},
          {"type":"node","id":3037893163,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1990879,"lon":16.3385273},
          {"type":"node","id":3037893164,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1990726,"lon":16.3385408},
        ]
      }
      var expectedSubRequestCount = 0
      var foundSubRequestCount = 0

      function compileListener (subrequest) {
        foundSubRequestCount++
      }

      var request = overpassFrontend.BBoxQuery(
        'node[amenity=bench];',
        {
          minlon: 16.3384816,
          minlat: 48.1990547,
          maxlon: 16.3386018,
          maxlat: 48.1991237
        },
        {
          properties: OverpassFrontend.TAGS
        },
        function(err, result, index) {
          found.push(result.id)

          if(expected.indexOf(result.id) == -1)
            assert.fail('Object ' + result.id + ' should not be found!')
        },
        function(err, result) {
          assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
          assert.equal(expected.length, found.length, 'Wrong count of objects found!')
          assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')
          assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')

          assert.deepEqual(result, expectedFinal)

          request.off('subrequest-compile', compileListener)
          done()
        }
      )

      request.on('subrequest-compile', compileListener)
    })

    it('should return a list of way features', function(done) {
      var finalCalled = 0
      var found = []
      var expected = [ 'w299709373' ]
      var expectedFinal = {
        ...osmjsonMeta,
        bounds: {"minlon":16.3384616,"minlat":48.1990347,"maxlon":16.3386118,"maxlat":48.1991437},
        elements: [
          {"type":"way","id":299709373,"tags":{"highway":"footway","name":"Emil-Maurer-Platz","source":"basemap.at"}},
        ]
      }
      var might = [ 'w299709375' ] // correct, if only bbox check is used

      var request = overpassFrontend.BBoxQuery(
        'way[highway=footway];',
        {
          minlon: 16.3384616,
          minlat: 48.1990347,
          maxlon: 16.3386118,
          maxlat: 48.1991437
        },
        {
          properties: OverpassFrontend.ID_ONLY
        },
        function(err, result, index) {
          if(expected.indexOf(result.id) === -1 &&
             might.indexOf(result.id) === -1) {
            assert.fail('Object ' + result.id + ' should not be found!')
          }

          if (expected.indexOf(result.id) !== -1) {
            found.push(result.id)
          }
        },
        function(err, result) {
          assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
          assert.equal(1, request.callCount, 'Server should be called once')
          assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')
          assert.equal(expected.length, found.length, 'Wrong count of objects found!')

          assert.deepEqual(result, expectedFinal)

          done()
        }
      )
    })

    it('should return a list of way features (2nd try, partly cached)', function(done) {
      return done() // disabled until https://github.com/Turfjs/turf/issues/1393 is fixed
      var finalCalled = 0
      var found = []
      var expected = [ 'w299709373' ]
      var expectedFinal = {
        ...osmjsonMeta,
      }
      var might = [ 'w299709375' ] // correct, if only bbox check is used

      var request = overpassFrontend.BBoxQuery(
        'way[highway=footway];',
        {
          minlon: 16.3382616,
          minlat: 48.1990347,
          maxlon: 16.3386118,
          maxlat: 48.1991437
        },
        {
          properties: OverpassFrontend.ID_ONLY
        },
        function(err, result, index) {
          if(expected.indexOf(result.id) === -1 &&
             might.indexOf(result.id) === -1) {
            assert.fail('Object ' + result.id + ' should not be found!')
          }

          if (expected.indexOf(result.id) !== -1) {
            found.push(result.id)
          }
        },
        function(err, result) {
          printOsmjsonResult(result)
          assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
          assert.equal(1, request.callCount, 'Server should be called once')
          assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')
          assert.equal(expected.length, found.length, 'Wrong count of objects found!')

          assert.deepEqual(result, expectedFinal)

          done()
        }
      )
    })

    it('should return a list of way features (3rd try, fully cached)', function(done) {
      return done() // disabled until https://github.com/Turfjs/turf/issues/1393 is fixed
      var finalCalled = 0
      var expectedFound = []
      var expected = [ 'w299709373' ]
      var expectedFinal = {
        ...osmjsonMeta,
      }
      var might = [ 'w299709375' ] // correct, if only bbox check is used

      var request = overpassFrontend.BBoxQuery(
        'way[highway=footway];',
        {
          minlon: 16.3384616,
          minlat: 48.1990347,
          maxlon: 16.3386118,
          maxlat: 48.1991437
        },
        {
          properties: OverpassFrontend.ID_ONLY
        },
        function(err, result, index) {
          if(expected.indexOf(result.id) !== -1)
            expectedFound.push(result.id)

          if(expected.indexOf(result.id) === -1 &&
             might.indexOf(result.id) === -1)
            assert.fail('Object ' + result.id + ' should not be found!')
        },
        function(err) {
          assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
          assert.equal(0, request.callCount, 'Server should be not be called (fully cached)')
          assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')
          if(expectedFound.length != expected.length)
            assert.fail('Wrong count of objects found!')

          assert.deepEqual(result, expectedFinal)

          done()
        }
      )
    })

    it('should return a list of way features, ordered by BBoxDiagonalLength', function(done) {
      var finalCalled = 0
      var found = []
      var expected = [ 'w243704615', 'w125586430', 'w313063294', 'w172236247' ]
      var expectedFinal = {
        ...osmjsonMeta,
        bounds: {"minlon":16.3375,"minlat":48.1995,"maxlon":16.3385,"maxlat":48.2005},
        elements: [
          {"type":"way","id":243704615,"tags":{"amenity":"shelter","building":"roof","shelter_type":"public_transport"}},
          {"type":"way","id":313063294,"tags":{"building":"yes"}},
          {"type":"way","id":172236247,"tags":{"building":"yes"}},
          {"type":"way","id":125586430,"tags":{"building":"yes","location":"indoor","name":"Unterwerk Goldschlagstraße","note":"für U6","power":"substation","substation":"traction","voltage":"20000"}},
        ]
      }

      var request = overpassFrontend.BBoxQuery(
        'way[building];',
        {
          minlon: 16.3375,
          minlat: 48.1995,
          maxlon: 16.3385,
          maxlat: 48.2005
        },
        {
          properties: OverpassFrontend.ID_ONLY,
          sort: 'BBoxDiagonalLength'
        },
        function(err, result, index) {
          found.push(result.id)

          if (expected.indexOf(result.id) === -1)
            assert.fail('Object ' + result.id + ' should not be found!')
        },
        function(err, result) {
          assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
          assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')
          if (found.length != expected.length)
            assert.fail('Wrong count of objects found!')

          assert.deepEqual(result, expectedFinal)

          done()
        }
      )
    })

    it('should return a list of node features (request splitted)', function(done) {
      var loadCount = 0
      var expectedLoadCount = 3
      overpassFrontend.on('load', function (osm3sMeta) {
        loadCount++
      })
      var finalCalled = 0
      var found = []
      var expected = [ 'n1853730762', 'n1853730763', 'n1853730777', 'n1853730779', 'n1853730785', 'n1853730792', 'n1853730797', 'n1853730821' ]
      var expectedFinal = {
        ...osmjsonMeta,
        bounds: {"minlon":16.3384,"minlat":48.199,"maxlon":16.3387,"maxlat":48.1993},
        elements: [
          {"type":"node","id":1853730762,"tags":{"denotation":"urban","natural":"tree"},"lat":48.1990272,"lon":16.3384872},
          {"type":"node","id":1853730763,"tags":{"denotation":"urban","natural":"tree"},"lat":48.1990361,"lon":16.3386686},
          {"type":"node","id":1853730777,"tags":{"denotation":"urban","natural":"tree"},"lat":48.1990876,"lon":16.3386472},
          {"type":"node","id":1853730779,"tags":{"denotation":"urban","natural":"tree"},"lat":48.1991045,"lon":16.3384538},
          {"type":"node","id":1853730785,"tags":{"denotation":"urban","natural":"tree"},"lat":48.199141,"lon":16.3386339},
          {"type":"node","id":1853730792,"tags":{"denotation":"urban","natural":"tree"},"lat":48.1991899,"lon":16.3384258},
          {"type":"node","id":1853730797,"tags":{"denotation":"urban","natural":"tree"},"lat":48.1991979,"lon":16.3386152},
          {"type":"node","id":1853730821,"tags":{"denotation":"urban","natural":"tree"},"lat":48.1992512,"lon":16.3385912},
        ]
      }
      var expectedSubRequestCount = 3
      var foundSubRequestCount = 0

      var req = overpassFrontend.BBoxQuery(
        'node[natural=tree];',
        {
          minlon: 16.3384,
          minlat: 48.1990,
          maxlon: 16.3387,
          maxlat: 48.1993
        },
        {
          properties: OverpassFrontend.ID_ONLY,
          split: 3
        },
        function(err, result, index) {
          found.push(result.id)

          if(expected.indexOf(result.id) == -1)
            assert.fail('Object ' + result.id + ' should not be found!')
        },
        function(err, result) {
          assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
          assert.deepEqual(expected.sort(), found.sort(), 'Wrong count of objects found!')
          assert.equal(req.count, expected.length, 'Expected ' + expected.length + ' results')
          assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of subrequests')
          assert.equal(loadCount, expectedLoadCount, 'Wrong count of load events')

          assert.deepEqual(result, expectedFinal)

          done()
        }
      )

      req.on('subrequest-finish', function (subRequest) {
        foundSubRequestCount++
      })
    })

    it('should handle simultaneous requests gracefully (overlapping area; partyly known; requests splitted)', function(done) {
      return done() // disabled until https://github.com/Turfjs/turf/issues/1393 is fixed
      var found1 = []
      var found2 = []
      var expected1 = [ 'n1853730762', 'n1853730763', 'n1853730777', 'n1853730779', 'n1853730785', 'n1853730792', 'n1853730797', 'n1853730821', 'n1853730767', 'n1853730778', 'n1853730787', 'n1853730801', 'n1853730774', 'n1853730788', 'n1853730816', 'n1853730828', 'n1853730831', 'n1853730842', 'n1853730843' ]
      var expected2 = [ 'n1853730762', 'n1853730763', 'n1853730777', 'n1853730779', 'n1853730785', 'n1853730792', 'n1853730797', 'n1853730821', 'n1853730767', 'n1853730778', 'n1853730787', 'n1853730801', 'n1853730774', 'n1853730788', 'n1853730816', 'n1853730828', 'n1853730831', 'n1853730842', 'n1853730843', 'n1853730825' ]
      var expected1Final = {
        ...osmjsonMeta,
      }
      var expected2Final = {
        ...osmjsonMeta,
      }

      async.parallel([
        function (callback) {
          var finalCalled = 0
          var req = overpassFrontend.BBoxQuery(
            'node[natural=tree];',
            {
              minlon: 16.3380,
              minlat: 48.1990,
              maxlon: 16.3387,
              maxlat: 48.1993
            },
            {
              properties: OverpassFrontend.ID_ONLY,
              split: 3
            },
            function(err, result, index) {
              found1.push(result.id)

              if(expected1.indexOf(result.id) == -1)
                assert.fail('(1) Object ' + result.id + ' should not be found!')
            },
            function(err, result) {
              assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
              assert.equal(req.count, expected.length, 'Expected ' + expected.length + ' results')
              assert.deepEqual(expected1.sort(), found1.sort(), '(1) Wrong count of objects found!')

              assert.deepEqual(result, expected1Final)

              callback()
            }
          )
        },
        function (callback) {
          var finalCalled = 0
          var req = overpassFrontend.BBoxQuery(
            'node[natural=tree];',
            {
              minlon: 16.3377,
              minlat: 48.1990,
              maxlon: 16.3387,
              maxlat: 48.1993
            },
            {
              properties: OverpassFrontend.ID_ONLY,
              split: 3
            },
            function(err, result, index) {
              found2.push(result.id)

              if(expected2.indexOf(result.id) == -1)
                assert.fail('(2) Object ' + result.id + ' should not be found!')
            },
            function(err, result) {
              assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
              assert.equal(req.count, expected.length, 'Expected ' + expected.length + ' results')
              assert.deepEqual(expected2.sort(), found2.sort(), '(2) Wrong count of objects found!')

              assert.deepEqual(result, expected2Final)

              callback()
            }
          )
        }
      ], function () {
        done()
      })
    })
  })
  describe('bbox query - key regexp', function() {
    it('key regexp matches (not cached)', function(done) {
      overpassFrontend.clearCache()
      var finalCalled = 0
      var found = []
      var expected = [ 'n3037893162', 'n3037893163', 'n3037893164' ]
      var expectedFinal = {
        ...osmjsonMeta,
        bounds: {"minlon":16.3384616,"minlat":48.1990347,"maxlon":16.3386118,"maxlat":48.1991437},
        elements: [
          {"type":"node","id":3037893162,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1991041,"lon":16.3385091},
          {"type":"node","id":3037893163,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1990879,"lon":16.3385273},
          {"type":"node","id":3037893164,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1990726,"lon":16.3385408},
        ]
      }
      var expectedSubRequestCount = 1
      var foundSubRequestCount = 0

      function compileListener (subrequest) {
        foundSubRequestCount++
      }

      var request = overpassFrontend.BBoxQuery(
        '(nwr[~"amenity"~"."];);',
        {
          minlon: 16.3384616,
          minlat: 48.1990347,
          maxlon: 16.3386118,
          maxlat: 48.1991437
        },
        {
          properties: OverpassFrontend.TAGS
        },
        function(err, result, index) {
          found.push(result.id)

          if(expected.indexOf(result.id) == -1)
            assert.fail('Object ' + result.id + ' should not be found!')
        },
        function(err, result) {
          assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
          assert.equal(expected.length, found.length, 'Wrong count of objects found!')
          assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')
          assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')

          assert.deepEqual(result, expectedFinal)

          request.off('subrequest-compile', compileListener)
          done()
        }
      )

      request.on('subrequest-compile', compileListener)
    })
    it('key regexp matches (fully cached)', function(done) {
      var finalCalled = 0
      var found = []
      var expected = [ 'n3037893162', 'n3037893163', 'n3037893164' ]
      var expectedFinal = {
        ...osmjsonMeta,
        bounds: {"minlon":16.3384616,"minlat":48.1990347,"maxlon":16.3386118,"maxlat":48.1991437},
        elements: [
          {"type":"node","id":3037893162,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1991041,"lon":16.3385091},
          {"type":"node","id":3037893163,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1990879,"lon":16.3385273},
          {"type":"node","id":3037893164,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1990726,"lon":16.3385408},
        ]
      }
      var expectedSubRequestCount = 0
      var foundSubRequestCount = 0

      function compileListener (subrequest) {
        foundSubRequestCount++
      }

      var request = overpassFrontend.BBoxQuery(
        '(nwr[~"amenity"~"."];);',
        {
          minlon: 16.3384616,
          minlat: 48.1990347,
          maxlon: 16.3386118,
          maxlat: 48.1991437
        },
        {
          properties: OverpassFrontend.TAGS
        },
        function(err, result, index) {
          found.push(result.id)

          if(expected.indexOf(result.id) == -1)
            assert.fail('Object ' + result.id + ' should not be found!')
        },
        function(err, result) {
          assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
          assert.equal(expected.length, found.length, 'Wrong count of objects found!')
          assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')
          assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')

          assert.deepEqual(result, expectedFinal)

          request.off('subrequest-compile', compileListener)
          done()
        }
      )

      request.on('subrequest-compile', compileListener)
    })
    it('key regexp matches (fully cached, different bbox)', function(done) {
      var finalCalled = 0
      var found = []
      var expected = [ 'n3037893162', 'n3037893163', 'n3037893164' ]
      var expectedFinal = {
        ...osmjsonMeta,
        bounds: {"minlon":16.3384716,"minlat":48.1990347,"maxlon":16.3386118,"maxlat":48.1991437},
        elements: [
          {"type":"node","id":3037893162,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1991041,"lon":16.3385091},
          {"type":"node","id":3037893163,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1990879,"lon":16.3385273},
          {"type":"node","id":3037893164,"tags":{"amenity":"bench","backrest":"yes","material":"wood","source":"survey"},"lat":48.1990726,"lon":16.3385408},
        ]
      }
      var expectedSubRequestCount = 0
      var foundSubRequestCount = 0

      function compileListener (subrequest) {
        foundSubRequestCount++
      }

      var request = overpassFrontend.BBoxQuery(
        '(nwr[~"amenity"~"."];);',
        {
          minlon: 16.3384716,
          minlat: 48.1990347,
          maxlon: 16.3386118,
          maxlat: 48.1991437
        },
        {
          properties: OverpassFrontend.TAGS
        },
        function(err, result, index) {
          found.push(result.id)

          if(expected.indexOf(result.id) == -1)
            assert.fail('Object ' + result.id + ' should not be found!')
        },
        function(err, result) {
          assert.equal(finalCalled++, 0, 'Final function called ' + finalCalled + ' times!')
          assert.equal(expected.length, found.length, 'Wrong count of objects found!')
          assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')
          assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')

          assert.deepEqual(result, expectedFinal)

          request.off('subrequest-compile', compileListener)
          done()
        }
      )

      request.on('subrequest-compile', compileListener)
    })
  })
})

describe('BBoxQuery - Consecutive queries with different properties', function () {
  it('clear cache', function () {
    overpassFrontend.clearCache()
  })

  it('first query', function (done) {
    var expected = ['n441576820', 'n442066582', 'n442972880', 'n1467109667', 'n355123976', 'n1955278832', 'n441576823', 'n2083468740', 'n2099023017', 'w369989037', 'w370577069']
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: {"minlon":16.335,"minlat":48.195,"maxlon":16.345,"maxlat":48.2},
      elements: [
        {"type":"node","id":441576820,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"6","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","cuisine":"chinese","name":"Zum Westbahnhof"},"lat":48.1980578,"lon":16.3371068},
        {"type":"node","id":442066582,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"5","addr:postcode":"1150","addr:street":"Gerstnerstraße","amenity":"restaurant","cuisine":"chinese","name":"Tsing Tao","website":"www.tsingtao-vienna.com"},"lat":48.1956833,"lon":16.336853},
        {"type":"node","id":442972880,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"2","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","name":"Pulkautaler Weinhaus","phone":"+43 1 7898537","website":"www.pulkautaler-weinhaus.at","wheelchair":"no"},"lat":48.1983304,"lon":16.3380221},
        {"type":"node","id":1467109667,"tags":{"amenity":"restaurant","name":"Vienna Spezialitäten"},"lat":48.1952368,"lon":16.337205},
        {"type":"node","id":355123976,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"127","addr:postcode":"1060","addr:street":"Mariahilfer Straße","amenity":"restaurant","cuisine":"asian","name":"Yellow","website":"http://yellow.co.at","wheelchair":"yes"},"lat":48.1952219,"lon":16.3403939},
        {"type":"node","id":1955278832,"tags":{"addr:country":"AT","addr:housenumber":"29","addr:postcode":"1060","addr:street":"Bürgerspitalgasse","amenity":"restaurant","cuisine":"south_american","name":"Pa'ti ya!","website":"fb.me/patiyaenviena","wheelchair":"no"},"lat":48.1950584,"lon":16.3405197},
        {"type":"node","id":441576823,"tags":{"addr:city":"Wien","addr:housenumber":"15","addr:postcode":"1150","addr:street":"Löhrgasse","amenity":"restaurant","name":"Fuenfhauser Stueberl"},"lat":48.1995985,"lon":16.3366001},
        {"type":"node","id":2083468740,"tags":{"amenity":"restaurant","cuisine":"chinese","name":"Chinazentrum"},"lat":48.1988427,"lon":16.3412368},
        {"type":"node","id":2099023017,"tags":{"addr:housenumber":"5","addr:postcode":"1070","addr:street":"Stollgasse","amenity":"restaurant","cuisine":"italian","name":"Restaurante Fiore Pizzeria & Vegan"},"lat":48.198721,"lon":16.3416572},
        {"type":"way","id":369989037,"tags":{"amenity":"restaurant","indoor":"yes","layer":"1","level":"1","name":"Wiener Wald"}},
        {"type":"way","id":370577069,"tags":{"amenity":"restaurant","indoor":"yes","layer":"-1","level":"-1","name":"Merkur Restaurant","wheelchair":"yes"}},
      ]
    }
    var found = []
    var error = ''

    var expectedSubRequestCount = 1
    var foundSubRequestCount = 0

    function compileListener (subRequest) {
      foundSubRequestCount++
    }

    var request = overpassFrontend.BBoxQuery(
      "nwr[amenity=restaurant]",
      {
        "maxlat": 48.200,
        "maxlon": 16.345,
        "minlat": 48.195,
        "minlon": 16.335
      },
      {
        properties: 0
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')
        assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')

        assert.deepEqual(result, expectedFinal)

        request.off('subrequest-compile', compileListener)

        done()
      }
    )

    request.on('subrequest-compile', compileListener)
  })

  it('second query (fully cached)', function (done) {
    var expected = ['n441576820', 'n442066582', 'n442972880', 'n1467109667', 'n355123976', 'n1955278832', 'n441576823', 'n2083468740', 'n2099023017', 'w369989037', 'w370577069']
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: {"minlon":16.335,"minlat":48.195,"maxlon":16.345,"maxlat":48.2},
      elements: [
        {"type":"node","id":441576820,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"6","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","cuisine":"chinese","name":"Zum Westbahnhof"},"lat":48.1980578,"lon":16.3371068},
        {"type":"node","id":442066582,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"5","addr:postcode":"1150","addr:street":"Gerstnerstraße","amenity":"restaurant","cuisine":"chinese","name":"Tsing Tao","website":"www.tsingtao-vienna.com"},"lat":48.1956833,"lon":16.336853},
        {"type":"node","id":442972880,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"2","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","name":"Pulkautaler Weinhaus","phone":"+43 1 7898537","website":"www.pulkautaler-weinhaus.at","wheelchair":"no"},"lat":48.1983304,"lon":16.3380221},
        {"type":"node","id":1467109667,"tags":{"amenity":"restaurant","name":"Vienna Spezialitäten"},"lat":48.1952368,"lon":16.337205},
        {"type":"node","id":355123976,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"127","addr:postcode":"1060","addr:street":"Mariahilfer Straße","amenity":"restaurant","cuisine":"asian","name":"Yellow","website":"http://yellow.co.at","wheelchair":"yes"},"lat":48.1952219,"lon":16.3403939},
        {"type":"node","id":1955278832,"tags":{"addr:country":"AT","addr:housenumber":"29","addr:postcode":"1060","addr:street":"Bürgerspitalgasse","amenity":"restaurant","cuisine":"south_american","name":"Pa'ti ya!","website":"fb.me/patiyaenviena","wheelchair":"no"},"lat":48.1950584,"lon":16.3405197},
        {"type":"node","id":441576823,"tags":{"addr:city":"Wien","addr:housenumber":"15","addr:postcode":"1150","addr:street":"Löhrgasse","amenity":"restaurant","name":"Fuenfhauser Stueberl"},"lat":48.1995985,"lon":16.3366001},
        {"type":"node","id":2083468740,"tags":{"amenity":"restaurant","cuisine":"chinese","name":"Chinazentrum"},"lat":48.1988427,"lon":16.3412368},
        {"type":"node","id":2099023017,"tags":{"addr:housenumber":"5","addr:postcode":"1070","addr:street":"Stollgasse","amenity":"restaurant","cuisine":"italian","name":"Restaurante Fiore Pizzeria & Vegan"},"lat":48.198721,"lon":16.3416572},
        {"type":"way","id":369989037,"tags":{"amenity":"restaurant","indoor":"yes","layer":"1","level":"1","name":"Wiener Wald"}},
        {"type":"way","id":370577069,"tags":{"amenity":"restaurant","indoor":"yes","layer":"-1","level":"-1","name":"Merkur Restaurant","wheelchair":"yes"}},
      ]
    }
    var found = []
    var error = ''

    var expectedSubRequestCount = 0
    var foundSubRequestCount = 0

    function compileListener (subRequest) {
      foundSubRequestCount++
    }

    var request = overpassFrontend.BBoxQuery(
      "nwr[amenity=restaurant]",
      {
        "maxlat": 48.200,
        "maxlon": 16.345,
        "minlat": 48.195,
        "minlon": 16.335
      },
      {
        properties: 0
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')
        assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')

        assert.deepEqual(result, expectedFinal)

        request.off('subrequest-compile', compileListener)

        done()
      }
    )

    request.on('subrequest-compile', compileListener)
  })

  it('second query (more properties)', function (done) {
    var expected = ['n441576820', 'n442066582', 'n442972880', 'n1467109667', 'n355123976', 'n1955278832', 'n441576823', 'n2083468740', 'n2099023017', 'w369989037', 'w370577069']
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: {"minlon":16.335,"minlat":48.195,"maxlon":16.345,"maxlat":48.2},
      elements: [
        {"type":"node","id":441576820,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"6","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","cuisine":"chinese","name":"Zum Westbahnhof"},"lat":48.1980578,"lon":16.3371068},
        {"type":"node","id":442066582,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"5","addr:postcode":"1150","addr:street":"Gerstnerstraße","amenity":"restaurant","cuisine":"chinese","name":"Tsing Tao","website":"www.tsingtao-vienna.com"},"lat":48.1956833,"lon":16.336853},
        {"type":"node","id":442972880,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"2","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","name":"Pulkautaler Weinhaus","phone":"+43 1 7898537","website":"www.pulkautaler-weinhaus.at","wheelchair":"no"},"lat":48.1983304,"lon":16.3380221},
        {"type":"node","id":1467109667,"tags":{"amenity":"restaurant","name":"Vienna Spezialitäten"},"lat":48.1952368,"lon":16.337205},
        {"type":"node","id":355123976,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"127","addr:postcode":"1060","addr:street":"Mariahilfer Straße","amenity":"restaurant","cuisine":"asian","name":"Yellow","website":"http://yellow.co.at","wheelchair":"yes"},"lat":48.1952219,"lon":16.3403939},
        {"type":"node","id":1955278832,"tags":{"addr:country":"AT","addr:housenumber":"29","addr:postcode":"1060","addr:street":"Bürgerspitalgasse","amenity":"restaurant","cuisine":"south_american","name":"Pa'ti ya!","website":"fb.me/patiyaenviena","wheelchair":"no"},"lat":48.1950584,"lon":16.3405197},
        {"type":"node","id":441576823,"tags":{"addr:city":"Wien","addr:housenumber":"15","addr:postcode":"1150","addr:street":"Löhrgasse","amenity":"restaurant","name":"Fuenfhauser Stueberl"},"lat":48.1995985,"lon":16.3366001},
        {"type":"node","id":2083468740,"tags":{"amenity":"restaurant","cuisine":"chinese","name":"Chinazentrum"},"lat":48.1988427,"lon":16.3412368},
        {"type":"node","id":2099023017,"tags":{"addr:housenumber":"5","addr:postcode":"1070","addr:street":"Stollgasse","amenity":"restaurant","cuisine":"italian","name":"Restaurante Fiore Pizzeria & Vegan"},"lat":48.198721,"lon":16.3416572},
        {"type":"way","id":369989037,"tags":{"amenity":"restaurant","indoor":"yes","layer":"1","level":"1","name":"Wiener Wald"},"nodes":[3966187466,3965914141,3966187471,3966187468,3966187466]},
        {"type":"way","id":370577069,"tags":{"amenity":"restaurant","indoor":"yes","layer":"-1","level":"-1","name":"Merkur Restaurant","wheelchair":"yes"},"nodes":[3966420036,3966420031,3966420030,3966420027,3966420028,3742742818,3966420039,3966420036]},
      ]
    }
    var found = []
    var error = ''

    var expectedSubRequestCount = 1
    var foundSubRequestCount = 0

    function compileListener (subRequest) {
      foundSubRequestCount++
    }

    var request = overpassFrontend.BBoxQuery(
      "nwr[amenity=restaurant]",
      {
        "maxlat": 48.200,
        "maxlon": 16.345,
        "minlat": 48.195,
        "minlon": 16.335
      },
      {
        properties: OverpassFrontend.META
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')
        assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')

        assert.deepEqual(result, expectedFinal)

        request.off('subrequest-compile', compileListener)

        done()
      }
    )

    request.on('subrequest-compile', compileListener)
  })

  it('clear cache', function () {
    overpassFrontend.clearCache()
  })

  it('first query (with more properties)', function (done) {
    var expected = ['n441576820', 'n442066582', 'n442972880', 'n1467109667', 'n355123976', 'n1955278832', 'n441576823', 'n2083468740', 'n2099023017', 'w369989037', 'w370577069']
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: {"minlon":16.335,"minlat":48.195,"maxlon":16.345,"maxlat":48.2},
      elements: [
        {"type":"node","id":441576820,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"6","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","cuisine":"chinese","name":"Zum Westbahnhof"},"lat":48.1980578,"lon":16.3371068},
        {"type":"node","id":442066582,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"5","addr:postcode":"1150","addr:street":"Gerstnerstraße","amenity":"restaurant","cuisine":"chinese","name":"Tsing Tao","website":"www.tsingtao-vienna.com"},"lat":48.1956833,"lon":16.336853},
        {"type":"node","id":442972880,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"2","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","name":"Pulkautaler Weinhaus","phone":"+43 1 7898537","website":"www.pulkautaler-weinhaus.at","wheelchair":"no"},"lat":48.1983304,"lon":16.3380221},
        {"type":"node","id":1467109667,"tags":{"amenity":"restaurant","name":"Vienna Spezialitäten"},"lat":48.1952368,"lon":16.337205},
        {"type":"node","id":355123976,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"127","addr:postcode":"1060","addr:street":"Mariahilfer Straße","amenity":"restaurant","cuisine":"asian","name":"Yellow","website":"http://yellow.co.at","wheelchair":"yes"},"lat":48.1952219,"lon":16.3403939},
        {"type":"node","id":1955278832,"tags":{"addr:country":"AT","addr:housenumber":"29","addr:postcode":"1060","addr:street":"Bürgerspitalgasse","amenity":"restaurant","cuisine":"south_american","name":"Pa'ti ya!","website":"fb.me/patiyaenviena","wheelchair":"no"},"lat":48.1950584,"lon":16.3405197},
        {"type":"node","id":441576823,"tags":{"addr:city":"Wien","addr:housenumber":"15","addr:postcode":"1150","addr:street":"Löhrgasse","amenity":"restaurant","name":"Fuenfhauser Stueberl"},"lat":48.1995985,"lon":16.3366001},
        {"type":"node","id":2083468740,"tags":{"amenity":"restaurant","cuisine":"chinese","name":"Chinazentrum"},"lat":48.1988427,"lon":16.3412368},
        {"type":"node","id":2099023017,"tags":{"addr:housenumber":"5","addr:postcode":"1070","addr:street":"Stollgasse","amenity":"restaurant","cuisine":"italian","name":"Restaurante Fiore Pizzeria & Vegan"},"lat":48.198721,"lon":16.3416572},
        {"type":"way","id":369989037,"tags":{"amenity":"restaurant","indoor":"yes","layer":"1","level":"1","name":"Wiener Wald"},"nodes":[3966187466,3965914141,3966187471,3966187468,3966187466]},
        {"type":"way","id":370577069,"tags":{"amenity":"restaurant","indoor":"yes","layer":"-1","level":"-1","name":"Merkur Restaurant","wheelchair":"yes"},"nodes":[3966420036,3966420031,3966420030,3966420027,3966420028,3742742818,3966420039,3966420036]},
      ]
    }
    var found = []
    var error = ''

    var expectedSubRequestCount = 1
    var foundSubRequestCount = 0

    function compileListener (subRequest) {
      foundSubRequestCount++
    }

    var request = overpassFrontend.BBoxQuery(
      "nwr[amenity=restaurant]",
      {
        "maxlat": 48.200,
        "maxlon": 16.345,
        "minlat": 48.195,
        "minlon": 16.335
      },
      {
        properties: OverpassFrontend.META
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')
        assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')

        assert.deepEqual(result, expectedFinal)

        request.off('subrequest-compile', compileListener)

        done()
      }
    )

    request.on('subrequest-compile', compileListener)
  })

  it('second query (fully cached, less properties)', function (done) {
    var expected = ['n441576820', 'n442066582', 'n442972880', 'n1467109667', 'n355123976', 'n1955278832', 'n441576823', 'n2083468740', 'n2099023017', 'w369989037', 'w370577069']
    var expectedFinal = {
      ...osmjsonMeta,
      bounds: {"minlon":16.335,"minlat":48.195,"maxlon":16.345,"maxlat":48.2},
      elements: [
        {"type":"node","id":441576820,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"6","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","cuisine":"chinese","name":"Zum Westbahnhof"},"lat":48.1980578,"lon":16.3371068},
        {"type":"node","id":442066582,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"5","addr:postcode":"1150","addr:street":"Gerstnerstraße","amenity":"restaurant","cuisine":"chinese","name":"Tsing Tao","website":"www.tsingtao-vienna.com"},"lat":48.1956833,"lon":16.336853},
        {"type":"node","id":442972880,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"2","addr:postcode":"1150","addr:street":"Felberstraße","amenity":"restaurant","name":"Pulkautaler Weinhaus","phone":"+43 1 7898537","website":"www.pulkautaler-weinhaus.at","wheelchair":"no"},"lat":48.1983304,"lon":16.3380221},
        {"type":"node","id":1467109667,"tags":{"amenity":"restaurant","name":"Vienna Spezialitäten"},"lat":48.1952368,"lon":16.337205},
        {"type":"node","id":355123976,"tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"127","addr:postcode":"1060","addr:street":"Mariahilfer Straße","amenity":"restaurant","cuisine":"asian","name":"Yellow","website":"http://yellow.co.at","wheelchair":"yes"},"lat":48.1952219,"lon":16.3403939},
        {"type":"node","id":1955278832,"tags":{"addr:country":"AT","addr:housenumber":"29","addr:postcode":"1060","addr:street":"Bürgerspitalgasse","amenity":"restaurant","cuisine":"south_american","name":"Pa'ti ya!","website":"fb.me/patiyaenviena","wheelchair":"no"},"lat":48.1950584,"lon":16.3405197},
        {"type":"node","id":441576823,"tags":{"addr:city":"Wien","addr:housenumber":"15","addr:postcode":"1150","addr:street":"Löhrgasse","amenity":"restaurant","name":"Fuenfhauser Stueberl"},"lat":48.1995985,"lon":16.3366001},
        {"type":"node","id":2083468740,"tags":{"amenity":"restaurant","cuisine":"chinese","name":"Chinazentrum"},"lat":48.1988427,"lon":16.3412368},
        {"type":"node","id":2099023017,"tags":{"addr:housenumber":"5","addr:postcode":"1070","addr:street":"Stollgasse","amenity":"restaurant","cuisine":"italian","name":"Restaurante Fiore Pizzeria & Vegan"},"lat":48.198721,"lon":16.3416572},
        {"type":"way","id":369989037,"tags":{"amenity":"restaurant","indoor":"yes","layer":"1","level":"1","name":"Wiener Wald"},"nodes":[3966187466,3965914141,3966187471,3966187468,3966187466]},
        {"type":"way","id":370577069,"tags":{"amenity":"restaurant","indoor":"yes","layer":"-1","level":"-1","name":"Merkur Restaurant","wheelchair":"yes"},"nodes":[3966420036,3966420031,3966420030,3966420027,3966420028,3742742818,3966420039,3966420036]},
      ]
    }
    var found = []
    var error = ''

    var expectedSubRequestCount = 0
    var foundSubRequestCount = 0

    function compileListener (subRequest) {
      foundSubRequestCount++
    }

    var request = overpassFrontend.BBoxQuery(
      "nwr[amenity=restaurant]",
      {
        "maxlat": 48.200,
        "maxlon": 16.345,
        "minlat": 48.195,
        "minlon": 16.335
      },
      {
        properties: 0
      },
      function (err, result) {
        found.push(result.id)

        if (expected.indexOf(result.id) === -1) {
          error += 'Unexpected result ' + result.id + '\n'
        }
      },
      function (err, result) {
        if (err) {
          return done(err)
        }

        if (error) {
          return done(error)
        }

        if (found.length !== expected.length) {
          return done('Wrong count of objects returned:\n' +
               'Expected: ' + expected.join(', ') + '\n' +
               'Found: ' + found.join(', '))
        }

        assert.equal(foundSubRequestCount, expectedSubRequestCount, 'Wrong count of sub requests!')
        assert.equal(request.count, expected.length, 'Expected ' + expected.length + ' results')

        assert.deepEqual(result, expectedFinal)

        request.off('subrequest-compile', compileListener)

        done()
      }
    )

    request.on('subrequest-compile', compileListener)
  })
})

describe('BBoxQuery({ limit })', function () {
  it('Query all restaurants to fill cache (limit=0)', function (done) {
    overpassFrontend.clearCache()
    test({
      query: "(node[amenity=restaurant];way[amenity=restaurant];relation[amenity=restaurant];)",
      bounds: {
	"maxlat": 48.200,
	"maxlon": 16.345,
	"minlat": 48.195,
	"minlon": 16.335
      },
      options: {
        limit: 0
      },
      expected: [ 'n441576820', 'n442066582', 'n442972880', 'n1467109667', 'n355123976', 'n1955278832', 'n441576823', 'n2083468740', 'n2099023017', 'w369989037', 'w370577069' ],
      expectedSubRequestCount: 1
    }, done)
  })

  it('Simple queries - all restaurants (fully cached, limit to 5 items)', function (done) {
    test({
      query: "(node[amenity=restaurant];way[amenity=restaurant];relation[amenity=restaurant];)",
      bounds: {
	"maxlat": 48.200,
	"maxlon": 16.345,
	"minlat": 48.195,
	"minlon": 16.335
      },
      options: {
        limit: 5
      },
      expected: [ 'n441576820', 'n442066582', 'n442972880', 'n1467109667', 'n355123976', 'n1955278832', 'n441576823', 'n2083468740', 'n2099023017', 'w369989037', 'w370577069' ],
      expectedCount: 5,
      expectedSubRequestCount: 0
    }, done)
  })

  it('Simple queries - all restaurants (cache cleared, only 5 items)', function (done) {
    overpassFrontend.clearCache()
    test({
      query: "(node[amenity=restaurant];way[amenity=restaurant];relation[amenity=restaurant];)",
      bounds: {
	"maxlat": 48.200,
	"maxlon": 16.345,
	"minlat": 48.195,
	"minlon": 16.335
      },
      options: {
        limit: 5
      },
      expected: [ 'n441576820', 'n442066582', 'n442972880', 'n1467109667', 'n355123976', 'n1955278832', 'n441576823', 'n2083468740', 'n2099023017', 'w369989037', 'w370577069' ],
      expectedCount: 5,
      expectedSubRequestCount: 1
    }, done)
  })

  it('Simple queries - all restaurants (5 items, which are already cached)', function (done) {
    test({
      query: "(node[amenity=restaurant];way[amenity=restaurant];relation[amenity=restaurant];)",
      bounds: {
	"maxlat": 48.200,
	"maxlon": 16.345,
	"minlat": 48.195,
	"minlon": 16.335
      },
      options: {
        limit: 5
      },
      expected: [ 'n441576820', 'n442066582', 'n442972880', 'n1467109667', 'n355123976', 'n1955278832', 'n441576823', 'n2083468740', 'n2099023017', 'w369989037', 'w370577069' ],
      expectedCount: 5,
      expectedSubRequestCount: 0
    }, done)
  })

  it('Simple queries - all restaurants (partly cached, up to 10 items)', function (done) {
    test({
      query: "(node[amenity=restaurant];way[amenity=restaurant];relation[amenity=restaurant];)",
      bounds: {
	"maxlat": 48.200,
	"maxlon": 16.345,
	"minlat": 48.195,
	"minlon": 16.335
      },
      options: {
        limit: 10
      },
      expected: [ 'n441576820', 'n442066582', 'n442972880', 'n1467109667', 'n355123976', 'n1955278832', 'n441576823', 'n2083468740', 'n2099023017', 'w369989037', 'w370577069' ],
      expectedCount: 10,
      expectedSubRequestCount: 1
    }, done)
  })

  it('Simple queries - all restaurants (partly cached, limit 15 - only 11 found)', function (done) {
    overpassFrontend.clearCache()
    test({
      query: "(node[amenity=restaurant];way[amenity=restaurant];relation[amenity=restaurant];)",
      bounds: {
	"maxlat": 48.200,
	"maxlon": 16.345,
	"minlat": 48.195,
	"minlon": 16.335
      },
      options: {
        limit: 15
      },
      expected: [ 'n441576820', 'n442066582', 'n442972880', 'n1467109667', 'n355123976', 'n1955278832', 'n441576823', 'n2083468740', 'n2099023017', 'w369989037', 'w370577069' ],
      expectedCount: 11,
      expectedSubRequestCount: 1
    }, done)
  })
})

describe('BBoxQuery with recurse', function () {
  it('Query relation nodes', function (done) {
    overpassFrontend.clearCache()
    test({
      query: "relation[route=tram][ref=9];node(r);",
      bounds: {
	"maxlat": 48.200,
	"maxlon": 16.350,
	"minlat": 48.190,
	"minlon": 16.330
      },
      expected: ['n2293993991', 'n287235515', 'n2285911704', 'n2293993859', 'n2411909898', 'n2411911256', 'n2285911663', 'n2285911667', 'n2285911665', 'n2285911692', 'n2285911702', 'n1546106141', 'n1546106157', 'n2223156317', 'n2285945342', 'n2423365127', 'n473167212', 'n1630416816', 'n2216507460', 'n2216530088', 'n1394529428', 'n2293993848', 'n2293993867', 'n2293993929', 'n2407351716', 'n2407351717', 'n2407231833', 'n2407231834', 'n2407325778', 'n252511595', 'n253233651', 'n2292452224', 'n2411950477', 'n269541925', 'n2407260774', 'n2407325779'],
      expectedSubRequestCount: 1
    }, done)
  })

  it('Query relation nodes with result bounding box', function (done) {
    test({
      query: "relation[route=tram][ref=9];node(r);",
      bounds: {
	"maxlat": 48.300,
	"maxlon": 16.350,
	"minlat": 48.190,
	"minlon": 16.330
      },
      options: {
        boundsRecurseSelector: 'result',
      },
      expected: ['n287235515', 'n1630416816', 'n2216507460', 'n1394529428', 'n2293993848', 'n2293993867', 'n2293993929', 'n2407351716', 'n2407351717', 'n2407325778', 'n269541925', 'n2407260774', 'n2407325779'],
      expectedSubRequestCount: 1
    }, done)
  })

  it('Query relation nodes with smaller result bounding box', function (done) {
    test({
      query: "relation[route=tram][ref=9];node(r);",
      bounds: {
	"maxlat": 48.200,
	"maxlon": 16.350,
	"minlat": 48.190,
	"minlon": 16.330
      },
      options: {
        boundsRecurseSelector: 'result',
      },
      expected: ['n287235515', 'n2293993867', 'n2293993929'],
      expectedSubRequestCount: 0
    }, done)
  })
})

function test (options, callback) {
  var finalCalled = 0
  var found = []
  var error = ''
  var foundSubRequestCount = 0

  function compileListener (subRequest) {
    foundSubRequestCount++
  }

  var request = overpassFrontend.BBoxQuery(
    options.query,
    options.bounds,
    options.options,
    function (err, result) {
      found.push(result.id)

      if (options.expected.indexOf(result.id) === -1) {
        error += 'Unexpected result ' + result.id + ' ' + result.tags.name + '\n'
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

      const expectedCount = 'expectedCount' in options ? options.expectedCount : options.expected.length
      assert.equal(found.length, expectedCount, 'Wrong count of objects returned')
      assert.equal(request.count, expectedCount, 'request\'s count should equal ' + expectedCount)

      if ('expectedSubRequestCount' in options) {
        assert.equal(foundSubRequestCount, options.expectedSubRequestCount, 'Wrong count of sub requests!')
      }
      request.off('subrequest-compile', compileListener)

      callback()
    }
  )

  request.on('subrequest-compile', compileListener)
}

function printResult (v) {
  let r = '{\n'
  r += '  ...osmjsonMeta,\n'

  if (v.bounds) {
    r += '  bounds: ' + JSON.stringify(v.bounds) + ',\n'
  }

  r += '  elements: [\n'
  v.elements.forEach(e => {
    r += '    ' + JSON.stringify(e) + ',\n'
  })

  r += '  ]\n}'

  console.log(r)
}
