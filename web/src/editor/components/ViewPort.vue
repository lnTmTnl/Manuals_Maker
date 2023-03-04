<template>
  <div id="viewport-container" ref="viewportContainer"></div>
</template>

<script setup>
import { Viewport } from "@/editor/js/Viewport.js"
import { ref } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"

const viewportContainer = ref(null)
const props = defineProps(["editor"])

onMounted(() => {
  const viewport = new Viewport(props.editor)
  viewportContainer.value.appendChild(viewport.dom)
})
</script>

<style scoped></style>
