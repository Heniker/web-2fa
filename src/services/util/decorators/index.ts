import { persist } from '@/util'

export * from './appInject'
export * from './serviceMethods'

/**
 * Function is executed only once per constructed instance and then only returns stored value
 */
export const once = () => {
  return <This, T extends (this: This, ...args: any) => any>(
    value: T,
    context: ClassMethodDecoratorContext<This, T>
  ) => {
    const isCalled = {}
    const callReturn = {}

    const returnVal = function (...args) {
      if (persist(this, isCalled)) {
        return persist(this, callReturn)
      }

      const callResult = value.call(this, ...args)

      persist(this, isCalled, true)
      persist(this, callReturn, callResult)

      return callResult
    } as T

    return value.constructor.name === 'AsyncFunction'
      ? (async function (...args) {
          return returnVal.call(this, ...args)
        } as T)
      : returnVal
  }
}
