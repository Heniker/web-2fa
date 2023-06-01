import * as v from 'vue'
import { useBetterResetRef } from '../util'
import { PersistentStorage } from './PersistentStorage'
import { ServiceA } from './_Service'
import { appInject } from './util'
import { Security } from './Security'

export class Otp extends ServiceA {
  static token = Symbol() as v.InjectionKey<Otp>

  @appInject(PersistentStorage.token)
  private accessor persistentStorageService!: PersistentStorage

  @appInject(Security.token)
  private accessor securityService!: Security

  constructor() {
    super()
  }

  reactive = (() => {
    const tokens = ((encryptedTokens = this.persistentStorageService.reactive['secure-tokens']) =>
      (encryptedTokens && this.securityService.decrypt(encryptedTokens)) || [])()

    return v.reactive({
      tokens: this.persistentStorageService.reactive,
      passwordTtl: passwordTtl,
      password: useBetterResetRef('', passwordTtl),
    })
  })()

  create() {}

  generateCode() {}
}
