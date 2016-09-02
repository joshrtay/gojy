
# gojy

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

GO style control flow in Javascript with Yieldable actions.

gojy is redux style middleware that treats generators as sequential blocking threads. These threads will block on yielded promises and generator - very much like co. gojy however, uses a different concurrency mechanism. Whereas co utilizes arrays and objects, gojy uses the go action. When a go action is yielded a promise is returned that resolves when the go routine completes. This promise can then be yielded at a later point in time to wait for the result.

gojy's concurrency mechanism provides three advantages over co:

 - it's more powerful
 - it doesn't overload objects and arrays so that they can be used as actions
 - it pools goroutines run by an instance of a runner, so that they can all be killed

## Installation

    $ npm install gojy

## Usage

```js
const {run, go, join} = require('gojy')

run(function * () {
  // launch go routine without blocking
  const promise1 = yield go(function * () {
    yield fetch('google.com')
    yield fetch('facebook.com')
  })

  // launch go routine without blocking
  const promise2 = yield go(function * () {
    yield fetch('segment.io')
    yield fetch('mixpanel.io')
  })

  // block
  yield join([promise1, promise2])
})
```

## API

### gojy runners

#### .run(process)
A pure runner with no additional action processing.

- `process` - generator to run

**Returns:** result of generator

#### .compose(...middleware)
Creates a runner with additional action processing handled by `middleware`.

- `middleware` - redux style middleware

**Returns:** a gojy runner

#### .middleware()

**Returns:** the gojy middleware for use in redux middleware stacks

### gojy actions

#### .go(goroutine)
Launch a goroutine

- `goroutine` - goroutine to run

**Returns:** a promise that resolves on goroutine completion

#### .kill()
Kill running goroutines launched by runner.

### control flow helpers
Helpers for managing control flow.

#### .join(collection)
Turn collection to a promise and block on it.

- `collection` - the promise or collection of promises to block on

**Returns:** result of promise

implementation:
```js
function * join (collection) {
  return yield toPromise(collection)
}
```

#### .forEach(generator, collection)
Async sequential for each.

- `generator` - async iteratee
- `collection` - collection to iterate over

#### .map(generator, collection)
Async sequential map.

- `generator` - async iteratee
- `collection` - collection to iterate over

**Returns:** mapped collection

#### .now(collection)
Run collection in parallel and block. Gives you similar behavior to co yielded arrays and objects.

- `collection` - the collection of goroutines to run in parallel

**Returns** result of collection goroutines

implementation:
```js
function * now (collection) {
  return yield join(yield map(go, collection))
}
```

### goisms
Some handy dandy goisms.

#### .delay(time)
[Sleep](//github.com/micro-js/sleep) for time.

#### .channel()
Simple promise based [channel implementation](//github.com/micro-js/channel).

**Returns:** take and put functions for the created channel

#### .poss(generator)
Go inspired error handling by [matthewmueller](//github.com/matthewmueller/poss)

**Returns:** error first array ([err, ...])

### .select(cases)
Wait on multiple promises and selects first.

- `cases` - array of cases to wait on. Each case is a tuple of the form [promise, cb].

**Returns:** result cb of fasest promise

Example:
```js
const res = yield select([
  [fetch('google'), _ => 'google is better'],
  [fetch('facebook'), _ => 'facebook is better']
])
console.log(res) // => `google is better`
```


## License

MIT

[travis-image]: https://img.shields.io/travis/joshrtay/gojy.svg?style=flat-square
[travis-url]: https://travis-ci.org/joshrtay/gojy
[git-image]: https://img.shields.io/github/tag/joshrtay/gojy.svg?style=flat-square
[git-url]: https://github.com/joshrtay/gojy
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/gojy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/gojy
