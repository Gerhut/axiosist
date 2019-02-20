import test from 'ava'
import * as http from 'http'
import axiosist from '.'

test('should request', t =>
  axiosist((req, res) => res.end())
    .get('/').then(() => t.pass()))

test('should request the right method', t =>
  axiosist((req, res) => {
    t.is(req.method, 'POST')
    res.end()
  }).post('/').then(() => t.pass()))

test('should request the right url', t =>
  axiosist((req, res) => {
    t.is(req.url, '/foo/bar?baz=qux')
    res.end()
  }).request({
    baseURL: '/foo',
    url: '/bar',
    params: { baz: 'qux' }
  }).then(() => t.pass()))

test('should request the right header', t =>
  axiosist((req, res) => {
    t.is(req.headers.foo, 'bar')
    res.end()
  }).request({
    url: '/',
    headers: { foo: 'bar' }
  }).then(() => t.pass()))

test('should request the right body', t =>
  axiosist((req, res) => {
    req.setEncoding('utf8')
    req
      .on('data', chunk => t.is(chunk, 'foo'))
      .on('end', () => res.end())
  }).request({
    method: 'post',
    url: '/',
    data: 'foo'
  }).then(() => t.pass()))

test('should request the right host', t =>
  axiosist((req, res) => {
    t.is(req.headers.host, 'example.com')
    res.end()
  }).get('http://example.com/foo')
    .then(() => t.pass()))

test('should response the right status', t =>
  axiosist((req, res) => {
    res.statusCode = 400
    res.statusMessage = 'FOO'
    res.end()
  }).get('/').then(response => {
    t.is(response.status, 400)
    t.is(response.statusText, 'FOO')
  }))

test('should response the right header', t =>
  axiosist((req, res) => {
    res.setHeader('foo', 'bar')
    res.end()
  }).get('/').then(response => {
    t.is(response.headers.foo, 'bar')
  }))

test('should response the right body', t =>
  axiosist((req, res) => {
    res.end('foo')
  }).get('/').then(response => {
    t.is(response.data, 'foo')
  }))

test('should fail correctly', t => t.throwsAsync(
  axiosist((req, res) => {
    res.end('foo')
  }).request({
    url: '/',
    maxContentLength: 1
  }), /maxContentLength/).then(() => t.pass()))

test('should response redirect', t =>
  axiosist((req, res) => {
    res.statusCode = 302
    res.setHeader('Location', 'http://example.com/')
    res.end()
  }).get('/').then(response => {
    t.is(response.status, 302)
    t.is(response.headers.location, 'http://example.com/')
  }))

test('should work with http server', t => {
  const app = http.createServer((req, res) => {
    res.end('foo')
  })

  return axiosist(app).get('/').then(() => t.pass())
})
