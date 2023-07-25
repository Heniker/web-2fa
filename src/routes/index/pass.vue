<template>
  <Teleport to="#app-overlay-portal">
    <section :class="[$style['scrim']]" class="d-flex justify-center align-center">
      <v-card :width="display.smAndDown.value ? '90%' : 400" class="pb-2">
        <v-card-title class="d-flex justify-center mt-3 mb-1 text-h4">
          Provide password
        </v-card-title>

        <v-card-text>
          <!-- <v-form> -->
          <ProvideValue v-slot="slot" :isPassVisible="false" :selectionStart="0">
            <v-text-field
              ref="passInputRef"
              v-model="password"
              class="mt-3"
              autofocus
              density="default"
              :append-inner-icon="slot.isPassVisible ? mdiEye : mdiEyeOff"
              :rules="[(v) => !!v || 'Password is required']"
              :type="slot.isPassVisible ? 'text' : 'password'"
              label="Decryption password"
              @click:append-inner="
                () => {
                  slot.isPassVisible = !slot.isPassVisible
                  const selectionStart = passInputRef.selectionStart
                  window.requestAnimationFrame(() => {
                    passInputRef.$el.querySelector('input').selectionStart = selectionStart
                  })
                }
              "
              @keyup.enter="onPasswordAccept"
            ></v-text-field>
          </ProvideValue>
          <!-- </v-form> -->
        </v-card-text>

        <v-card-actions class="mt-n2 d-flex justify-space-around">
          <v-btn
            class="px-10"
            color="deep-purple-accent-1"
            variant="tonal"
            @click="onPasswordAccept"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </section>
  </Teleport>
</template>

<script lang="ts">
import type { TokenI } from '@/_types'
import * as v from 'vue'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { Otp, Security } from '@/services'
import { ProvideValue } from '@/util'
import { useRouter } from 'vue-router'

export default v.defineComponent({
  components: { ProvideValue },
  setup(props, ctx) {
    const otpService = v.inject(Otp.token)
    assert(otpService)
    const securityService = v.inject(Security.token)
    assert(securityService)

    const router = useRouter()
    const password = v.ref('')

    const onPasswordAccept = () => {
      securityService.setupSecureContext(password.value)
      router.push({ name: '' + require.resolve('@/routes/index.vue') })
    }

    return {
      display: useDisplay(),
      password,
      onPasswordAccept,
      passInputRef: v.ref<Element>(),

      mdiEyeOff,
      mdiEye,
    }
  },
})
</script>

<style scoped>
:deep(.v-input__details) {
  margin-bottom: 0;
}
</style>
<style module>
.scrim {
  composes: scrim from './style.module.css';
}
</style>
