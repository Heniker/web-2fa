<template>
  <v-card>
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
        @error="(ev) => $emit('error', ev)"
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
</template>

<script lang="ts">
import { isTokenAlgorithm } from '@/_types'
import * as v from 'vue'
import { Otp, Security } from '@/services'
import { SnackbarNotification } from '@/components/Notification'

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
  components: { QrcodeStream, SnackbarNotification },

  setup(props, ctx) {
    const otpService = v.inject(Otp.token)
    assert(otpService)
    const securityService = v.inject(Security.token)
    assert(securityService)

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

    const onCodeDetect = async (arg: [CodeScanResultI]) => {
      // #todo> remove usage of otpauth completely
      const otpUri = (await import('otpauth')).URI

      const parsed = otpUri.parse(arg[0].rawValue)
      const algo = parsed.algorithm
      // SHA1 -> SHA-1
      const algorithm = `${algo.slice(0, 3)}-${algo.slice(3)}`

      assert('period' in parsed)
      assert(isTokenAlgorithm(algorithm))

      const token = Otp.formToken(Object.assign(parsed, { algorithm }))

      ctx.emit('detected', token, parsed.secret.base32)
    }

    return {
      selectedDevice,
      videoDevices,

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
.qrStream canvas {
  display: none; /* It's not displayed correctly on itital load. wtf is wrong with this libray */
}

.qrStream video {
  max-height: 60vh;
  max-width: 80vw;
}
</style>
