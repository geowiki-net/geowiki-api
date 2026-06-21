const defines = require('./defines')

const postOp = {
  '=': '=',
  '~': '~',
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
    let table = 'postpass_pointlinepolygon t'

    if (options.properties & defines.TAGS) {
      fields.push('t.tags')
    }
    if (options.properties & defines.MEMBERS) {
      fields.push('w.nodes')
      fields.push('r.members')
      table += " left join planet_osm_ways w on t.osm_type = 'W' and t.osm_id = w.id left join planet_osm_rels r on t.osm_type = 'R' and t.osm_id = r.id"
    }

    return 'SELECT ' + fields.join(', ') + ' FROM ' + table + ' WHERE ' + this.compileStmtQuery(stmt)
  }

  compileStmtQuery (stmt) {
    const filters = stmt.filters.map(filter => {
      if (filter.op) {
        return this.compileOp(filter)
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
