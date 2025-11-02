const filterPart = require('./filterPart')
const OverpassFrontend = require('./defines')

const outParams = {
  ids: OverpassFrontend.ID_ONLY,
  skel: OverpassFrontend.MEMBERS,
  body: OverpassFrontend.MEMBERS | OverpassFrontend.TAGS,
  tags: OverpassFrontend.TAGS,
  meta: OverpassFrontend.MEMBERS | OverpassFrontend.TAGS | OverpassFrontend.META,
  noids: OverpassFrontend.ID_ONLY, // TODO?
  geom: OverpassFrontend.GEOM,
  bb: OverpassFrontend.BBOX,
  center: OverpassFrontend.CENTER,
}
const outOtherParams = {
  asc: 0, // TODO
  qt: 0, // TODO
  count: 0
}

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

    const outOptions = this.outOptions()
    if (outOptions.count) {
      return result += 'out count;'
    }

    const count = this.count()
    result += 'out ' + (count ? count + ' ' : '') + Object.keys(outOptions).join(' ') + ';'

    return result
  }

  /**
   * Compile all (recursing) parts of a query
   */
  toQuery (options = {}) {
    return this.inputSet.toQuery(options) + 'nwr._' + this.inputSet.id + ';'
  }

  /**
   * which feature properties are requested by this out statement?
   * @return {Number}
   */
  properties () {
    let result = 0
    let hasParams = false
    const otherParams = {}

    this.def.out.forEach(outParam => {
      if (outParam in outParams) {
        result |= outParams[outParam]
        hasParams = true
      } else if (outParam.match(/^[0-9]+$/)) {
        ; // ignore
      } else if (outParam in outOtherParams) {
        otherParams[outParam] = true
      } else {
        throw new Error('Invalid parameter for print: "' + outParams + '"')
      }
    })

    if (otherParams.count) {
      result |= OverpassFrontend.ID_ONLY
      hasParams = true
    }

    if (!hasParams) {
      result = OverpassFrontend.MEMBERS | OverpassFrontend.TAGS
    }

    return result
  }

  /**
   * which options for the out()-function of OverpassObject
   * @return {object}
   */
  outOptions () {
    const result = {}
    let hasParams = false

    this.def.out.forEach(outParam => {
      if (outParam in outParams) {
        result[outParam] = true
        hasParams = true
      } else if (outParam.match(/^[0-9]+$/)) {
        ; // ignore
      } else if (outParam in outOtherParams) {
        result[outParam] = true
      } else {
        throw new Error('Invalid parameter for print: "' + outParam + '"')
      }
    })

    if (result.count) {
      result.ids = true
      hasParams = true
    }

    if (!hasParams) {
      result.body = true
    }

    return result
  }

  /**
   * has there been a count given?
   * @return {object}
   */
  count () {
    let result = null
    let hasParams = false

    this.def.out.forEach(outParam => {
      if (outParam.match(/^[0-9]+$/)) {
        result = parseInt(outParam)
      }
    })

    return result
  }
}

filterPart.register('out', OutStatement)
