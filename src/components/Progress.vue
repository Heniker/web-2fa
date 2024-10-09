<template>
  <div
    :style="{
      transform: `scaleX(${transitionState})`,
      transitionDuration: `${transitionDuration}ms`,
      transformOrigin: transitionDirection ? 'left' : 'right',
    }"
    :class="$style.progressbar"
    class="bg-deep-purple-darken-3"
  ></div>
</template>

<script lang="ts">
import { forceProgressUpdateToken } from '@/constant'
import { otpService } from '@/services'
import { useStore } from '@/store'
import { useDocumentVisibility, whenever } from '@vueuse/core'
import * as v from 'vue'

export default v.defineComponent({
  props: {
    period: { type: Number as v.PropType<number>, required: true },
    direction: { type: Number as v.PropType<0 | 1>, required: true },
  },
  components: {},
  setup(props) {
    const store = useStore()
    const visibility = useDocumentVisibility()
    const transition = useTransitionValue(v.toRef(() => props.period))

    const forceProgressUpdateTrigger = v.inject(forceProgressUpdateToken) || v.ref()

    const update = () => transition.update(props.direction)

    whenever(() => visibility.value === 'visible', update)
    v.onMounted(update)
    v.watch(forceProgressUpdateTrigger, update)
    v.watch(() => props.direction, update)
    v.watch(() => store.state.globalProgressBar, update)

    return { ...transition }
  },
})

/**
 * This seems to be much more cpu efficient than Animations API
 * @pure
 */
function useTransitionValue(period: v.Ref<number>) {
  const transitionDuration = v.ref(0)
  const transitionDirection = v.ref(0 as 0 | 1)
  const transitionState = v.ref(0)

  const update = (direction: 0 | 1) => {
    requestAnimationFrame(() => {
      transitionDirection.value = direction
      const time = otpService.getRemainingTime(period.value)
      firstFrame(time)
      requestAnimationFrame(() => nextFrame(time))
    })
  }

  return { transitionState, transitionDuration, transitionDirection, update }

  function firstFrame(time: number) {
    transitionDuration.value = 0
    transitionState.value = transitionDirection.value
      ? (period.value - time / 1000) / period.value // close to 0 when period starts
      : time / 1000 / period.value // close to 1 when period starts
  }

  function nextFrame(time: number) {
    transitionDuration.value = time
    transitionState.value = transitionDirection.value ? 1 : 0
  }
}
</script>

<style module>
.progressbar {
  transition-timing-function: linear;
  margin-top: -3px;
  height: 3px;
  width: 100%;
}
</style>
