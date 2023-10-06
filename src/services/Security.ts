import * as v from 'vue'
import { managedPromise, persist } from '@/util'
import { appInject, serviceUntilInit, serviceUntilInject } from './util'
import { PersistentStorage } from './PersistentStorage'
import { until } from '@vueuse/core'
import { Settings } from './Settings'
import { useIdle } from '@vueuse/core'

const baseDecrypt = (iv: Uint8Array, key: CryptoKey, data: Uint8Array) => {
  return crypto.subtle
    .decrypt({ name: 'AES-GCM', iv }, key, data)
    .then((arg) => new TextDecoder().decode(arg))
}

const baseEncrypt = (iv: Uint8Array, key: CryptoKey, data: string) => {
  return crypto.subtle
    .encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(data))
    .then((arg) => new Uint8Array(arg))
}

export class Security {
  static token = Symbol() as v.InjectionKey<Security>

  @appInject(PersistentStorage.token)
  private accessor persistentStorage!: PersistentStorage

  @appInject(Settings.token)
  private accessor settings!: Settings

  private encryptionKey?: CryptoKey
  private encryptionIv?: Uint8Array

  reactive = v.reactive({ isContextSetUp: false })

  @serviceUntilInit()
  async encrypt(data: string) {
    await until(() => this.reactive.isContextSetUp).toBe(true)

    assert(this.encryptionKey)
    assert(this.encryptionIv)

    return baseEncrypt(this.encryptionIv, this.encryptionKey, data)
  }

  @serviceUntilInit()
  async decrypt(data: Uint8Array) {
    await until(() => this.reactive.isContextSetUp).toBe(true)

    assert(this.encryptionKey)
    assert(this.encryptionIv)

    return baseDecrypt(this.encryptionIv, this.encryptionKey, data)
  }

  /**
   * Plain password should not be accessible from outside - that's why this function exists
   */
  @serviceUntilInit()
  async setupSecureContext(plainTextPass: string) {
    if (this.reactive.isContextSetUp) {
      return
    }

    const key = await crypto.subtle.importKey(
      'raw',
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(plainTextPass)),
      'AES-GCM',
      false,
      ['encrypt', 'decrypt']
    )

    const iv = await this.persistentStorage.getItem('iv').then(async (it) => {
      if (!it || it.length === 0) {
        console.log('No iv found in storage. Generating a new one')
        const newIv = crypto.getRandomValues(new Uint8Array(12))

        await this.persistentStorage.setItem('iv', newIv)
        return newIv
      }

      return it
    })

    const secureValidation = await this.persistentStorage
      .getItem('secure-validation')
      .then(async (it) => {
        if (!it || it.length === 0) {
          const encryptedMessage = await baseEncrypt(iv, key, 'valid')
          await this.persistentStorage.setItem('secure-validation', encryptedMessage)

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

    this.setUpForgetPassword()

    this.encryptionKey = key
    this.encryptionIv = iv
    this.reactive.isContextSetUp = true

    return true
  }

  @serviceUntilInject()
  private setUpForgetPassword() {
    /**
     * useIdle implementation might leak memory, but I did not look at it deep enough to make accusations
     */
    const idle = useIdle()

    let timeout: ReturnType<typeof setTimeout>

    var setUpForget = () => {
      clearTimeout(timeout)

      if (this.settings.reactive.passwordKeepAlive === Infinity) {
        return
      }

      const timePassed = Date.now() - idle.lastActive.value
      timeout = setTimeout(() => {
        if (timePassed > this.settings.reactive.passwordKeepAlive) {
          setUpForget()
          return
        }

        this.encryptionIv = undefined
        this.encryptionKey = undefined
        this.reactive.isContextSetUp = false
      }, this.settings.reactive.passwordKeepAlive - timePassed + 100)
    }

    v.watch(() => this.settings.reactive.passwordKeepAlive, setUpForget)

    setUpForget()
  }
}
