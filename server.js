#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser
const http = require('http')
const url = require('url')

const OverpassFrontend = require('.')

const defaultConfig = {
  port: 8080,
  ip: '0.0.0.0',
  db: 'https://www.overpass-api.de/api/interpreter'
}

const parser = new ArgumentParser({
  add_help: true,
  description: 'Starts a geowiki-api server, either as proxy for a Overpass/Geowiki API server or from a OSM file'
})

parser.add_argument('--db', {
  help: 'Override the default database (e.g. Overpass/Geowiki API URL or OSM file)',
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
    const reqUrl = url.parse(request.url, true)
    if (!body && reqUrl.query.data) {
      body = reqUrl.query.data
    }

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

      console.log(typeof result)
      if (typeof result !== 'string') {
        result = JSON.stringify(result, null, '  ')
      }

      response.end(result)
    }
  })
}
