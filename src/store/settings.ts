import type { AppSettingsI } from '@/_types'
import { storageService } from '@/services'
import { createGlobalState } from '@vueuse/core'
import * as v from 'vue'

export const useSettingsStore = createGlobalState(() => {
  const state = v.reactive({
    passwordKeepAlive: Infinity,
    theme: 'dark' as 'dark' | 'light',
    progressBarStyle: 'multiple' as 'grouped' | 'multiple',
    preferLessAnimations:
      globalThis.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true,
  } satisfies AppSettingsI as AppSettingsI)

  return Object.assign(state, { fetch })

  async function fetch() {
    Object.assign(state, await storageService.getItem('app-settings'))
  }
})
