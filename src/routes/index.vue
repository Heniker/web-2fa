<template>
  <Sidebar v-model="isSideBarOpen" v-if="isContextSetUp"></Sidebar>
  <Teleport to="#app-bar-portal" v-if="isContextSetUp">
    <v-app-bar-nav-icon
      :size="display.smAndDown ? 'large' : 'default'"
      :icon="mdiReorderHorizontal"
      class="order-1 mr-auto"
      aria-label="Open sidebar"
      elevation="0"
      @click="isSideBarOpen = !isSideBarOpen"
    ></v-app-bar-nav-icon>
    <Teleport to="#app-bottom-portal" :disabled="!display.smAndDown">
      <section
        :class="
          display.smAndDown ? [$style.mobileButtons, 'mr-3 mb-3 d-flex flex-column'] : 'order-12'
        "
      >
        <v-btn
          :icon="mdiQrcodeScan"
          :to="{ name: '' + require.resolve('./index/qr-code.vue') }"
          :size="display.smAndDown ? 'large' : 'default'"
          :class="display.smAndDown ? 'mb-3' : 'mr-3'"
          :elevation="display.smAndDown ? 7 : 2"
          aria-label="Scan QR code"
          color="deep-purple-darken-1"
          variant="elevated"
        ></v-btn>

        <v-btn
          :icon="mdiPlusBoxMultiple"
          :to="{ name: '' + require.resolve('./index/new.vue') }"
          :size="display.smAndDown ? 'large' : 'default'"
          :elevation="display.smAndDown ? 7 : 2"
          aria-label="Add new token"
          color="deep-purple-darken-1"
          variant="elevated"
        ></v-btn>
      </section>
    </Teleport>
  </Teleport>
  <v-container v-if="isContextSetUp" fluid>
    <v-row ref="dndEl">
      <v-col cols="12" md="6" lg="4" xl="3" v-for="token in tokens" :key="token.id">
        <TwoFaCard :token="token" :forceAnimationUpdate="forceAnimationUpdate"></TwoFaCard>
      </v-col>
    </v-row>
  </v-container>
  <router-view></router-view>
</template>

<script lang="ts">
import * as v from 'vue'
import { mdiReorderHorizontal, mdiPlus, mdiQrcodeScan, mdiPlusBoxMultiple } from '@mdi/js'
import { onClickOutside, watchOnce } from '@vueuse/core'
import TwoFaCard from '@/components/TwoFaCard.vue'
import { Otp, Security } from '@/services'
import { useSortable } from '@vueuse/integrations/useSortable'

const Sidebar = v.defineAsyncComponent(
  () =>
    import(
      /* webpackPrefetch: true */
      '@/components/Sidebar.vue'
    )
)

export const isSideBarOpenKey = Symbol() as v.InjectionKey<v.Ref<boolean>>

export default v.defineComponent({
  components: {
    TwoFaCard,
    Sidebar,
  },

  setup() {
    const otpService = v.inject(Otp.token)
    assert(otpService)
    const securityService = v.inject(Security.token)
    assert(securityService)

    const isAdding = v.ref(true)
    const tokens = v.toRefs(otpService.reactive).tokens
    const isContextSetUp = v.computed(() => securityService.reactive.isContextSetUp)
    const dndEl = v.ref() as v.Ref<Element>

    const forceAnimationUpdate = v.ref(false)

    watchOnce(dndEl, () => {
      useSortable(dndEl as any, tokens, {
        handle: '.hack_selector-drag',
        animation: 150,
        emptyInsertThreshold: 0,
        onEnd() {
          forceAnimationUpdate.value = true
          queueMicrotask(() => (forceAnimationUpdate.value = false))
        },
      })
    })

    const isSideBarOpen = v.ref(false)
    v.provide(isSideBarOpenKey, isSideBarOpen)

    return {
      dndEl,

      isSideBarOpen,
      forceAnimationUpdate,
      tokens,
      isContextSetUp,
      isAdding,

      mdiReorderHorizontal,
      mdiPlus,
      mdiQrcodeScan,
      mdiPlusBoxMultiple,
    }
  },
})
</script>

<style scoped>
.test {
  /* box-shadow: 0px 0px 4px 0px rgb(var(--v-theme-background)); */
}

.sortable-chosen {
  /* visibility: hidden !important; */
}

:deep(.v-field) * {
  /* letter-spacing: 1px; */
  /* font-size: 30px; */
  /* --v-input-padding-top: 2px;
  --v-field-padding-start: 12px;
  --v-input-control-height: 60px; */
}

:deep(.v-label) {
  /* font-size: 17px; */
}
</style>

<style module>
.mobileButtons {
  position: fixed;
  bottom: 0px;
  right: 0px;
}
</style>
