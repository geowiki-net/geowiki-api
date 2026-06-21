const defines = require('./defines')

const postOp = {
  '=': '=',
  '~': '~',
}

const tables = {
  nwr: 'postpass_pointlinepolygon',
  node: 'postpass_point',
  way: "(SELECT osm_id, osm_type, tags, geom FROM postpass_line WHERE osm_type='W' UNION SELECT osm_id, osm_type, tags, geom FROM postpass_polygon WHERE osm_type='W')",
  relation: "(SELECT osm_id, osm_type, tags, geom FROM postpass_pointlinepolygon WHERE osm_type='R')"
}

module.exports = class DBTypePostpass {
  constructor (url, options) {
    this.url = url
    this.options = options
  }

  compile (query, options) {
    const stmt = query.getStatement()

    let result = this.compileStmt(stmt, options)
    if (options.bounds) {
      result = 'SELECT * FROM (' + result + ') WHERE geom && st_setsrid(st_makebox2d(st_makepoint(' + options.bounds.minlon + ',' + options.bounds.minlat + '), st_makepoint(' + options.bounds.maxlon + ',' + options.bounds.maxlat + ')), 4326)'
    }

    return result
  }

  compileStmt (stmt, options) {
    if (stmt.constructor.name === 'FilterQuery' && stmt.inputSets && stmt.type === 'nwr' && stmt.filters.length === 0) {
      return this.compileStmt(Object.values(stmt.inputSets)[0].set, options)
    }

    switch (stmt.constructor.name) {
      case 'FilterQuery':
        return this.compileFilterQuery(stmt, options)
      case 'FilterOr':
        return '(' + stmt.parts.map(part => this.compileStmt(part, options)).join(') UNION (') + ')'
      default:
        throw new Error("Can't compile filter type '" + stmt.constructor.name + "'")
    }
  }

  compileFilterQuery (stmt, options) {
    // postpass queries always require geom
    let fields = ['t.osm_id', 't.osm_type', 't.geom']
    let table = tables[stmt.type] + ' t'

    if (options.properties & defines.TAGS) {
      fields.push('t.tags')
    }
    if ((options.properties & defines.MEMBERS) && stmt.type !== 'node') {
      fields.push('w.nodes')
      fields.push('r.members')
      table += " left join planet_osm_ways w on t.osm_type = 'W' and t.osm_id = w.id left join planet_osm_rels r on t.osm_type = 'R' and t.osm_id = r.id"
    }

    const where = this.compileStmtQuery(stmt)

    return 'SELECT ' + fields.join(', ') + ' FROM ' + table + (where ? ' WHERE ' + where : '')
  }

  compileStmtQuery (stmt) {
    const filters = stmt.filters.map(filter => {
      if (filter.fun === 'id') {
        return 'osm_id = ANY(\'{' + filter.value.join(',') + '}\')'
      } else if (filter.op) {
        return this.compileOp(filter)
      } else {
        throw new Error("Don't know how to compile filter: " + JSON.stringify(filter))
      }
    }).join(' AND ')

    return filters
  }

  compileOp (filter) {
    const column = 't.tags->>' + quote(filter.key)
    const value = filter.value ? quote(filter.value) : null

    switch (filter.op) {
      case 'has_key':
        return 't.tags?' + quote(filter.key)
      default:
        if (!(filter.op in postOp)) {
          throw new Error("Can't compile operator '" + filter.op + "'")
        }
        return column + postOp[filter.op] + value
    }
  }
}

function quote (str) {
  return "'" + str.replace(/'/g, "\\'") + "'"
}
