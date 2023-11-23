<template>
  <v-app :class="$style.main">
    <v-app-bar :class="$style.appBar">
      <v-container fluid class="d-flex align-center">
        <!--
          The order of stuff teleported here should be controlled with css flex order property
          Which is a bit hacky, but it's the simplest to understand and manage
         -->
        <div id="app-bar-portal" :class="[$style.portal, $style.appBar]"></div>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>

  <Teleport to="#app-bar-portal">
    <span :class="[$style.title]">Web-2FA</span>
  </Teleport>

  <div id="app-overlay-portal" :class="$style.overlay"></div>
  <div id="app-bottom-portal" :class="$style.portal"></div>

  <SnackbarNotificationMount></SnackbarNotificationMount>
</template>

<script lang="ts">
import * as v from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as services from '@/services'
import { useTheme } from 'vuetify'
import { SnackbarNotificationMount } from '@/components/Notification'

export default v.defineComponent({
  components: {
    SnackbarNotificationMount,
  },
  setup() {
    const settingsService = v.inject(services.Settings.token)
    assert(settingsService)
    const otpService = v.inject(services.Otp.token)
    assert(otpService)
    const securityService = v.inject(services.Security.token)
    assert(securityService)

    const vTheme = useTheme()
    const router = useRouter()

    Object.values(services).forEach((it) => {
      const service = v.inject(it.token) as InstanceType<typeof it>

      assert(service)
      'init' in service && service.init()
    })

    v.watch(
      () => settingsService.reactive.theme,
      () => {
        vTheme.global.name.value = settingsService.reactive.theme
      }
    )

    v.watch(
      () => securityService.reactive.isContextSetUp,
      (arg) => {
        if (!arg) {
          router.push({ name: '' + require.resolve('@/routes/index/pass') })
        }
      },
      { immediate: true }
    )

    return {}
  },
})
</script>

<style module>
.title {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  letter-spacing: 1px;
  font-size: 38px;
  font-weight: 630;
}

.portal {
  display: contents;
}

.portal:empty {
  display: none;
}

.overlay {
  left: 0;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1005; /* Vuetify uses z-index 1000 */
}
.overlay:empty {
  display: none;
}

.notificationContainer {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  z-index: 1006;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: column-reverse;
}

.notificationContainer > * {
  /* animation: show 600ms 100ms cubic-bezier(0.38, 0.97, 0.56, 0.76) forwards; */
  /* transform: rotateX(-90deg); */
  /* transform-origin: top center; */
}

.appBar {
  overflow: visible !important;
}
</style>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;

  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;

  image-rendering: smooth;
  image-rendering: optimizeQuality;

  overflow: auto;

  --color-1: #292929;
  --color-2: #3b3b3b;
  --color-3: #3636363a;
  --color-4: #3636363a;
}

* {
  box-sizing: border-box;

  /* 
  If something breaks you  won't debug it.
  Also, the performace difference is marginal.
  (should rather stop using so much JS code, lol) 
  */
  /* contain: content;
  content-visibility: auto; */
}
</style>
