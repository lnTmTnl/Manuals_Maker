<template>
  <div id="manual-view" ref="manualView">
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

const manualView = ref(null)
const router = useRouter()
const route = useRoute()

const manualid = route.params.manualid

window.THREE = THREE // Used by APP Scripts.
window.VRButton = VRButton // Used by APP Scripts.

const player = new APP.Player()
const manualUI = new ManualUI(player)

onMounted(() => {
  axios
    .get("/getAManual/" + manualid)
    .then((res) => {
      player.initJson = res.data.data
      player.load(res.data.data)
      player.setSize(window.innerWidth, window.innerHeight)
      player.play()

      manualUI.setSteps(res.data.stepnames)
      manualUI.loadStep(0)

      manualView.value.appendChild(player.dom)
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
    .get("/getAManualInfo/" + manualid)
    .then((res) => {
      const userid = res.data.userid
      router.replace({ path: `/profile/${userid}/manuals` })
    })
    .catch((res) => {
      console.log(res)
    })
}
</script>

<style>
.uiBtn {
  position: absolute;
  color: #fff;
  background-color: #0006;
  font-size: 18px;
  line-height: 18px;
}

.uiBtn:focus {
  background-color: #0006;
}

.separateBtn,
.recoverBtn {
  width: 60px;
  height: 30px;
  bottom: 35px;
}

.separateBtn {
  left: 25%;
}

.recoverBtn {
  right: 25%;
}

.preStepBtn,
.nextStepBtn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  top: 50%;
}

.preStepBtn {
  left: 5px;
}

.nextStepBtn {
  right: 5px;
}

.stepSelect {
  position: absolute;
  top: 5px;
  left: 50%;
  text-align: center;
  font-size: 20px;
  background-color: #0006 !important;
  color: #fff;
  width: 160px;
  height: 40px;
  margin-left: -80px;
  text-transform: none;
}
</style>
