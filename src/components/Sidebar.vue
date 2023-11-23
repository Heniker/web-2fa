<template>
  <v-navigation-drawer
    :modelValue="modelValue"
    :order="-1"
    @update:modelValue="(arg) => $emit('update:modelValue', arg)"
  >
    <div :class="$style.sideBarContent" class="d-flex flex-column h-100">
      <v-list nav>
        <v-list-item @click="" :prepend-icon="mdiWifiSync" title="Local sync"></v-list-item>
        <v-list-item
          :prepend-icon="mdiBackupRestore"
          :to="{ name: '' + require.resolve('@/routes/index/backup.vue') }"
          title="Import & Backup"
        ></v-list-item>
        <v-list-item
          :to="{ name: '' + require.resolve('@/routes/index/settings.vue') }"
          :prepend-icon="mdiCog"
          title="Settings"
        ></v-list-item>
      </v-list>
      <v-list nav class="mt-auto">
        <v-list-item
          @click="window.open('https://github.com/Heniker/web-2fa', '_blank')"
          :prepend-icon="mdiXml"
          title="Source Code"
        ></v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import * as v from 'vue'
import { mdiXml, mdiWifiSync, mdiBackupRestore, mdiCog } from '@mdi/js'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'

export default v.defineComponent({
  props: { modelValue: { type: Boolean }, abc: { type: Number } },

  setup(props, ctx) {
    const isOpen = props.modelValue

    return {
      isOpen,

      mdiWifiSync,
      mdiXml,
      mdiBackupRestore,
      mdiCog,
    }
  },
})
</script>

<style scoped>
/* .v-navigation-drawer__scrim {
  background: unset;
  width: 100%;
  height: 100%;
  backdrop-filter: grayscale(0.5) blur(2px);
} */
</style>

<style module>
.sideBarContent i {
  font-size: 1.35em;
}

.sideBarContent :global(.v-list-item__content) {
  /* vertical-align: middle; */
}

.sideBarContent :global(.v-list-item-title) {
  align-items: center;
  align-self: center;
  display: flex;
  height: 1.5em;
  font-size: 0.9em;
}
</style>
