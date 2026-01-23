const GeowikiAPI = require('geowiki-api')

// you may specify an OSM file as url, e.g. 'test/data.osm.bz2'
const geowikiAPI = new GeowikiAPI('//overpass-api.de/api/interpreter')

// request restaurants in the specified bounding box
geowikiAPI.get(
  ['n27365030', 'w5013364'],
  {
    properties: GeowikiAPI.TAGS
  },
  function (err, result) {
    if (result) {
      console.log('* ' + result.tags.name + ' (' + result.id + ')')
    } else {
      console.log('* empty result')
    }
  },
  function (err) {
    if (err) { console.log(err) }
  }
)
