<template>
  <v-app class="main">
  <!-- <v-app :class="$style.main"> -->
    <v-app-bar></v-app-bar>
    <v-main>
      <router-view>
      </router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import * as v from 'vue'

export default v.defineComponent({
  setup() { }
})
</script>

<style module>
.main {
  width: 100vw;
  height: 100vh;
  background-color: rgb(126, 88, 189);
}
</style>
