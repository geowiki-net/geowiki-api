const filterPart = require('./filterPart')

class OutStatement {
  constructor (def, filter) {
    this.def = def
    this.inputSet = filter.sets[this.def.inputSet ?? '_']
  }

  toQl (options = {}) {
    let result = ''

    if (options.setsUseStatementIds) {
      result += '._' + (this.inputSet ? this.inputSet.id : 'missing') + ' '
    } else if (this.def.inputSet) {
      result += '.' + this.def.inputSet + ' '
    }

    result += 'out'

    if (this.def.out.length) {
      result += ' ' + this.def.out.join(' ')
    }

    result += ';'
    return result
  }

  /**
   * Compile all (recursing) parts of a query
   */
  toQuery (options = {}) {
    return this.inputSet.toQuery(options) + 'nwr._' + this.inputSet.id + ';'

    // + this.toQl({ ...options, setsUseStatementIds: true })
  }
}

filterPart.register('out', OutStatement)
