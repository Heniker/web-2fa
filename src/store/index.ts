import * as v from 'vue'
import { useSettingsStore } from '@/store/settings'
import { useStateStore } from '@/store/state'
import { useTokensStore } from '@/store/tokens'
import { useSecurityStore } from '@/store/security'

export type StoreT = ReturnType<typeof useStore>

export const useStore = () => {
  const instance = v.getCurrentInstance()
  assert(instance)

  return {
    get settings() {
      return instance.appContext.app.runWithContext(() => useSettingsStore())!
    },
    get state() {
      return instance.appContext.app.runWithContext(() => useStateStore())!
    },
    get token() {
      return instance.appContext.app.runWithContext(() => useTokensStore())!
    },
    get security() {
      return instance.appContext.app.runWithContext(() => useSecurityStore())!
    },
  }
}
