const assert = require('assert')
const BoundingBox = require('boundingbox')

const defines = require('../src/defines')
const Filter = require('../src/Filter')
const DBTypePostpass = require('../src/DBTypePostpass')

const queryList = {
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
  }
}

describe('DBTypePostpass', function () {
  let db

  it('initialize', function () {
    db = new DBTypePostpass('', {})
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
})
