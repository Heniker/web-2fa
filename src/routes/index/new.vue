<template>
  <Teleport to="#app-overlay-portal">
    <div :class="$style.scrim"></div>
    <section :class="$style['overlay']">
      <v-card :width="display.smAndDown.value ? '90vw' : 400">
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
              v-model="token.description"
              aria-autocomplete="none"
              class="mt-3"
              label="Description"
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
          <!-- <v-btn
            @click="isSettingsExpanded = !isSettingsExpanded"
            :class="[$style['expand-btn'], isSettingsExpanded && $style['expand-btn--active']]"
            class="mb-n2"
            color="grey-darken-1"
            variant="outlined"
            icon="mdi-chevron-double-down"
          ></v-btn> -->
          <v-btn
            @click="isSettingsExpanded = !isSettingsExpanded"
            :class="[$style['expand-btn']]"
            class="mb-n4"
            size="small"
            color="grey-darken-1"
            :variant="isSettingsExpanded ? 'outlined' : 'text'"
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
          <v-sheet v-show="isSettingsExpanded">
            <v-row no-gutters class="pb-4 pt-2 px-4">
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
                  v-model.number="token.codeLen"
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

    const token: v.Ref<TokenI> = v.ref({
      id: nanoid(),
      label: '',
      description: '',
      period: 30,
      algorithm: 'SHA1',
      codeLen: 6,
      code: '',
    })

    const tokenSecret = v.ref('')

    const saveToken = () => {
      otpService.addToken(token.value, tokenSecret.value)
    }

    return {
      display: useDisplay(),
      token,
      tokenSecret,
      saveToken,
      otpService,
      isSettingsExpanded: v.ref(false),
    }
  },
})
</script>

<style scoped>
.test {
  flex-basis: 0px;
}
</style>
<style module>
.overlay {
  z-index: 1;
  position: absolute;
  /* display: flex; */
  top: 30%;
  left: 50%;
  transform: translate(-50%, 0);
  /* align-items: center;
  justify-content: space-around; */
}

.scrim {
  width: 100%;
  height: 100%;
  backdrop-filter: grayscale(0.5) blur(2px);
}

.expand-btn i {
  margin-top: 3px;
  font-size: 1.7em;
}
</style>
