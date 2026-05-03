const elementIds = {
  node: 0,
  way: 0,
  relation: 0
}

function geojson2elements (data, elements, options) {
  if (data.type === 'FeatureCollection') {
    return data.features.forEach(feature => {
      geojson2elements(feature, elements, options)
    })
  }

  if (data.type !== 'Feature') {
    throw new Error('Unknown type ' + data.type)
  }

  let element

  switch (data.geometry.type) {
    case 'Point':
      element = {
        type: 'node',
        lon: data.geometry.coordinates[0],
        lat: data.geometry.coordinates[1]
      }
      break
    case 'LineString':
      element = {
        type: 'way',
        geometry: data.geometry.coordinates.map(c => {
          return { lon: c[0], lat: c[1] }
        })
      }
      break
    case 'MultiLineString':
      data.geometry.coordinates.forEach(coords => {
        const feature = {
          type: 'Feature',
          properties: data.properties,
          geometry: {
            type: 'LineString',
            coordinates: coords
          }
        }

        geojson2elements(feature, elements, options)
      })
      return
    case 'Polygon':
      if (data.geometry.coordinates.length === 1) {
        element = {
          type: 'way',
          geometry: data.geometry.coordinates[0].map(c => {
            return { lon: c[0], lat: c[1] }
          })
        }
      } else {
        element = {
          type: 'relation',
          members: data.geometry.coordinates.map((ring, i) => {
            return {
              type: 'way',
              ref: --elementIds.way,
              role: i ? 'inner' : 'outer',
              geometry: ring.map(c => {
                return { lon: c[0], lat: c[1] }
              })
            }
          })
        }
        data.properties = { ...data.properties, type: 'multipolygon' }
      }
      break
    default:
      console.log('Unknown geometry type ' + data.geometry.type)
      return
  }

  if (data.properties) {
    element.tags = data.properties
  }

  element.id = --elementIds[element.type]

  elements.push(element)
}

module.exports = geojson2elements
