import * as v from 'vue'

// https://github.com/vuejs/core/issues/8594
export const appToken = Symbol('App') as v.InjectionKey<v.App>

/**
 * Accessor is used because overwise TS typing is impossible
 */
export const appInject = <T>(token: v.InjectionKey<T>) => {
  const _ = <This>(
    target: ClassAccessorDecoratorTarget<This, T>,
    context: ClassAccessorDecoratorContext<This, T>
  ): ClassAccessorDecoratorResult<This, T> => {
    // this is actually required
    const storage = new WeakMap<any, T>()

    context.addInitializer(init)

    return {
      get(): T {
        const val = storage.get(this)

        val || console.warn(this)
        assert(
          val,
          `Injected value cannot be accessed in sync context. Accessed property - ${String(
            context.name
          )}`
        )

        return val
      },

      set() {
        assert(false)
      },
    }

    function init(this: This) {
      const currentApp = v.inject(appToken)

      currentApp || console.warn(this)
      assert(
        currentApp,
        `Vue application not found for <${String(
          context.name
        )}>. Make sure services are constructed within 'app.runWithContext'`
      )

      queueMicrotask(() => {
        assert(currentApp)

        const val = currentApp.runWithContext(() => v.inject(token))

        val || console.warn(this)
        assert(
          val,
          `Token injection for <${String(
            context.name
          )}> failed. Make sure service token is provided in sync context`
        )

        storage.set(this, val)
      })
    }
  }

  return _
}
