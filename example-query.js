const GeowikiAPI = require('geowiki-api')

// you may specify an OSM file as url, e.g. 'test/data.osm.bz2'
const geowikiAPI = new GeowikiAPI('//overpass-api.de/api/interpreter')

// request restaurants in the specified bounding box
geowikiAPI.query(
  '[out:object][bbox:48.19,16.33,48.20,16.34];nwr[amenity=restaurant];out;',
  {
    each: item => console.log('* ' + item.tags.name + ' (' + item.type + '/' + item.id + ')')
  },
  function (err, result) {
    if (err) { console.log(err) }
    console.log(result) // the final result (almost) as expected by Overpass API
  }
)
