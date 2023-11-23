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
import { Otp, State } from '@/services'
import { useDocumentVisibility } from '@vueuse/core'
import * as v from 'vue'

export default v.defineComponent({
  props: {
    period: { type: Number as v.PropType<number>, required: true },
  },
  components: {},
  setup(props, ctx) {
    const otpService = v.inject(Otp.token)
    assert(otpService)
    const state = v.inject(State.token)
    assert(state)

    const visibility = useDocumentVisibility()
    const transition = useTransitionValue(v.toRef(() => props.period))

    v.onMounted(() => transition.update(false))

    v.watch(visibility, (arg) => arg === 'visible' && transition.update(false))

    v.watch(
      () => state.reactive.globalProgressBar,
      () => transition.update(false)
    )

    {
      const cancelAutoUpdate = otpService.eachPeriod(props.period, () => {
        transition.update(true)
      })

      v.onUnmounted(() => {
        cancelAutoUpdate()
      })
    }

    ctx.expose({ update })

    return { ...transition, update }

    function update(arg: boolean) {
      if (visibility.value === 'hidden') {
        return
      }

      transition.update(arg)
    }
  },
})

// this seems to be much more efficient than Animations API
function useTransitionValue(period: v.Ref<number>) {
  const transitionDuration = v.ref(0)
  const transitionDirection = v.ref(0 as 0 | 1)
  const transitionState = v.ref(0)

  const update = (swapDirection: boolean) => {
    requestAnimationFrame(() => {
      const time = Otp.getRemainingTime(period.value)

      firstFrame(time, swapDirection)
      requestAnimationFrame(() => nextFrame(time))
    })

    return

    function firstFrame(time: number, swapDirection: boolean) {
      transitionDuration.value = 0
      swapDirection && (transitionDirection.value = Number(!transitionDirection.value))
      transitionState.value = transitionDirection.value
        ? (period.value - time / 1000) / period.value // close to 0 when period starts
        : time / 1000 / period.value // close to 1 when period starts
    }

    function nextFrame(time: number) {
      transitionDuration.value = time
      transitionState.value = transitionDirection.value ? 1 : 0
    }
  }

  return { transitionState, transitionDuration, transitionDirection, update }
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
