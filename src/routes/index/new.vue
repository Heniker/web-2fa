<template>
  <Teleport to="#app-overlay-portal">
    <section :class="$style.scrim">
      <v-card
        v-click-outside="{
          include: () => [...window.document.querySelectorAll('.v-select__content')],
          handler: () => $router.push({ name: '' + require.resolve('@/routes/index.vue') }),
        }"
        :class="$style.overlay"
        :width="display.smAndDown ? '90vw' : 450"
        class="pb-2"
      >
        <v-card-title class="d-flex justify-center mt-3 mb-1 text-h4">Add 2FA</v-card-title>

        <v-card-text class="pb-2">
          <v-form>
            <v-text-field
              v-model="token.label"
              aria-autocomplete="none"
              class="mt-3"
              label="Name"
              hide-details
            ></v-text-field>
            <v-text-field
              v-model="token.issuer"
              aria-autocomplete="none"
              class="mt-3"
              label="Description (Issuer)"
              hide-details
            ></v-text-field>
            <v-text-field
              v-model="tokenSecret"
              aria-autocomplete="none"
              label="Token"
              hide-details
              class="mt-3"
              :rules="[(v) => !!v || 'Token is required']"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions class="mx-2 mb-2 d-flex justify-space-between">
          <v-btn
            class="px-4"
            tag="a"
            color="red"
            variant="tonal"
            :to="{ name: '' + require.resolve('@/routes/index.vue') }"
          >
            Cancel
          </v-btn>
          <v-btn
            @click="isAdvancedExpanded = !isAdvancedExpanded"
            class="mb-n4"
            size="small"
            color="grey-darken-1"
            :variant="isAdvancedExpanded ? 'outlined' : 'text'"
          >
            advanced
          </v-btn>
          <v-btn class="px-4" tag="a" color="green" variant="tonal" @click="saveToken">
            Create
          </v-btn>
        </v-card-actions>

        <v-expand-transition>
          <v-sheet v-show="isAdvancedExpanded">
            <v-row no-gutters class="pt-2 px-4">
              <v-col class="mr-4">
                <v-select
                  v-model="token.algorithm"
                  :items="otpService.supportedAlgorithms"
                  label="Algorithm"
                  variant="solo-filled"
                  hide-details
                ></v-select>
              </v-col>
              <v-col class="mr-4">
                <v-text-field
                  v-model.number="token.period"
                  :disabled="token.algorithm === 'STEAM'"
                  label="Time step"
                  hide-details
                  type="number"
                />
              </v-col>
              <v-col>
                <v-text-field
                  v-model.number="token.digits"
                  :disabled="token.algorithm === 'STEAM'"
                  label="Code size"
                  hide-details
                  type="number"
                />
              </v-col>
            </v-row>
          </v-sheet>
        </v-expand-transition>
      </v-card>
    </section>
  </Teleport>
  <SnackbarNotification v-model="isValidationError" variant="tonal" color="red">
    <span class="text-h6 d-flex justify-center">Token validation failed</span>
  </SnackbarNotification>
</template>

<script lang="ts">
import type { TokenI, TokenAlgorithmT } from '@/_types'
import * as v from 'vue'
import { useDisplay } from 'vuetify'
import { Otp } from '@/services'
import { nanoid } from 'nanoid'
import { SnackbarNotification } from '@/components/Notification'
import { useRouter } from 'vue-router'

export default v.defineComponent({
  components: { SnackbarNotification },
  setup(props, ctx) {
    const otpService = v.inject(Otp.token)
    assert(otpService)

    const router = useRouter()

    const token = v.ref(
      Otp.formToken({ label: '', issuer: '', period: 30, algorithm: 'SHA-1', digits: 6 })
    )

    v.watch(
      v.toRef(() => token.value.algorithm),
      (arg) => {
        if (arg === 'STEAM') {
          token.value.period = 30
          token.value.digits = 5
        }
      }
    )

    const tokenSecret = v.ref('')

    const isValidationError = v.ref(false)

    const saveToken = async () => {
      const isValid = await Otp.validate(token.value, tokenSecret.value)

      if (isValid) {
        otpService.addToken(token.value, tokenSecret.value)
        router.push({ name: '' + require.resolve('@/routes/index.vue') })
      } else {
        console.log(isValidationError)
        isValidationError.value = true
      }
    }

    return {
      isValidationError,
      token,
      tokenSecret,
      saveToken,
      otpService,
      isAdvancedExpanded: v.ref(false),
    }
  },
})
</script>

<style scoped></style>
<style module>
/* Overlay can expand (changing height). So can't use flex */
.overlay {
  position: absolute;
  z-index: 1;
  top: 30%;
  left: 50%;
  transform: translate(-50%, 0);
}

.scrim {
  composes: scrim from './style.module.css';
}
</style>
