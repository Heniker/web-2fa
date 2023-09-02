<template>
  <Teleport to="#app-overlay-portal">
    <section :class="$style.scrim" class="d-flex justify-center align-center">
      <v-card
        v-click-outside="{
          include: () => [...window.document.querySelectorAll('.v-select__content')],
          handler: () => $router.push({ name: '' + require.resolve('@/routes/index.vue') }),
        }"
        :width="display.smAndDown ? '90vw' : 400"
        class="pb-2"
      >
        <v-card-title class="d-flex justify-center mt-3 mb-1 text-h4">Settings</v-card-title>

        <v-card-text class="pb-2">
          <v-form>
            <v-select
              v-model="appTheme.selected.value"
              :items="appTheme.options"
              class="mt-3"
              label="Theme"
              variant="solo-filled"
              hide-details
            ></v-select>
            <v-select
              v-model="appLockTime.selected.value"
              :items="appLockTime.options"
              class="mt-3"
              label="Lock after"
              variant="solo-filled"
              hide-details
            ></v-select>
            <v-select
              v-model="appProgressBar.selected.value"
              :items="appProgressBar.options"
              class="mt-3"
              label="Progress bar style"
              variant="solo-filled"
              hide-details
            ></v-select>
            <!-- v-model="s" -->
            <v-switch
              v-model="preferLessAnimations"
              :class="$style.switch"
              class="mt-3"
              color="deep-purple-lighten-2"
              label="Prefer less animations"
              hide-details
            ></v-switch>
          </v-form>
        </v-card-text>
      </v-card>
    </section>
  </Teleport>
</template>

<script lang="ts">
import type { TokenI, TokenAlgorithmT } from '@/_types'
import * as v from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import { Otp, Settings } from '@/services'
import { nanoid } from 'nanoid'

export default v.defineComponent({
  components: {},
  setup(props, ctx) {
    const settingsService = v.inject(Settings.token)
    assert(settingsService)

    const appLockTime = {
      selected: v.toRefs(settingsService.reactive).passwordKeepAlive,
      options: [
        {
          title: 'Instant',
          value: 0,
        },
        {
          title: '1 minute',
          value: 1000 * 60,
        },
        {
          title: '5 minutes',
          value: 1000 * 60 * 5,
        },
        {
          title: '10 minutes',
          value: 1000 * 60 * 10,
        },
        {
          title: '30 minutes',
          value: 1000 * 60 * 30,
        },
        {
          title: '1 hour',
          value: 1000 * 60 * 60,
        },
        {
          title: '12 hours',
          value: 1000 * 60 * 60 * 12,
        },
        {
          title: 'Never',
          value: Infinity,
        },
      ],
    }

    const appTheme = {
      selected: v.toRefs(settingsService.reactive).theme,
      options: settingsService.themeValues.map((it) => ({
        title: it.slice(0, 1).toUpperCase() + it.slice(1),
        value: it,
      })),
    }

    const appProgressBar = {
      selected: v.toRefs(settingsService.reactive).progressBarStyle,
      options: settingsService.progressBarValues.map((it) => ({
        title: it.slice(0, 1).toUpperCase() + it.slice(1),
        value: it,
      })),
    }

    const preferLessAnimations = v.toRefs(settingsService.reactive).preferLessAnimations

    return {
      appLockTime,
      appTheme,
      appProgressBar,
      preferLessAnimations,
    }
  },
})
</script>

<style scoped></style>
<style module>
.switch :global(.v-switch__thumb) {
  color: #7844d3;
}

.scrim {
  composes: scrim from './style.module.css';
}
</style>
