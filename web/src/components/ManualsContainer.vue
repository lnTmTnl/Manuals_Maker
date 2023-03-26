<template>
  <div id="manuals-container">
    manuals
    <button @click="test">test</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

function test() {
  router.replace({ name: "manual", params: { manualid: 0 } })
}
</script>

<style scoped></style>
