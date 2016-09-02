/**
 * Imports
 */

require("babel-polyfill")

const test = require('tape')
const {run, go, join, poss, delay, select, kill, forEach, map, now} = require('..')

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
    t.deepEquals(vals, [1, 2, 3])
    t.end()
  })
})

test('should run sync foreach on object', (t) => {
  run(function * () {
    const vals = []
    const [err] = yield poss(forEach(function * (val) {
      yield delay(50)
      vals.push(val)
    }, {a: 1, b: 2, c: 3}))

    t.deepEquals(vals, [1, 2, 3])
    t.end()
  })
})

test('should run sync map on array', (t) => {
  run(function * () {
    const [err, vals] = yield poss(map(function * (val) {
      yield delay(50)
      return val + 1
    }, [1, 2, 3]))
    t.deepEquals(vals, [2, 3, 4])
    t.end()
  })
})

test('should run sync map on object', (t) => {
  run(function * () {
    const [err, vals] = yield poss(map(function * (val) {
      yield delay(50)
      return val + 1
    }, {a: 1, b: 2, c: 3}))
    t.deepEquals(vals, {a: 2, b: 3, c: 4})
    t.end()
  })
})

test('should run processes in parallel with now', (t) => {
  run(function * () {
    const res = yield now({
      a: function * () {
        yield delay(50)
        return 1
      },
      b: function * () {
        yield delay(50)
        return 2
      }
    })
    t.deepEquals(res, {a: 1, b: 2})
    t.end()
  })
})
