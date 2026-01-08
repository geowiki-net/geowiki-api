#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser
const fs = require('fs')
const OverpassFrontend = require('.')

const defaultConfig = {
  db: 'https://overpass-api.de/api/interpreter'
}

const parser = new ArgumentParser({
  add_help: true,
  description: 'Starts an overpass-frontend server'
})

parser.add_argument('--db', {
  help: 'Override the default database (e.g. Overpass API URL)',
  default: defaultConfig.db
})

const config = { ...parser.parse_args() }

const overpassFrontend = new OverpassFrontend(config.db)

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
