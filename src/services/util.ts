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
