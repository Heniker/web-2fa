<template>
  <v-card>
    <div>
      <h1 :class="$style.test">Hello World</h1>
      <p>This is a simple example of a Vue.js component.</p>
    </div>
    You've been looking at this page for {{ secondsPassed }} seconds.
  </v-card>
</template>

<script lang="ts">
import * as v from 'vue'

export default v.defineComponent({
  setup() {
    const secondsPassed = v.ref(0)

    v.onMounted(() => {
      const interval = setInterval(() => {
        secondsPassed.value++
      }, 1000)

      v.onUnmounted(() => {
        clearInterval(interval)
      })
    })

    return { secondsPassed }
  }
})
</script>

<style module>
.test {
  color: red;
}
</style>
