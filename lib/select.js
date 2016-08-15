const forEach = require('@f/foreach')
const race = require('./race')

module.exports = select

function * select (cases) {
  const promises = {}
  const callbacks = {}
  forEach(function (val, idx) {
    promises[idx] = val[0]
    callbacks[idx] = val[1]
  }, cases)
  const keyVal = yield race(promises)
  return callbacks[keyVal[0]](keyVal[1])
}
