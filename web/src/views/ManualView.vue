<template>
  <div id="manual-view">
    <el-button type="primary" id="back-btn" @click="onBack">返回</el-button>
  </div>
</template>

<script setup>
import * as THREE from "@/editor/build/three.module.js"
import { APP } from "@/editor/js/libs/app.js"
import { VRButton } from "@/editor/examples/jsm/webxr/VRButton.js"
import { ManualUI } from "@/editor/js/ManualUI.js"
import { onMounted, reactive, ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import axios from "axios"

const router = useRouter()
const route = useRoute()

const manualid = route.params.manualid

window.THREE = THREE // Used by APP Scripts.
window.VRButton = VRButton // Used by APP Scripts.

// const loader = new THREE.FileLoader()
const player = new APP.Player()
const manualUI = new ManualUI(player)

onMounted(() => {
  axios
    .post("/getAManual", { id: manualid })
    .then((res) => {
      console.log(res.data)
      player.load(res.data)
      player.setSize(window.innerWidth, window.innerHeight)
      player.play()
      document.body.appendChild(player.dom)
      player.dom.style.position = "relative"
      player.dom.appendChild(manualUI.dom)
      window.addEventListener("resize", function () {
        player.setSize(window.innerWidth, window.innerHeight)
      })
    })
    .catch((res) => console.log(res))
})

function onBack() {
  axios
    .post("/getAManualInfo", { id: manualid })
    .then((res) => {
      const userid = res.data.userid
      router.replace({ path: `/profile/${userid}/manuals` })
    })
    .catch((res) => {
      console.log(res)
    })
}
</script>

<style scoped></style>
