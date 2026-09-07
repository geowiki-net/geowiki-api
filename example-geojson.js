const fs = require('fs')
const GeowikiAPI = require('@geowiki-net/geowiki-api')

// you may specify an OSM file as url, e.g. 'test/data.osm.bz2'
const geowikiAPI = new GeowikiAPI('//overpass-api.de/api/interpreter')

// request restaurants in the specified bounding box
geowikiAPI.query(
  '[out:geojson][bbox:48.19,16.33,48.20,16.34];nwr[building];out geom;',
  function (err, result) {
    if (err) { return console.error("Error loading data:", err.message) }
    fs.writeFile('output.geojson', JSON.stringify(result, null, '  '), (err) => {
      if (err) { return console.error("Can't write file:", err.message) }
      console.log('written to output.geojson')
    })
  }
)
