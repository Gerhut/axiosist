'use strict'

const http = require('http')
const url = require('url')

const axios = require('axios').default
const defaultAdapter = axios.defaults.adapter

const createAdapter = handler => config => {
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

  const server = handler instanceof http.Server ? handler : http.createServer(handler)
  const listening = server.listening

  return new Promise((resolve, reject) => {
    server.on('error', reject)
    if (listening) {
      resolve()
    } else {
      server.listen(0, '127.0.0.1', resolve)
    }
  }).then(() => {
    urlObject.port = server.address().port
    config.url = url.format(urlObject)
    return defaultAdapter(config)
  }).then(value => new Promise(resolve => {
    if (listening) {
      resolve(value)
    } else {
      server.close(() => resolve(value))
    }
  }), reason => new Promise((resolve, reject) => {
    if (listening) {
      reject(reason)
    } else {
      server.close(() => reject(reason))
    }
  }))
}

const axiosist = handler => {
  return axios.create({
    adapter: createAdapter(handler),
    validateStatus: () => true,
    maxRedirects: 0
  })
}

exports = module.exports = axiosist
exports.default = axiosist
exports.createAdapter = createAdapter
