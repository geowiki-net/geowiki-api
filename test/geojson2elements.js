const assert = require('assert').strict
const fs = require('fs')

const geojson2elements = require('../src/geojson2elements')

describe('geojson2elements', function () {
  const elements = []

  it ('parse and check result', function () {
    const data = JSON.parse(fs.readFileSync('test/geojson.geojson'))
    const expected = JSON.parse(fs.readFileSync('test/geojson.result'))

    geojson2elements(data, elements, {})

    //fs.writeFileSync('test/geojson.result', JSON.stringify(elements, null, '  '))
    assert.deepEqual(elements, expected, 'geojson2elements: invalid result')
  })
})
