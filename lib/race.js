const isArray = require('@f/is-array')
const isObject = require('@f/is-object')
const forEach = require('@f/foreach')

module.exports = race

function race (val) {
  if (isArray(val)) return raceArray(val)
  if (isObject(val)) return raceObject(val)
  throw new Error('Can only select on an arry or object')
}

function raceArray (arr) {
  return Promise.race(arr)
}

function raceObject (obj) {
  var arr = []
  forEach((p, key) => {
    arr.push(p.then(v => {
      return [key, v]
    }))
  }, obj)
  return Promise.race(arr)
}
