const assert = require('assert').strict

module.exports = function testOverpassObject (ob, outResults) {
  Object.entries(outResults).forEach(([param, expected]) => {
    it(param, function () {
      const options = {}
      param.split(' ').forEach(p => options[p] = true)

      const actual = ob.out(options)

      assert.deepEqual(actual, expected)
    })
  })
}
