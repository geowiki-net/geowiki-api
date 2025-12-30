const fs = require('fs')
const conf = JSON.parse(fs.readFileSync('test/conf.json', 'utf8'));
const assert = require('assert').strict
const httpLoad = require('../src/httpLoad')

const OverpassFrontend = require('..')
const testOverpassObject = require('./src/testOverpassObject')

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

const exceptions = {
  'w299709376': ['center', 'noids center'],
  'w31254026': ['center', 'noids center'],
  'r2334391': ['center', 'noids center'],
  'r3237099': ['center', 'noids center'],
  'r6384718': ['bb', 'noids bb', 'center', 'noids center'],
  'r6487824': ['bb', 'noids bb', 'center', 'noids center'],
  'r6412377': ['center', 'noids center'],
}

const outVariants = [
  '', 'ids', 'skel', 'body', 'tags', 'meta', 'geom', 'ids geom', 'ids tags', 'tags geom', 'meta geom', 'skel geom', 'noids', 'noids skel', 'noids geom', 'noids tags', 'bb', 'noids bb', 'center', 'noids center',
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

        originalResults[osmId] = {}
        originalResults[osmId][variant] = []

        results.elements.forEach(el => {
          if (el.type === 'count') {
            if (++varPoi >= outVariants.length) {
              varPoi = 0
              osmPoi++
              osmId = toTest[osmPoi]

              if (osmId) {
                originalResults[osmId] = {}
              }
            }

            variant = outVariants[varPoi]
            if (osmId && variant !== undefined) {
              originalResults[osmId][variant] = []
            }
          } else {
            originalResults[osmId][variant].push(el)
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

              if (osmId in exceptions && exceptions[osmId].includes(outParam)) {
                console.log('skip test')
              } else {
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
