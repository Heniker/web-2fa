<template>
  <Teleport to="#app-overlay-portal">
    <section :class="$style.scrim">
      <v-card
        v-click-outside="() => $router.push({ name: '' + require.resolve('@/routes/index.vue') })"
        :class="$style.overlay"
        :width="display.smAndDown ? '90vw' : 400"
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
              label="Description (issuer)"
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
          <v-btn
            class="px-4"
            tag="a"
            color="green"
            variant="tonal"
            @click="saveToken"
            :to="{ name: '' + require.resolve('@/routes/index.vue') }"
          >
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
                  label="Time step"
                  v-model.number="token.period"
                  hide-details
                  type="number"
                />
              </v-col>
              <v-col>
                <v-text-field
                  label="Code size"
                  v-model.number="token.digits"
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
</template>

<script lang="ts">
import type { TokenI, TokenAlgorithmT } from '@/_types'
import * as v from 'vue'
import { useDisplay } from 'vuetify'
import { Otp } from '@/services'
import { nanoid } from 'nanoid'

export default v.defineComponent({
  components: {},
  setup(props, ctx) {
    const otpService = v.inject(Otp.token)
    assert(otpService)

    const token = v.ref<TokenI>({
      id: nanoid(),
      label: '',
      issuer: '',
      period: 30,
      algorithm: 'SHA1',
      digits: 6,
    })

    const tokenSecret = v.ref('')

    const saveToken = () => {
      otpService.addToken(token.value, tokenSecret.value)
    }

    return {
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
