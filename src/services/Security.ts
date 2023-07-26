import * as v from 'vue'
import { managedPromise, persist } from '@/util'
import { appInject, delayAsyncFunctions } from './util'
import { PersistentStorage } from './PersistentStorage'
import { until } from '@vueuse/core'
import { Settings } from './Settings'
import { useIdle } from '@vueuse/core'

@delayAsyncFunctions()
export class Security {
  static token = Symbol() as v.InjectionKey<Security>

  @appInject(PersistentStorage.token)
  private accessor persistentStorage!: PersistentStorage

  @appInject(Settings.token)
  private accessor settings!: Settings

  private encryptionKey?: CryptoKey
  private encryptionIv?: Uint8Array

  reactive = v.reactive({ isContextSetUp: false })

  async encrypt(data: string) {
    await until(v.toRef(() => this.reactive.isContextSetUp)).toBe(true)

    assert(this.encryptionKey)
    assert(this.encryptionIv)

    return crypto.subtle
      .encrypt(
        { name: 'AES-GCM', iv: this.encryptionIv },
        this.encryptionKey,
        new TextEncoder().encode(data)
      )
      .then((arg) => new Uint8Array(arg))
  }

  async decrypt(data: Uint8Array) {
    await until(v.toRef(() => this.reactive.isContextSetUp)).toBe(true)

    assert(this.encryptionKey)
    assert(this.encryptionIv)

    return crypto.subtle
      .decrypt({ name: 'AES-GCM', iv: this.encryptionIv }, this.encryptionKey, data)
      .then((arg) => new TextDecoder().decode(arg))
  }

  /**
   * Plain password should not be accessible from outside - that's why this function exists
   */
  async setupSecureContext(plainTextPass: string) {
    if (this.reactive.isContextSetUp) {
      return
    }

    this.encryptionKey = await crypto.subtle.importKey(
      'raw',
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(plainTextPass)),
      'AES-GCM',
      false,
      ['encrypt', 'decrypt']
    )

    let secureIv = await this.persistentStorage.getItem('secure-iv')

    if (!secureIv || secureIv.length === 0) {
      console.log('No secure-iv found in storage. Generating a new one')
      secureIv = crypto.getRandomValues(new Uint8Array(12))
      await this.persistentStorage.setItem('secure-iv', secureIv)
    }

    this.encryptionIv = secureIv
    this.reactive.isContextSetUp = true

    /**
     * useIdle implementation might leak memory, but I did not look at it deep enough to make accusations
     */
    const idle = useIdle()

    const setUpForget = () => {
      const timePassed = Date.now() - idle.lastActive.value
      clearTimeout(persist(setUpForget))

      const timeout = setTimeout(() => {
        if (timePassed > this.settings.reactive.passwordKeepAlive) {
          setUpForget()
          return
        }

        this.encryptionIv = undefined
        this.encryptionKey = undefined
        this.reactive.isContextSetUp = false
      }, this.settings.reactive.passwordKeepAlive - timePassed + 100)

      persist(setUpForget, timeout)
    }

    v.watch(
      v.toRef(() => this.settings.reactive.passwordKeepAlive),
      setUpForget
    )

    setUpForget()
  }
}
