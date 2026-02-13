var fs = require('fs')
var conf = JSON.parse(fs.readFileSync('test/conf.json', 'utf8'));

if (!conf.generator) {
  console.error('Set correct "generator" string in test/conf.json!')
  process.exit(0)
}

var assert = require('assert')
var async = require('async')

var OverpassFrontend = require('..')
var removeNullEntries = require('../src/removeNullEntries')

var overpassFrontend = new OverpassFrontend(conf.url)

describe('Abort request', function() {
  it('abort() should abort a "get" request', function (done) {
    var finalCalled = 0
    var req = overpassFrontend.get([ 'n3037893161' ],
      {
        properties: OverpassFrontend.ID_ONLY
      },
      function(err, result, index) {
        assert.fail('Should not call feature_callback, as request gets aborted.')
      },
      function(err) {
        done('finalCallback should not be called')
      }
    )

    req.on('abort', () => {
      done()
    })

    req.abort()
  })

  it('abort() should abort a "get" request (even when object has already been loaded)', function (done) {
    var finalCalled = 0
    var req = overpassFrontend.get([ 'n3037893169' ],
      {
        properties: OverpassFrontend.ID_ONLY
      },
      function(err, result, index) {
        assert.fail('Should not call feature_callback, as request gets aborted.')
      },
      function(err) {
        done('finalCallback should not be called')
      }
    )

    req.on('abort', () => {
      done()
    })

    req.abort()
  })

  it('abort() should abort a "BBoxQuery" request', function (done) {
    var finalCalled = 0
    overpassFrontend.clearBBoxQuery('node[natural=tree];')
    var req = overpassFrontend.BBoxQuery(
      'node[natural=tree];',
      {
        minlon: 16.338,
        minlat: 48.199,
        maxlon: 16.339,
        maxlat: 48.200
      },
      {
        properties: OverpassFrontend.ID_ONLY
      },
      function(err, result, index) {
        assert.fail('Should not call feature_callback, as request gets aborted.')
      },
      function(err) {
        done('finalCallback should not be called')
      }
    )

    req.on('abort', () => {
      done()
    })

    req.abort()
  })

  it('abort() should abort a "BBoxQuery" request', function (done) {
    var finalCalled = 0
    overpassFrontend.clearBBoxQuery('node[natural=tree];')
    var req = overpassFrontend.BBoxQuery(
      'node[natural=tree];',
      {
        minlon: 16.338,
        minlat: 48.199,
        maxlon: 16.339,
        maxlat: 48.200
      },
      {
        properties: OverpassFrontend.ID_ONLY
      },
      function(err, result, index) {
        assert.fail('Should not call feature_callback, as request gets aborted.')
      },
      function(err) {
        done('finalCallback should not be called')
      }
    )

    req.on('abort', () => {
      done()
    })

    req.abort()
  })

  it('abortAllRequests() should abort requests', function (done) {
    var finalCalled = 0
    var req = overpassFrontend.get([ 'n3037893161' ],
      {
        properties: OverpassFrontend.ID_ONLY
      },
      function(err, result, index) {
        assert.fail('Should not call feature_callback, as request gets aborted.')
      },
      function(err) {
        done('finalCallback should not be called')
      }
    )

    req.on('abort', () => {
      done()
    })

    overpassFrontend.abortAllRequests()
  })

  it('request list should be empty', function () {
    var finalCalled = 0
    removeNullEntries(overpassFrontend.requests)

    assert.deepEqual(overpassFrontend.requests, [], 'request list should be empty')
    return true
  })
})
