<template>
  <Teleport to="#app-overlay-portal">
    <section :class="$style.scrim" class="justify-center align-center d-flex">
      <v-card
        v-click-outside="() => $router.push({ name: '' + require.resolve('@/routes/index.vue') })"
        :class="$style.root"
        class="pb-2"
        :style="{}"
      >
        <v-card-title class="d-flex justify-center mt-3 mb-1 text-h4">Scan QR Code</v-card-title>

        <v-card-text>
          <v-select
            v-model="selectedDevice"
            :items="videoDevices"
            :return-object="true"
            item-title="label"
            label="Select camera"
          ></v-select>
          <QrcodeStream
            :class="$style.qrStream"
            :constraints="{ deviceId: selectedDevice?.deviceId }"
            @detect="onCodeDetect"
            @error="onQrError"
          ></QrcodeStream>
        </v-card-text>

        <v-card-actions class="mt-n2 d-flex justify-space-around">
          <v-btn
            class="px-10"
            color="red"
            variant="tonal"
            :to="{ name: '' + require.resolve('@/routes/index.vue') }"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </section>
  </Teleport>
  <Notification v-model="isError" variant="tonal" color="red">
    <div class="text-h6 d-flex flex-column justify-space-around align-center">
      <div>Something went wrong</div>
      <div>Check console for details</div>
    </div>
  </Notification>
  <Notification v-model="isSuccess" variant="tonal" color="green">
    <span class="text-h6 d-flex justify-center">Added entry from QR Code</span>
  </Notification>
</template>

<script lang="ts">
import { isTokenAlgorithm } from '@/_types'
import * as v from 'vue'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import { Otp, Security } from '@/services'
import { useRouter } from 'vue-router'
import { isSideBarOpenKey } from '../index.vue'
import { Notification } from '@/components/Notification'

const QrcodeStream = v.defineAsyncComponent(async () => {
  return import(
    /* webpackPrefetch: true */
    'vue-qrcode-reader'
  ).then((it) => it.QrcodeStream)
})

type PointT = { x: number; y: number }
type OtpArgsT =
  | `secret=${string}`
  | `secret=${string}&issuer=${string}`
  | `issuer=${string}&secret=${string}`

interface CodeScanResultI {
  boundingBox: DOMRectReadOnly
  cornerPoints: [PointT, PointT, PointT, PointT]
  format: 'qr_code'
  rawValue: `otpauth://totp/${string}?${OtpArgsT}`
}

export default v.defineComponent({
  components: { QrcodeStream, Notification },
  setup(props, ctx) {
    const otpService = v.inject(Otp.token)
    assert(otpService)
    const securityService = v.inject(Security.token)
    assert(securityService)

    const router = useRouter()

    const selectedDevice = v.ref<MediaDeviceInfo | undefined>()
    const videoDevices = v.ref([] as MediaDeviceInfo[])

    navigator.mediaDevices
      .enumerateDevices()
      .then((it) => it.filter(({ kind }) => kind === 'videoinput'))
      // idk why JSON.parse(JSON.stringify) is required. mby vuetify does something weird
      .then((it) => JSON.parse(JSON.stringify(it)))
      .then((it) => {
        videoDevices.value.push(...it)
        selectedDevice.value = it[0]
      })

    const isError = v.ref(true)
    const onQrError = (err: Error) => {
      isError.value = true
      console.warn('Error reading QR code')
      console.warn(err)
    }

    const isSuccess = v.ref(false)
    const onCodeDetect = async (arg: [CodeScanResultI]) => {
      const otpUri = (await import('otpauth')).URI

      const parsed = otpUri.parse(arg[0].rawValue)
      const algorithm = parsed.algorithm

      assert('period' in parsed)
      assert(isTokenAlgorithm(algorithm))

      const token = Otp.formToken(Object.assign(parsed, { algorithm }))

      otpService.addToken(token, parsed.secret.base32)
      isSuccess.value = true

      router.push({ name: require.resolve('@/routes/index.vue') + '' })
    }

    const isSideBarOpen = v.inject(isSideBarOpenKey)
    isSideBarOpen && (isSideBarOpen.value = false)

    return {
      selectedDevice,
      videoDevices,
      isError,
      isSuccess,

      mdiEyeOff,
      mdiEye,

      onQrError,
      onCodeDetect,
    }
  },
})
</script>

<style scoped>
:deep(.v-input__details) {
  margin-bottom: 0;
}

:deep(.qrcode-stream-overlay) {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
<style module>
.scrim {
  composes: scrim from './style.module.css';
}

.root {
}

.qrStream canvas {
  display: none; /* It's not displayed correctly on itital load. wtf is wrong with this libray */
}

.qrStream video {
  max-height: 60vh;
  max-width: 80vw;
}
</style>
