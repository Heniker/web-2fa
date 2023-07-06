<template>
  <v-card
    :class="$style['cool-background']"
    height="170"
    color="#DCEFEF"
    variant="outlined"
    @click.right="(event) => isEdit || ((isEdit = true), event.preventDefault())"
  >
    <div class="pa-2 d-flex justify-space-between h-100">
      <div class="flex-grow-1 mr-5">
        <template v-if="isEdit">
          <v-card-title class="mt-2 text-h1">
            <v-text-field
              v-model="token.label"
              label="Name"
              variant="filled"
              density="default"
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-card-subtitle class="mt-auto mb-3">
            <v-text-field
              v-model="token.description"
              label="Description"
              variant="solo"
              density="comfortable"
              hide-details
            ></v-text-field>
          </v-card-subtitle>
        </template>

        <template v-else>
          <v-card-title>
            <span class="text-h5">{{ token.label || '&shy;' }}</span>
          </v-card-title>
          <v-card-subtitle>
            <span>{{ token.description || '&shy;' }}</span>
          </v-card-subtitle>
          <v-card-text>
            <Transition name="fade">
              <span :class="$style.code" class="text-h2 my-auto text-h3">
                {{ displayCode || '&shy;' }}
              </span>
            </Transition>
          </v-card-text>
        </template>
      </div>

      <!-- <v-avatar color="#89CFF0" size="90" class="ma-auto mr-3 flex-shrink-0"> -->
      <v-avatar :color="color" size="90" class="my-auto mr-3 flex-shrink-0">
        <span class="text-h4 text-black">{{ token.label.charAt(0).toUpperCase() }}</span>
        <!-- <v-icon large color="blue darken-2">
            S
          </v-icon> -->
      </v-avatar>
    </div>
    <div
      ref="progressBar"
      :style="{
        transform: `scaleX(${transitionState})`,
        transitionDuration: `${transitionDuration}ms`,
        transformOrigin: transitionDirection ? 'left' : 'right',
      }"
      class="bg-deep-purple-darken-3"
      :class="$style.progressbar"
    ></div>
    <!-- <v-progress-linear
      :class="$style.progressbar"
      :style="{ 'transition-duration': `${transitionSpeed}s` }"
      :max="token.period"
      :reverse="!!transitionDirection"
      :active="true"
      :model-value="transitionState"
      color="deep-purple"
      height="3"
    ></v-progress-linear> -->
  </v-card>
</template>

<script lang="ts">
import * as v from 'vue'
import * as otp from 'otpauth'
import { useDisplay } from 'vuetify'
import {
  computedEager,
  onClickOutside,
  useTransition,
  useCurrentElement,
  whenever,
  useAnimate,
  type MaybeElement,
  useDocumentVisibility,
} from '@vueuse/core'
import { ProvideValue, seededRandom } from '../util'
import type { TokenI } from '@/_types'
import { Otp } from '@/services'

export default v.defineComponent({
  components: {
    ProvideValue,
  },

  props: {
    token: { required: true, type: Object as v.PropType<TokenI> },
  },

  setup(props, { expose }) {
    const otpService = v.inject(Otp.token) as Otp
    assert(otpService)
    const token = props.token

    const displayCode = v.toRef(() => otpService.reactive.codes[token.id])

    const isEdit = useEdit(v.ref(useCurrentElement()))
    const color = getColorForString(props.token.label)

    const progressBarEl = v.ref() as v.Ref<MaybeElement>

    const { transitionDuration, transitionState, transitionDirection } = useTransitionValue(token)

    return {
      transitionDirection,
      transitionDuration,
      transitionState,
      progressBar: progressBarEl,
      isEdit,
      color,
      displayCode,
    }
  },
})

function useTransitionValue(token: TokenI) {
  const otpService = v.inject(Otp.token)
  assert(otpService)

  const transitionDuration = v.ref(0)
  const transitionDirection = v.ref(0 as 0 | 1)
  const transitionState = v.ref(0)

  const visibility = useDocumentVisibility()
  whenever(
    () => visibility.value === 'visible',
    () => {
      const time = otpService.getRemainingTime(token)
      // transitionDirection.value = 0
      transitionDuration.value = 0
      transitionState.value = transitionDirection.value
        ? (token.period - time / 1000) / token.period
        : time / 1000 / token.period

      // transitionDirection.value = 0

      requestAnimationFrame(() => {
        // const time = otpService.getRemainingTime(token)

        // console.log(transitionState.value)
        // console.log(time)
        transitionDuration.value = time
        transitionState.value = transitionDirection.value ? 1 : 0
      })
    },
    { immediate: true }
  )

  // requestAnimationFrame(() => {
  //   transitionState.value = 0
  // })

  v.watch(
    v.toRef(() => otpService.reactive.codes[token.id]),
    (current, previous) => {
      if (!previous) {
        return
      }

      transitionDuration.value = 0
      transitionState.value = transitionDirection.value ? 1 : 0
      transitionDirection.value = Number(!transitionDirection.value)

      requestAnimationFrame(() => {
        const time = otpService.getRemainingTime(token)
        // console.log('timeRemaining2')
        // console.log(time)

        transitionDuration.value = time
        transitionState.value = transitionDirection.value ? 1 : 0
      })
    }
  )

  return { transitionState, transitionDuration, transitionDirection }
}

function useEdit(rootRef: v.Ref<Element>) {
  const isEdit = v.ref(false)

  let cancel: (() => void) | undefined
  v.watch(isEdit, () => {
    if (isEdit.value === true) {
      cancel = onClickOutside(rootRef as any, () => {
        isEdit.value = false
      })
    } else {
      cancel?.()
    }
  })

  return isEdit
}

function getColorForString(str: string) {
  // gpt3 said these colors are nice
  const colors = [
    '#FFFFFF',
    '#ECECEC',
    '#C4E3F3',
    '#B5E6B5',
    '#D8B4E2',
    '#FFFACD',
    '#FFC0CB',
    '#FFDAB9',
    '#B2DFDB',
    '#FFC1C1',
  ]

  const stringSum = (
    [].map.call(str, (it: string, i) => it.charCodeAt(0) * (i + 1)) as number[]
  ).reduce((a, b) => a + b, 0)

  const indexNum = ~~(seededRandom(stringSum) * 10)

  return colors[indexNum]
}
</script>

<style scoped>
:deep(.v-label.v-field-label.v-field-label--floating) {
  top: 3px;
}

:deep(.v-progress-linear:not(\0)) {
  transition-timing-function: linear;
}
</style>

<style module>
@keyframes progress {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}

.progressbar {
  /* animation: 3s 0 alternate linear progress; */
  transition-timing-function: linear;
  margin-top: -3px;
  height: 3px;
  width: 100%;
  /* z-index: -1000; */
  /* contain: strict; */
}

.cool-background {
  background-color: #292929;
  border-color: #3b3b3b;

  /* background-color: #5A7172; */
}

.cool-background:hover {
  background-color: #363636;
}

.code {
  /* padding: 5px; */
  /* border: 1px solid white; */
  /* border-color: rgb(var(--v-theme-surface)); */
}
</style>