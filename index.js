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

const axios = require('axios').default
const defaultAdapter = /** @type {AxiosAdapter} */(axios.defaults.adapter)

/**
 * @callback RequestListener
 * @param {IncomingMessage} request
 * @param {ServerResponse} response
 */

/** @typedef {RequestListener | Server} Handler */

/**
 * Create the adapter of the request callback, used for your own axios instance.
 * ```
 * axiosist(callback)
 * ```
 * is equal to
 * ```
 * axios.create({ adapter: axiosist.createAdapter(callback) })
 * ```
 *
 * @param {Handler} handler A handler for axiosist, may be a request listener or a http server.
 * @returns {AxiosAdapter} The axios adapter would used in adapter options of axios.
 */
const createAdapter = handler => config => new Promise((resolve, reject) => {
  const urlObject = url.parse(config.url || '')

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

  server.on('error', reject)

  let promise = listening
    ? Promise.resolve()
    : new Promise(resolve => server.listen(0, '127.0.0.1', resolve))

  promise = promise.then(() => {
    const address = /** @type {AddressInfo} */(server.address())
    urlObject.port = address.port.toString()
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
 * Create an axios instance with adapter of the request callback, and treat all HTTP statuses as fulfilled.
 *
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
