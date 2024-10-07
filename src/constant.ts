import type { createTrigger } from '@/util'
import * as v from 'vue'

export const appToken = Symbol('App') as v.InjectionKey<v.App>

export const forceProgressUpdateToken = Symbol('ProgressUpdateTrigger') as v.InjectionKey<
  ReturnType<typeof createTrigger<void>>
>
