/**
 * Modules
 */

const isGenerator = require('@f/is-generator')
const isIterator = require('@f/is-iterator')
const isPromise = require('@f/is-promise')
const isArray = require('@f/is-array')
const flatten = require('@f/flatten-gen')
const toPromise = require('@f/to-promise')
const map = require('@f/map-gen')
const sleep = require('@f/sleep')
const channel = require('@f/channel')
const bind = require('@f/bind-middleware')

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

// action processors
exports.dispatch = composeWithGojy()
exports.compose = composeWithGojy
exports.middleware = gojy

// primitive actions
exports.go = go
exports.kill = kill

// goisms
exports.delay = sleep
exports.channel = channel
exports.select = select
exports.poss = poss

// control flow helpers
exports.forEach = forEach
exports.map = gMap
exports.join = join
exports.now = now



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

function composeWithGojy (mw, ...mws) {
  let stack = [gojy()]
  if (isArray(mw)) {
    stack = [gojy(), ...mw]
  } else if (mw){
    stack = [gojy(), mw, ...mws]
  }
  return bind(stack)
}

function * go (action) {
  return yield {type: GO, payload: action}
}

function * kill () {
  return yield {type: KILL}
}

function * join (val) {
  return yield toPromise(val)
}

function * now (val) {
  return yield join(yield gMap(go, val))
}

function toDefer (promise) {
  return {promise}
}
