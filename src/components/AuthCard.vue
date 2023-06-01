<template>
  <v-card class="pa-2 d-flex justify-center" :class="$style['cool-background']" ref="rootRef" :height="175"
    color="#DCEFEF" variant="outlined" @click.right="(event) => isEdit || (isEdit = true, event.preventDefault())">

    <div class="d-flex flex-column pr-1 overflow-hidden w-100">
      <template v-if="isEdit">
        <v-card-title class="mt-2">
          <v-text-field label="Name" variant="filled" density="default" hide-details>
          </v-text-field>
        </v-card-title>
        <v-card-subtitle class="mt-auto mb-3">
          <v-text-field label="Description" v-model="testt" variant="solo" density="comfortable" hide-details>
          </v-text-field>
        </v-card-subtitle>
      </template>

      <template v-else>
        <v-card-title>
          <span class="text-h5">{{ display.mobile.value }}</span>
        </v-card-title>
        <v-card-subtitle>
          Test Test test test ssss
        </v-card-subtitle>
        <v-card-text>
          <div class="text-h2 my-auto">502073</div>
        </v-card-text>
      </template>
    </div>

    <v-avatar color="#89CFF0" size="80" class="ma-auto mr-3 flex-shrink-0">
      <span class="text-h5 text-black">S</span>
      <!-- <v-icon large color="blue darken-2">
            S
          </v-icon> -->
    </v-avatar>
  </v-card>
</template>

<script lang="ts">
import * as v from 'vue'
import * as otp from 'otpauth'
import { useDisplay } from 'vuetify'
import { onClickOutside } from '@vueuse/core'
import { ProvideValue } from '../util'

export default v.defineComponent({
  components: {
    ProvideValue,
  },

  setup(_, { expose }) {
    const rootRef = v.ref(null) /* html ref */
    const isEdit = v.ref(false)

    onClickOutside(rootRef, () => { isEdit.value = false })


    return { display: useDisplay(), testt: 'Hello world', isEdit, rootRef }
  }
})
</script>

<style scoped>
:deep(.v-label.v-field-label.v-field-label--floating) {
  top: 3px;
}
</style>

<style module>
.cool-background {
  background-color: #292929;
  border-color: #3b3b3b;
  /* background-color: #5A7172; */
}
</style>