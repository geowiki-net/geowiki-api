const assert = require('assert')
const Filter = require('../src/Filter')

const list = {
  'node[a];node._[b];': 'node["b"]["a"];',
  '(node[a];node._[b];);': '(node["a"];node["b"]["a"];);',
  '(node[a];);': 'node["a"];',
  '((node[a];););': 'node["a"];',
  //'((();node[a];););': 'node["a"];', // TODO
  'relation[b];node(r)[b]->._a;node._a[a];': 'relation["b"];node(r)["a"]["b"];',
  'relation[b];node(r)[b]->._a;node._a[a];node._[c];': 'relation["b"];node(r)["c"]["a"]["b"];',
  '(way[c];way[d];)->._2;nwr._2[a];': '(way["c"]["a"];way["d"]["a"];);',
  '(way[c];way[d];)->._2;nwr._2[a];nwr._[b];': '(way["c"];way["d"];)->._2;nwr._2["b"]["a"];', // TODO
  'relation->._a;(node(r._a)[a];way[b];);': 'relation->._a;(node(r._a)["a"];way["b"];);',
}

describe('Filter.simplify()', function () {
  Object.entries(list).forEach(([input, expected]) => {
    it(input, function () {
      const filter = new Filter(input)
      filter.simplify()
      const actual = filter.toString()

      assert.equal(actual, expected)
    })
  })
})
