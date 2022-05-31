<template>
  <div>
    <h1>Hello World</h1>
    <p>This is a simple example of a Vue.js component.</p>
  </div>
  You've been looking at this page for {{ secondsPassed }} seconds.
</template>

<script lang="ts" setup>
import * as v from 'vue'

const secondsPassed = v.ref(0)

{
  const interval = setInterval(() => {
    secondsPassed.value++
  }, 1000)

  v.onUnmounted(() => {
    clearInterval(interval)
  })
}
</script>
