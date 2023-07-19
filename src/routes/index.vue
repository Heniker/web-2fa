<template>
  <Teleport to="#app-navigation-portal">
    <Sidebar v-model="isSideBarOpen"></Sidebar>
  </Teleport>
  <Teleport to="#app-bar-portal">
    <v-app-bar-nav-icon
      v-if="isContextSetUp"
      :class="[display.smAndDown ? $style['add-new-mobile'] : '']"
      :size="display.smAndDown ? 'x-large' : undefined"
      @click="isSideBarOpen = !isSideBarOpen"
      aria-label="Open sidebar"
      elevation="0"
      class="order-1"
      :icon="mdiReorderHorizontal"
    ></v-app-bar-nav-icon>
    <!-- <v-btn></v-btn> -->
    <Teleport to="#app-bottom-portal" :disabled="!display.smAndDown">
      <v-btn
        v-if="isContextSetUp"
        :class="[display.smAndDown ? $style['add-new-mobile'] : '']"
        :size="display.smAndDown ? 'x-large' : undefined"
        @click="addToken"
        aria-label="Add new token"
        color="deep-purple-darken-1"
        variant="elevated"
        elevation="4"
        :icon="mdiPlus"
        class="ml-auto order-12"
      ></v-btn>
    </Teleport>
  </Teleport>
  <v-container fluid>
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
import * as otp from 'otpauth'
import { mdiReorderHorizontal, mdiPlus } from '@mdi/js'
import { useDisplay } from 'vuetify'
import * as vuetifyComponents from 'vuetify/components'
import { onClickOutside, watchOnce } from '@vueuse/core'
import TwoFaCard from '@/components/TwoFaCard.vue'
import { Otp, Security } from '@/services'
import { isResolved } from '@/util'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useDraggable, type UseDraggableReturn } from 'vue-draggable-plus'

const SidebarLazy = v.defineAsyncComponent(
  () =>
    import(
      /* webpackPrefetch: true */
      '@/components/Sidebar.vue'
    )
)

export default v.defineComponent({
  components: {
    TwoFaCard,
    Sidebar: SidebarLazy,
  },

  setup() {
    const otpService = v.inject(Otp.token)
    assert(otpService)
    const securityService = v.inject(Security.token)
    assert(securityService)

    const router = useRouter()

    otpService.fetchStoredTokens()

    v.onBeforeMount(async () => {
      const isSecuritySetUp = securityService.reactive.isContextSetUp
      if (!isSecuritySetUp) {
        router.push({ name: '' + require.resolve('./index/pass') })
      }
    })

    const addToken = () => {
      if (securityService.reactive.isContextSetUp) {
        router.push({ name: '' + require.resolve('./index/new') })
      }
    }

    const isAdding = v.ref(true)
    const tokens = v.toRefs(otpService.reactive).tokens
    const isContextSetUp = v.computed(() => securityService.reactive.isContextSetUp)
    const dndEl = v.ref() as v.Ref<Element>

    const forceAnimationUpdate = v.ref(false)

    watchOnce(dndEl, () => {
      useDraggable<UseDraggableReturn>(dndEl, tokens, {
        emptyInsertThreshold: 0,
        animation: 150,
        handle: '.hack_selector-drag',
        onEnd() {
          forceAnimationUpdate.value = true
          queueMicrotask(() => (forceAnimationUpdate.value = false))
        },
      })
    })

    const isSideBarOpen = v.ref(false)

    return {
      dndEl,
      isSideBarOpen,
      forceAnimationUpdate,
      tokens,
      isContextSetUp,
      isAdding,
      addToken,

      mdiReorderHorizontal,
      mdiPlus,
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
.add-new-mobile {
  position: fixed;
  transform: translate(-20%, -20%);
  bottom: 0px;
  right: 0px;
}
</style>
