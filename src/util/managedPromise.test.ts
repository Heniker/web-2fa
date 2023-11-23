// @ts-nocheck
import * as managedPromise from './managedPromise'

{
  // basic resolve usage
  const promise = managedPromise.make()
  let result
  managedPromise.resolve(promise, 'test')

  setTimeout(() => {
    assert(result === 'test')
  })

  result = await promise
  assert(result === 'test')
}

{
  // basic reject usage
  const promise = managedPromise.make()
  let result
  managedPromise.reject(promise, 'test')

  setTimeout(() => {
    assert(result === 'test')
  })

  try {
    await promise
  } catch (err) {
    result = err
    assert(result === 'test')
  }
}

{
  // double resolve no action
  let result
  const promise = managedPromise.make()
  promise.then((arg) => (result = arg))
  managedPromise.resolve(promise, 'test1')
  managedPromise.resolve(promise, 'test2')
  setTimeout(() => {
    assert(result === 'test1')
  })
}

{
  // reject after resolve no action
  let result
  const promise = managedPromise.make()
  promise.then(
    (arg) => (result = arg),
    (arg) => (result = arg)
  )
  managedPromise.resolve(promise, 'test1')
  managedPromise.reject(promise, 'test2')
  setTimeout(() => {
    assert(result === 'test1')
  })
}

{
  // double .then chaining
  let result = 1
  const promise = managedPromise.make()
  promise.then((arg) => (result += arg)).then((arg) => (result += arg))
  managedPromise.resolve(promise, 1)
  setTimeout(() => {
    assert(result === 4)
  })
}

{
  // reject .then
  const promise = managedPromise.make()

  let result
  promise.then(undefined, (reason) => {
    result = reason
  })

  managedPromise.reject(promise, 'rejected')
  setTimeout(() => {
    assert(result === 'rejected')
  })
}

{
  // double .then reject
  const promise = managedPromise.make()

  let result = 0
  promise
    .then(undefined, (reason) => {
      result += reason
    })
    .then(undefined, (reason) => {
      result += reason
    })

  managedPromise.reject(promise, 1)

  setTimeout(() => {
    assert(result === 1)
  })
}
