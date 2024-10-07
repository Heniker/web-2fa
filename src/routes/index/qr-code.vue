<template>
  <Teleport to="#app-overlay-portal">
    <section :class="$style.scrim" class="justify-center align-center d-flex">
      <QrScanner
        v-click-outside="{
          include: () => [...window.document.querySelectorAll('.v-select__content')],
          handler: () => $router.push({ name: '' + require.resolve('@/routes/index.vue') }),
        }"
        @error="onError"
        @detected="onDetected"
      ></QrScanner>
    </section>
  </Teleport>
  <SnackbarNotification v-model="isError" variant="tonal" color="red">
    <div class="text-h6 d-flex flex-column justify-space-around align-center">
      <div>Something went wrong</div>
      <div>Check console for details</div>
    </div>
  </SnackbarNotification>
  <SnackbarNotification v-model="isSuccess" variant="tonal" color="green">
    <span class="text-h6 d-flex justify-center">Added entry from QR Code</span>
  </SnackbarNotification>
</template>

<script lang="ts">
import { type TokenI, type TokenSecretTag } from '@/_types'
import * as v from 'vue'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import { useRouter } from 'vue-router'
import { SnackbarNotification } from '@/components/Notification'
import QrScanner from '@/components/QrScanner.vue'
import { useStore } from '@/store'
import { otpService } from '@/services'

export default v.defineComponent({
  components: { QrScanner, SnackbarNotification },
  setup(props, ctx) {
    const store = useStore()
    const router = useRouter()

    const isError = v.ref(false)
    const onError = (err: Error) => {
      isError.value = true
    }

    const isSuccess = v.ref(false)
    const onDetected = (token: TokenI, secret: TokenSecretTag) => {
      store.token.add(token, secret)
      isSuccess.value = true

      router.push({ name: require.resolve('@/routes/index.vue') + '' })
    }

    store.state.isSideBarOpen = false

    return {
      isError,
      isSuccess,

      mdiEyeOff,
      mdiEye,

      onError,
      onDetected,
    }
  },
})
</script>

<style scoped></style>
<style module>
.scrim {
  composes: scrim from './style.module.css';
}
</style>
