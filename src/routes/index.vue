<template>
  <v-container>
    <AuthCard>
    </AuthCard>
  </v-container>
  <router-view></router-view>
</template>

<script lang="ts">
import * as v from 'vue'
import * as otp from 'otpauth'
import { useDisplay } from 'vuetify'
import { onClickOutside } from '@vueuse/core'
import AuthCard from '@/components/AuthCard.vue'

export default v.defineComponent({
  components: {
    AuthCard,
  },

  setup() {
    const isAdding = v.ref(true)

    dostuff()

    return { display: useDisplay(), testt: 'Hello world', isAdding }
  }
})

function dostuff() {
  var a = new otp.TOTP({
    issuer: 'ACME',
    label: 'AzureDiamond',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: '6CJLIEWALRJTFXPIUQB3INWGZIZOJNFQ' // or "OTPAuth.Secret.fromBase32('NB2W45DFOIZA')"
  });

  console.log(a)
  console.log(


    a.generate()
  )

}
</script>

<style scoped>
.test {
  /* box-shadow: 0px 0px 4px 0px rgb(var(--v-theme-background)); */
}

.test2 {
  height: 70px;
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