import { app } from '@/main'
import * as v from 'vue'

export function appInject<T>(token: v.InjectionKey<T>) {
  return <This>(
    target: ClassAccessorDecoratorTarget<This, T>,
    context: ClassAccessorDecoratorContext<This, T>
  ): ClassAccessorDecoratorResult<This, T> => {
    let val: T | undefined

    queueMicrotask(() => {
      val = app.runWithContext(() => v.inject(token))
      assert(val, `Token injection failed. Make sure token is provided in sync context`)
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
