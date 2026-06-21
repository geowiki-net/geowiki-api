const assert = require('assert')
const BoundingBox = require('boundingbox')

const defines = require('../src/defines')
const Filter = require('../src/Filter')
const DBTypePostpass = require('../src/DBTypePostpass')
const GeowikiAPI = require('..')

const queryList = {
  'nwr': {
    'bboxquery': false,
    'tags': "SELECT t.osm_id, t.osm_type, t.geom, t.tags FROM postpass_pointlinepolygon t",
    'tags-members': "SELECT t.osm_id, t.osm_type, t.geom, t.tags, w.nodes, r.members FROM postpass_pointlinepolygon t left join planet_osm_ways w on t.osm_type = 'W' and t.osm_id = w.id left join planet_osm_rels r on t.osm_type = 'R' and t.osm_id = r.id"
  },
  'node': {
    'tags': "SELECT t.osm_id, t.osm_type, t.geom, t.tags FROM postpass_point t",
    'tags-members': "SELECT t.osm_id, t.osm_type, t.geom, t.tags, '{}'::bigint[] as \"nodes\", '{}'::jsonb as \"members\" FROM postpass_point t"
  },
  'way': {
    'tags': "SELECT t.osm_id, t.osm_type, t.geom, t.tags FROM (SELECT osm_id, osm_type, tags, geom FROM postpass_line WHERE osm_type='W' UNION SELECT osm_id, osm_type, tags, geom FROM postpass_polygon WHERE osm_type='W') t",
    'tags-members': "SELECT t.osm_id, t.osm_type, t.geom, t.tags, w.nodes, r.members FROM (SELECT osm_id, osm_type, tags, geom FROM postpass_line WHERE osm_type='W' UNION SELECT osm_id, osm_type, tags, geom FROM postpass_polygon WHERE osm_type='W') t left join planet_osm_ways w on t.osm_type = 'W' and t.osm_id = w.id left join planet_osm_rels r on t.osm_type = 'R' and t.osm_id = r.id"
  },
  'relation': {
    'tags': "SELECT t.osm_id, t.osm_type, t.geom, t.tags FROM (SELECT osm_id, osm_type, tags, geom FROM postpass_pointlinepolygon WHERE osm_type='R') t",
    'tags-members': "SELECT t.osm_id, t.osm_type, t.geom, t.tags, w.nodes, r.members FROM (SELECT osm_id, osm_type, tags, geom FROM postpass_pointlinepolygon WHERE osm_type='R') t left join planet_osm_ways w on t.osm_type = 'W' and t.osm_id = w.id left join planet_osm_rels r on t.osm_type = 'R' and t.osm_id = r.id"
  },
  'nwr[amenity=restaurant]': {
    'tags': "SELECT t.osm_id, t.osm_type, t.geom, t.tags FROM postpass_pointlinepolygon t WHERE t.tags->>'amenity'='restaurant'",
    'tags-members': "SELECT t.osm_id, t.osm_type, t.geom, t.tags, w.nodes, r.members FROM postpass_pointlinepolygon t left join planet_osm_ways w on t.osm_type = 'W' and t.osm_id = w.id left join planet_osm_rels r on t.osm_type = 'R' and t.osm_id = r.id WHERE t.tags->>'amenity'='restaurant'"
  },
  'nwr[amenity=restaurant][cuisine]': {
    'tags': "SELECT t.osm_id, t.osm_type, t.geom, t.tags FROM postpass_pointlinepolygon t WHERE t.tags->>'amenity'='restaurant' AND t.tags?'cuisine'",
    'tags-members': "SELECT t.osm_id, t.osm_type, t.geom, t.tags, w.nodes, r.members FROM postpass_pointlinepolygon t left join planet_osm_ways w on t.osm_type = 'W' and t.osm_id = w.id left join planet_osm_rels r on t.osm_type = 'R' and t.osm_id = r.id WHERE t.tags->>'amenity'='restaurant' AND t.tags?'cuisine'"
  },
  'nwr[amenity=restaurant][cuisine~";"]': {
    'tags': "SELECT t.osm_id, t.osm_type, t.geom, t.tags FROM postpass_pointlinepolygon t WHERE t.tags->>'amenity'='restaurant' AND t.tags->>'cuisine'~';'",
    'tags-members': "SELECT t.osm_id, t.osm_type, t.geom, t.tags, w.nodes, r.members FROM postpass_pointlinepolygon t left join planet_osm_ways w on t.osm_type = 'W' and t.osm_id = w.id left join planet_osm_rels r on t.osm_type = 'R' and t.osm_id = r.id WHERE t.tags->>'amenity'='restaurant' AND t.tags->>'cuisine'~';'"
  },
  '(nwr[amenity=restaurant];nwr[bar];)': {
    'tags': "(SELECT t.osm_id, t.osm_type, t.geom, t.tags FROM postpass_pointlinepolygon t WHERE t.tags->>'amenity'='restaurant') UNION (SELECT t.osm_id, t.osm_type, t.geom, t.tags FROM postpass_pointlinepolygon t WHERE t.tags?'bar')",
    'tags-members': "(SELECT t.osm_id, t.osm_type, t.geom, t.tags, w.nodes, r.members FROM postpass_pointlinepolygon t left join planet_osm_ways w on t.osm_type = 'W' and t.osm_id = w.id left join planet_osm_rels r on t.osm_type = 'R' and t.osm_id = r.id WHERE t.tags->>'amenity'='restaurant') UNION (SELECT t.osm_id, t.osm_type, t.geom, t.tags, w.nodes, r.members FROM postpass_pointlinepolygon t left join planet_osm_ways w on t.osm_type = 'W' and t.osm_id = w.id left join planet_osm_rels r on t.osm_type = 'R' and t.osm_id = r.id WHERE t.tags?'bar')"
  },
  'way(id:4583259,38279772)': {
    'tags': "SELECT t.osm_id, t.osm_type, t.geom, t.tags FROM (SELECT osm_id, osm_type, tags, geom FROM postpass_line WHERE osm_type='W' UNION SELECT osm_id, osm_type, tags, geom FROM postpass_polygon WHERE osm_type='W') t WHERE osm_id = ANY('{4583259,38279772}')",
    'tags-members': "SELECT t.osm_id, t.osm_type, t.geom, t.tags, w.nodes, r.members FROM (SELECT osm_id, osm_type, tags, geom FROM postpass_line WHERE osm_type='W' UNION SELECT osm_id, osm_type, tags, geom FROM postpass_polygon WHERE osm_type='W') t left join planet_osm_ways w on t.osm_type = 'W' and t.osm_id = w.id left join planet_osm_rels r on t.osm_type = 'R' and t.osm_id = r.id WHERE osm_id = ANY('{4583259,38279772}')"
  },
  'way[highway](4583259)': {
    'tags': "SELECT t.osm_id, t.osm_type, t.geom, t.tags FROM (SELECT osm_id, osm_type, tags, geom FROM postpass_line WHERE osm_type='W' UNION SELECT osm_id, osm_type, tags, geom FROM postpass_polygon WHERE osm_type='W') t WHERE t.tags?'highway' AND osm_id = ANY('{4583259}')",
    'tags-members': "SELECT t.osm_id, t.osm_type, t.geom, t.tags, w.nodes, r.members FROM (SELECT osm_id, osm_type, tags, geom FROM postpass_line WHERE osm_type='W' UNION SELECT osm_id, osm_type, tags, geom FROM postpass_polygon WHERE osm_type='W') t left join planet_osm_ways w on t.osm_type = 'W' and t.osm_id = w.id left join planet_osm_rels r on t.osm_type = 'R' and t.osm_id = r.id WHERE t.tags?'highway' AND osm_id = ANY('{4583259}')"
  },
  '(node[place=continent];way(4583259);)': {
    'tags': "(SELECT t.osm_id, t.osm_type, t.geom, t.tags FROM postpass_point t WHERE t.tags->>'place'='continent') UNION (SELECT t.osm_id, t.osm_type, t.geom, t.tags FROM (SELECT osm_id, osm_type, tags, geom FROM postpass_line WHERE osm_type='W' UNION SELECT osm_id, osm_type, tags, geom FROM postpass_polygon WHERE osm_type='W') t WHERE osm_id = ANY('{4583259}'))",
    'tags-members': "(SELECT t.osm_id, t.osm_type, t.geom, t.tags, '{}'::bigint[] as \"nodes\", '{}'::jsonb as \"members\" FROM postpass_point t WHERE t.tags->>'place'='continent') UNION (SELECT t.osm_id, t.osm_type, t.geom, t.tags, w.nodes, r.members FROM (SELECT osm_id, osm_type, tags, geom FROM postpass_line WHERE osm_type='W' UNION SELECT osm_id, osm_type, tags, geom FROM postpass_polygon WHERE osm_type='W') t left join planet_osm_ways w on t.osm_type = 'W' and t.osm_id = w.id left join planet_osm_rels r on t.osm_type = 'R' and t.osm_id = r.id WHERE osm_id = ANY('{4583259}'))"
  }
}

describe('DBTypePostpass', function () {
  let db
  let geowiki

  it('initialize', function () {
    db = new DBTypePostpass('', {})
    geowiki = new GeowikiAPI('', {
      dbType: 'postpass'
    })
  })

  describe('compile filter with tags, without bounds', function () {
    Object.entries(queryList).forEach(([query, def]) => {
      it(query, function () {
        const filter = new Filter(query)
        const result = db.compile(filter, {
          properties: defines.TAGS
        })

        assert.equal(result, def.tags)
      })
    })
  })

  describe('compile filter with tags, with bounds', function () {
    Object.entries(queryList).forEach(([query, def]) => {
      it(query, function () {
        const filter = new Filter(query)
        const result = db.compile(filter, {
          properties: defines.TAGS,
          bounds: new BoundingBox({ minlon: 1, minlat: 1, maxlon: 2, maxlat: 2 })
        })

        assert.equal(result, 'SELECT * FROM (' + def.tags + ') WHERE geom && st_setsrid(st_makebox2d(st_makepoint(1,1), st_makepoint(2,2)), 4326)')
      })
    })
  })

  describe('compile filter with tags and members, without bounds', function () {
    Object.entries(queryList).forEach(([query, def]) => {
      it(query, function () {
        const filter = new Filter(query)
        const result = db.compile(filter, {
          properties: defines.TAGS|defines.MEMBERS
        })

        assert.equal(result, def['tags-members'])
      })
    })
  })

  describe('compile filter with tags and members, with bounds', function () {
    Object.entries(queryList).forEach(([query, def]) => {
      it(query, function () {
        const filter = new Filter(query)
        const result = db.compile(filter, {
          properties: defines.TAGS|defines.MEMBERS,
          bounds: new BoundingBox({ minlon: 1, minlat: 1, maxlon: 2, maxlat: 2 })
        })

        assert.equal(result, 'SELECT * FROM (' + def['tags-members'] + ') WHERE geom && st_setsrid(st_makebox2d(st_makepoint(1,1), st_makepoint(2,2)), 4326)')
      })
    })
  })

  describe('BBoxQuery', function () {
    Object.entries(queryList).forEach(([query, def]) => {
      it(query, function (done) {
        geowiki.BBoxQuery(
          query,
          { minlat: 48.19, maxlat: 48.20, minlon: 16.33, maxlon: 16.34 },
          {
            out: 'json',
            outOptions: 'tags'
          },
          (err, result) => {
            //console.log(JSON.stringify(result, null, '  '))
            done(err)
          }
        )
      })
    })
  })
})
