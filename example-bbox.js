const GeowikiAPI = require('geowiki-api')

// you may specify an OSM file as url, e.g. 'test/data.osm.bz2'
const geowikiAPI = new GeowikiAPI('//overpass-api.de/api/interpreter')

// request restaurants in the specified bounding box
geowikiAPI.BBoxQuery(
  'nwr[amenity=restaurant]',
  { minlat: 48.19, maxlat: 48.20, minlon: 16.33, maxlon: 16.34 },
  {
    properties: GeowikiAPI.ALL
  },
  function (err, result) {
    console.log('* ' + result.tags.name + ' (' + result.id + ')')
  },
  function (err) {
    if (err) { console.log(err) }
  }
)
