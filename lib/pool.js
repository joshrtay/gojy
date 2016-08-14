const toPromise = require('@f/gen-to-promise')
const isFunction = require('@f/is-function')

module.exports = pool

function pool () {
  var processes = []
  var killing = false
  return {spawn: spawn, killAll: killAll}

  function spawn (gen) {
    if (isFunction(gen)) gen = gen()
    processes.push(gen)
    return toPromise(gen).then(val => {
      removeProcess(gen)
      return val
    }, err => {
      removeProcess(gen)
      throw err
    })
  }

  function removeProcess (proc) {
    if (killing) return
    processes.splice(processes.indexOf(proc), 1)
  }

  function killAll () {
    killing = true
    processes.forEach(proc => {
      proc.throw(new Error("STOP EXECUTION"))
    })
    processes = []
    killing = false
  }
}
