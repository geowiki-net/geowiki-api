const assert = require('assert')
const Filter = require('../src/Filter')

const list = {
  'node[a];node._[b];': 'node["b"]["a"];',
  '(node[a];node._[b];);': '(node["a"];node["b"]["a"];);',
  '(node[a];);': 'node["a"];',
  '((node[a];););': 'node["a"];',
  '((();node[a];););': 'node["a"];',
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
