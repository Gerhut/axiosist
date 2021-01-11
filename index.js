/**
 * @typedef {import('net').AddressInfo} AddressInfo
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 * @typedef {import('axios').AxiosAdapter} AxiosAdapter
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 */

const { Server, createServer } = require('http')
const { URL } = require('url')

const axios = require('axios').default
const defaultAdapter = /** @type {AxiosAdapter} */(axios.defaults.adapter)

/**
 * @callback RequestListener
 * @param {IncomingMessage} request
 * @param {ServerResponse} response
 */

/** @typedef {RequestListener | Server} Handler */

/**
 * @param {string} urlString the url to tell.
 * @returns {boolean} whether the url is absolute url.
 */
const isAbsoluteUrl = (urlString) => {
  const url = new URL(urlString, 'http://axiosist/')
  return url.host !== 'axiosist'
}

/**
 * @param {Handler} handler A handler for axiosist, may be a request listener or a http server.
 * @returns {AxiosAdapter} The axios adapter would used in adapter options of axios.
 */
const createAdapter = handler => config => new Promise((resolve, reject) => {
  const urlField = isAbsoluteUrl(config.url || '') ? 'url' : 'baseURL'
  const url = new URL(config[urlField] || '', 'http://axiosist/')

  // Forcely set protocol to HTTP
  url.protocol = 'http'

  // Apply original host to request header
  if (url.host !== 'axiosist' && config.headers.host == null) {
    config.headers.host = url.host
  }

  const server = handler instanceof Server ? handler : createServer(handler)
  const listening = server.listening

  server.on('error', reject)

  resolve(/** @type {Promise<void>} */ (
    new Promise(resolve => {
      if (listening) {
        resolve()
      } else {
        server.listen(0, '127.0.0.1', resolve)
      }
    })
  ).then(
    () => {
      const address = /** @type {AddressInfo} */(server.address())
      url.host = '127.0.0.1'
      url.port = address.port.toString()
      config[urlField] = url.toString()
      return defaultAdapter(config)
    }
  ).then(
    (response) => {
      if (listening) {
        return response
      } else {
        return new Promise(resolve => {
          server.close(() => resolve(response))
        })
      }
    },
    (error) => {
      if (listening) {
        throw error
      } else {
        return new Promise((resolve, reject) => {
          server.close(() => reject(error))
        })
      }
    }
  ))
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
