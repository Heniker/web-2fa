<template>
  <v-app :class="$style.main">
    <v-app-bar>
      <v-container fluid class="d-flex">
        <!--
          The order of stuff teleported here should be controlled with css flex order property
          Which is a bit hacky, but it's the simplest to understand and manage
         -->
        <div id="app-bar-portal" :class="$style.portal"></div>
      </v-container>
    </v-app-bar>
    
    <div id="app-navigation-portal" :class="$style.portal"></div>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>

  <Teleport to="#app-bar-portal">
    <span :class="$style.title" class="align-self-center">Web-2FA</span>
  </Teleport>

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
.title {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  /* letter-spacing: 1px; */
  font-size: 38px;
  font-weight: 630;
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
</style>
