'use strict'

const http = require('http')
const url = require('url')

const axios = require('axios').default
const defaultAdapter = axios.defaults.adapter

const createAdapter = callback => config => {
  const urlObject = url.parse(config.url)

  // Forcely set protocol to HTTP
  urlObject.protocol = 'http:'
  urlObject.slashes = true

  const host = urlObject.host
  delete urlObject.host
  urlObject.hostname = '127.0.0.1'
  // Apply original host to request header
  if (host != null && config.headers.host == null) {
    config.headers.host = host
  }

  const server = http.createServer(callback)

  return new Promise((resolve, reject) => {
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      urlObject.port = server.address().port
      config.url = url.format(urlObject)
      resolve(defaultAdapter(config))
    })
  }).then(value => new Promise(resolve => {
    server.close(() => resolve(value))
  }), reason => new Promise((resolve, reject) => {
    server.close(() => reject(reason))
  }))
}

const axiosist = callback => {
  return axios.create({
    adapter: createAdapter(callback),
    validateStatus: () => true,
    maxRedirects: 0
  })
}

exports = module.exports = axiosist
exports.default = axiosist
exports.createAdapter = createAdapter
