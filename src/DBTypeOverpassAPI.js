const overpassOutOptions = require('./overpassOutOptions')

module.exports = class DBTypeOverpassAPI {
  constructor () {
    this.type = 'OverpassAPI'
  }

  compile (query, options) {
    // let query;
    let resultSet = '.result'

    // if the context already has a bbox and it differs from this, we can't add
    // ours
    if (this.lokiQuery) {
      query = this.lokiQuery.toQl({ setsUseStatementIds: true }) + '\n'
      this.options.properties |= this.lokiQuery.properties()
      resultSet = options.statementId ? '._' + options.statementId : '.result'
    } else {
      query = this.query.substr(0, this.query.length - 1) + '->.result;\n'
    }

    let queryRemoveDoneFeatures = ''
    let countRemoveDoneFeatures = 0
    for (const id in this.doneFeatures) {
      const ob = this.doneFeatures[id]

      if (countRemoveDoneFeatures % 1000 === 999) {
        query += '(' + queryRemoveDoneFeatures + ')->.done;\n'
        queryRemoveDoneFeatures = '.done;'
      }

      queryRemoveDoneFeatures += ob.type + '(' + ob.osm_id + ');'
      countRemoveDoneFeatures++
    }

    if (countRemoveDoneFeatures) {
      query += '(' + queryRemoveDoneFeatures + ')->.done;\n'
      query += '(' + resultSet + '; - .done;)->' + resultSet + ';\n'
    }

    query += resultSet + ' out ' + overpassOutOptions(this.options) + ';\n'

    return query
  }
}
