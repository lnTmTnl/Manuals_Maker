<template>
  <div id="edit-view">
    <router-view></router-view>
    <!-- <ThreeEditorComponent></ThreeEditorComponent>
    <LoginView></LoginView> -->
  </div>
  <!-- <ScenePreviewComponent :code="code"></ScenePreviewComponent> -->
  <!-- <BlocklyComponent @run-code="runCode"></BlocklyComponent> -->
</template>

<script setup>
import BlocklyComponent from "@/components/BlocklyComponent.vue"
//import ScenePreviewComponent from "@/components/ScenePreviewComponent.vue"
import ThreeEditorComponent from "@/editor/ThreeEditorComponent.vue"
import LoginView from "@/views/LoginView.vue"
import { ref } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"

const code = ref("")

function runCode(codeToRun) {
  code.value = codeToRun.value
}
</script>

<style scoped></style>
