<template>
  <Teleport to="#app-portal">
    <v-card :class="$style['creation-dialog']" :width="display.smAndDown.value ? '90%' : 400">
      <v-card-title class="d-flex justify-center mt-3 mb-1 text-h4">Add 2FA</v-card-title>

      <v-card-text class="pb-2">
        <v-form>
          <v-text-field
            aria-autocomplete="none"
            class="mt-3"
            label="Name"
            hide-details
          ></v-text-field>
          <v-text-field
            aria-autocomplete="none"
            class="mt-3"
            label="Description"
            hide-details
          ></v-text-field>
          <v-text-field
            aria-autocomplete="none"
            class="mt-3"
            label="Token"
            hide-details
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
          class="px-4"
          tag="a"
          color="green"
          variant="tonal"
          :to="{ name: '' + require.resolve('@/routes/index.vue') }"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </Teleport>
</template>

<script lang="ts">
import * as v from 'vue'
import { useDisplay } from 'vuetify';

export default v.defineComponent({
  components: {},
  setup(props, ctx) {
    return { display: useDisplay() }
  },
})
</script>

<style scoped></style>
<style module>
.creation-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(10px);
  /* width: 400px; */
  /* height: 180px; */
}
</style>
