<template>
  <v-navigation-drawer
    :modelValue="modelValue"
    :order="-1"
    temporary
    disableResizeWatcher
    @update:model-value="(arg) => $emit('update:modelValue', arg)"
  >
    <div :class="$style['side-bar-content']" class="d-flex flex-column h-100">
      <v-list nav>
        <v-list-item @click="" :prepend-icon="mdiWifiSync" title="Local sync"></v-list-item>
        <v-list-item
          @click=""
          :prepend-icon="mdiBackupRestore"
          title="Import & Backup"
        ></v-list-item>
        <v-list-item @click="" :prepend-icon="mdiCog" title="Settings"></v-list-item>
      </v-list>
      <v-list nav class="mt-auto">
        <v-list-item @click="" :prepend-icon="mdiXml" title="Source Code"></v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import * as v from 'vue'
import { mdiXml, mdiWifiSync, mdiBackupRestore, mdiCog } from '@mdi/js'
import { useRouter } from 'vue-router'

export default v.defineComponent({
  components: {},
  props: { modelValue: { type: Boolean, required: true } },

  setup(props) {
    return {
      isOpen: props.modelValue,

      mdiWifiSync,
      mdiXml,
      mdiBackupRestore,
      mdiCog,
    }
  },
})
</script>

<style module>
.side-bar-content i {
  font-size: 1.35em;
}

.side-bar-content :global(.v-list-item__content) {
  /* vertical-align: middle; */
}

.side-bar-content :global(.v-list-item-title) {
  align-items: center;
  align-self: center;
  display: flex;
  height: 1.5em;
  font-size: 0.9em;
}
</style>
