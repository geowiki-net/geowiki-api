const filterPart = require('./filterPart')
const OutOptions = require('./OutOptions')

class OutStatement {
  constructor (def, filter) {
    this.def = def
    this.inputSet = filter.sets[this.def.inputSet ?? '_']
    this.opt = new OutOptions(this.def.out)
  }

  toQl (options = {}) {
    let result = ''

    if (options.setsUseStatementIds) {
      result += '._' + (this.inputSet ? this.inputSet.id : 'missing') + ' '
    } else if (this.def.inputSet) {
      result += '.' + this.def.inputSet + ' '
    }

    const outOptions = this.outOptions()
    if (outOptions.count) {
      return result + 'out count;'
    }

    const count = this.count()
    result += 'out ' + (count ? count + ' ' : '') + Object.keys(outOptions).join(' ') + ';'

    return result
  }

  toQuery (options = {}) {
    return 'nwr._' + this.inputSet.id + ';'
  }

  /**
   * which feature properties are requested by this out statement?
   * @return {Number}
   */
  properties () {
    return this.opt.properties()
  }

  /**
   * which options for the out()-function of OverpassObject
   * @return {object}
   */
  outOptions () {
    return this.opt.outOptions()
  }

  /**
   * has there been a count given?
   * @return {object}
   */
  count () {
    let result = null

    this.def.out.forEach(outParam => {
      if (outParam.match(/^[0-9]+$/)) {
        result = parseInt(outParam)
      }
    })

    return result
  }

  dependents () {
    return this.inputSet.dependents().concat([this.inputSet])
  }

  /**
   * Compile all (recursing) parts of a query
   */
  fullQuery (options) {
    return this.dependents().map(s => s.toQuery(options)).join('') + this.toQuery(options)
  }
}

filterPart.register('out', OutStatement)
