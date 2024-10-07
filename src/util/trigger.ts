import type { Tagged } from 'type-fest'
import * as v from 'vue'

export type TriggerTag<T> = Tagged<v.ShallowRef<T>, 'trigger'>
export type TriggerValueTag<T> = Tagged<T, 'triggerValue'>

export const createTrigger = <T>(): TriggerTag<T> =>
  v.shallowRef() as TriggerTag<TriggerValueTag<T>>

export const pullTrigger = <T>(trigger: TriggerTag<T>, arg?: T) => {
  arg !== undefined && (trigger.value = arg)
  v.triggerRef(trigger)
}
