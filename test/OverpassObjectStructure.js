const fs = require('fs')
const conf = JSON.parse(fs.readFileSync('test/conf.json', 'utf8'));
const assert = require('assert').strict
const httpLoad = require('../src/httpLoad')

const OverpassFrontend = require('..')
const testOverpassObject = require('./src/testOverpassObject')
const deepEqualCheck = require('deep-equal-check').default

const toTest = [
  'n3037893171',
  'n377991',
  'w299709376',
  'w31254026',
  'r2334391',
  'r3237099',
  'r7735480',
  'r6384718',
  'r6487824',
  'r6412377',
  //'r20313', // bounds missing in file load mode
]

const outVariants = [
  '', 'ids', 'skel', 'body', 'tags', 'meta', 'geom', 'ids geom', 'ids tags', 'tags geom', 'meta geom', 'noids', 'noids skel', 'noids geom', 'noids tags',
]

const originalResults = {}

const types = { n: 'node', w: 'way', r: 'relation' }
describe('Overpass Object Structures', function () {
  describe('get original results', function () {
   
    it('get all objects', function (done) { 
      let query = '[out:json];\n'

      toTest.forEach(osmId => {
        let type = osmId[0]
        let id = osmId.substr(1)

        outVariants.forEach(outParam => {
          query += types[type] + '(' + id + ');out ' + outParam + ';out count;\n'
        })
      })

      httpLoad(
        conf.url,
        null,
        query,
        receive
      )

      function receive (err, results) {
        if (err) {
          assert.fail('Got error: ' + err.message)
        }

        let osmPoi = 0
        let osmId = toTest[osmPoi]
        let varPoi = 0
        let variant = outVariants[varPoi]

        results.elements.forEach(el => {
          if (el.type === 'count') {
            if (++varPoi >= outVariants.length) {
              varPoi = 0
              osmPoi++
              osmId = toTest[osmPoi]
            }

            variant = outVariants[varPoi]
          } else {
            if (!(osmId in originalResults)) {
              originalResults[osmId] = {}
            }
            if (!(variant in originalResults[osmId])) {
              originalResults[osmId][variant] = []
            }

            originalResults[toTest[osmPoi]][outVariants[varPoi]].push(el)
          }
        })

        //console.log(JSON.stringify(originalResults, null, '  '))
        done()
      }
    })
  })

  describe('Load from OverpassFrontend via file', function () {
    const overpassFrontend = new OverpassFrontend('test/data.osm.bz2')

    toTest.forEach(osmId => {
      outVariants.forEach(outParam => {
        const outOptions = {}
        outParam.split(' ').forEach(o => outOptions[o] = true)

        it (osmId + ' ' + outParam, function (done) {
          overpassFrontend.get(osmId, {},
            (err, object) => {
              const actual = object.out(outOptions)
              const expected = originalResults[osmId][outParam][0]
              // console.log('actual', result)
              // console.log('expect', originalResults[osmId][outParam][0])

              if (!deepEqualCheck(actual, expected, { numberPrecision: 0.0000001 })) {
                assert.deepEqual(actual, expected, 'Items are not equal')
              }
            },
            (err) => {
              done()
            })
          })
        })
      })
  })
})
