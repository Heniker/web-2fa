import * as v from 'vue'

// https://github.com/vuejs/core/issues/8594
export const appToken = Symbol('App') as v.InjectionKey<v.App>

// accessor is used because overwise TS typing is impossible
export const appInject = <T>(token: v.InjectionKey<T>) => {
  return <This>(
    target: ClassAccessorDecoratorTarget<This, T>,
    context: ClassAccessorDecoratorContext<This, T>
  ): ClassAccessorDecoratorResult<This, T> => {
    let val: T | undefined
    let currentApp: v.App | undefined

    // this function is called synchronously after instance is constructed
    context.addInitializer(() => {
      currentApp = v.inject(appToken)

      assert(
        currentApp,
        `Vue application not found for <${String(
          context.name
        )}>. Ensure services are constructed within 'app.runWithContext'`
      )
    })

    queueMicrotask(() => {
      assert(currentApp)
      val = currentApp.runWithContext(() => v.inject(token))

      assert(
        val,
        `Token injection for <${String(
          context.name
        )}> failed. Make sure service token is provided in sync context`
      )
    })

    return {
      get(): T {
        assert(val, 'Injected value cannot be accessed in sync context')
        return val
      },

      set() {
        assert(false)
      },
    }
  }
}

/**
 * So, this decorator makes all async functions in a class begin on queueMicrotask, rather than sync \
 * Normally when async function is called it begins its execution synchronously
 * and returns its value on queueMicrotask (unless there are any truly async operations within function)
 *
 * This decorator is not required, but without it manually adding `await 1` to any function that uses injected service is mandatory
 *
 * The decorator imlementation is rather terrible (methods are replaced on instance, not on prototype),
 * but it does not really matter that much for services
 */
export const delayAsyncFunctions = () => {
  return <This extends new (...args: any) => any>(
    target: This,
    context: ClassDecoratorContext<This>
  ) => {
    const fnKeysToReplace = Object.entries(
      Object.getOwnPropertyDescriptors(target.prototype)
    ).flatMap(([key, descriptor]) => {
      if (
        descriptor.get ||
        descriptor.set ||
        typeof descriptor.value !== 'function' ||
        descriptor.value.constructor.name !== 'AsyncFunction'
      ) {
        return []
      }

      return [key]
    })

    return class extends target {
      constructor(...arg: any[]) {
        super(...arg)

        fnKeysToReplace.forEach((it) => {
          const savedVal = this[it]

          const replaceFn = async (...args: any[]) => {
            await 1 /* can be any value */
            return savedVal.call(this, ...args)
          }

          Object.defineProperty(this, it, {
            value: replaceFn,
            configurable: true,
            writable: true,
            enumerable: false,
          })
        })
      }
    }
  }
}
