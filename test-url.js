/**
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 * @typedef {import('ava').Macro<[AxiosRequestConfig, string, string]>} Macro
 */

const test = require('ava').default
const axiosist = require('.').default

/** @type {Macro} */
const macro = async (t, options, expectedHost, expectedUrl) => {
  t.plan(2)
  await axiosist((req, res) => {
    t.is(req.url, expectedUrl)
    t.is(req.headers.host, expectedHost)
    res.end()
  })(options)
}

macro.title = (providedTitle = '') => 'should request the right host & url: ' + providedTitle

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
