<template>
  <v-card
    ref="rootRef"
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
          <v-card-subtitle class="mt-1">
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

      <div v-if="isEdit" class="d-flex flex-column align-center justify-space-around ma-3">
        <!-- I am not sure if this is visually obvious enough to be a drag target -->
        <v-avatar size="60" class="cursor-grab hack_selector-drag">
          <v-icon size="60">mdi-drag-variant</v-icon>
        </v-avatar>

        <v-btn color="red" variant="tonal" @click="remove">remove</v-btn>
      </div>

      <v-avatar v-else :color="color" size="90" class="my-auto mr-3 flex-shrink-0">
        <span class="text-h4 text-black">{{ token.label.charAt(0).toUpperCase() }}</span>
      </v-avatar>
    </div>
  </v-card>
  <div
    :style="{
      transform: `scaleX(${transitionState})`,
      transitionDuration: `${transitionDuration}ms`,
      transformOrigin: transitionDirection ? 'left' : 'right',
    }"
    class="bg-deep-purple-darken-3"
    :class="$style.progressbar"
  ></div>
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
import { seededRandom } from '../util'
import type { TokenI } from '@/_types'
import { Otp } from '@/services'

export default v.defineComponent({
  components: {},

  props: {
    token: { required: true, type: Object as v.PropType<TokenI> },
    forceAnimationUpdate: { required: true, type: Boolean },
  },

  setup(props, { expose }) {
    const otpService = v.inject(Otp.token) as Otp
    assert(otpService)

    const displayCode = v.toRef(() => otpService.reactive.codes[props.token.id])

    const rootRef = v.ref() as v.Ref<Element | undefined>
    const isEdit = useEdit(rootRef)
    const color = getColorForString(props.token.label)

    // custom transition is used instead of animations API because it seems to be MUCH more cpu-efficient
    const { transitionDuration, transitionState, transitionDirection, forcedUpdate } =
      useTransitionValue(props.token)

    whenever(
      () => props.forceAnimationUpdate,
      () => forcedUpdate(false)
    )

    return {
      rootRef,
      transitionDirection,
      transitionDuration,
      transitionState,
      remove: () => {
        const tokens = otpService.reactive.tokens
        tokens.splice(tokens.indexOf(props.token), 1)
      },
      isEdit,
      color,
      displayCode,
    }
  },
})

function useTransitionValue(token: TokenI) {
  const otpService = v.inject(Otp.token) as Otp
  assert(otpService)

  const transitionDuration = v.ref(0)
  const transitionDirection = v.ref(0 as 0 | 1)
  const transitionState = v.ref(0)

  const visibility = useDocumentVisibility()

  const forcedUpdate = (swapDirection = false) => {
    requestAnimationFrame(() => {
      firstFrame()
      requestAnimationFrame(nextFrame)
    })

    const time = otpService.getRemainingTime(token)

    function firstFrame() {
      transitionDuration.value = 0
      swapDirection && (transitionDirection.value = Number(!transitionDirection.value))
      transitionState.value = transitionDirection.value
        ? (token.period - time / 1000) / token.period // 0
        : time / 1000 / token.period // 1
    }

    function nextFrame() {
      transitionDuration.value = time
      transitionState.value = transitionDirection.value ? 1 : 0
    }
  }

  forcedUpdate()

  whenever(
    () => visibility.value === 'visible',
    () => forcedUpdate()
  )

  v.watch(
    v.toRef(() => otpService.reactive.codes[token.id]),
    (current, previous) => {
      if (!previous) {
        return
      }

      forcedUpdate(true)
    }
  )

  return { transitionState, transitionDuration, transitionDirection, forcedUpdate }
}

function useEdit(rootRef: v.Ref<Element | undefined>) {
  const isEdit = v.ref(false)

  whenever(isEdit, () => {
    const cancel = onClickOutside(
      rootRef as any,
      () => {
        isEdit.value = false
        cancel?.()
      },
      { capture: true }
    )
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
</style>

<style module>
.progressbar {
  transition-timing-function: linear;
  margin-top: -3px;
  height: 3px;
  width: 100%;
}

.cool-background {
  background-color: #292929;
  border-color: #3b3b3b;
  /* background-color: #5A7172; */
}

.cool-background:hover {
  background-color: #363636;
}
</style>
