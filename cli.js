#!/usr/bin/env node
const fs = require('fs')
const OverpassFrontend = require('.')

const defaultConfig = {
  overpassURL: 'overpass-api.de/api/interpreter'
}

const config = { ...defaultConfig }

const overpassFrontend = new OverpassFrontend(config.overpassURL)

const query = fs.readFileSync(0, 'utf-8')

try {
  overpassFrontend.query(query, handleResult)
} catch (e) {
  handleResult(e)
}

function handleResult (err, result) {
  if (err) {
    console.error(err.message)
    process.exit(1)
  }

  fs.writeFileSync(1, JSON.stringify(result, null, '  ') + '\n')
}
