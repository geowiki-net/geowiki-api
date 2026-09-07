module.exports = function readDbMeta (data) {
  const result = {}

  for (const k in data) {
    if (k !== 'elements' && k !== 'osm3s') {
      result[k] = data[k]
    }
  }

  if (data.osm3s) {
    for (const k in data.osm3s) {
      result[k] = data.osm3s[k]
    }
  }

  return result
}
