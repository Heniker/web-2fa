<template>
  <Sidebar v-model="isSideBarOpen" v-if="isContextSetUp"></Sidebar>
  <Teleport to="#app-bar-portal" v-if="isContextSetUp">
    <v-app-bar-nav-icon
      :size="display.smAndDown ? 'large' : 'default'"
      :icon="mdiReorderHorizontal"
      class="order-1"
      aria-label="Open sidebar"
      elevation="0"
      @click="isSideBarOpen = !isSideBarOpen"
    ></v-app-bar-nav-icon>

    <div class="order-11 d-flex ml-auto">
      <ProvideValue :isOpen="false" v-slot="slot">
        <v-expand-x-transition :disabled="preferLessAnimations">
          <v-text-field
            v-if="slot.isOpen"
            v-model="filterQuery"
            style="width: 250px"
            placeholder="Search"
            class="mr-3"
            variant="filled"
            density="compact"
            single-line
            hide-details
            @keydown.esc=";(slot.isOpen = !slot.isOpen), (filterQuery = '')"
          ></v-text-field>
        </v-expand-x-transition>
        <v-btn
          :icon="slot.isOpen ? mdiClose : mdiMagnify"
          :elevation="display.smAndDown ? 7 : 2"
          class="mr-3"
          aria-label="Toggle search bar"
          color="deep-purple-darken-1"
          variant="outlined"
          @click=";(slot.isOpen = !slot.isOpen), (filterQuery = '')"
        ></v-btn>
      </ProvideValue>
    </div>

    <Progress
      v-if="globalProgressBar"
      :period="globalProgressBar"
      :class="$style.progressBar"
    ></Progress>

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
        <TwoFaCard ref="cardEls" :id="`card-${token.id}`" :token="token"></TwoFaCard>
      </v-col>
    </v-row>
  </v-container>
  <router-view></router-view>
</template>

<script lang="ts">
import * as v from 'vue'
import {
  mdiReorderHorizontal,
  mdiPlus,
  mdiQrcodeScan,
  mdiPlusBoxMultiple,
  mdiMagnify,
  mdiClose,
} from '@mdi/js'
import { onClickOutside, watchOnce } from '@vueuse/core'
import TwoFaCard from '@/components/TwoFaCard.vue'
import { Otp, Security, Settings, State } from '@/services'
import { useSortable } from '@vueuse/integrations/useSortable'
import { ProvideValue, makePersist, persist, trigger } from '@/util'
import Progress from '@/components/Progress.vue'
import type { TokenI } from '@/_types'
import { eagerComputed } from '@vueuse/core'
import { computedAsync } from '@vueuse/core'

const Sidebar = v.defineAsyncComponent(
  () =>
    import(
      /* webpackPrefetch: true */
      '@/components/Sidebar.vue'
    )
)

const FuseImport = import(/* webpackPrefetch: true */ 'fuse.js')

export default v.defineComponent({
  components: {
    TwoFaCard,
    Progress,
    Sidebar,
    ProvideValue,
  },

  setup() {
    const otpService = v.inject(Otp.token)
    assert(otpService)
    const securityService = v.inject(Security.token)
    assert(securityService)
    const settingsService = v.inject(Settings.token)
    assert(settingsService)
    const state = v.inject(State.token)
    assert(state)

    const filterQuery = v.ref('')

    {
      const searchTokens = async (arg: string) => {
        const fuseInstance = FuseImport.then(
          (it) => new it.default(otpService.reactive.tokens, { keys: ['label', 'issuer'] })
        )

        return (await fuseInstance).search(arg).map((it) => it.item)
      }

      var tokens = computedAsync(
        async () =>
          filterQuery.value && otpService.reactive.tokens
            ? await searchTokens(filterQuery.value)
            : otpService.reactive.tokens,
        []
      )
    }

    const dndEl = v.ref<Element>()
    const cardEls = v.ref<InstanceType<typeof import('@/components/TwoFaCard.vue').default>[]>()

    watchOnce(dndEl, () => {
      const st = useSortable(dndEl as any, tokens, {
        handle: '.hack_selector-drag',
        animation: 150,
        emptyInsertThreshold: 0,
      })

      v.watch(filterQuery, () => {
        filterQuery.value ? st.option('disabled', true) : st.option('disabled', false)
      })
    })

    {
      let lastSearchResult: TokenI | undefined

      v.watch(filterQuery, (val) => {
        cardEls.value?.forEach((it) => {
          it.forcedUpdate(false)
        })

        if (val) {
          lastSearchResult = tokens.value[0]
        } else {
          v.nextTick(() => {
            lastSearchResult &&
              document.querySelector(`#card-${lastSearchResult.id}`)?.scrollIntoView()
            lastSearchResult = undefined
          })
        }
      })
    }

    return {
      dndEl,
      cardEls,

      globalProgressBar: v.toRef(() => state.reactive.globalProgressBar),
      isSideBarOpen: v.toRefs(state.reactive).isSideBarOpen,
      tokens,
      filterQuery,
      isContextSetUp: v.toRef(() => securityService.reactive.isContextSetUp),
      isAdding: v.ref(true),
      preferLessAnimations: v.toRef(() => settingsService.reactive.preferLessAnimations),

      mdiClose,
      mdiReorderHorizontal,
      mdiPlus,
      mdiQrcodeScan,
      mdiPlusBoxMultiple,
      mdiMagnify,
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

* {
  overflow: visible !important;
}
</style>

<style module>
.mobileButtons {
  position: fixed;
  bottom: 0px;
  right: 10px;
}

.progressBar {
  position: absolute;
  bottom: -6px;
  left: 0px;
  right: 0px;
}
</style>
