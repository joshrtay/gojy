const forEach = require('@f/foreach')
const race = require('./race')

module.exports = select

function select (cases) {
  var promises = {}
  var callbacks = {}
  forEach(function (val, idx) {
    promises[idx] = val[0].then(v => [idx, v])
    callbacks[idx] = val[1]
  }, cases)
  return race(promises).then(function (keyVal) {
    return callbacks[keyVal[0]](keyVal[1])
  })
}
