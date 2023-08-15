import { useStorage } from '@vueuse/core'
import { get as dbGet, set as dbSet } from 'idb-keyval'
import * as v from 'vue'
import type { KeyValStorageDataI } from '@/_types'
import { once, serviceInit, serviceUntilInit } from './util'
import { managedPromise } from '@/util'

/**
 * Nothing but data persistance should be handled here
 * IDB is used because storing Unsigned arrays is nigh impossible with localStorage
 */
export class PersistentStorage {
  static token = Symbol() as v.InjectionKey<PersistentStorage>

  public keyPrefix: string | undefined

  @serviceUntilInit()
  async getItem<T extends keyof KeyValStorageDataI>(
    key: T
  ): Promise<KeyValStorageDataI[T] | undefined> {
    assert(typeof key === 'string')
    assert(this.keyPrefix !== undefined)

    return dbGet(this.keyPrefix + key)
  }

  @serviceUntilInit()
  async setItem<T extends keyof KeyValStorageDataI>(key: T, value: KeyValStorageDataI[T]) {
    assert(typeof key === 'string')
    assert(this.keyPrefix !== undefined)

    return dbSet(this.keyPrefix + key, value)
  }

  @serviceInit()
  async init(prefix = '') {
    this.keyPrefix = prefix
  }
}
