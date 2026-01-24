const GeowikiAPI = require('geowiki-api')

// you may specify an OSM file as url, e.g. 'test/data.osm.bz2'
const geowikiAPI = new GeowikiAPI('//overpass-api.de/api/interpreter')

// request some popular items by ID
geowikiAPI.get(
  ['n27365030', 'w5013364'],
  {
    out: 'json',
    outOptions: 'tags',
    each: item => console.log('* ' + item.tags.name + ' (' + item.type + '/' + item.id + ')')
  },
  function (err, result) {
    if (err) { console.log(err) }
    // console.log(result) // the final result in OSM JSON format
  }
)
