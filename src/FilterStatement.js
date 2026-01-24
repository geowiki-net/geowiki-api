module.exports = class FilterStatement {
  constructor (def, filter) {
    this.id = filter.createStatementId()
    filter.statements[this.id] = this
  }

  derefSets () {
    return []
  }

  properties () {
    return 0
  }

  possibleBounds (ob) {
    return null
  }

  /**
   * Check if this statement and the given statement are mergeable. If yes, the
   * 'merge()' function will do the actual merging.
   * @param {FilterStatement} statement The statement to merge with.
   */
  mergeable (statement) {
    return false
  }

  /**
   * Merge this statement with the given statement.
   * @param {FilterStatement} statement The statement to merge with.
   */
  merge (statement) {
  }

  /**
   * Conflate this statement with nearby statements if possible.
   */
  conflate () {
  }

  /**
   * List of all dependents
   */
  dependents () {
    return []
  }
}
