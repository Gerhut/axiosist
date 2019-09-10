/**
 * @typedef {import('net').AddressInfo} AddressInfo
 * @typedef {import('http').Server} Server
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 * @typedef {import('axios').AxiosAdapter} AxiosAdapter
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 */

const http = require('http')
const url = require('url')
const Url = require('url-parse')
const axios = require('axios').default
const defaultAdapter = /** @type {AxiosAdapter} */(axios.defaults.adapter)

/**
 * @callback RequestListener
 * @param {IncomingMessage} request
 * @param {ServerResponse} response
 */

/** @typedef {RequestListener | Server} Handler */

/**
 * @param {Handler} handler A handler for axiosist, may be a request listener or a http server.
 * @returns {AxiosAdapter} The axios adapter would used in adapter options of axios.
 */
const createAdapter = handler => config => new Promise((resolve, reject) => {
  var urlObject = new Url(config.url || '')

  // Forcely set protocol to HTTP
  urlObject.set('protocol', 'http')

  const host = urlObject.host
  urlObject.set('hostname', '127.0.0.1')
  // Apply original host to request header
  if (host != null && config.headers.host == null) {
    config.headers.host = host
  }

  const server = handler instanceof http.Server ? handler : http.createServer(handler)
  const listening = server.listening

  server.on('error', reject)

  let promise = listening
    ? Promise.resolve()
    : new Promise(resolve => server.listen(0, '127.0.0.1', resolve))

  promise = promise.then(() => {
    const address = /** @type {AddressInfo} */(server.address())
    const portstr = address.port.toString()
    urlObject.set('port', portstr)
    config.url = url.format(urlObject)
    return defaultAdapter(config)
  })

  if (listening) {
    promise.then(resolve, reject)
  } else {
    promise.then(
      value => server.close(() => resolve(value)),
      reason => server.close(() => reject(reason))
    )
  }
})

/**
 * @param {Handler} handler A handler, may be a request listener or a http server.
 * @returns {AxiosInstance} The axios instance would use for test.
 */
const axiosist = handler => {
  return axios.create({
    adapter: createAdapter(handler),
    validateStatus: () => true,
    maxRedirects: 0
  })
}

module.exports = axiosist
module.exports.createAdapter = createAdapter
