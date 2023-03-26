<template>
  <div id="manual-view"></div>
</template>

<script setup>
import * as THREE from "@/editor/build/three.module.js"
import { APP } from "@/editor/js/libs/app.js"
import { VRButton } from "@/editor/examples/jsm/webxr/VRButton.js"

window.THREE = THREE // Used by APP Scripts.
window.VRButton = VRButton // Used by APP Scripts.

var loader = new THREE.FileLoader()
loader.load("app.json", function (text) {
  console.log(text)
  var player = new APP.Player()
  player.load(JSON.parse(text))
  player.setSize(window.innerWidth, window.innerHeight)
  player.play()

  document.body.appendChild(player.dom)

  window.addEventListener("resize", function () {
    player.setSize(window.innerWidth, window.innerHeight)
  })
})
</script>

<style scoped></style>
