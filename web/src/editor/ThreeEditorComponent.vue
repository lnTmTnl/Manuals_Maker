<template>
  <div id="three-editor" ref="threeEditor">
    <div>
      <ViewPort :editor="editor"></ViewPort>
      <ToolBar :editor="editor"></ToolBar>
      <!-- <Player :editor="editor"></Player> -->
      <SideBar :editor="editor"></SideBar>
      <Script :editor="editor" ref="scriptComponent"></Script>
      <MenuBar :editor="editor" ref="menubar" @addStep="addStep"></MenuBar>
      <el-button type="primary" id="back-btn" @click="onBack">返回</el-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "@vue/runtime-core"
import { useRouter, useRoute } from "vue-router"
import * as THREE from "three"

import { Editor } from "./js/Editor.js"
// import { Viewport } from "./js/Viewport.js"
// import { Toolbar } from "./js/Toolbar.js"
// import { Script } from "./js/Script.js"
import { Player } from "./js/Player.js"
// import { Sidebar } from "./js/Sidebar.js"
// import { Menubar } from "./js/Menubar.js"
import { Resizer } from "./js/Resizer.js"
import { VRButton } from "three/addons/webxr/VRButton.js"

import ViewPort from "@/editor/components/ViewPort.vue"
import ToolBar from "@/editor/components/ToolBar.vue"
import Script from "@/editor/components/Script.vue"
// import Player from '@/editor/components/Player.vue'
import SideBar from "@/editor/components/SideBar.vue"
import MenuBar from "@/editor/components/MenuBar.vue"
import axios from "axios"

const threeEditor = ref(null)
const scriptComponent = ref(null)
const menubar = ref(null)

const editor = new Editor()

const router = useRouter()
const route = useRoute()

const userid = parseInt(route.params.userid)
const id = route.params.projectid
const stepnames = ref([])
const model = ref({
  id,
  userid,
  name: "",
  step: "",
  content: {},
})

onMounted(() => {
  window.URL = window.URL || window.webkitURL
  window.BlobBuilder =
    window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder

  Number.prototype.format = function () {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }

  //

  window.editor = editor // Expose editor to Console
  window.THREE = THREE // Expose THREE to APP Scripts and Console
  window.VRButton = VRButton // Expose VRButton to APP Scripts

  // const viewport = new Viewport(editor)
  // threeEditor.value.appendChild(viewport.dom)
  //document.body.appendChild(viewport.dom)

  // const toolbar = new Toolbar(editor)
  // threeEditor.value.appendChild(toolbar.dom)

  // const script = new Script(editor)
  // threeEditor.value.appendChild(script.dom)

  const player = new Player(editor)
  threeEditor.value.appendChild(player.dom)

  // const sidebar = new Sidebar(editor)
  // threeEditor.value.appendChild(sidebar.dom)

  // const menubar = new Menubar(editor)
  // threeEditor.value.appendChild(menubar.dom)

  const resizer = new Resizer(editor)
  threeEditor.value.appendChild(resizer.dom)

  //

  editor.storage.init(function () {
    axios
      .post("/getAProjectInfo", model.value)
      .then((res) => {
        if (res.data.state !== 0) {
          const data = res.data.data
          model.value.name = data.name
          stepnames.value = data.content
          model.value.step = stepnames.value[0]
          menubar.value.setSteps(stepnames.value, loadStep)
        }
      })
      .then(() => {
        loadStep(model.value.step)

        // axios.get("/getAStep/" + id + "/" + model.value.step).then((res) => {
        //   console.log(res)
        // })
      })
      .then(() => {
        // scriptComponent.value.injectBlocks()
        editor.signals.editScript.add(function (object, script) {
          scriptComponent.value.injectBlocks()
        })
      })

    // editor.storage.get(function (state) {
    //   if (isLoadingFromHash) return

    //   if (state !== undefined) {
    //     console.log(0, model.value.content)
    //     console.log(1, state)
    //     editor.fromJSON(state)
    //   }

    //   const selected = editor.config.getKey("selected")

    //   if (selected !== undefined) {
    //     editor.selectByUuid(selected)
    //   }
    // })

    //

    let timeout

    //保存项目
    function saveState() {
      if (editor.config.getKey("autosave") === false) {
        return
      }

      clearTimeout(timeout)

      timeout = setTimeout(function () {
        editor.signals.savingStarted.dispatch()

        timeout = setTimeout(function () {
          //editor.storage.set(editor.toJSON())
          const editorJSON = editor.toJSON()
          let editorJSONString = JSON.stringify(editorJSON, null, "\t")
          editorJSONString = editorJSONString.replace(
            /[\n\t]+([\d\.e\-\[\]]+)/g,
            "$1"
          )
          axios
            .post("/updateProjects", {
              id,
              userid,
              name: model.value.name,
              step: model.value.step,
              content: editorJSONString,
            })
            .then((res) => {
              console.log("saved")
            })
            .catch((res) => {
              console.log(res)
            })

          editor.signals.savingFinished.dispatch()
        }, 100)
      }, 1000)
    }

    const signals = editor.signals

    signals.geometryChanged.add(saveState)
    signals.objectAdded.add(saveState)
    signals.objectChanged.add(saveState)
    signals.objectRemoved.add(saveState)
    signals.materialChanged.add(saveState)
    signals.sceneBackgroundChanged.add(saveState)
    signals.sceneEnvironmentChanged.add(saveState)
    signals.sceneFogChanged.add(saveState)
    signals.sceneGraphChanged.add(saveState)
    signals.scriptChanged.add(saveState)
    signals.historyChanged.add(saveState)
  })

  //

  document.addEventListener("dragover", function (event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  })

  document.addEventListener("drop", function (event) {
    event.preventDefault()

    if (event.dataTransfer.types[0] === "text/plain") return // Outliner drop

    if (event.dataTransfer.items) {
      // DataTransferItemList supports folders

      editor.loader.loadItemList(event.dataTransfer.items)
    } else {
      editor.loader.loadFiles(event.dataTransfer.files)
    }
  })

  function onWindowResize() {
    editor.signals.windowResize.dispatch()
  }

  window.addEventListener("resize", onWindowResize)

  onWindowResize()

  //

  let isLoadingFromHash = false
  const hash = window.location.hash

  if (hash.slice(1, 6) === "file=") {
    const file = hash.slice(6)

    if (confirm("Any unsaved data will be lost. Are you sure?")) {
      const loader = new THREE.FileLoader()
      loader.crossOrigin = ""
      loader.load(file, function (text) {
        editor.clear()
        editor.fromJSON(JSON.parse(text))
      })

      isLoadingFromHash = true
    }
  }

  // ServiceWorker

  if ("serviceWorker" in navigator) {
    try {
      navigator.serviceWorker.register("/editor/sw.js")
    } catch (error) {}
  }
})

function addStep(newStepName) {
  const editor = new Editor()
  editor.clear()
  const editorJSON = editor.toJSON()
  let editorJSONString = JSON.stringify(editorJSON, null, "\t")
  editorJSONString = editorJSONString.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, "$1")
  axios
    .post("/updateProjects", {
      id,
      userid,
      name: model.value.name,
      step: newStepName,
      content: editorJSONString,
    })
    .then((res) => {
      stepnames.value.push(newStepName)
      menubar.value.setSteps(stepnames.value, loadStep)
      console.log("saved")
    })
    .catch((res) => {
      console.log(res)
    })
}

function loadStep(step) {
  axios.get("/getAStep/" + id + "/" + step).then((res) => {
    model.value.content = res.data
    model.value.step = step
    editor.clear()
    editor.fromJSON(res.data)
  })
}

function onBack() {
  router.replace({ path: `/profile/${userid}/projects` })
}
</script>

<style scoped>
#back-btn {
  z-index: 999;
  float: right;
}
</style>
