<template>
  <div id="menubar-container" ref="menubarContainer"></div>
</template>

<script setup>
import { Menubar } from "@/editor/js/Menubar.js"
import { ref } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"

const menubarContainer = ref(null)
const props = defineProps(["editor"])

onMounted(() => {
  const menubar = new Menubar(props.editor)
  menubarContainer.value.appendChild(menubar.dom)
})
</script>

<style scoped></style>
