<template>
  <v-app :class="$style.main">
    <div id="app-bar-portal" :class="$style.portal">
      <!-- <v-app-bar></v-app-bar> -->
    </div>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
  <!-- <div id="app-overlay-portal" :class="[$style.overlay, $style.portal]"></div> -->
  <div id="app-overlay-portal" :class="$style.overlay"></div>
  <div id="app-bottom-portal" :class="$style.portal"></div>
</template>

<script lang="ts">
import * as v from 'vue'
import { useRoute } from 'vue-router'

export default v.defineComponent({
  setup() {
    return {}
  },
})
</script>

<style module>
.main {
  /* width: 100vw; */
  /* height: 100vh; */
  /* overflow: hidden; */
}

.portal {
  display: contents;
}

.portal:empty {
  display: none;
}

.overlay {
  left: 0;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 2000; /* Vuetify uses z-index 1000 */
}
.overlay:empty {
  display: none;
}
</style>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;

  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;

  image-rendering: smooth;
  image-rendering: optimizeQuality;

  overflow: auto;
}

* {
  box-sizing: border-box;

  /* 
  If something breaks you  won't debug it.
  Also, the performace difference is marginal.
  (should rather stop using so much JS code, lol) 
  */
  /* contain: content;
  content-visibility: auto; */
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-grab {
  cursor: grab;
}
</style>
