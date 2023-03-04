<template>
  <div id="toolbar-container" ref="toolbarContainer"></div>
</template>

<script setup>
import { Toolbar } from "@/editor/js/Toolbar.js"
import { ref } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"

const toolbarContainer = ref(null)
const props = defineProps(["editor"])

onMounted(() => {
  const toolbar = new Toolbar(props.editor)
  toolbarContainer.value.appendChild(toolbar.dom)
})
</script>

<style scoped></style>
