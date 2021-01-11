const test = require('ava').default
const axiosist = require('.').default

const TITLE_PREFIX = 'should request the right host & url'

test(TITLE_PREFIX + 'with url (includes host)', async t => {
  t.plan(2)
  await axiosist((req, res) => {
    t.is(req.url, '/foo')
    t.is(req.headers.host, 'example.com')
    res.end()
  })({
    url: 'http://example.com/foo'
  })
})

test(TITLE_PREFIX + 'with baseURL (includes host)', async t => {
  t.plan(2)
  await axiosist((req, res) => {
    t.is(req.url, '/foo')
    t.is(req.headers.host, 'example.com')
    res.end()
  })({
    baseURL: 'http://example.com/foo'
  })
})

test(TITLE_PREFIX + 'with baseURL (includes host) and url', async t => {
  t.plan(2)
  await axiosist((req, res) => {
    t.is(req.url, '/foo/bar')
    t.is(req.headers.host, 'example.com')
    res.end()
  })({
    baseURL: 'http://example.com/foo',
    url: '/bar'
  })
})

test(TITLE_PREFIX + 'with baseURL and url (includes host)', async t => {
  t.plan(2)
  await axiosist((req, res) => {
    t.is(req.url, '/bar')
    t.is(req.headers.host, 'example.com')
    res.end()
  })({
    baseURL: '/foo',
    url: 'http://example.com/bar'
  })
})

test(TITLE_PREFIX + 'with baseURL (includes host) and url (includes host)', async t => {
  t.plan(2)
  await axiosist((req, res) => {
    t.is(req.url, '/bar')
    t.is(req.headers.host, 'example.org')
    res.end()
  })({
    baseURL: 'http://example.com/foo',
    url: 'http://example.org/bar'
  })
})
