const { createServer } = require('http')
const test = require('ava').default
const axiosist = require('.').default

test('should request', async t => {
  t.plan(0)
  await axiosist((req, res) => res.end()).get('/')
})

test('should request the right method', async t => {
  t.plan(1)
  await axiosist((req, res) => {
    t.is(req.method, 'POST')
    res.end()
  }).post('/')
})

test('should request the right url', async t => {
  t.plan(1)
  await axiosist((req, res) => {
    t.is(req.url, '/foo/bar?baz=qux')
    res.end()
  }).request({
    baseURL: '/foo',
    url: '/bar',
    params: { baz: 'qux' }
  })
})

test('should request the empty url', async t => {
  t.plan(1)
  await axiosist((req, res) => {
    t.is(req.url, '/?baz=qux')
    res.end()
  }).request({
    params: { baz: 'qux' }
  })
})

test('should request the right header', async t => {
  t.plan(1)
  await axiosist((req, res) => {
    t.is(req.headers.foo, 'bar')
    res.end()
  }).request({
    url: '/',
    headers: { foo: 'bar' }
  })
})

test('should request the right body', async t => {
  t.plan(1)
  await axiosist((req, res) => {
    req.setEncoding('utf8')
    req
      .on('data', chunk => t.is(chunk, 'foo'))
      .on('end', () => res.end())
  }).request({
    method: 'post',
    url: '/',
    data: 'foo'
  })
})

test('should request the right host', async t => {
  t.plan(1)
  await axiosist((req, res) => {
    t.is(req.headers.host, 'example.com')
    res.end()
  }).get('http://example.com/foo')
})

test('should response the right status', async t => {
  const response = await axiosist((req, res) => {
    res.statusCode = 400
    res.statusMessage = 'FOO'
    res.end()
  }).get('/')

  t.is(response.status, 400)
  t.is(response.statusText, 'FOO')
})

test('should response the right header', async t => {
  const response = await axiosist((req, res) => {
    res.setHeader('foo', 'bar')
    res.end()
  }).get('/')

  t.is(response.headers.foo, 'bar')
})

test('should response the right body', async t => {
  const response = await axiosist((req, res) => {
    res.end('foo')
  }).get('/')

  t.is(/** @type {string} */(response.data), 'foo')
})

test('should fail correctly', async t => {
  await t.throwsAsync(axiosist((req, res) => {
    res.end('foo')
  }).request({
    url: '/',
    maxContentLength: 1
  }), { message: /maxContentLength/ })
})

test('should response redirect', async t => {
  const response = await axiosist((req, res) => {
    res.statusCode = 302
    res.setHeader('Location', 'http://example.com/')
    res.end()
  }).get('/')

  t.is(response.status, 302)
  t.is(response.headers.location, 'http://example.com/')
})

test('should work with unlistened http server', async t => {
  const server = createServer((req, res) => res.end('foo'))
  const response = await axiosist(server).get('/')

  t.is(/** @type {string} */(response.data), 'foo')
  t.false(server.listening)
})

test('should work with listened http server', async t => {
  const server = createServer((req, res) => res.end('bar'))
  await new Promise(resolve => server.listen(resolve))

  const response = await axiosist(server).get('/')

  t.is(/** @type {string} */(response.data), 'bar')
  t.true(server.listening)

  await new Promise(resolve => server.close(resolve))
})

test('should work with listened http server (failed request)', async t => {
  const server = createServer((req, res) => res.end('bar'))
  await new Promise(resolve => server.listen(resolve))

  await t.throwsAsync(axiosist(server).get('/', { maxContentLength: 1 }))
  t.true(server.listening)

  await new Promise(resolve => server.close(resolve))
})

test('socket hang up', async t => {
  /** @type {import('http').Server} */
  const server = createServer((req, res) => res.destroy())
  await t.throwsAsync(axiosist(server).get('/'), { message: 'socket hang up' })
})
