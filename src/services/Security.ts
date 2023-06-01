import * as v from 'vue'
import { ServiceA } from './_Service'
import { appInject } from './util'
import { PersistentStorage } from './PersistentStorage'

export class Security extends ServiceA {
  static token = Symbol() as v.InjectionKey<Security>

  @appInject(PersistentStorage.token)
  private accessor persistentStorage!: PersistentStorage

  reactive = undefined

  contextSetUp = new Promise<void>((resolve) => (this.contextSetUpResolve = resolve))
  private contextSetUpResolve!: () => void

  encrypt: (data: string) => Promise<string> | void = assert.bind(
    {},
    false,
    'Encryption is not initialized'
  )
  decrypt: (data: string) => Promise<string> | void = assert.bind(
    false,
    'Decryption is not initialized'
  )

  constructor() {
    super()
  }

  async setupSecureContext(plainTextPass: string) {
    const key = await crypto.subtle.importKey(
      'raw',
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(plainTextPass)),
      'AES-GCM',
      false,
      ['encrypt', 'decrypt']
    )
    plainTextPass = ''

    const iv =
      this.persistentStorage.reactive['secure-iv'] ||
      (this.persistentStorage.reactive['secure-iv'] = crypto.getRandomValues(new Uint8Array(12)))

    const encryptionAlgorithm = {
      name: 'AES-GCM',
      iv,
    }

    this.encrypt = (data: string) =>
      crypto.subtle
        .encrypt(encryptionAlgorithm, key, new TextEncoder().encode(data))
        .then((arg) => new TextDecoder().decode(arg))

    this.decrypt = (data: string) =>
      crypto.subtle
        .decrypt(encryptionAlgorithm, key, new TextEncoder().encode(data))
        .then((arg) => new TextDecoder().decode(arg))

    this.contextSetUpResolve()
  }
}
