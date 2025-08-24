const assert = require('assert')
const Filter = require('../src/Filter')

const list = {
  'node[a];node._[b];': {
    str: 'node["b"]["a"];',
    loki: {"type":{"$eq":"node"},"tags.b":{"$exists":true},"tags.a":{"$exists":true}},
  },
  'relation[b];node(r)[b]->._a;node._a[a];': {
    str: 'relation["b"];node(r)["a"]["b"];',
    loki: {"type":{"$eq":"node"},"tags.a":{"$exists":true},"tags.b":{"$exists":true}},
  },
  'relation[b];node(r)[b]->._a;node._a[a];node._[c];': {
    str: 'relation["b"];node(r)["c"]["a"]["b"];',
    loki: {"type":{"$eq":"node"},"tags.c":{"$exists":true},"tags.a":{"$exists":true},"tags.b":{"$exists":true}},
  },
  'way;node(w);': {
    str: 'way;node(w);',
    loki: {"type":{"$eq":"node"}},
  },
  'way[a];node(w)->.a;way[a];node.a(w);': {
    str: 'way["a"]->._1;way["a"];node(w)(w._1);',
    loki: {"type":{"$eq":"node"}},
  },
}

describe('Filter.conflate()', function () {
  Object.entries(list).forEach(([input, expected]) => {
    it(input, function () {
      const filter = new Filter(input)
      filter.conflate()

      const actualStr = filter.toString()
      assert.equal(actualStr, expected.str)

      const actualLoki = filter.toLokijs()
      //console.log('loki:', JSON.stringify(actualLoki))
      assert.deepEqual(actualLoki, expected.loki)
    })
  })
})
