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
import * as v from 'vue'
import { useStore } from '@/store'

export default v.defineComponent({
  components: {},
  setup(props, ctx) {
    const store = useStore()

    const appLockTime = {
      selected: v.toRef(() => store.settings.passwordKeepAlive),
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
      selected: v.toRef(() => store.settings.theme),
      options: [
        { title: 'Dark', value: 'dark' },
        { title: 'Light', value: 'light' },
      ] satisfies { title: string; value: typeof store.settings.theme }[],
    }

    const appProgressBar = {
      selected: v.toRef(() => store.settings.progressBarStyle),
      options: [
        { title: 'Grouped', value: 'grouped' },
        { title: 'Multiple', value: 'multiple' },
      ] satisfies { title: string; value: typeof store.settings.progressBarStyle }[],
    }

    const preferLessAnimations = v.toRef(() => store.settings.preferLessAnimations)

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
