const toPromise = require('@f/gen-to-promise')
const isFunction = require('@f/is-function')

module.exports = pool

function pool () {
  var processes = []
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
    processes.splice(processes.indexOf(proc), 1)
  }

  function killAll () {
    processes.forEach(proc => {
      try {
        proc.throw(new Error("STOP_EXECUTION"))
      } catch(e) {}

    })
    processes = []
  }
}
