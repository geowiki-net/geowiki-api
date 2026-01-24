const fs = require('fs')
const conf = JSON.parse(fs.readFileSync('test/conf.json', 'utf8'));
const OverpassFrontend = require('..')
const assert = require('assert').strict

const DOMParser = require('@xmldom/xmldom').DOMParser
const domParser = new DOMParser({
  errorHandler: {
    error: (err) => { throw new Error('Error parsing XML file: ' + err) },
    fatalError: (err) => { throw new Error('Error parsing XML file: ' + err) }
  }
})

const XMLSerializer = require('@xmldom/xmldom').XMLSerializer
const xmlSerializer = new XMLSerializer()

// const loadOverpassFrontendFile = require('./src/loadOverpassFrontendFile.js')
// const overpassFrontendFile = loadOverpassFrontendFile('test/data.osm.bz2')
// const overpassFrontend = overpassFrontendFile
const overpassFrontend = new OverpassFrontend(conf.url)

describe('RequestQuery', function () {
  it ('json: out count', function (done) {
    overpassFrontend.query('[out:json];nwr[amenity=place_of_worship];out ids;out count;',
      (err, result) => {
        if (err) {
          assert.fail('Error: ' + err.message)
        }

        const el = result.elements[result.elements.length - 1]
        assert.deepEqual(el, {type:'count',id:0,tags:{nodes:'1',ways:'1',relations:'0',total:'2'}})
        //console.log(JSON.stringify(result, null, '  '))
        done()
      }
    )
  })

  it ('json: out count of 1st set', function (done) {
    overpassFrontend.query('[out:json];nwr[office]->.a;nwr[amenity=place_of_worship];out tags;.a out count;',
      (err, result) => {
        if (err) {
          assert.fail('Error: ' + err.message)
        }

        const el = result.elements[result.elements.length - 1]
        assert.deepEqual(el, {type:'count',id:0,tags:{nodes:'1',ways:'0',relations:'0',total:'1'}})
        //console.log(JSON.stringify(result, null, '  '))
        done()
      }
    )
  })

  it ('json: recurse down.', function (done) {
    const expectedWays = [ 161610245, 171973475, 171973476, 171973482, 171973483, 171973487, 171973488, 86127673 ]
    overpassFrontend.query('[out:json];relation[building](48.201,16.338,48.202,16.340)->.a;way(r.a:outer);out tags;',
      (err, result) => {
        if (err) {
          assert.fail('Error: ' + err.message)
        }

        assert.equal(result.elements.length, expectedWays.length)
        const resultingWays = result.elements.filter(el => el.type === 'way').map(el => el.id).sort()
        assert.deepEqual(resultingWays, expectedWays)

        done()
      }
    )
  })

  it ('json: recurse down and back.', function (done) {
    const expectedWays = [ 161610245, 171973475, 171973476, 171973482, 171973483, 171973487, 171973488, 86127673 ]
    const expectedRels = [ 1282647, 2164434, 2293450, 2293453, 2293457, 2293458, 2293459, 2293461 ]

    overpassFrontend.query('[out:json];relation[building](48.201,16.338,48.202,16.340)->.a;way(r.a:outer);out tags;relation(bw);out ids;',
      (err, result) => {
        if (err) {
          assert.fail('Error: ' + err.message)
        }

        assert.equal(result.elements.length, expectedWays.length + expectedRels.length)
        const resultingWays = result.elements.filter(el => el.type === 'way').map(el => el.id).sort()
        const resultingRels = result.elements.filter(el => el.type === 'relation').map(el => el.id).sort()
        assert.deepEqual(resultingWays, expectedWays)
        assert.deepEqual(resultingRels, expectedRels)
        done()
      }
    )
  })

  it ('xml: out count', function (done) {
    overpassFrontend.query('[out:xml];nwr[amenity=place_of_worship];out ids;out count;',
      (err, result) => {
        if (err) {
          assert.fail('Error: ' + err.message)
        }

        //console.log(result)

        const data = domParser.parseFromString(result, 'text/xml')
        const osm = data.getElementsByTagName('osm')[0]

        const element = osm.getElementsByTagName('count')[0]

        assert.equal(element.tagName, 'count')
        const counts = {}
        let c = element.firstChild
        while (c) {
          if (c.tagName === 'tag') {
            counts[c.getAttribute('k')] = c.getAttribute('v')
          }
          c = c.nextSibling
        }

        assert.deepEqual(counts, {nodes:'1',ways:'1',relations:'0',total:'2'})
        done()
      }
    )
  })

  it ('xml: out count of 1st set', function (done) {
    overpassFrontend.query('[out:xml];nwr[office]->.a;nwr[amenity=place_of_worship];out ids;.a out count;',
      (err, result) => {
        if (err) {
          assert.fail('Error: ' + err.message)
        }

        //console.log(result)

        const data = domParser.parseFromString(result, 'text/xml')
        const osm = data.getElementsByTagName('osm')[0]

        const element = osm.getElementsByTagName('count')[0]

        assert.equal(element.tagName, 'count')
        const counts = {}
        let c = element.firstChild
        while (c) {
          if (c.tagName === 'tag') {
            counts[c.getAttribute('k')] = c.getAttribute('v')
          }
          c = c.nextSibling
        }

        assert.deepEqual(counts, {nodes:'1',ways:'0',relations:'0',total:'1'})
        done()
      }
    )
  })
})
