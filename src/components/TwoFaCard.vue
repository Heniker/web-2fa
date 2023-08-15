<template>
  <v-card
    v-click-outside="() => (isEdit = false)"
    v-long-press="() => isEdit || (isEdit = true)"
    :class="[theme.name.value === 'dark' && $style.coolBackground, $style.root]"
    :ripple="false"
    :color="theme.name.value === 'dark' ? '#DCEFEF' : '#3b3b3b'"
    height="170"
    variant="outlined"
    @click.left.passive="copyCode"
    @click.right.prevent="() => isEdit || (isEdit = true)"
    @contextmenu.prevent
  >
    <Transition v-if="!isEdit" :css="!preferLessAnimations" name="fade" mode="out-in">
      <v-sheet
        v-show="isCopyNotification"
        :class="$style.codeCopyNotification"
        class="justify-center align-center"
        elevation="20"
        rounded
        color="grey-lighten-4"
      >
        <span class="text-h4">Copied</span>
      </v-sheet>
    </Transition>
    <div class="pa-2 d-flex justify-space-between h-100">
      <div class="flex-grow-1">
        <template v-if="isEdit">
          <v-card-title class="text-h1 mt-2">
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
              v-model="token.issuer"
              :variant="theme.name.value === 'dark' ? 'solo' : 'solo-filled'"
              label="Description"
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
            <span>{{ token.issuer || '&shy;' }}</span>
          </v-card-subtitle>
          <v-card-text class="d-flex">
            <Transition name="fade" :css="!preferLessAnimations" mode="out-in">
              <span :key="displayCode" class="my-auto text-h3">
                {{
                  displayCode.length === 6
                    ? displayCode.slice(0, 3) + displayCode.slice(3)
                    : displayCode
                }}
              </span>
            </Transition>
          </v-card-text>
        </template>
      </div>

      <div v-if="isEdit" class="d-flex flex-column align-center justify-space-around ma-3 ml-0">
        <!-- I am not sure if this is visually obvious enough to be a drag target -->
        <v-avatar :class="$style.cursorGrab" class="hack_selector-drag" size="60">
          <v-icon size="60" :icon="mdiDragVariant"></v-icon>
        </v-avatar>

        <v-btn color="red" variant="tonal" @click="remove">remove</v-btn>
      </div>

      <v-avatar v-else :color="color" size="90" class="my-auto mr-3 flex-shrink-0">
        <span :class="theme.name.value === 'dark' && 'text-grey-darken-4'" class="text-h4">
          {{ token.label.charAt(0).toUpperCase() }}
        </span>
      </v-avatar>
    </div>
  </v-card>
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
import * as v from 'vue'
import * as otp from 'otpauth'
import { mdiDragVariant } from '@mdi/js'
import { Ripple } from 'vuetify/directives'
import {
  computedEager,
  onClickOutside,
  useTransition,
  useCurrentElement,
  whenever,
  useAnimate,
  type MaybeElement,
  useDocumentVisibility,
  onLongPress,
  watchPausable,
} from '@vueuse/core'
import { vOnLongPress } from '@vueuse/components'
import { seededRandom } from '../util'
import type { TokenI } from '@/_types'
import { Otp, Settings } from '@/services'

export default v.defineComponent({
  components: {},

  directives: {
    'long-press': vOnLongPress,
  },

  props: {
    token: { type: Object as v.PropType<TokenI>, required: true },
    forceAnimationUpdate: { type: Boolean },
  },

  setup(props, ctx) {
    const otpService = v.inject(Otp.token) as Otp
    assert(otpService)
    const settingsService = v.inject(Settings.token)
    assert(settingsService)

    const displayCode = v.ref(v.computed(() => otpService.reactive.codes[props.token.id] || ''))

    const isEdit = v.ref(false)

    const isCopyNotification = v.ref(false)
    const copyCode = () => {
      if (isEdit.value) {
        return
      }

      isCopyNotification.value = true
      window.navigator.clipboard.writeText(displayCode.value)
      setTimeout(() => {
        isCopyNotification.value = false
      }, 1200)
    }

    // custom transition is used instead of animations API because it turns out to be MUCH more cpu-efficient
    const { transitionDuration, transitionState, transitionDirection, forcedUpdate } =
      useTransitionValue(props.token)

    whenever(
      () => props.forceAnimationUpdate,
      () => forcedUpdate(false)
    )

    return {
      isCopyNotification,
      transitionDirection,
      transitionDuration,
      transitionState,
      displayCode,

      isEdit,
      color: getColorForString(props.token.label),
      preferLessAnimations: v.toRef(() => settingsService.reactive.preferLessAnimations),

      remove: () => {
        const tokens = otpService.reactive.tokens
        tokens.splice(tokens.indexOf(props.token), 1)
      },
      copyCode,

      mdiDragVariant,
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
        ? (token.period - time / 1000) / token.period // close to 0 when period starts
        : time / 1000 / token.period // close to 1 when period starts
    }

    function nextFrame() {
      transitionDuration.value = time
      transitionState.value = transitionDirection.value ? 1 : 0
    }
  }

  const watchControls = watchPausable(
    v.toRef(() => otpService.reactive.codes[token.id]),
    (current, previous) => {
      if (!previous) {
        return
      }

      forcedUpdate(true)
    }
  )

  // browsers do not call requestAnimationFrame cb when page is not visible
  // instead calls are throttled to when page becomes active & dispatched all at once
  // this is not the desired behavior, as that can mess up animation, so watch is paused when page is hidden
  v.watch(visibility, (arg) => {
    arg === 'visible' && (forcedUpdate(), watchControls.resume())
    arg === 'hidden' && watchControls.pause()
  })

  forcedUpdate()

  return { transitionState, transitionDuration, transitionDirection, forcedUpdate }
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style module>
.root :global(.v-label.v-field-label.v-field-label--floating) {
  top: 3px;
}

.progressbar {
  transition-timing-function: linear;
  margin-top: -3px;
  height: 3px;
  width: 100%;
}

.codeCopyNotification {
  display: flex;
  transition-duration: 0.4s !important;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  opacity: 0.35;
  padding: 15px 30px;
  z-index: 1;
}

.coolBackground {
  background-color: #292929;
  border-color: #3b3b3b;
}

.coolBackground:hover {
  background-color: #3636363a;
}

.cursorGrab {
  cursor: grab;
}
</style>
