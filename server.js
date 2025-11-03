const http = require('http')

const defaultConfig = {
  port: 8080,
  ip: '0.0.0.0',
  overpassURL: 'https://www.overpass-api.de/api/interpreter'
}

const config = { ...defaultConfig }

const server = http.createServer(handleRequest)

server.listen(config.port, config.ip)

function handleRequest (request, response) {
  let body = ''

  request.on('data', (data) => {
    body += data
  })

  request.on('end', () => {
    response.writeHead(200, {
      'Content-Type': 'application/json'
    })

    response.end(JSON.stringify(body))
  })
}
