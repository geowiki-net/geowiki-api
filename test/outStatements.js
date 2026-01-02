var fs = require('fs')
var conf = JSON.parse(fs.readFileSync('test/conf.json', 'utf8'));

var assert = require('assert')
var async = require('async')

var OverpassFrontend = require('../src/OverpassFrontend')
const Filter = require('../src/Filter')
var BoundingBox = require('boundingbox')
var overpassFrontend

const packageInfo = require('../version.json')
const generator = packageInfo.name + ' ' + packageInfo.version

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
            version: 0.6,
            generator,
            elements: [
              { type: 'node', id: 1863103110, lat: 48.1992013, lon: 16.3406967, tags: {"amenity":"place_of_worship","denomination":"catholic","name":"Zum Göttlichen Heiland","religion":"christian"} },
              { type: 'way', id: 86273642, nodes: [1039442641,1965238263,1001461016,1001460674,1001461096,1842842028,1842842024,1842842023,1001460403,1039442583,1001460157,1039442513,2548006760,1001460572,2548006752,2548006747,2548006748,2548006753,2548006757,2548006749,2548006750,2548006751,2548006758,2548006759,2548006754,2548006756,2548006762,1001460923,1001460592,2548006769,2548006765,2548006766,2548006770,2548006774,2548006767,2548006768,2548006775,2548006778,2548006772,2548006773,2548006779,2548006784,2548006776,2548006777,2548006785,2548006786,2548006781,2548006783,2548006787,1039442579,1842842027,1842842026,1039442641], tags: {"amenity":"place_of_worship","building":"church","denomination":"catholic","name":"Lazaristenkirche","religion":"christian","wikipedia":"de:Lazaristenkirche (Neubau)"} }
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
            version: 0.6,
            generator,
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
            version: 0.6,
            generator,
            elements: [
              { type: 'count', id: 0,
                tags: { nodes: '1', ways: '1', relations: '0', total: '2' }
              }
            ]
          }
        }, {}, done)
      })
      it ('nwr[building](48.19612,16.34066,48.19688,16.34171);out meta geom;', function (done) {
// [out:json][bbox:48.20074,16.33678,48.20227,16.33902];
        test('nwr[building](48.19612,16.34066,48.19688,16.34171);out meta geom;', {
          def: [
            [{"op":"has_key","key":"building"},{"fun":"bbox","value":{"maxlat":48.19688,"maxlon":16.34171,"minlat": 48.19612,"minlon":16.34066}}],
            {out:['meta', 'geom']}
          ],
          toString: 'nwr["building"](48.19612,16.34066,48.19688,16.34171);out meta geom;',
          toQlStatementIds: 'nwr["building"](48.19612,16.34066,48.19688,16.34171)->._1;._1 out meta geom;',
          toQuery: 'nwr["building"](48.19612,16.34066,48.19688,16.34171)->._1;',
          result: {
            version: 0.6,
            generator,
            elements: [
              {"type":"way","id":86273634,"version":6,"timestamp":"2014-04-11T21:30:26Z","changeset":21635523,"uid":1066249,"user":"Railjet","tags":{"building":"yes"},"bounds":{"minlon":16.3408891,"minlat":48.1963491,"maxlon":16.3415051,"maxlat":48.1967389},"nodes":[2548006646,1001460111,2784273119,2548006710,2548006707,2548006706,2548006705,2548006686,2548006684,2548006676,2548006679,2548006674,2548006675,2548006681,1842841891,2548006654,1842841848,2548006646],"geometry":[{"lat":48.1963491,"lon":16.3411739},{"lat":48.1964054,"lon":16.3415051},{"lat":48.1964648,"lon":16.3414911},{"lat":48.1967389,"lon":16.3414268},{"lat":48.1967295,"lon":16.341235},{"lat":48.1967237,"lon":16.3411154},{"lat":48.1967203,"lon":16.3409434},{"lat":48.1966191,"lon":16.3409658},{"lat":48.1966133,"lon":16.3408891},{"lat":48.1965521,"lon":16.3409009},{"lat":48.19656,"lon":16.3409788},{"lat":48.1965493,"lon":16.3409815},{"lat":48.1965518,"lon":16.3409955},{"lat":48.1965672,"lon":16.3410879},{"lat":48.1964829,"lon":16.341108},{"lat":48.1964659,"lon":16.3411127},{"lat":48.1964088,"lon":16.3411444},{"lat":48.1963491,"lon":16.3411739}]},
              {"type":"way","id":173478248,"version":2,"timestamp":"2013-11-24T00:22:29Z","changeset":19083846,"uid":17047,"user":"KaiRo","tags":{"building":"yes"},"bounds":{"minlon":16.3403654,"minlat":48.196223,"maxlon":16.3408116,"maxlat":48.1965052},"nodes":[2548006639,2548006638,2548006640,2548006645,1842841814,1842841832,2548006649,2548006658,1001460712,1842841852,1842841851,1842841854,1842841850,1842841842,1842841836,1842841875,1001460391,2548006644,1842841812,1842841782,2548006639],"geometry":[{"lat":48.1962851,"lon":16.3404265},{"lat":48.196223,"lon":16.3404503},{"lat":48.1962873,"lon":16.3408116},{"lat":48.1963466,"lon":16.340789},{"lat":48.1963407,"lon":16.3407562},{"lat":48.1963891,"lon":16.3407384},{"lat":48.1963952,"lon":16.3407702},{"lat":48.1965052,"lon":16.340728},{"lat":48.1964888,"lon":16.3406373},{"lat":48.1964236,"lon":16.3406607},{"lat":48.1964127,"lon":16.3405973},{"lat":48.1964271,"lon":16.3405918},{"lat":48.1964148,"lon":16.3405209},{"lat":48.1964002,"lon":16.3405253},{"lat":48.1963916,"lon":16.3404796},{"lat":48.1964571,"lon":16.3404565},{"lat":48.1964411,"lon":16.3403654},{"lat":48.1963316,"lon":16.3404081},{"lat":48.1963368,"lon":16.3404367},{"lat":48.1962898,"lon":16.3404551},{"lat":48.1962851,"lon":16.3404265}]},
              {"type":"way","id":247954701,"version":1,"timestamp":"2013-11-24T00:22:22Z","changeset":19083846,"uid":17047,"user":"KaiRo","tags":{"building":"yes"},"bounds":{"minlon":16.340728,"minlat":48.1962873,"maxlon":16.3411739,"maxlat":48.1965672},"nodes":[2548006645,2548006640,2548006646,1842841848,1842841844,1842841885,1842841891,2548006681,2548006675,1001460577,1842841887,1842841902,1842841892,1842841879,1001460894,1001460429,2548006658,2548006649,1842841840,1842841818,2548006645],"geometry":[{"lat":48.1963466,"lon":16.340789},{"lat":48.1962873,"lon":16.3408116},{"lat":48.1963491,"lon":16.3411739},{"lat":48.1964088,"lon":16.3411444},{"lat":48.1964041,"lon":16.341115},{"lat":48.1964759,"lon":16.3410856},{"lat":48.1964829,"lon":16.341108},{"lat":48.1965672,"lon":16.3410879},{"lat":48.1965518,"lon":16.3409955},{"lat":48.1964838,"lon":16.3410127},{"lat":48.1964766,"lon":16.3409601},{"lat":48.196492,"lon":16.340955},{"lat":48.1964798,"lon":16.3408824},{"lat":48.1964623,"lon":16.3408868},{"lat":48.1964552,"lon":16.3408432},{"lat":48.1965224,"lon":16.3408183},{"lat":48.1965052,"lon":16.340728},{"lat":48.1963952,"lon":16.3407702},{"lat":48.196402,"lon":16.3408132},{"lat":48.1963543,"lon":16.3408323},{"lat":48.1963466,"lon":16.340789}]},
              {"type":"relation","id":2316361,"version":2,"timestamp":"2013-11-24T00:22:27Z","changeset":19083846,"uid":17047,"user":"KaiRo","tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"5","addr:postcode":"1070","addr:street":"Kaiserstraße","building":"yes","type":"multipolygon"},"bounds":{"minlon":16.3408984,"minlat":48.1967203,"maxlon":16.3414268,"maxlat":48.1969548},"members":[{"ref":247954748,"type":"way","role":"outer","geometry":[{"lat":48.1967389,"lon":16.3414268},{"lat":48.1969548,"lon":16.341377},{"lat":48.1969094,"lon":16.3408984},{"lat":48.1967642,"lon":16.3409329},{"lat":48.1967203,"lon":16.3409434},{"lat":48.1967237,"lon":16.3411154},{"lat":48.1967453,"lon":16.3411126},{"lat":48.1967484,"lon":16.3410969},{"lat":48.1967603,"lon":16.341095},{"lat":48.1967629,"lon":16.3411288},{"lat":48.1967514,"lon":16.3411375},{"lat":48.1967426,"lon":16.3411565},{"lat":48.1967408,"lon":16.3411772},{"lat":48.196745,"lon":16.3411956},{"lat":48.1967563,"lon":16.3412107},{"lat":48.1967731,"lon":16.341217},{"lat":48.1967773,"lon":16.3412515},{"lat":48.196763,"lon":16.3412529},{"lat":48.1967575,"lon":16.3412346},{"lat":48.1967295,"lon":16.341235},{"lat":48.1967389,"lon":16.3414268}]},{"ref":173478253,"type":"way","role":"inner","geometry":[{"lat":48.1968358,"lon":16.3410804},{"lat":48.1967839,"lon":16.3410913},{"lat":48.1967907,"lon":16.3411551},{"lat":48.1968072,"lon":16.3411529},{"lat":48.1968095,"lon":16.3411789},{"lat":48.1967932,"lon":16.3411804},{"lat":48.1967998,"lon":16.3412502},{"lat":48.1968494,"lon":16.3412386},{"lat":48.1968358,"lon":16.3410804}]}]}
            ]
          }
        }, {}, done)
      })
      it ('nwr[building](48.19612,16.34066,48.19688,16.34171);out skel;', function (done) {
        test('nwr[building](48.19612,16.34066,48.19688,16.34171);out skel;', {
          def: [
            [{"op":"has_key","key":"building"},{"fun":"bbox","value":{"maxlat":48.19688,"maxlon":16.34171,"minlat": 48.19612,"minlon":16.34066}}],
            {out:['skel']}
          ],
          toString: 'nwr["building"](48.19612,16.34066,48.19688,16.34171);out skel;',
          toQlStatementIds: 'nwr["building"](48.19612,16.34066,48.19688,16.34171)->._1;._1 out skel;',
          toQuery: 'nwr["building"](48.19612,16.34066,48.19688,16.34171)->._1;',
          result: {
            version: 0.6,
            generator,
            elements: [
              {"type":"way","id":86273634,"nodes":[2548006646,1001460111,2784273119,2548006710,2548006707,2548006706,2548006705,2548006686,2548006684,2548006676,2548006679,2548006674,2548006675,2548006681,1842841891,2548006654,1842841848,2548006646]},
              {"type":"way","id":173478248,"nodes":[2548006639,2548006638,2548006640,2548006645,1842841814,1842841832,2548006649,2548006658,1001460712,1842841852,1842841851,1842841854,1842841850,1842841842,1842841836,1842841875,1001460391,2548006644,1842841812,1842841782,2548006639]},
              {"type":"way","id":247954701,"nodes":[2548006645,2548006640,2548006646,1842841848,1842841844,1842841885,1842841891,2548006681,2548006675,1001460577,1842841887,1842841902,1842841892,1842841879,1001460894,1001460429,2548006658,2548006649,1842841840,1842841818,2548006645]},
              {"type":"relation","id":2316361,members:[{"ref":247954748,"type":"way","role":"outer"},{"ref":173478253,"type":"way","role":"inner"}]}
            ]
          }
        }, {}, done)
      })
      it ('nwr[building](48.19612,16.34066,48.19688,16.34171);out 2 body;', function (done) {
        overpassFrontend.clearCache()
        test('nwr[building](48.19612,16.34066,48.19688,16.34171);out 2 body;', {
          def: [
            [{"op":"has_key","key":"building"},{"fun":"bbox","value":{"maxlat":48.19688,"maxlon":16.34171,"minlat": 48.19612,"minlon":16.34066}}],
            {out:['2','body']}
          ],
          toString: 'nwr["building"](48.19612,16.34066,48.19688,16.34171);out 2 body;',
          toQlStatementIds: 'nwr["building"](48.19612,16.34066,48.19688,16.34171)->._1;._1 out 2 body;',
          toQuery: 'nwr["building"](48.19612,16.34066,48.19688,16.34171)->._1;',
          result: {
            version: 0.6,
            generator,
            elements: [
              {"type":"way","id":86273634,tags:{"building":"yes"},"nodes":[2548006646,1001460111,2784273119,2548006710,2548006707,2548006706,2548006705,2548006686,2548006684,2548006676,2548006679,2548006674,2548006675,2548006681,1842841891,2548006654,1842841848,2548006646]},
              {"type":"way","id":173478248,tags:{"building":"yes"},"nodes":[2548006639,2548006638,2548006640,2548006645,1842841814,1842841832,2548006649,2548006658,1001460712,1842841852,1842841851,1842841854,1842841850,1842841842,1842841836,1842841875,1001460391,2548006644,1842841812,1842841782,2548006639]}
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
            version: 0.6,
            generator,
            elements: [
              { type: 'node', id: 1863103110 },
              { type: 'way', id: 86273642 },
              { type: 'node', id: 1863103110, lat: 48.1992013, lon: 16.3406967, tags: {"amenity":"place_of_worship","denomination":"catholic","name":"Zum Göttlichen Heiland","religion":"christian"} },
              { type: 'way', id: 86273642, nodes: [1039442641,1965238263,1001461016,1001460674,1001461096,1842842028,1842842024,1842842023,1001460403,1039442583,1001460157,1039442513,2548006760,1001460572,2548006752,2548006747,2548006748,2548006753,2548006757,2548006749,2548006750,2548006751,2548006758,2548006759,2548006754,2548006756,2548006762,1001460923,1001460592,2548006769,2548006765,2548006766,2548006770,2548006774,2548006767,2548006768,2548006775,2548006778,2548006772,2548006773,2548006779,2548006784,2548006776,2548006777,2548006785,2548006786,2548006781,2548006783,2548006787,1039442579,1842842027,1842842026,1039442641], tags: {"amenity":"place_of_worship","building":"church","denomination":"catholic","name":"Lazaristenkirche","religion":"christian","wikipedia":"de:Lazaristenkirche (Neubau)"} }
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
            version: 0.6,
            generator,
            elements: [
              { type: 'node', id: 1863103110, lat: 48.1992013, lon: 16.3406967, tags: {"amenity":"place_of_worship","denomination":"catholic","name":"Zum Göttlichen Heiland","religion":"christian"} },
              { type: 'way', id: 86273642, nodes: [1039442641,1965238263,1001461016,1001460674,1001461096,1842842028,1842842024,1842842023,1001460403,1039442583,1001460157,1039442513,2548006760,1001460572,2548006752,2548006747,2548006748,2548006753,2548006757,2548006749,2548006750,2548006751,2548006758,2548006759,2548006754,2548006756,2548006762,1001460923,1001460592,2548006769,2548006765,2548006766,2548006770,2548006774,2548006767,2548006768,2548006775,2548006778,2548006772,2548006773,2548006779,2548006784,2548006776,2548006777,2548006785,2548006786,2548006781,2548006783,2548006787,1039442579,1842842027,1842842026,1039442641], tags: {"amenity":"place_of_worship","building":"church","denomination":"catholic","name":"Lazaristenkirche","religion":"christian","wikipedia":"de:Lazaristenkirche (Neubau)"} },
              { type: 'node', id: 1863103110 },
              { type: 'way', id: 86273642 },
            ]
          }
        }, {}, done)
      })
      it ('nwr[amenity];out body;out count;nwr[railway=station];out tags;', function (done) {
// [out:json][bbox:48.20074,16.33678,48.20227,16.33902];
        overpassFrontend.clearCache()
        test('nwr[amenity=place_of_worship];out body;nwr[railway=station];out tags;', {
          def: [
            [{"op":"=","key":"amenity","value":"place_of_worship"}],
            {out:['body']},
            [{"op":"=","key":"railway","value":"station"}],
            {out:['tags']},
          ],
          toString: 'nwr["amenity"="place_of_worship"];out body;nwr["railway"="station"];out tags;',
          toQlStatementIds: 'nwr["amenity"="place_of_worship"]->._1;._1 out body;nwr["railway"="station"]->._2;._2 out tags;',
          toQuery: 'nwr["railway"="station"]->._2;',
          recurse: [],
          getScript: [
            { id: 2, properties: 1, recurse: [] }
          ],
          compileQuery: {
            query: 'nwr["railway"="station"];',
            loki: {
              "tags.railway": { $eq: "station" }
            }
          },
          toLokijs: {
            "tags.railway": { $eq: "station" }
          },
          derefSets: [
            { type: 'nwr', filters: [ { key: 'railway', op: '=', value: 'station' } ] }
          ],
          cacheDescriptors: [
            { id: 'nwr["railway"="station"](properties:1)' }
          ],
          result: {
            version: 0.6,
            generator,
            elements: [
              { type: 'node', id: 1863103110, lat: 48.1992013, lon: 16.3406967, tags: {"amenity":"place_of_worship","denomination":"catholic","name":"Zum Göttlichen Heiland","religion":"christian"} },
              { type: 'way', id: 86273642, nodes: [1039442641,1965238263,1001461016,1001460674,1001461096,1842842028,1842842024,1842842023,1001460403,1039442583,1001460157,1039442513,2548006760,1001460572,2548006752,2548006747,2548006748,2548006753,2548006757,2548006749,2548006750,2548006751,2548006758,2548006759,2548006754,2548006756,2548006762,1001460923,1001460592,2548006769,2548006765,2548006766,2548006770,2548006774,2548006767,2548006768,2548006775,2548006778,2548006772,2548006773,2548006779,2548006784,2548006776,2548006777,2548006785,2548006786,2548006781,2548006783,2548006787,1039442579,1842842027,1842842026,1039442641], tags: {"amenity":"place_of_worship","building":"church","denomination":"catholic","name":"Lazaristenkirche","religion":"christian","wikipedia":"de:Lazaristenkirche (Neubau)"} },
              { type: 'node', id: 60093107, tags: {"name":"Wien Westbahnhof","operator":"ÖBB","railway":"station","railway:position":"0.0","railway:position:exact":"0.000","railway:ref":"Ws","railway:ref:DB":"XAWW","short_name":"Wien Westbf","uic_name":"Wien Westbahnhof","uic_ref":"8100003","wheelchair":"yes"} },
              { type: 'node', id: 4161756600, tags: {"name":"Westbahnhof","network":"VOR","operator":"Wiener Linien","platforms":"2","public_transport":"station","railway":"station","railway:position":"3.5","railway:position:exact":"3.492","railway:ref":"WS","ref":"1468","station":"subway","uic_name":"Wien Westbahnhof (U3)","uic_ref":"8170066","wheelchair":"yes"} },
              { type: 'node', id: 4281897753, tags: {"name":"Westbahnhof","network":"VOR","operator":"Wiener Linien","platforms":"2","public_transport":"station","railway":"station","railway:position":"8.0","railway:position:exact":"8.022","railway:ref":"WS","ref":"1468","station":"subway","uic_name":"Wien Westbahnhof (U6)","uic_ref":"8102005","wheelchair":"yes"} }
            ]
          }
        }, {}, done)
      })
    })

    describe("Query options " + mode, function () {
      it ('[bbox:48.196589,16.338580,48.199714,16.341262];nwr[amenity=place_of_worship];out;', function (done) {
// [out:json]
        test('[bbox:48.196589,16.338580,48.199714,16.341262];nwr[amenity=place_of_worship];out;', {
          result: {
            version: 0.6,
            generator,
            elements: [
              { type: 'node', id: 1863103110, lat: 48.1992013, lon: 16.3406967, tags: {"amenity":"place_of_worship","denomination":"catholic","name":"Zum Göttlichen Heiland","religion":"christian"} },
              { type: 'way', id: 86273642, nodes: [1039442641,1965238263,1001461016,1001460674,1001461096,1842842028,1842842024,1842842023,1001460403,1039442583,1001460157,1039442513,2548006760,1001460572,2548006752,2548006747,2548006748,2548006753,2548006757,2548006749,2548006750,2548006751,2548006758,2548006759,2548006754,2548006756,2548006762,1001460923,1001460592,2548006769,2548006765,2548006766,2548006770,2548006774,2548006767,2548006768,2548006775,2548006778,2548006772,2548006773,2548006779,2548006784,2548006776,2548006777,2548006785,2548006786,2548006781,2548006783,2548006787,1039442579,1842842027,1842842026,1039442641], tags: {"amenity":"place_of_worship","building":"church","denomination":"catholic","name":"Lazaristenkirche","religion":"christian","wikipedia":"de:Lazaristenkirche (Neubau)"} }
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
            version: 0.6,
            generator,
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
            version: 0.6,
            generator,
            elements: [
              { type: 'count', id: 0,
                tags: { nodes: '1', ways: '1', relations: '0', total: '2' }
              }
            ]
          }
        }, {}, done)
      })
      it ('nwr[building](48.19612,16.34066,48.19688,16.34171);out meta geom;', function (done) {
// [out:json][bbox:48.20074,16.33678,48.20227,16.33902];
        test('nwr[building](48.19612,16.34066,48.19688,16.34171);out meta geom;', {
          def: [
            [{"op":"has_key","key":"building"},{"fun":"bbox","value":{"maxlat":48.19688,"maxlon":16.34171,"minlat": 48.19612,"minlon":16.34066}}],
            {out:['meta', 'geom']}
          ],
          toString: 'nwr["building"](48.19612,16.34066,48.19688,16.34171);out meta geom;',
          toQlStatementIds: 'nwr["building"](48.19612,16.34066,48.19688,16.34171)->._1;._1 out meta geom;',
          toQuery: 'nwr["building"](48.19612,16.34066,48.19688,16.34171)->._1;',
          result: {
            version: 0.6,
            generator,
            elements: [
              {"type":"way","id":86273634,"version":6,"timestamp":"2014-04-11T21:30:26Z","changeset":21635523,"uid":1066249,"user":"Railjet","tags":{"building":"yes"},"bounds":{"minlon":16.3408891,"minlat":48.1963491,"maxlon":16.3415051,"maxlat":48.1967389},"nodes":[2548006646,1001460111,2784273119,2548006710,2548006707,2548006706,2548006705,2548006686,2548006684,2548006676,2548006679,2548006674,2548006675,2548006681,1842841891,2548006654,1842841848,2548006646],"geometry":[{"lat":48.1963491,"lon":16.3411739},{"lat":48.1964054,"lon":16.3415051},{"lat":48.1964648,"lon":16.3414911},{"lat":48.1967389,"lon":16.3414268},{"lat":48.1967295,"lon":16.341235},{"lat":48.1967237,"lon":16.3411154},{"lat":48.1967203,"lon":16.3409434},{"lat":48.1966191,"lon":16.3409658},{"lat":48.1966133,"lon":16.3408891},{"lat":48.1965521,"lon":16.3409009},{"lat":48.19656,"lon":16.3409788},{"lat":48.1965493,"lon":16.3409815},{"lat":48.1965518,"lon":16.3409955},{"lat":48.1965672,"lon":16.3410879},{"lat":48.1964829,"lon":16.341108},{"lat":48.1964659,"lon":16.3411127},{"lat":48.1964088,"lon":16.3411444},{"lat":48.1963491,"lon":16.3411739}]},
{"type":"way","id":173478248,"version":2,"timestamp":"2013-11-24T00:22:29Z","changeset":19083846,"uid":17047,"user":"KaiRo","tags":{"building":"yes"},"bounds":{"minlon":16.3403654,"minlat":48.196223,"maxlon":16.3408116,"maxlat":48.1965052},"nodes":[2548006639,2548006638,2548006640,2548006645,1842841814,1842841832,2548006649,2548006658,1001460712,1842841852,1842841851,1842841854,1842841850,1842841842,1842841836,1842841875,1001460391,2548006644,1842841812,1842841782,2548006639],"geometry":[{"lat":48.1962851,"lon":16.3404265},{"lat":48.196223,"lon":16.3404503},{"lat":48.1962873,"lon":16.3408116},{"lat":48.1963466,"lon":16.340789},{"lat":48.1963407,"lon":16.3407562},{"lat":48.1963891,"lon":16.3407384},{"lat":48.1963952,"lon":16.3407702},{"lat":48.1965052,"lon":16.340728},{"lat":48.1964888,"lon":16.3406373},{"lat":48.1964236,"lon":16.3406607},{"lat":48.1964127,"lon":16.3405973},{"lat":48.1964271,"lon":16.3405918},{"lat":48.1964148,"lon":16.3405209},{"lat":48.1964002,"lon":16.3405253},{"lat":48.1963916,"lon":16.3404796},{"lat":48.1964571,"lon":16.3404565},{"lat":48.1964411,"lon":16.3403654},{"lat":48.1963316,"lon":16.3404081},{"lat":48.1963368,"lon":16.3404367},{"lat":48.1962898,"lon":16.3404551},{"lat":48.1962851,"lon":16.3404265}]},
{"type":"way","id":247954701,"version":1,"timestamp":"2013-11-24T00:22:22Z","changeset":19083846,"uid":17047,"user":"KaiRo","tags":{"building":"yes"},"bounds":{"minlon":16.340728,"minlat":48.1962873,"maxlon":16.3411739,"maxlat":48.1965672},"nodes":[2548006645,2548006640,2548006646,1842841848,1842841844,1842841885,1842841891,2548006681,2548006675,1001460577,1842841887,1842841902,1842841892,1842841879,1001460894,1001460429,2548006658,2548006649,1842841840,1842841818,2548006645],"geometry":[{"lat":48.1963466,"lon":16.340789},{"lat":48.1962873,"lon":16.3408116},{"lat":48.1963491,"lon":16.3411739},{"lat":48.1964088,"lon":16.3411444},{"lat":48.1964041,"lon":16.341115},{"lat":48.1964759,"lon":16.3410856},{"lat":48.1964829,"lon":16.341108},{"lat":48.1965672,"lon":16.3410879},{"lat":48.1965518,"lon":16.3409955},{"lat":48.1964838,"lon":16.3410127},{"lat":48.1964766,"lon":16.3409601},{"lat":48.196492,"lon":16.340955},{"lat":48.1964798,"lon":16.3408824},{"lat":48.1964623,"lon":16.3408868},{"lat":48.1964552,"lon":16.3408432},{"lat":48.1965224,"lon":16.3408183},{"lat":48.1965052,"lon":16.340728},{"lat":48.1963952,"lon":16.3407702},{"lat":48.196402,"lon":16.3408132},{"lat":48.1963543,"lon":16.3408323},{"lat":48.1963466,"lon":16.340789}]},
{"type":"relation","id":2316361,"version":2,"timestamp":"2013-11-24T00:22:27Z","changeset":19083846,"uid":17047,"user":"KaiRo","tags":{"addr:city":"Wien","addr:country":"AT","addr:housenumber":"5","addr:postcode":"1070","addr:street":"Kaiserstraße","building":"yes","type":"multipolygon"},"bounds":{"minlon":16.3408984,"minlat":48.1967203,"maxlon":16.3414268,"maxlat":48.1969548},"members":[{"ref":247954748,"type":"way","role":"outer","geometry":[{"lat":48.1967389,"lon":16.3414268},{"lat":48.1969548,"lon":16.341377},{"lat":48.1969094,"lon":16.3408984},{"lat":48.1967642,"lon":16.3409329},{"lat":48.1967203,"lon":16.3409434},{"lat":48.1967237,"lon":16.3411154},{"lat":48.1967453,"lon":16.3411126},{"lat":48.1967484,"lon":16.3410969},{"lat":48.1967603,"lon":16.341095},{"lat":48.1967629,"lon":16.3411288},{"lat":48.1967514,"lon":16.3411375},{"lat":48.1967426,"lon":16.3411565},{"lat":48.1967408,"lon":16.3411772},{"lat":48.196745,"lon":16.3411956},{"lat":48.1967563,"lon":16.3412107},{"lat":48.1967731,"lon":16.341217},{"lat":48.1967773,"lon":16.3412515},{"lat":48.196763,"lon":16.3412529},{"lat":48.1967575,"lon":16.3412346},{"lat":48.1967295,"lon":16.341235},{"lat":48.1967389,"lon":16.3414268}]},{"ref":173478253,"type":"way","role":"inner","geometry":[{"lat":48.1968358,"lon":16.3410804},{"lat":48.1967839,"lon":16.3410913},{"lat":48.1967907,"lon":16.3411551},{"lat":48.1968072,"lon":16.3411529},{"lat":48.1968095,"lon":16.3411789},{"lat":48.1967932,"lon":16.3411804},{"lat":48.1967998,"lon":16.3412502},{"lat":48.1968494,"lon":16.3412386},{"lat":48.1968358,"lon":16.3410804}]}]}
            ]
          }
        }, {}, done)
      })
      it ('nwr[building](48.19612,16.34066,48.19688,16.34171);out skel;', function (done) {
        test('nwr[building](48.19612,16.34066,48.19688,16.34171);out skel;', {
          def: [
            [{"op":"has_key","key":"building"},{"fun":"bbox","value":{"maxlat":48.19688,"maxlon":16.34171,"minlat": 48.19612,"minlon":16.34066}}],
            {out:['skel']}
          ],
          toString: 'nwr["building"](48.19612,16.34066,48.19688,16.34171);out skel;',
          toQlStatementIds: 'nwr["building"](48.19612,16.34066,48.19688,16.34171)->._1;._1 out skel;',
          toQuery: 'nwr["building"](48.19612,16.34066,48.19688,16.34171)->._1;',
          result: {
            version: 0.6,
            generator,
            elements: [
              {"type":"way","id":86273634,"nodes":[2548006646,1001460111,2784273119,2548006710,2548006707,2548006706,2548006705,2548006686,2548006684,2548006676,2548006679,2548006674,2548006675,2548006681,1842841891,2548006654,1842841848,2548006646]},
              {"type":"way","id":173478248,"nodes":[2548006639,2548006638,2548006640,2548006645,1842841814,1842841832,2548006649,2548006658,1001460712,1842841852,1842841851,1842841854,1842841850,1842841842,1842841836,1842841875,1001460391,2548006644,1842841812,1842841782,2548006639]},
              {"type":"way","id":247954701,"nodes":[2548006645,2548006640,2548006646,1842841848,1842841844,1842841885,1842841891,2548006681,2548006675,1001460577,1842841887,1842841902,1842841892,1842841879,1001460894,1001460429,2548006658,2548006649,1842841840,1842841818,2548006645]},
              {"type":"relation","id":2316361,members:[{"ref":247954748,"type":"way","role":"outer"},{"ref":173478253,"type":"way","role":"inner"}]}
            ]
          }
        }, {}, done)
      })
      it ('nwr[building](48.19612,16.34066,48.19688,16.34171);out 2 body;', function (done) {
        overpassFrontend.clearCache()
        test('nwr[building](48.19612,16.34066,48.19688,16.34171);out 2 body;', {
          def: [
            [{"op":"has_key","key":"building"},{"fun":"bbox","value":{"maxlat":48.19688,"maxlon":16.34171,"minlat": 48.19612,"minlon":16.34066}}],
            {out:['2','body']}
          ],
          toString: 'nwr["building"](48.19612,16.34066,48.19688,16.34171);out 2 body;',
          toQlStatementIds: 'nwr["building"](48.19612,16.34066,48.19688,16.34171)->._1;._1 out 2 body;',
          toQuery: 'nwr["building"](48.19612,16.34066,48.19688,16.34171)->._1;',
          result: {
            version: 0.6,
            generator,
            elements: [
              {"type":"way","id":86273634,tags:{"building":"yes"},"nodes":[2548006646,1001460111,2784273119,2548006710,2548006707,2548006706,2548006705,2548006686,2548006684,2548006676,2548006679,2548006674,2548006675,2548006681,1842841891,2548006654,1842841848,2548006646]},
              {"type":"way","id":173478248,tags:{"building":"yes"},"nodes":[2548006639,2548006638,2548006640,2548006645,1842841814,1842841832,2548006649,2548006658,1001460712,1842841852,1842841851,1842841854,1842841850,1842841842,1842841836,1842841875,1001460391,2548006644,1842841812,1842841782,2548006639]}
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

  if (expected.def) {
    var f = new Filter(input)

    assert.deepEqual(f.def, expected.def)
    assert.equal(f.toString(), expected.toString)
    assert.equal(f.toQl({ setsUseStatementIds: true }), expected.toQlStatementIds)
    assert.equal(f.toQuery(), expected.toQuery)
  }
  if (expected.recurse) {
    assert.deepEqual(f.recurse(), expected.recurse)
  }
  if (expected.getScript) {
    assert.deepEqual(f.getScript(), expected.getScript)
  }
  if (expected.compileQuery) {
    assert.deepEqual(f.compileQuery(), expected.compileQuery)
  }
  if (expected.toLokijs) {
    assert.deepEqual(f.toLokijs(), expected.toLokijs)
  }
  if (expected.derefSets) {
    assert.deepEqual(f.derefSets(), expected.derefSets)
  }
  if (expected.cacheDescriptors) {
    assert.deepEqual(f.cacheDescriptors(), expected.cacheDescriptors)
  }

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

      // console.log(result.elements.map(el => JSON.stringify(el)).join('\n'))
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
