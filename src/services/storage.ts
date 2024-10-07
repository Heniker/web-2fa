import type { EncryptedTag, KeyValStorage } from '@/_types'
import { get as dbGet, set as dbSet } from 'idb-keyval'

/**
 * IDB is used because storing Unsigned arrays is nigh impossible with localStorage
 */
function getItem<T extends keyof KeyValStorage>(
  key: T
): Promise<EncryptedTag<KeyValStorage[T]> | undefined> {
  return dbGet(key)
}

function setItem<T extends keyof KeyValStorage>(key: T, value: EncryptedTag<KeyValStorage[T]>) {
  return dbSet(key, value)
}

export const storageService = { getItem, setItem }
