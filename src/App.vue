<template>
  <v-app :class="$style.main">
    <v-app-bar></v-app-bar>
    <v-main>
      <router-view>
      </router-view>
    </v-main>
  </v-app>
  <div id="app-portal" :class="$style.overlay"></div>
</template>

<script lang="ts">
import * as v from 'vue'
import { useRoute } from 'vue-router'

export default v.defineComponent({
  setup() {
    
    return { }
  },
})
</script>

<style module>
.main {
  /* width: 100vw; */
  /* height: 100vh; */
  /* overflow: hidden; */
}

.overlay {
  top: 0;
  backdrop-filter: grayscale(0.5) blur(2px);
  position: fixed;
  z-index: 10;
  width: 100vw;
  height: 100vh;
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

  overflow: hidden;
}

/* a {
  text-decoration: none;
  color: inherit;
} */

* {
  box-sizing: border-box;
  contain: content;
  content-visibility: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
