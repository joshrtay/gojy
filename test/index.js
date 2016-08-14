/**
 * Imports
 */

require("babel-polyfill")

const test = require('tape')
const {middleware, go, join, poss} = require('..')
const bind = require('@f/bind-middleware')
const sleep = require('@f/sleep')

/**
 * Tests
 */

test('go should run async and return', (t) => {

  let dispatch = bind([middleware()])

  dispatch(function * () {
    var p = yield go(function * () {
      yield sleep(10)
      return 'foo'
    })

    const [err, res] = yield poss(join(p))
    t.equal(res, 'foo')
    t.end()

  })


})
