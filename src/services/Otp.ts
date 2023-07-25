import * as v from 'vue'
import * as otp from 'otpauth'
import { PersistentStorage } from './PersistentStorage'
import { appInject, delayAsyncFunctions, once } from './util'
import { Security } from './Security'
import type { TokenAlgorithmT, TokenI } from '@/_types'
import { watchDebounced } from '@vueuse/core'

@delayAsyncFunctions()
export class Otp {
  static token = Symbol() as v.InjectionKey<Otp>

  @appInject(PersistentStorage.token)
  private accessor persistentStorageService!: PersistentStorage

  @appInject(Security.token)
  private accessor securityService!: Security

  private async fetchStoredTokens() {
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
      setTimeout(makeTimer, isEdge ? timeRemeaining - 700 : timeRemeaining)
    }

    makeTimer()
  }

  private async generateCodeFor(token: TokenI) {
    const encryptedSecret = await this.persistentStorageService.getItem(`secure-secret-${token.id}`)
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

  supportedAlgorithms = ['SHA1', 'SHA256', 'SHA512'] as const satisfies readonly TokenAlgorithmT[]

  reactive = v.reactive({
    tokens: [] as TokenI[],
    codes: {} as Record<TokenI['id'], string>,
  })

  @once()
  async init() {
    await this.fetchStoredTokens()

    // this is not a perfect solution, but better than alternatives
    watchDebounced(
      v.toRef(() => this.reactive.tokens),
      async () => {
        if (!this.reactive.tokens.length) {
          return
        }

        this.persistentStorageService.setItem(
          'secure-tokens',
          await this.securityService.encrypt(JSON.stringify(this.reactive.tokens))
        )
      },
      { deep: true, debounce: 300 }
    )
  }

  /**
   * Remaining cycle time in ms
   *
   * #todo?> cache
   */
  getRemainingTime(token: TokenI) {
    return token.period * 1000 - (Date.now() % (token.period * 1000))
  }

  async addToken(token: TokenI, secret: string) {
    // the order is important, which is bad
    // #todo?> lets not use array to store tokens
    // this will make it a bit harder to get secure stuff right though

    this.persistentStorageService.setItem(
      `secure-secret-${token.id}`,
      await this.securityService.encrypt(secret)
    )

    this.setupToken(token)
  }
}
