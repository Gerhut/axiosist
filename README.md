axiosist
========

[![Build Status](https://travis-ci.org/Gerhut/axiosist.svg?branch=master)](https://travis-ci.org/Gerhut/axiosist)
[![Coverage Status](https://coveralls.io/repos/github/Gerhut/axiosist/badge.svg?branch=master)](https://coveralls.io/github/Gerhut/axiosist?branch=master)
[![dependencies Status](https://david-dm.org/Gerhut/axiosist/status.svg)](https://david-dm.org/Gerhut/axiosist)
[![devDependencies Status](https://david-dm.org/Gerhut/axiosist/dev-status.svg)](https://david-dm.org/Gerhut/axiosist?type=dev)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Convert node.js request handler to axios adapter, used for node.js server unit test.

Install
-------

    $ npm install --save-dev axiosist
    
Usage
-----

```javascript
// App
const express = require('express')
const app = express()

app.get('/', (req, res) => res.status(201).send('foo'))

// Unit test
const assert = require('assert')
const axiosist = require('axiosist')
axiosist(app).get('/').then(response => {
    assert.strictEqual(201, response.statusCode)
    assert.strictEqual('foo', response.data)
})
```

API
---

### `axiosist(callback)`

Create an axios instance with adapter of the request callback.

### `axiosist.createAdapter(callback)`

Create the adapter of the request callback, used for your own axios instance.

```javascript
axiosist(callback)
```

is equal to

```javascript
axios.create({ adapter: axiosist.createAdapter(callback) })
```

Misc
----

Axiosist will keep the host header of the request, for example

```javascript
const express = require('express')
const app = require('app')

app.get('/', (req, res) => res.send(req.get('host')))


const assert = require('assert')
const axiosist = require('axiosist')
axiosist(app).get('/').then(response => {
    assert.strictEqual('127.0.0.1:5xxxxx', response.data)
})
axiosist(app).get('http://www.example.com:3912/').then(response => {
    assert.strictEqual('www.example.com:3912', response.data)
})
```

License
-------

MIT
