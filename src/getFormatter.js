const FormatterJson = require('./FormatterJson')
const FormatterXml = require('./FormatterXml')

module.exports = function getFormatter (out, overpass) {
  switch (out ?? 'json') {
    case 'json':
      return new FormatterJson(overpass)
    case 'xml':
      return new FormatterXml(overpass)
    default:
      throw new Error('Formatter "' + out + '" unknown')
  }
}
