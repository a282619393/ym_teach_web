'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"/api"',
  // BASE_API: `"http://132.232.87.95:3000/admin"`
})
