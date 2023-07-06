import { ServiceA } from './_Service'
import { useStorage } from '@vueuse/core'
import { get as dbGet, set as dbSet } from 'idb-keyval'
import * as v from 'vue'
import type { KeyValStorageDataI } from '@/_types'

/**
 * Nothing but data persistance should be handled here
 * IDB is used because storing Unsigned arrays is nigh impossible with localStorage
 */
export class PersistentStorage extends ServiceA {
  static token = Symbol() as v.InjectionKey<PersistentStorage>

  constructor() {
    super()
  }

  getItem<T extends keyof KeyValStorageDataI>(key: T): Promise<KeyValStorageDataI[T] | undefined> {
    assert(typeof key === 'string')
    return dbGet(key)
  }

  setItem<T extends keyof KeyValStorageDataI>(key: T, value: KeyValStorageDataI[T]) {
    assert(typeof key === 'string')
    return dbSet(key, value)
  }
}
