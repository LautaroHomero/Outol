/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('node:path')

process.chdir(path.resolve(__dirname, '..'))

const { resetDb } = require('../dist-db-shim.cjs')

resetDb()
console.log('Base de datos local creada y seedeada en data/golfield.db')
