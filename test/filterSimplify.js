const assert = require('assert')
const Filter = require('../src/Filter')

const list = {
  'node[a];node._[b];': {
    str: 'node["b"]["a"];',
    loki: {"type":{"$eq":"node"},"tags.b":{"$exists":true},"tags.a":{"$exists":true}},
  },
  '(node[a];node._[b];);': {
    str: '(node["a"];node["b"]["a"];);',
    loki: {"$or":[{"type":{"$eq":"node"},"tags.a":{"$exists":true}},{"type":{"$eq":"node"},"tags.b":{"$exists":true},"tags.a":{"$exists":true}}]},
  },
  '(node[a];);': {
    str: 'node["a"];',
    loki: {"type":{"$eq":"node"},"tags.a":{"$exists":true}},
  },
  '((node[a];););': {
    str: 'node["a"];',
    loki: {"type":{"$eq":"node"},"tags.a":{"$exists":true}},
  },
  //'((();node[a];););': {
  //  str: 'node["a"];', // TODO
  //  loki: {"type":{"$eq":"node"},"tags.a":{"$exists":true}},
  //},
  'relation[b];node(r)[b]->._a;node._a[a];': {
    str: 'relation["b"];node(r)["a"]["b"];',
    loki: {"type":{"$eq":"node"},"tags.a":{"$exists":true},"tags.b":{"$exists":true}},
  },
  'relation[b];node(r)[b]->._a;node._a[a];node._[c];': {
    str: 'relation["b"];node(r)["c"]["a"]["b"];',
    loki: {"type":{"$eq":"node"},"tags.c":{"$exists":true},"tags.a":{"$exists":true},"tags.b":{"$exists":true}},
  },
  '(way[c];way[d];)->._2;nwr._2[a];': {
    str: '(way["c"]["a"];way["d"]["a"];);',
    loki: {"$not":true}, // TODO
  },
  '(way[c];way[d];)->._2;nwr._2[a];nwr._[b];': {
    str: '(way["c"]["b"]["a"];way["d"]["b"]["a"];);',
    loki: {"$not":true}, // TODO
  },
  'relation->._a;(node(r._a)[a];way[b];);': {
    str: 'relation->._a;(node(r._a)["a"];way["b"];);',
    loki: {},
  },
  'nwr(48.195,16.335,48.2,16.345)->._base;nwr._base["cuisine"]->._base;(node._base["amenity"="restaurant"];way._base["amenity"="restaurant"];relation._base["amenity"="restaurant"];);nwr._(properties:13);': {
    str: '(node["amenity"="restaurant"]["cuisine"](48.195,16.335,48.2,16.345)(properties:13);way["amenity"="restaurant"]["cuisine"](48.195,16.335,48.2,16.345)(properties:13);relation["amenity"="restaurant"]["cuisine"](48.195,16.335,48.2,16.345)(properties:13););',
    loki: {"$not":true}, // TODO
  },
}

describe('Filter.simplify()', function () {
  Object.entries(list).forEach(([input, expected]) => {
    it(input, function () {
      const filter = new Filter(input)
      filter.simplify()

      const actualStr = filter.toString()
      assert.equal(actualStr, expected.str)

      const actualLoki = filter.toLokijs()
      //console.log('loki:', JSON.stringify(actualLoki))
      assert.deepEqual(actualLoki, expected.loki)
    })
  })
})
