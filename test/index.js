/**
 * Imports
 */

require("babel-polyfill")

const test = require('tape')
const {run, go, join, poss, delay, select, kill, forEach} = require('..')
const bind = require('@f/bind-middleware')

/**
 * Tests
 */

test('go should run async and return', (t) => {

  run(function * () {
    const p = yield go(function * () {
      yield delay(10)
      return 'foo'
    })

    const res = yield p
    t.equal(res, 'foo')
    t.end()
  })

})

test('join should wait on multiple', (t) => {
  run(function * () {
    const p1 = yield go(function * () {
      yield delay(10)
      return 'foo'
    })
    const p2 = yield go(function * () {
      yield delay(20)
      return 'bar'
    })

    const [err, res] = yield poss(join([p1, p2]))
    t.deepEqual(res, ['foo', 'bar'])
    t.end()
  })
})

test('join should selct fastest', (t) => {
  run(function * () {
    const p1 = yield go(function * () {
      yield delay(20)
    })
    const p2 = yield go(function * () {
      yield delay(10)
    })

    const [err, res] = yield poss(select([
      [p1, _ => 'foo'],
      [p2, _ => 'bar']
    ]))

    t.deepEqual(res, 'bar')
    t.end()
  })
})

test('should kill ongoing gos', (t) => {
  run(function * () {
    const ended = []
    const p1 = yield go(function * () {
      yield delay(200)
      ended.push(true)
    })
    const p2 = yield go(function * () {
      yield delay(200)
      ended.push(true)
    })

    const [err, res] = yield poss(kill())
    t.equal(err.message, 'STOP_EXECUTION')
    yield delay(200)
    t.equal(ended.length, 0)
    t.end()
  })
})

test('should run sync foreach', (t) => {
  run(function * () {
    const vals = []
    yield forEach(function * (val) {
      yield delay(50)
      vals.push(val)
    }, [1, 2, 3])
    t.deepEquals(vals,[1, 2, 3])
    t.end()
  })
})
