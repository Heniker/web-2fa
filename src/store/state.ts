import * as v from 'vue'
import { useStore } from '@/store'
import { createGlobalState } from '@vueuse/core'

export const useStateStore = createGlobalState(() => {
  const store = useStore()

  const globalProgressBar = v.computed(() => {
    if (store.settings.progressBarStyle === 'multiple') {
      return false
    }

    const tokens = store.token.tokens
    if (new Set(tokens.map((it) => it.period)).size === 1) {
      return tokens[0]?.period
    }

    return false
  })

  return v.reactive({ isSideBarOpen: false, globalProgressBar })
})
