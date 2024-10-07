import * as v from 'vue'
import { useStore } from '@/store'
import { createGlobalState } from '@vueuse/core'
import { until } from '@vueuse/core'
import type { EncryptedTag } from '@/_types'
import { storageService } from '@/services/storage'
import type { JsonPrimitive, JsonValue } from 'type-fest'

const baseDecrypt = <T>(iv: Uint8Array, key: CryptoKey, data: EncryptedTag<T>): Promise<T> => {
  return crypto.subtle
    .decrypt({ name: 'AES-GCM', iv }, key, data)
    .then((arg) => JSON.parse(new TextDecoder().decode(arg)))
}

const baseEncrypt = <T>(iv: Uint8Array, key: CryptoKey, data: T): Promise<EncryptedTag<T>> => {
  return crypto.subtle
    .encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(data)))
    .then((arg) => new Uint8Array(arg) as EncryptedTag<T>)
}

export const useSecurityStore = createGlobalState(() => {
  const isContextSetUp = v.ref(false)
  const encryptionIv = v.ref<Uint8Array | undefined>(undefined)
  const encryptionKey = v.ref<CryptoKey | undefined>(undefined)

  return v.reactive({ isContextSetUp, encrypt, decrypt, setupSecureContext, forgetPassword })

  async function encrypt<T>(data: T) {
    await until(isContextSetUp).toBe(true)

    assert(encryptionKey.value)
    assert(encryptionIv.value)

    return baseEncrypt(encryptionIv.value, encryptionKey.value, data)
  }

  async function decrypt<T>(data: EncryptedTag<T>) {
    await until(isContextSetUp).toBe(true)

    assert(encryptionKey.value)
    assert(encryptionIv.value)

    return await baseDecrypt(encryptionIv.value, encryptionKey.value, data)
  }

  /**
   * Plain password should not be accessible from outside - that's why function exists
   */
  async function setupSecureContext(plainTextPass: string) {
    if (isContextSetUp.value) {
      return
    }

    let isNewIv = false

    const key = await crypto.subtle.importKey(
      'raw',
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(plainTextPass)),
      'AES-GCM',
      false,
      ['encrypt', 'decrypt']
    )

    const iv = await storageService.getItem('iv').then(async (it) => {
      if (!it || it.length === 0) {
        console.log('No iv found in storage. Generating a new one')
        const newIv = crypto.getRandomValues(new Uint8Array(12)) as EncryptedTag<Uint8Array>

        await storageService.setItem('iv', newIv)

        isNewIv = true
        return newIv
      }

      return it
    })

    const secureValidation = await storageService.getItem('validation').then(async (it) => {
      if (!it || it.length === 0) {
        const encryptedMessage = await baseEncrypt(iv, key, 'valid' as const)
        await storageService.setItem('validation', encryptedMessage)

        return encryptedMessage
      }

      return it
    })

    try {
      const decryptedValidation = await baseDecrypt(iv, key, secureValidation)
      assert(decryptedValidation === 'valid')
    } catch (err) {
      return false
    }

    encryptionKey.value = key
    encryptionIv.value = iv
    isContextSetUp.value = true

    return isNewIv ? 'new_iv' as const : true
  }

  function forgetPassword() {
    encryptionIv.value = undefined
    encryptionKey.value = undefined
    isContextSetUp.value = false
  }
})
