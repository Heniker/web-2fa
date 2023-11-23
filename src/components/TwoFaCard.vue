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
    <Transition v-if="!isEdit" :name="preferLessAnimations ? '' : 'fade'" mode="out-in">
      <v-sheet
        v-show="isCopyNotification"
        :class="$style.codeCopyNotification"
        class="justify-center align-center"
        elevation="2"
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
            <Transition :name="preferLessAnimations ? '' : 'fade'" mode="out-in">
              <span :key="displayCode" class="my-auto text-h3" v-if="displayCode">
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
        <!-- #todo?> I am not sure if this is visually obvious enough to be a drag target -->
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
    <Progress v-if="!globalProgressBar" ref="progressEl" :period="token.period"></Progress>
  </v-card>
</template>

<script lang="ts">
import * as v from 'vue'
import { mdiDragVariant } from '@mdi/js'
import { whenever } from '@vueuse/core'
import { vOnLongPress } from '@vueuse/components'
import { seededRandom } from '../util'
import type { TokenI } from '@/_types'
import { Otp, Settings, State } from '@/services'
import Progress from '@/components/Progress.vue'

export default v.defineComponent({
  components: {
    Progress,
  },

  directives: {
    'long-press': vOnLongPress,
  },

  props: {
    token: { type: Object as v.PropType<TokenI>, required: true },
  },

  setup(props, ctx) {
    const otpService = v.inject(Otp.token) as Otp
    assert(otpService)
    const settingsService = v.inject(Settings.token)
    assert(settingsService)
    const state = v.inject(State.token)
    assert(state)

    const displayCode = v.computed(() => otpService.reactive.codes[props.token.id] || '')
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

    const progressEl = v.ref<InstanceType<typeof import('@/components/Progress.vue').default>>()

    const updateProgress = (arg: boolean) => {
      progressEl.value?.update(arg)
    }

    ctx.expose({
      updateProgress,
    })

    return {
      updateProgress,

      progressEl,

      globalProgressBar: v.toRef(() => state.reactive.globalProgressBar),
      isCopyNotification,
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

function getColorForString(str: string) {
  if (!str) {
    return '#FFFFFF'
  }

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
