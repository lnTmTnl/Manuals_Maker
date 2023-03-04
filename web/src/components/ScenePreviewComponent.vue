<template>
  <div id="scene-preview">
    <canvas id="three" ref="threeCanvas"></canvas>
  </div>
</template>

<script setup>
import * as THREE from "three"
import { computed, onMounted, ref, watch } from "@vue/runtime-core"

const threeCanvas = ref(null)
let scene
let renderer
let camera

const props = defineProps(["code"])
const code = computed(() => props.code)

onMounted(() => {
  initThree()
})

watch(code, (newVal, oldVal) => {
  console.log(oldVal)
  eval(newVal)
})

function initThree() {
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer({
    canvas: threeCanvas.value,
    antialias: true,
  })
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  scene.background = new THREE.Color("#ccc")
  renderer.render(scene, camera)
}
</script>

<style scoped>
#scene-preview {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 50%;
}

#three {
  height: 100%;
  width: 100%;
}
</style>
