/* eslint-env mocha */
'use strict'

const assert = require('assert')
const axiosist = require('.')

describe('axiosist', () => {
  it('should request the callback', () => {
    let called = false
    return axiosist((req, res) => {
      called = true
      res.end()
    }).request({ url: '/' }).then(function () {
      assert.ok(called)
    })
  })
  it('should request the right method', () => {
    return axiosist((req, res) => {
      assert.strictEqual('POST', req.method)
      res.end()
    }).post('/')
  })
  it('should request the right url', () => {
    return axiosist((req, res) => {
      assert.strictEqual('/foo/bar?baz=qux', req.url)
      res.end()
    }).request({
      baseURL: '/foo',
      url: '/bar',
      params: { baz: 'qux' }
    })
  })
  it('should request the right header', () => {
    return axiosist((req, res) => {
      assert.strictEqual('bar', req.headers.foo)
      res.end()
    }).request({
      url: '/',
      headers: { foo: 'bar' }
    })
  })
  it('should request the right body', () => {
    return axiosist((req, res) => {
      req.setEncoding('utf8')
      req.on('data', chunk => {
        assert.deepEqual('foo', chunk)
      }).on('end', () => res.end())
    }).request({
      method: 'post',
      url: '/',
      data: 'foo'
    })
  })
  it('should request the right host', () => {
    return axiosist((req, res) => {
      assert.deepEqual('example.com', req.headers.host)
      res.end()
    }).request({
      url: 'http://example.com/foo'
    })
  })
  it('should response the right status', () => {
    return axiosist((req, res) => {
      res.statusCode = 400
      res.statusMessage = 'FOO'
      res.end()
    }).request({ url: '/' }).catch(error => {
      assert.strictEqual(400, error.response.status)
      assert.strictEqual('FOO', error.response.statusText)
    })
  })
  it('should response the right header', () => {
    return axiosist((req, res) => {
      res.setHeader('foo', 'bar')
      res.end()
    }).request({ url: '/' }).then(response => {
      assert.strictEqual('bar', response.headers.foo)
    })
  })
  it('should response the right body', () => {
    return axiosist((req, res) => {
      res.end('foo')
    }).request({ url: '/' }).then(response => {
      assert.strictEqual('foo', response.data)
    })
  })
})
