const { createServer } = require('http')
const test = require('ava').default
const axiosist = require('.').default

test('should work with unlistened http server', async t => {
  const server = createServer((req, res) => res.end('foo'))
  const response = await axiosist(server).get('/')

  t.is(/** @type {string} */(response.data), 'foo')
  t.false(server.listening)
})

test('should work with unlistened http server (client failure)', async t => {
  const server = createServer((req, res) => res.end('bar'))

  await t.throwsAsync(axiosist(server).get('/', { maxContentLength: 1 }), { message: /maxContentLength/ })
  t.false(server.listening)
})

test('should work with unlistened http server (server failure)', async t => {
  const server = createServer((req, res) => res.destroy())

  await t.throwsAsync(axiosist(server).get('/'), { message: 'socket hang up' })
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

test('should work with listened http server (client failure)', async t => {
  const server = createServer((req, res) => res.end('bar'))
  await new Promise(resolve => server.listen(resolve))

  await t.throwsAsync(axiosist(server).get('/', { maxContentLength: 1 }), { message: 'maxContentLength size of 1 exceeded' })
  t.true(server.listening)

  await new Promise(resolve => server.close(resolve))
})

test('should work with listened http server (server failure)', async t => {
  const server = createServer((req, res) => res.destroy())
  await new Promise(resolve => server.listen(resolve))

  await t.throwsAsync(axiosist(server).get('/'), { message: 'socket hang up' })
  t.true(server.listening)

  await new Promise(resolve => server.close(resolve))
})
