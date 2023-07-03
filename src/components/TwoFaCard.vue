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
            <span :class="$style.code" class="text-h2 my-auto text-h3">
              {{ displayCode || '&shy;' }}
            </span>
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
    <v-progress-linear
      :class="$style.progressbar"
      :max="token.period"
      :reverse="!!transitionDirection"
      :active="true"
      :model-value="transitionState"
      color="deep-purple"
      height="3"
    ></v-progress-linear>
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
  type MaybeElement,
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

    const timeRemaining = v.computed(() => otpService.reactive.timers[token.period] || 0)

    const transitionDirection = v.ref(0)
    const nextValue = v.computed(() => timeRemaining.value - 1)
    const transitionState = v.computed(() =>
      transitionDirection.value ? nextValue.value : token.period - nextValue.value
    )

    const displayCode = v.ref('')

    v.watch(timeRemaining, () => {
      if (timeRemaining.value === token.period) {
        transitionDirection.value = Number(!transitionDirection.value)
      }
    })

    async function onInit() {
      const code = await otpService.generateTokenFor(token)
      displayCode.value =
        code.length % 2 === 0 ? code.slice(0, code.length) + ' ' + code.slice(code.length) : code
    }

    v.onMounted(onInit)

    onInit()

    v.watch(
      timeRemaining,
      async (arg) => {
        if (timeRemaining.value !== token.period) {
          return
        }
        onInit()
      },
      { immediate: true }
    )

    const rootRef = v.ref(useCurrentElement())
    const isEdit = v.ref(false)

    {
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
    }

    const color = getColorForString(props.token.label)

    return {
      transitionDirection,
      transitionState,
      testt: 'Hello world',
      isEdit,
      rootRef,
      color,
      displayCode,
      timeRemaining,
    }
  },
})

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

  const stringSum = ([].map.call(str, (it: string) => it.charCodeAt(0)) as number[]).reduce(
    (a, b) => a + b,
    0
  )

  const indexNum = ~~(seededRandom(stringSum) * 10)

  return colors[indexNum]
}
</script>

<style scoped>
:deep(.v-label.v-field-label.v-field-label--floating) {
  top: 3px;
}

:deep(.v-progress-linear:not(\0)) {
  transition: 1s;
  transition-timing-function: linear;
}
</style>

<style module>
.progressbar {
  margin-top: -3px;
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
