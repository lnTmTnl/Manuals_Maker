<template>
  <div id="sidebar-container" ref="sidebarContainer"></div>
</template>

<script setup>
import { Sidebar } from "@/editor/js/Sidebar.js"
import { ref } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"

const sidebarContainer = ref(null)
const props = defineProps(["editor"])

onMounted(() => {
  const sidebar = new Sidebar(props.editor)
  sidebarContainer.value.appendChild(sidebar.dom)
})
</script>

<style scoped></style>
