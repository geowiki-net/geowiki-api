const assert = require('assert').strict
const fs = require('fs')

const fileFormatGeoJSON = require('../src/fileFormatGeoJSON')

describe('fileFormatGeoJSON', function () {
  const elements = []

  it ('parse and check result', function (done) {
    const data = fs.readFileSync('test/geojson.geojson')
    const expected = JSON.parse(fs.readFileSync('test/geojson.result'))

    fileFormatGeoJSON.load(data, {}, (err, result) => {
      //fs.writeFileSync('test/geojson.result', JSON.stringify(result, null, '  '))
      assert.deepEqual(result, expected, 'fileFormatGeoJSON: invalid result')
      done()
    })
  })
})
