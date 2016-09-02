const isArray = require('@f/is-array')
const isObject = require('@f/is-object')

module.exports = gForEach

function * gForEach (fn, a) {
  if (isArray(a)) return yield gForEachArray.call(this, fn, a)
  if (isObject(a)) return yield gForEachObject.call(this, fn, a)
  throw new Error('Can only iterate over objects and arrays.')
}

function * gForEachArray (gen, arr) {
  if (!arr) return
  for (var i = 0, len = arr.length; i < len; ++i) {
    yield gen.call(this, arr[i], i)
  }
}

function * gForEachObject (gen, obj) {
  if (!obj) return

  let keys = Object.keys(obj)

  for (var i = 0, len = keys.length; i < len; ++i) {
    let key = keys[i]
    yield gen.call(this, obj[key], key, i)
  }
}
