# axiosist

[![Build Status](https://travis-ci.org/Gerhut/axiosist.svg?branch=master)](https://travis-ci.org/Gerhut/axiosist)
[![Coverage Status](https://coveralls.io/repos/github/Gerhut/axiosist/badge.svg?branch=master)](https://coveralls.io/github/Gerhut/axiosist?branch=master)
[![dependencies Status](https://david-dm.org/Gerhut/axiosist/status.svg)](https://david-dm.org/Gerhut/axiosist)
[![devDependencies Status](https://david-dm.org/Gerhut/axiosist/dev-status.svg)](https://david-dm.org/Gerhut/axiosist?type=dev)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Greenkeeper badge](https://badges.greenkeeper.io/Gerhut/axiosist.svg)](https://greenkeeper.io/)

[Axios][axios] based supertest: convert node.js request handler to [axios][axios] adapter, used for node.js server unit test.

## Install

    npm install --save-dev axiosist

## Usage

```javascript
// App
const express = require('express')
const app = express()

app.get('/', (req, res) => res.status(201).send('foo'))

// Unit test in async function
const assert = require('assert')
const axiosist = require('axiosist')

void (async () => {
    const response = await axiosist(app).get('/')
    assert.strictEqual(201, response.statusCode)
    assert.strictEqual('foo', response.data)
}) ()
```

## API

### `axiosist(callback)`

Create an axios instance with adapter of the request callback,
and treat all HTTP statuses as fulfilled.

### `axiosist.createAdapter(callback)`

Create the adapter of the request callback, used for your own axios instance.

```javascript
axiosist(callback)
```

is equal to

```javascript
axios.create({ adapter: axiosist.createAdapter(callback) })
```

## Why another supertest

Supertest(Superagent) is build on callbacks.

```JavaScript
supertest(app).get('/').end((err, res) => console.log(res.data))
```

Although compatible with stream mode & promise mode.

```JavaScript
// Stream mode
fs.createReadStream('foo.txt')
.pipe(supertest(app).post('/'))
.on('response', res => console.log('Successful.'))

// Promise mode
supertest(app).delete('/').then(
    res => console.log('Successful.'),
    err => console.log('Failed.')
)
```

We can use one mode of them, but not multi modes together.

```JavaScript
fs.createReadStream('foo.txt')
.pipe(supertest(app).post('/')).then(
    res => console.log('Successful.'),
    err => console.log('Failed.')
) // Boom: two requests sent.
```

Axios is build on promises, and easy to use with callbacks & streams together.

```JavaScript
axiosist(app).post('/', fs.createReadStream('foo.txt')).then(
    res => console.log('Successful.'),
    err => console.log('Failed.')
) // Works
```

It may be more suitable for some specific test cases.

## Misc

Axiosist will keep the host header of the request, for example

```javascript
const express = require('express')
const app = require('app')

app.get('/host', (req, res) => res.send(req.get('host')))


const assert = require('assert')
const axiosist = require('axiosist')

void (async () => {
    const response = await axiosist(app).get('/host')
    assert.strictEqual('127.0.0.1:5xxxxx', response.data)
}) ()

void (async () => {
    const response = await axiosist(app).get('http://www.example.com:3912/host')
    assert.strictEqual('www.example.com:3912', response.data)
}) ()
```

## License

MIT

[axios]: https://www.npmjs.com/package/axios
