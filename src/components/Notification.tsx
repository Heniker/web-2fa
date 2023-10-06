import { refDefault, syncRef, until, whenever } from '@vueuse/core'
import * as v from 'vue'
import { VCard, VSnackbar } from 'vuetify/components'

// this module is required because VSnackbar won't be persisted if parent component unmounts
// also VSnackbar will stack on top of each other why

type VSnackbarInstance = InstanceType<typeof VSnackbar>
type VSnackbarProps = VSnackbarInstance['$props']
// type VSnackbarEmits = VSnackbarInstance['$emit']
// type VSnackbarSlots = VSnackbarInstance['$slots']

type ItemInfo = { instance: v.ComponentInternalInstance; effectScope: v.EffectScope }

// currently only 1 notification mount per app is allowed
const appToItem = new WeakMap<v.App, ItemInfo[]>()

export const SnackbarNotification = v.defineComponent({
  inheritAttrs: false,

  props: Object.keys(VSnackbar.props) as (keyof VSnackbarProps)[],

  setup(props: VSnackbarProps, ctx) {
    const instance = v.getCurrentInstance()
    assert(instance)

    const notifications = appToItem.get(instance.appContext.app)

    assert(notifications, 'NotificationMount should be initiated first')
    assert(ctx.slots.default, 'Default slot is required')

    notifications.push({ instance, effectScope: v.effectScope() })

    // Nothing is rendered here. Default slot is 'teleported' to NotificationMount
    // This is just a convenience to keep all ui info in <template>
    return () => ''
  },
})

export const SnackbarNotificationMount = v.defineComponent({
  setup() {
    const instance = v.getCurrentInstance()
    assert(instance)

    const items = v.reactive([]) as ItemInfo[]
    appToItem.set(instance.appContext.app, items)

    const components = v.computed(() =>
      items.map((it, i) => (
        <VSnackbar
          {...it.instance.attrs}
          {...it.instance.props}
          onVnodeMounted={() => onVnodeMounted(it)}
          style={{ visibility: i === 0 ? 'visible' : 'hidden' }}
          attach={'body'}
          v-slots={it.instance.slots}
        ></VSnackbar>
      ))
    )

    return () => components.value

    function onVnodeMounted(it: ItemInfo) {
      it.effectScope.run(() => v.onScopeDispose(() => onParentUnmounted(it)))
    }

    async function onParentUnmounted(it: ItemInfo) {
      const modelValue = v.toRefs(it.instance.props).modelValue as v.Ref<boolean>

      {
        const prev = it.instance.attrs['onUpdate:modelValue'] as any
        it.instance.attrs['onUpdate:modelValue'] = (arg: boolean) => {
          prev?.()
          modelValue.value = arg
        }
      }

      await until(modelValue).toBe(false)

      // hacky way to let animations finish
      // because vuetify does not expose `afterLeave` event on VSnackbar
      setTimeout(() => {
        items.splice(items.indexOf(it))
      }, 150)
    }
  },
})
