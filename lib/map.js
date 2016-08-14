const isArray = require('@f/is-array')
const isObject = require('@f/is-object')


module.exports = gMap

function * gMap (gen, val) {
  if (isArray(val)) return gMapArray.call(this, gen, val)
  if (isObject(val)) return gMapObject.call(this, gen, val)
  throw new Error('Can only map over objects and arrays.')
}

function * gMapArray (gen, arr) {
  var len = arr.length
  var result = new Array(len)

  for (var i = 0; i < len; ++i) {
    result[i] = yield gen.call(this, arr[i], i)
  }
  return result
}

function * gMapObject (gen, obj) {
  var result = {}
  var keys = Object.keys(obj)

  for (var i = 0, len = keys.length; i < len; ++i) {
    var key = keys[i]
    result[key] = yield gen.call(this, obj[key], key)
  }
  return result
}
