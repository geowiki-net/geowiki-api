function compileCacheDescriptors (result, options = {}) {
  result = _compileCacheDescriptors(result, options)
  _compileCacheDescriptorsRecurses(result)
  _compileCacheDescriptorsClearProperties(result)

  return result
}

function _compileCacheDescriptors (result, options) {
  return result.map(entry => {
    let recurses = ''

    let recurse = []
    if (entry.recurse) {
      recurse = _compileCacheDescriptors(entry.recurse, options)
    }

    if (!options.skipRecurses) {
      recurses = recurse
        .map(r => {
          return r.id + '->' + r.setId + ';'
        })
        .join('')
    }

    entry.id = (entry.type || 'nwr') + entry.filters +
        recurse.map(r => r.filtersFwd ?? '').join('') +
        '(properties:' + entry.properties + ')'

    if (entry.diff) {
      entry.id = '(' + entry.id + ';-' + entry.diff + ';)'
      delete entry.diff
    }

    entry.id = recurses + entry.id

    return entry
  })
}

function _compileCacheDescriptorsRecurses (result) {
  result.forEach(entry => {
    if (entry.recurse) {
      entry.recurse.forEach(r => {
        r.id = entry.id + '->' + r.setId + ';' +
          (r.type || 'nwr') + r.filters + r.filtersRec + '(properties:' + r.properties + ')'

        _compileCacheDescriptorsRecurses([r])
      })
    }
  })
}

function _compileCacheDescriptorsClearProperties (result) {
  result.forEach(entry => {
    if (entry.recurse) {
      entry.recurse.forEach(r => {
        _compileCacheDescriptorsClearProperties([r])
      })
    }

    delete entry.type
    delete entry.filters
    delete entry.filtersFwd
    delete entry.filtersRec
    delete entry.recurseType
    delete entry.recurseRecType
    delete entry.properties
    delete entry.setId
    delete entry.role
  })
}

module.exports = compileCacheDescriptors
