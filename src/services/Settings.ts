import * as v from 'vue'
import { appInject, delayAsyncFunctions, once } from './util'
import { PersistentStorage } from './PersistentStorage'
import { until } from '@vueuse/core'
import type { AppSettingsI } from '@/_types'
import { watchDebounced } from '@vueuse/core'
import { persist } from '@/util'

@delayAsyncFunctions()
export class Settings {
  static token = Symbol() as v.InjectionKey<Settings>

  @appInject(PersistentStorage.token)
  private accessor persistentStorage!: PersistentStorage

  themeValues = ['dark', 'light'] as const
  progressBarValues = ['grouped', 'multiple'] as const

  reactive: AppSettingsI = v.reactive({
    passwordKeepAlive: Infinity,
    theme: 'dark' as (typeof this.themeValues)[number],
    progressBarStyle: 'grouped' as (typeof this.progressBarValues)[number],
    // this is not really correctly handled, as once set the value will be persisted
    // and if user changes prefers-reduced-motion - nothing will change
    preferLessAnimations:
      globalThis.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true,
  } satisfies AppSettingsI)

  @once()
  async init(vTheme: ReturnType<typeof import('vuetify').useTheme>) {
    v.watch(
      v.toRef(() => this.reactive.theme),
      () => {
        vTheme.global.name.value = this.reactive.theme
      }
    )

    Object.assign(this.reactive, await this.persistentStorage.getItem('app-settings'))

    watchDebounced(
      v.toRef(() => this.reactive),
      () => {
        this.persistentStorage.setItem('app-settings', Object.assign({}, this.reactive))
      },
      { deep: true, debounce: 300 }
    )
  }
}
