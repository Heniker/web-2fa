<template>
  <Teleport to="#app-overlay-portal">
    <section :class="$style.scrim" class="justify-center align-center d-flex">
      <v-card
        v-click-outside="{
          include: () => [...window.document.querySelectorAll('.v-select__content')],
          handler: () => $router.push({ name: '' + require.resolve('@/routes/index.vue') }),
        }"
        :class="$style.overlay"
        :width="display.smAndDown ? '90vw' : 450"
      >
        <v-card-title class="d-flex justify-center mt-3 mb-1 text-h4">
          Backup & Restore
        </v-card-title>
        <v-card-text>
          <v-tabs v-model="currentTab" color="deep-purple-accent-2" align-tabs="center">
            <v-tab value="import">Import</v-tab>
            <v-tab value="export">Export</v-tab>
          </v-tabs>

          <v-window v-model="currentTab">
            <v-window-item value="import">
              <v-row class="mb-2 mt-2">
                <v-col>
                  <v-btn>Google Drive</v-btn>
                </v-col>
                <v-col>
                  <v-btn>OneDrive</v-btn>
                </v-col>
                <v-col>
                  <v-btn>DropBox</v-btn>
                </v-col>
              </v-row>
              <v-sheet
                elevation="10"
                color="white"
                height="350"
                class="d-flex align-center justify-center"
              >
                <span class="text-subtitle-1">Or Drag & Drop files anywhere</span>
              </v-sheet>
            </v-window-item>
            <v-window-item value="export">
              <v-container fluid></v-container>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </section>
  </Teleport>
</template>

<script lang="ts">
import * as v from 'vue'

export default v.defineComponent({
  components: {},
  setup(props, ctx) {
    const currentTab = v.ref<'import' | 'export'>('import')

    return { currentTab }
  },
})
</script>

<style scoped></style>

<style module>
.scrim {
  composes: scrim from './style.module.css';
}
</style>
