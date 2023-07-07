import * as v from 'vue'
import * as otp from 'otpauth'
import { persist, useBetterResetRef, useLazyInitRef } from '../util'
import { PersistentStorage } from './PersistentStorage'
import { ServiceA } from './_Service'
import { appInject } from './util'
import { Security } from './Security'
import type { TokenAlgorithmT, TokenI } from '@/_types'
import { nanoid } from 'nanoid'
import { useAsyncState, useInterval, watchArray } from '@vueuse/core'

export class Otp extends ServiceA {
  static token = Symbol() as v.InjectionKey<Otp>

  @appInject(PersistentStorage.token)
  private accessor persistentStorageService!: PersistentStorage

  @appInject(Security.token)
  private accessor securityService!: Security

  async fetchStoredTokens() {
    await 1 // gurantees async execution bcs injected services will be undefined if sync
    const encryptedTokens = await this.persistentStorageService.getItem('secure-tokens')

    if (!encryptedTokens) {
      console.log('No secure-tokens found in storage')
      return [] as TokenI[]
    }

    const tokens = JSON.parse(await this.securityService.decrypt(encryptedTokens)) as TokenI[]

    assert(tokens.length, 'Tokens should not be empty. This is a bug')
    tokens.forEach((it) => this.setupToken(it))
  }

  private setupToken(_: TokenI) {
    const tokenRef = v.toRef(_)
    this.reactive.tokens.push(tokenRef.value)

    const token = tokenRef.value

    const makeTimer = async () => {
      const code = await this.generateCodeFor(token)
      this.reactive.codes[token.id] = code

      const timeRemeaining = this.getRemainingTime(token)

      // isEdge check forces this function to reactivate many times when it is close to finishing
      // welp, I've tried to make things right
      setTimeout(makeTimer, isEdge ? timeRemeaining - 100 : timeRemeaining)
    }

    makeTimer()
  }

  /**
   * #todo> cache
   */
  getRemainingTime(token: TokenI) {
    // 30 * (1 - ((Date.now() / 1000 / 30) % 1))
    return token.period * 1000 - (Date.now() % (token.period * 1000))
    // return token.period * (1 - ((Date.now() / 1000 / token.period) % 1)) * 1000
    // const time = token.period * (1 - ((Date.now() / 1000 / token.period) % 1)) * 1000
    // console.log(time)
    // return time
  }

  reactive = v.reactive({
    tokens: [] as TokenI[],
    codes: {} as Record<TokenI['id'], string>,
  })

  supportedAlgorithms = ['SHA1', 'SHA256', 'SHA512'] as const satisfies readonly TokenAlgorithmT[]

  async addToken(token: TokenI, secret: string) {
    await 1

    this.persistentStorageService.setItem(
      `secret-${token.id}`,
      await this.securityService.encrypt(secret)
    )

    // the order is important, which is bad
    // #todo?> lets not use array to store tokens
    this.setupToken(token)

    this.persistentStorageService.setItem(
      'secure-tokens',
      await this.securityService.encrypt(JSON.stringify(this.reactive.tokens))
    )
  }

  async generateCodeFor(token: TokenI) {
    await 1

    const encryptedSecret = await this.persistentStorageService.getItem(`secret-${token.id}`)
    assert(encryptedSecret, `Secret not found for token <${token.id}>`)

    const secret = await this.securityService.decrypt(encryptedSecret)

    const code = new otp.TOTP({
      secret,
      algorithm: token.algorithm,
      digits: token.codeLen,
      period: token.period,
    }).generate()

    return code
  }
}
