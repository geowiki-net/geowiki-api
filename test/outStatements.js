var fs = require('fs')
var conf = JSON.parse(fs.readFileSync('test/conf.json', 'utf8'));

var assert = require('assert')
var async = require('async')

var OverpassFrontend = require('../src/OverpassFrontend')
const Filter = require('../src/Filter')
var BoundingBox = require('boundingbox')
var overpassFrontend

;['via-server', 'via-file'].forEach(mode => {
  describe('Test filter sets ' + mode, function () {
    describe('initalize', function () {
      if (mode === 'via-server') {
        it('load', function () {
          overpassFrontend = new OverpassFrontend(conf.url)
        })
      } else {
        it('load', function (done) {
          this.timeout(20000)
          overpassFrontend = new OverpassFrontend('test/data.osm.bz2')
          overpassFrontend.once('load', () => done())
        })
      }
    })

    describe("Simple statements " + mode, function () {
      it ('nwr[amenity];out;', function (done) {
// [out:json][bbox:48.20074,16.33678,48.20227,16.33902];
        test('nwr[amenity=place_of_worship];out;', {
          def: [
            [{"op":"=","key":"amenity","value":"place_of_worship"}],
            {out:[]}
          ],
          toString: 'nwr["amenity"="place_of_worship"];out body;',
          toQlStatementIds: 'nwr["amenity"="place_of_worship"]->._1;._1 out body;',
          toQuery: 'nwr["amenity"="place_of_worship"]->._1;',
          recurse: [],
          getScript: [
            { id: 1, properties: 1, recurse: [] }
          ],
          compileQuery: {
            query: 'nwr["amenity"="place_of_worship"];',
            loki: {
              "tags.amenity": { $eq: "place_of_worship" }
            }
          },
          toLokijs: {
            "tags.amenity": { $eq: "place_of_worship" }
          },
          derefSets: [
            { type: 'nwr', filters: [ { key: 'amenity', op: '=', value: 'place_of_worship' } ] }
          ],
          cacheDescriptors: [
            { id: 'nwr["amenity"="place_of_worship"](properties:1)' }
          ],
          result: {
            elements: [
              { type: 'node', id: 1863103110, tags: {"amenity":"place_of_worship","denomination":"catholic","name":"Zum Göttlichen Heiland","religion":"christian"} },
              { type: 'way', id: 86273642, tags: {"amenity":"place_of_worship","building":"church","denomination":"catholic","name":"Lazaristenkirche","religion":"christian","wikipedia":"de:Lazaristenkirche (Neubau)"} }
            ]
          }
        }, {}, done)
      })
      it ('nwr[amenity];out ids;', function (done) {
// [out:json][bbox:48.20074,16.33678,48.20227,16.33902];
        overpassFrontend.clearCache()
        test('nwr[amenity=place_of_worship];out ids;', {
          def: [
            [{"op":"=","key":"amenity","value":"place_of_worship"}],
            {out:['ids']}
          ],
          toString: 'nwr["amenity"="place_of_worship"];out ids;',
          toQlStatementIds: 'nwr["amenity"="place_of_worship"]->._1;._1 out ids;',
          toQuery: 'nwr["amenity"="place_of_worship"]->._1;',
          recurse: [],
          getScript: [
            { id: 1, properties: 1, recurse: [] }
          ],
          compileQuery: {
            query: 'nwr["amenity"="place_of_worship"];',
            loki: {
              "tags.amenity": { $eq: "place_of_worship" }
            }
          },
          toLokijs: {
            "tags.amenity": { $eq: "place_of_worship" }
          },
          derefSets: [
            { type: 'nwr', filters: [ { key: 'amenity', op: '=', value: 'place_of_worship' } ] }
          ],
          cacheDescriptors: [
            { id: 'nwr["amenity"="place_of_worship"](properties:1)' }
          ],
          result: {
            elements: [
              { type: 'node', id: 1863103110 },
              { type: 'way', id: 86273642 },
            ]
          }
        }, {}, done)
      })
      it ('nwr[amenity];out count;', function (done) {
// [out:json][bbox:48.20074,16.33678,48.20227,16.33902];
        test('nwr[amenity=place_of_worship];out count;', {
          def: [
            [{"op":"=","key":"amenity","value":"place_of_worship"}],
            {out:['count']}
          ],
          toString: 'nwr["amenity"="place_of_worship"];out count;',
          toQlStatementIds: 'nwr["amenity"="place_of_worship"]->._1;._1 out count;',
          toQuery: 'nwr["amenity"="place_of_worship"]->._1;',
          recurse: [],
          getScript: [
            { id: 1, properties: 1, recurse: [] }
          ],
          compileQuery: {
            query: 'nwr["amenity"="place_of_worship"];',
            loki: {
              "tags.amenity": { $eq: "place_of_worship" }
            }
          },
          toLokijs: {
            "tags.amenity": { $eq: "place_of_worship" }
          },
          derefSets: [
            { type: 'nwr', filters: [ { key: 'amenity', op: '=', value: 'place_of_worship' } ] }
          ],
          cacheDescriptors: [
            { id: 'nwr["amenity"="place_of_worship"](properties:1)' }
          ],
          result: {
            elements: [
              { type: 'count', id: 0,
                tags: { nodes: '1', ways: '1', relations: '0', total: '2' }
              }
            ]
          }
        }, {}, done)
      })
    })

    describe("Several out for same input statements (" + mode + ")", function () {
      it ('nwr[amenity];out ids;out body;', function (done) {
// [out:json][bbox:48.20074,16.33678,48.20227,16.33902];
        overpassFrontend.clearCache()
        test('nwr[amenity=place_of_worship];out ids;out body;', {
          def: [
            [{"op":"=","key":"amenity","value":"place_of_worship"}],
            {out:['ids']},
            {out:['body']}
          ],
          toString: 'nwr["amenity"="place_of_worship"];out ids;out body;',
          toQlStatementIds: 'nwr["amenity"="place_of_worship"]->._1;._1 out ids;._1 out body;',
          toQuery: 'nwr["amenity"="place_of_worship"]->._1;',
          recurse: [],
          getScript: [
            { id: 1, properties: 1, recurse: [] }
          ],
          compileQuery: {
            query: 'nwr["amenity"="place_of_worship"];',
            loki: {
              "tags.amenity": { $eq: "place_of_worship" }
            }
          },
          toLokijs: {
            "tags.amenity": { $eq: "place_of_worship" }
          },
          derefSets: [
            { type: 'nwr', filters: [ { key: 'amenity', op: '=', value: 'place_of_worship' } ] }
          ],
          cacheDescriptors: [
            { id: 'nwr["amenity"="place_of_worship"](properties:1)' }
          ],
          result: {
            elements: [
              { type: 'node', id: 1863103110 },
              { type: 'way', id: 86273642 },
              { type: 'node', id: 1863103110, tags: {"amenity":"place_of_worship","denomination":"catholic","name":"Zum Göttlichen Heiland","religion":"christian"} },
              { type: 'way', id: 86273642, tags: {"amenity":"place_of_worship","building":"church","denomination":"catholic","name":"Lazaristenkirche","religion":"christian","wikipedia":"de:Lazaristenkirche (Neubau)"} }
            ]
          }
        }, {}, done)
      })
      it ('nwr[amenity];out body;out ids;', function (done) {
// [out:json][bbox:48.20074,16.33678,48.20227,16.33902];
        overpassFrontend.clearCache()
        test('nwr[amenity=place_of_worship];out body;out ids;', {
          def: [
            [{"op":"=","key":"amenity","value":"place_of_worship"}],
            {out:['body']},
            {out:['ids']}
          ],
          toString: 'nwr["amenity"="place_of_worship"];out body;out ids;',
          toQlStatementIds: 'nwr["amenity"="place_of_worship"]->._1;._1 out body;._1 out ids;',
          toQuery: 'nwr["amenity"="place_of_worship"]->._1;',
          recurse: [],
          getScript: [
            { id: 1, properties: 1, recurse: [] }
          ],
          compileQuery: {
            query: 'nwr["amenity"="place_of_worship"];',
            loki: {
              "tags.amenity": { $eq: "place_of_worship" }
            }
          },
          toLokijs: {
            "tags.amenity": { $eq: "place_of_worship" }
          },
          derefSets: [
            { type: 'nwr', filters: [ { key: 'amenity', op: '=', value: 'place_of_worship' } ] }
          ],
          cacheDescriptors: [
            { id: 'nwr["amenity"="place_of_worship"](properties:1)' }
          ],
          result: {
            elements: [
              { type: 'node', id: 1863103110, tags: {"amenity":"place_of_worship","denomination":"catholic","name":"Zum Göttlichen Heiland","religion":"christian"} },
              { type: 'way', id: 86273642, tags: {"amenity":"place_of_worship","building":"church","denomination":"catholic","name":"Lazaristenkirche","religion":"christian","wikipedia":"de:Lazaristenkirche (Neubau)"} },
              { type: 'node', id: 1863103110 },
              { type: 'way', id: 86273642 },
            ]
          }
        }, {}, done)
      })
    })
  })
})

/**
 * @param {string[]} [options.ignoreMissing] ids of items which are missing from the database. As they get created by references, they could appear in results nonetheless.
 */
function test (input, expected, options, callback) {
  const origOptions = {...options}

  if (options.mode === 'via-server') {
    console.log(options.rek ? '2nd run' : '1st run')
  }

  var f = new Filter(input)

  assert.deepEqual(f.def, expected.def)
  assert.equal(f.toString(), expected.toString)
  assert.equal(f.toQl({ setsUseStatementIds: true }), expected.toQlStatementIds)
  assert.equal(f.toQuery(), expected.toQuery)
  assert.deepEqual(f.recurse(), expected.recurse)
  assert.deepEqual(f.getScript(), expected.getScript)
  assert.deepEqual(f.compileQuery(), expected.compileQuery)
  assert.deepEqual(f.toLokijs(), expected.toLokijs)
  assert.deepEqual(f.derefSets(), expected.derefSets)
  assert.deepEqual(f.cacheDescriptors(), expected.cacheDescriptors)

  let found = []
  let foundSubRequestCount = 0

  function compileListener (subrequest) {
    foundSubRequestCount++
  }

  options.queryOptions = options.queryOptions ?? {}
  options.queryOptions.featureCallback = (ob) => {
    found.push(ob.id)
  }

  const request = overpassFrontend.query(
    input,
    options.queryOptions,
    (err, result) => {
      if (err) {
        if (options.expectException) {
          assert.equal(err.message, options.expectException)
          return callback()
        }

        return callback(err)
      }

      // console.log(result)
      assert.deepEqual(result, expected.result, 'Unexpected result')

      /*
      const expected = (options.mode === 'via-server' ? options.expectedViaServer : options.expectedViaFile) || options.expected
      if (options.ignoreMissing) {
        found = found.filter(id => !options.ignoreMissing.includes(id))
      }
      assert.deepEqual(found.sort(), expected.sort(), 'List of found objects wrong!')
      if (options.mode === 'via-server') {
        assert.equal(foundSubRequestCount, options.expectedSubRequestCount, 'Wrong count of sub requests!')
      }

      request.off('subrequest-compile', compileListener)

      if (!options.noRecurse && !options.rek) {
        origOptions.rek = true
        origOptions.expectedSubRequestCount = options.expectedSubRequestCount2nd ?? 0
        return test(origOptions, callback)
      }
      */

      callback()
    }
  )

  request.on('subrequest-compile', compileListener)

  if (request.filterQuery) {
    const cacheDescriptors = request.cacheDescriptors.map(cd => cd.cacheDescriptor)
    if (options.expectedCacheDescriptors) {
      assert.deepEqual(cacheDescriptors, options.expectedCacheDescriptors, 'Expected cache info')
    }
    if ('expectedProperties' in options) {
      assert.equal(request.filterQuery.properties(), options.expectedProperties)
    }
  }

  return request
}
