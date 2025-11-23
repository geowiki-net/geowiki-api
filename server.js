const http = require('http')
const OverpassFrontend = require('.')

const defaultConfig = {
  port: 8080,
  ip: '0.0.0.0',
  overpassURL: 'https://www.overpass-api.de/api/interpreter'
}

const config = { ...defaultConfig }

const overpassFrontend = new OverpassFrontend(config.overpassURL)

const server = http.createServer(handleRequest)

server.listen(config.port, config.ip)

function handleRequest (request, response) {
  let body = ''

  request.on('data', (data) => {
    body += data
  })

  request.on('end', () => {
    try {
      overpassFrontend.query(body, handleResult)
    } catch (e) {
      handleResult(e)
    }

    function handleResult (err, result) {
      if (err) {
        response.writeHead(400, {
          'Content-Type': 'text/html; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        })
        console.error('Error loading data from API', err)
        return response.end(err.message)
      }

      response.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
      response.end(JSON.stringify(result, null, '  '))
    }
  })
}
