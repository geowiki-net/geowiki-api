#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser
const http = require('http')

const OverpassFrontend = require('.')

const defaultConfig = {
  port: 8080,
  ip: '0.0.0.0',
  db: 'https://www.overpass-api.de/api/interpreter'
}

const parser = new ArgumentParser({
  add_help: true,
  description: 'Starts an overpass-frontend server'
})

parser.add_argument('--db', {
  help: 'Override the default database (e.g. Overpass API URL)',
  default: defaultConfig.db
})

parser.add_argument('--port', '-p', {
  help: 'Port to listen on',
  default: defaultConfig.port
})

parser.add_argument('--ip', {
  help: 'IP to listen on',
  default: defaultConfig.ip
})

const config = { ...parser.parse_args() }

const overpassFrontend = new OverpassFrontend(config.db)

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
