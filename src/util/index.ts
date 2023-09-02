export * as managedPromise from './managedPromise'
export * from './persist'

import { syncRef, until, whenever } from '@vueuse/core'
import * as v from 'vue'

export const isResolved = <T>(promise: PromiseLike<T>) => {
  const t = {}
  return Promise.race([promise, t]).then(
    (v) => v !== t,
    () => false
  )
}

/**
 * if `init` is a function - it will be called when resulting ref is accessed for the first time.
 * Resulting value will replace `startingValue`. Promises are awaited.
 */
export const useLazyInitRef = <T extends unknown>(startingValue: T, init: () => Promise<T>) => {
  // #todo> this is not good. need to check if vueuse got something similar or implement this better
  const rememberValue = v.toRef(startingValue)

  let onGet = () => {
    onGet = () => {}
    init().then((arg) => (rememberValue.value = arg))
  }

  const result = v.computed<T>({
    get: () => {
      onGet()

      return rememberValue.value as T
    },
    set: (arg: T) => {
      rememberValue.value = arg
    },
  })

  return result
}

export const useBetterResetRef = <T extends unknown>(
  defaultValueArg: v.Ref<T> | T,
  resetAfterArg: v.Ref<number> | number
) => {
  const defaultValue = v.isRef(defaultValueArg) ? defaultValueArg : { value: defaultValueArg }
  const resetAfter = v.isRef(resetAfterArg) ? resetAfterArg : { value: resetAfterArg }

  // https://github.com/vuejs/core/issues/1324
  const returnVal = v.ref(defaultValue.value) as v.Ref<T>

  {
    let timeout: ReturnType<typeof setTimeout>

    var startReset = () => {
      timeout = setTimeout(() => {
        returnVal.value = defaultValue.value
      }, resetAfter.value)
    }

    var cancelReset = () => {
      clearTimeout(timeout)
    }
  }

  v.watch(
    [resetAfter],
    () => {
      cancelReset()
      startReset()
    },
    { immediate: true }
  )

  return returnVal
}

/**
 * Call fn and convert return value to [Renderless component](https://vuejs.org/guide/components/slots.html#renderless-components) slot args
 * @param fn
 * @returns
 */
export const toSlots = (fn: () => unknown) => {
  const key = Symbol('ReturnVal')
  return v.defineComponent({
    setup() {
      return { [key]: fn() }
    },

    // @ts-ignore
    render: (_ctx, _cache, $props, $setup, $data, $options) => {
      // @ts-ignore
      return v.renderSlot(
        _ctx.$slots,
        'default',
        // @ts-ignore
        v.normalizeProps(v.guardReactiveProps(_ctx[key]))
      )
    },
  })
}

/**
 * Component that resends all props passed to it as writeable v-slot arguments\
 * Do note, that v-slot value can not be destructured, as Vue (& vue-tsc) will
 * consider destructured variables immutable
 * 
 * @example
```html
<provide-value :a="42" v-slot="slot"><button v-on:click="slot.a++">{{slot.a}}</button></provide-value>
```
 */
export const ProvideValue = v.defineComponent({
  inheritAttrs: false,
  props: [] as any[],
  setup(_, { attrs, slots }) {
    const writeableProps = v.reactive(Object.assign({}, attrs))

    return () => v.renderSlot(slots, 'default', v.normalizeProps(writeableProps) || {})
  },
})

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
export const seededRandom = (seed: number) => {
  let t = (seed += 0x6d2b79f5)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const trigger = async (arg: v.Ref<boolean>) => {
  arg.value = true
  await v.nextTick()
  arg.value = false
}

/**
 * Returns ref that turns true whenever argument ref changes
 */
export const useHasChanged = (
  targetRef: v.Ref<unknown>,
  resultRef: v.Ref<boolean> = v.ref(false)
) => {
  until(targetRef)
    .changed()
    .then(() => {
      resultRef.value = true
      useHasChanged(targetRef, resultRef)
    })

  return resultRef
}

/**
 * Emit property change instead of changing property
 */
export const useEmitChange = <T>(prop: v.Ref<T>, emitName: string) => {
  const instance = v.getCurrentInstance()
  assert(instance)

  return v.computed<T>({
    get: () => prop.value,
    set: (val) => {
      instance.emit(emitName, val)
    },
  })
}
