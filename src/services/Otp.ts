import * as v from 'vue'
import { PersistentStorage } from './PersistentStorage'
import { appInject, once, serviceInit, serviceUntilInit, serviceUntilInject } from './util'
import { Security } from './Security'
import type { TokenAlgorithmT, TokenI } from '@/_types'
import { watchDebounced } from '@vueuse/core'
import { nanoid } from 'nanoid'

export class Otp {
  static token = Symbol() as v.InjectionKey<Otp>

  static formToken(arg: Omit<TokenI, 'id'>) {
    return {
      id: nanoid(),
      label: arg.label,
      period: arg.period,
      algorithm: arg.algorithm,
      digits: arg.digits,
      issuer: arg.issuer,
    } as TokenI
  }

  @appInject(PersistentStorage.token)
  private accessor persistentStorage!: PersistentStorage

  @appInject(Security.token)
  private accessor security!: Security

  @serviceUntilInject()
  private async fetchStoredTokens() {
    const encryptedTokens = await this.persistentStorage.getItem('secure-tokens')

    if (!encryptedTokens) {
      console.log('No secure-tokens found in storage')
      return [] as TokenI[]
    }

    const tokens = JSON.parse(await this.security.decrypt(encryptedTokens)) as TokenI[]

    assert(tokens.length, 'Tokens should not be empty. This is a bug')
    tokens.forEach((it) => this.setupToken(it))
  }

  private timers: Record<number, () => void> = {}

  @serviceUntilInject()
  private async setupToken(_: TokenI) {
    const tokenRef = v.toRef(_)
    this.reactive.tokens.push(tokenRef.value)

    const token = tokenRef.value

    const savedVal =
      this.timers[token.period] ||
      (() => {
        const timeRemeaining = this.getRemainingTime(token)
        const fn = this.timers[token.period]
        assert(fn) // cant happen

        // #todo>
        // isEdge check forces this function to reactivate many times when it is close to finishing
        // currently I have no idea how to implement proper timers in Edge browser
        setTimeout(fn, isEdge ? timeRemeaining - 700 : timeRemeaining)
      })

    const genCode = async () => {
      const code = await this.generateCodeFor(token)
      this.reactive.codes[token.id] = code
    }

    this.timers[token.period] || queueMicrotask(savedVal)

    this.timers[token.period] = async () => {
      await genCode()
      savedVal?.()
    }

    await genCode()
  }

  @serviceUntilInject()
  private async generateCodeFor(token: TokenI) {
    const encryptedSecret = await this.persistentStorage.getItem(`secure-secret-${token.id}`)
    assert(encryptedSecret, `Secret not found for token <${token.id}>`)

    const otp = await import(/* webpackPrefetch: true */ 'otpauth')

    const secret = await this.security.decrypt(encryptedSecret)

    const code = new otp.TOTP({
      secret,
      algorithm: token.algorithm,
      digits: token.digits,
      period: token.period,
    }).generate()

    return code
  }

  supportedAlgorithms = ['SHA1', 'SHA256', 'SHA512'] as const satisfies readonly TokenAlgorithmT[]

  reactive = v.reactive({
    tokens: [] as TokenI[],
    codes: {} as Record<TokenI['id'], string>,
  })

  @serviceInit()
  async init() {
    await this.fetchStoredTokens()

    // this is not a perfect solution, but better than alternatives
    watchDebounced(
      v.toRef(() => this.reactive.tokens),
      async () => {
        if (!this.reactive.tokens.length) {
          return
        }

        this.persistentStorage.setItem(
          'secure-tokens',
          await this.security.encrypt(JSON.stringify(this.reactive.tokens))
        )
      },
      { deep: true, debounce: 300 }
    )
  }

  /**
   * Remaining cycle time in ms
   */
  getRemainingTime(token: TokenI) {
    return token.period * 1000 - (Date.now() % (token.period * 1000))
  }

  @serviceUntilInit()
  async addToken(token: TokenI, secret: string) {
    await this.persistentStorage.setItem(
      `secure-secret-${token.id}`,
      await this.security.encrypt(secret)
    )

    this.setupToken(token)
  }
}
