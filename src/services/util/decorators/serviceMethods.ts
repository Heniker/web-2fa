import { makePersist, managedPromise, persist } from '@/util'
import { once } from '.'

const initFinished = makePersist<[any], PromiseLike<void>>()
const initUnavaliable = makePersist<[any], (string | symbol)[]>()

/**
 * Marks method as Service init method\
 * There can only be one init method per Service instance RN
 *
 * Such method can not call any methods decorated by `serviceUntilInit`
 */
export const serviceInit = () => {
  return <This, T extends (this: This, ...args: any) => any>(
    value: T,
    context: ClassMethodDecoratorContext<This, T>
  ) => {
    if (value.constructor.name !== 'AsyncFunction') {
      return
    }

    const isFinished = managedPromise.make<void>()

    context.addInitializer(function (this: any) {
      initFinished(this, isFinished)
    })

    const returnVal = async function (...args) {
      let thisArg = this

      if (__DEV__) {
        const forbiddenNames = initUnavaliable(this)
        assert(forbiddenNames)

        thisArg = Object.assign(
          {},
          this,
          Object.fromEntries(
            forbiddenNames.map((it) => [
              it,
              () => assert(false, 'Forbidden method was called in init function'),
            ])
          )
        )
      }

      await Promise.resolve()
      const returnVal = value.call(thisArg, ...args)
      managedPromise.resolve(initFinished(this))
      return returnVal
    } as T

    return once()(returnVal, context)
  }
}

/**
 * Delays async function until method decorated by `serviceInit()` is called
 *
 * If `serviceInit` was not added - delays untill `queueMicrotask`
 */
export const serviceUntilInit = () => {
  return <This, T extends (this: This, ...args: any) => any>(
    value: T,
    context: ClassMethodDecoratorContext<This, T>
  ) => {
    if (value.constructor.name !== 'AsyncFunction') {
      return
    }

    __DEV__ &&
      context.addInitializer(function () {
        initUnavaliable(this) || initUnavaliable(this, [])
        const decoratedItems = initUnavaliable(this)

        decoratedItems.push(context.name)
      })

    const returnVal = async function (...args) {
      await initFinished(this)
      return value.call(this, ...args)
    } as T

    return returnVal
  }
}

/**
 * Delays async function until `queueMicrotask`
 */
export const serviceUntilInject = () => {
  return <This, T extends (this: This, ...args: any) => any>(
    value: T,
    context: ClassMethodDecoratorContext<This, T>
  ) => {
    if (value.constructor.name === 'AsyncFunction') {
      return
    }

    return async function (...args) {
      await Promise.resolve()
      return value.call(this, ...args)
    } as T
  }
}
