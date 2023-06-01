export * as managedPromise from './managedPromise'

import * as v from 'vue'

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
