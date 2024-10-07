import type { TokenI, TokenSecretTag } from '@/_types'
import { createTrigger } from '@/util'
import { createEventHook, createGlobalState, useDebounceFn } from '@vueuse/core'
import * as v from 'vue'
import { otpService } from '@/services/otp'
import { useStore } from '@/store'

export interface TokenStoreI extends TokenI {
  transitionDirection: 1 | 0
  code: string
}

export const useTokensStore = createGlobalState(() => {
  const store = useStore()
  const tokens = v.ref([] as TokenStoreI[])

  return v.reactive({ tokens, fetch, save: useDebounceFn(save, 100), add, remove })

  async function add(token: TokenI, secret?: TokenSecretTag) {
    const result: TokenStoreI = {
      ...token,
      code: '',
      transitionDirection: 1,
    }

    secret && (await otpService.saveSecret(token, await store.security.encrypt(secret)))

    await otpService.generateCodeFor(token, store.security.decrypt).then((it) => (result.code = it))

    tokens.value.push(result)
    const savedToken = tokens.value.at(-1)!

    otpService.eachPeriod(token.period, () => {
      otpService.generateCodeFor(token, store.security.decrypt).then((it) => (savedToken.code = it))
      savedToken.transitionDirection = savedToken.transitionDirection ? 0 : 1
    })

    save()
  }

  async function fetch() {
    const encrypted = await otpService.getTokens()
    const result = (encrypted && (await store.security.decrypt(encrypted))) || []
    result.forEach((it) => add(it))
  }

  function save() {
    otpService.saveTokens(tokens.value, store.security.encrypt)
  }

  async function remove(id: TokenI['id']) {
    tokens.value.splice(tokens.value.findIndex((it) => it.id === id), 1)
    save()
  }
})
