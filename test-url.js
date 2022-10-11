/**
 * @typedef {import('ava').ExecutionContext} ExecutionContext
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

const test = require('ava').default
const axiosist = require('.').default

const macro = test.macro({
  /**
   * @param {ExecutionContext} t
   * @param {AxiosRequestConfig} options
   * @param {string} expectedHost
   * @param {string} expectedUrl
   */
  exec: async (t, options, expectedHost, expectedUrl) => {
    t.plan(2)
    await axiosist((req, res) => {
      t.is(req.url, expectedUrl)
      t.is(req.headers.host, expectedHost)
      res.end()
    })(options)
  },
  title: (providedTitle = '') => 'should request the right host & url: ' + providedTitle
})

test('with url (includes host)', macro, {
  url: 'http://example.com/foo'
}, 'example.com', '/foo')

test('with baseURL (includes host)', macro, {
  baseURL: 'http://example.com/foo'
}, 'example.com', '/foo')

test('with baseURL (includes host) and url', macro, {
  baseURL: 'http://example.com/foo',
  url: '/bar'
}, 'example.com', '/foo/bar')

test('with baseURL and url (includes host)', macro, {
  baseURL: '/foo',
  url: 'http://example.com/bar'
}, 'example.com', '/bar')

test('with baseURL (includes host) and url (includes host)', macro, {
  baseURL: 'http://example.com/foo',
  url: 'http://example.org/bar'
}, 'example.org', '/bar')
