<template>
  <div id="player-container" ref="playerContainer"></div>
</template>

<script setup>
import { Player } from "@/editor/js/Player.js"
import { ref } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"

const playerContainer = ref(null)
const props = defineProps(["editor"])

onMounted(() => {
  const player = new Player(props.editor)
  playerContainer.value.appendChild(player.dom)
})
</script>

<style scoped></style>
