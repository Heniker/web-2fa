import { ManagedPromise } from '@/util/managedPromise'
import * as v from 'vue'
import { VSnackbar } from 'vuetify/components'

// this module is required because VSnackbar won't be persisted if parent component unmounts
// also why VSnackbar will stack on top of each other?

type VSnackbarInstance = InstanceType<typeof VSnackbar>
type VSnackbarProps = VSnackbarInstance['$props']
type VSnackbarSlots = VSnackbarInstance['$slots']
// type VSnackbarEmits = VSnackbarInstance['$emit']
// type VSnackbarSlots = VSnackbarInstance['$slots']

// type ItemInfo = { instance: v.ComponentInternalInstance; effectScope: v.EffectScope }
type ItemInfo = {
  attrs: Record<string, unknown>
  props: VSnackbarProps
  slots: VSnackbarSlots
  unmounted: Promise<void>
}

// currently only 1 notification mount per app is allowed
const appToItem = new WeakMap<v.App, ItemInfo[]>()

const EmptyNode = () => v.createCommentVNode('EmptyNode')

export const SnackbarNotification = v.defineComponent({
  inheritAttrs: false,

  props: Object.keys(VSnackbar.props),

  setup(props: VSnackbarProps, ctx) {
    const instance = v.getCurrentInstance()
    assert(instance)

    const notifications = appToItem.get(instance.appContext.app)

    assert(notifications, 'NotificationMount should be initiated first')
    assert(ctx.slots.default, 'Default slot is required')

    const unmounted = new ManagedPromise()
    let isUnmounted = false
    unmounted.then(() => (isUnmounted = true))

    notifications.push({
      attrs: ctx.attrs,
      slots: ctx.slots,
      props,
      unmounted,
    })

    // Nothing is rendered here. Default slot is 'teleported' to NotificationMount
    // This is just a convenience to keep all ui info in <template>
    // return () => <div></div>
    return () => (
      <v.Fragment onVnodeUnmounted={() => unmounted.resolve()}>
        <EmptyNode></EmptyNode>
      </v.Fragment>
    )
  },
})

export const SnackbarNotificationMount = v.defineComponent({
  setup() {
    const instance = v.getCurrentInstance()
    assert(instance)

    const notifications = v.reactive([]) as ItemInfo[]
    appToItem.set(instance.appContext.app, notifications)

    const components = v.computed((d) => {
      return notifications.map((it, i) => {
        return (
          <VSnackbar
            {...it.attrs}
            {...it.props}
            attach={'body'}
            v-slots={it.slots}
            onVnodeMounted={() => onVnodeMounted(it, i)}
            // style={{ visibility: i === 0 ? 'visible' : 'hidden' }}
          ></VSnackbar>
        )
      })
    })

    return () => components.value

    async function onVnodeMounted(it: ItemInfo, i: number) {
      await it.unmounted

      if (it.props.modelValue === false) {
        notifications.splice(i, 1)
        return
      }

      // hack to make props writable. Only works because of Vue Proxy optimization
      const props = v.reactive(v.toRaw(it.props))

      props['onUpdate:modelValue'] = (arg: boolean) => {
        props.modelValue = arg

        // hack to wait till transition plays out. Vueteify does not expose `afterLeave` cb for this
        if (arg === false) {
          setTimeout(() => {
            notifications.splice(i, 1)
          }, 250)
        }
      }
    }
  },
})
