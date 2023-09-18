import * as v from 'vue'
import { PersistentStorage } from './PersistentStorage'
import { appInject, once, serviceInit, serviceUntilInit, serviceUntilInject } from './util'
import { Security } from './Security'
import { TokenAlgorithms, type TokenAlgorithmT, type TokenI } from '@/_types'
import { watchDebounced } from '@vueuse/core'
import { nanoid } from 'nanoid'
import { formOtpCode, formSteamCode } from '@local/otp-generator'

const formCode = (token: TokenI, secret: string) =>
  token.algorithm === 'STEAM'
    ? formSteamCode(secret)
    : formOtpCode(secret, token.period, token.digits, token.algorithm)

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

  static async validate(token: TokenI, secret: string) {
    try {
      await formCode(token, secret)
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  /**
   * Remaining cycle time in ms
   */
  static getRemainingTime(period: number) {
    return period * 1000 - (Date.now() % (period * 1000))
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

  @serviceUntilInject()
  private async setupToken(_: TokenI) {
    const tokenRef = v.toRef(_)
    this.reactive.tokens.push(tokenRef.value)

    const token = tokenRef.value

    this.reactive.codes[token.id] = await this.generateCodeFor(token)

    this.eachPeriod(token.period, async () => {
      this.reactive.codes[token.id] = await this.generateCodeFor(token)
    })
  }

  @serviceUntilInject()
  private async generateCodeFor(token: TokenI) {
    const encryptedSecret = await this.persistentStorage.getItem(`secure-secret-${token.id}`)
    assert(encryptedSecret, `Secret not found for token <${token.id}>`)

    const secret = await this.security.decrypt(encryptedSecret)
    return formCode(token, secret)
  }

  private timers: Record<number, () => void> = {}

  supportedAlgorithms = TokenAlgorithms

  reactive = v.reactive({
    tokens: [] as TokenI[],
    codes: {} as Record<TokenI['id'], string>,
  })

  eachPeriod(period: number, action: () => void) {
    const prev =
      this.timers[period] ||
      (() => setTimeout(() => this.timers[period]?.(), Otp.getRemainingTime(period)))

    this.timers[period] || queueMicrotask(prev)

    let isCancelled = false
    this.timers[period] = () => {
      prev()
      isCancelled || action()
    }

    return () => (isCancelled = true)
  }

  @serviceInit()
  async init() {
    await this.fetchStoredTokens()

    // this is not a perfect solution, but better than alternatives
    // #todo?> could delay saving tokens until vue nextTick, which would make more sense
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

  @serviceUntilInit()
  async addToken(token: TokenI, secret: string) {
    await this.persistentStorage.setItem(
      `secure-secret-${token.id}`,
      await this.security.encrypt(secret)
    )

    this.setupToken(token)
  }
}
