import * as v from 'vue'
import { appInject } from './util'
import { eagerComputed } from '@vueuse/core'
import { Otp, Settings } from '.'

/**
 * I've read about Pinia and concluded it useless
 */
export class State {
  static token = Symbol() as v.InjectionKey<State>

  @appInject(Settings.token)
  private accessor settingsService!: Settings

  @appInject(Otp.token)
  private accessor otpService!: Otp

  reactive = v.reactive({
    isSideBarOpen: false,
    globalProgressBar: v.computed(() => {
      if (this.settingsService.reactive.progressBarStyle === 'multiple') {
        return false
      }

      const tokens = this.otpService.reactive.tokens
      if (new Set(tokens.map((it) => it.period)).size === 1) {
        return tokens[0]?.period
      }

      return false
    }),
  })

  // @serviceInit()
  // init() {}
}
