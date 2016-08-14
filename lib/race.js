const isArray = require('@f/is-array')
const isObject = require('@f/is-object')

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
  forEach(function (p, key) {
    arr.push(p.then(function (v) {
      return [key, v]
    }))
  }, obj)
  return Promise.race(arr)
}
