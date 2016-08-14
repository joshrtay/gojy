/**
 * Modules
 */

const isGenerator = require('@f/is-generator')
const isIterator = require('@f/is-iterator')
const isPromise = require('@f/is-promise')
const flatten = require('@f/flatten-gen')
const map = require('@f/map-gen')
const channel = require('@f/channel')
const toPromise = require('@f/to-promise')

const poss = require('poss')

const createPool = require('./pool')
const gMap = require('./map')
const forEach = require('./foreach')
const select = require('./select')

const GO = 'gojy/GO'
const KILL = 'gojy/KILL'

/**
 * Expose
 */

exports.middleware = gojy
exports.go = go
exports.join = join
exports.now = now
exports.channel = channel
exports.select = select
exports.forEach = forEach
exports.map = gMap
exports.poss = poss

/**
 * gojy
 */

function gojy () {
  return ctx => {
    const pool = createPool()
    return next => action => {
      const dispatch = ctx.dispatch
      if (isGenerator(action) || isIterator(action) || action.type === GO) {
        if (action.type === GO) action = action.payload
        return toDefer(pool.spawn(map(action => action && dispatch(action), flatten(action))))
      } else if (action.type === KILL) {
        pool.killAll()
      } else if (isPromise(action) || isDefer(action)) {
        return action
      } else {
        return next(action)
      }
    }
  }
}

function * go (action) {
  return yield {type: GO, payload: action}
}

function * join (val) {
  return yield toPromise(val)
}

function * now (val) {
  return yield join (yield gMap(go, val))
}

function toDefer (promise) {
  return {promise}
}
