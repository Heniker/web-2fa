<template>
  <div>
    <h1 class="test">Hello World</h1>
    <p>This is a simple example of a Vue.js component.</p>
  </div>
  You've been looking at this page for {{ secondsPassed }} seconds.
</template>

<script lang="ts" setup>
import * as v from 'vue'

const secondsPassed = v.ref(0)

v.onMounted(() => {
  const interval = setInterval(() => {
    secondsPassed.value++
  }, 1000)

  v.onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style>
.test {
  color: red;
}
</style>
