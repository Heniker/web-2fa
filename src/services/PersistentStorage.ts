import { ServiceA } from './_Service'
import { useStorage } from '@vueuse/core'
import * as v from 'vue'
import * as _ from 'lodash'
import type { LocalStorageDataI } from '@/_types'

const localStorageDefaults: LocalStorageDataI = {}

/**
 * Basically localStorage access
 * Nothing but data persistance should be handled here
 */
export class PersistentStorage extends ServiceA {
  static token = Symbol() as v.InjectionKey<PersistentStorage>

  /**
   * Reactive LocalStorage
   */
  reactive = v.reactive({} as LocalStorageDataI)

  constructor() {
    super()
    
    v.watch(
      this.reactive,
      () => {
        const storageKeys = Object.keys(globalThis.localStorage) as (keyof LocalStorageDataI)[]
        const reactiveKeys = Object.keys(this.reactive)
        // One way reactivity. We do not care about changes to localStorage made outside of this module, because they should not happen
        const diff = reactiveKeys.filter((it) => !storageKeys.includes(it))

        if (!diff.length) {
          return
        }

        Object.assign(
          this.reactive,
          Object.fromEntries(
            diff.map(
              (key) =>
                [
                  key,
                  useStorage<LocalStorageDataI[keyof LocalStorageDataI] | undefined>(
                    key,
                    localStorageDefaults[key],
                    globalThis.localStorage
                  ).value,
                ] as const
            )
          )
        )
      },
      { immediate: true, deep: false }
    )
  }

  getItem(key: keyof LocalStorageDataI) {
    return this.reactive[key]
  }

  setItem<T extends keyof LocalStorageDataI>(key: T, value: LocalStorageDataI[T]) {
    return this.reactive[key] = value
  }
}
