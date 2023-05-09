<template>
  <div id="menubar-container">
    <div ref="menubarContainer"></div>
    <el-dialog title="Import" v-model="importDisplay" width="800px">
      <div>
        <ResourcesContainer ref="resourcesContainer"></ResourcesContainer>
      </div>
      <div slot="footer">
        <el-button @click="importCancelled">取 消</el-button>
        <el-button type="primary" @click="importConfirmed">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="publishDisplay" title="Shipping address">
      <el-input v-model="publishName" autocomplete="off" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="publishDisplay = false">取 消</el-button>
          <el-button type="primary" @click="publishConfirmed">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="addStepDisplay" title="Shipping address">
      <el-input v-model="newStepName" autocomplete="off" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addStepDisplay = false">取 消</el-button>
          <el-button type="primary" @click="addStepConfirmed">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <slot></slot>
  </div>
</template>

<script setup>
import { Menubar } from "@/editor/js/Menubar.js"
import { ref } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"
import { useRoute } from "vue-router"
import { Editor } from "@/editor/js/Editor.js"
import ResourcesContainer from "@/components/ResourcesContainer.vue"
import axios from "axios"
import utf8 from "utf8"

const route = useRoute()
const id = route.params.projectid
const userid = route.params.userid

const menubarContainer = ref(null)
const resourcesContainer = ref(null)
const props = defineProps(["editor"])
const menubar = new Menubar(props.editor)

const importDisplay = ref(false)
// document.importDisplay = importDisplay

const publishDisplay = menubar.menubarFile.publishDisplay
const addStepDisplay = menubar.menubarSteps.addStepDisplay

const publishName = ref("")
const newStepName = ref("")

let targetFileLoader = null

const emit = defineEmits(["addStep"])

function displayResources(loader) {
  importDisplay.value = true
  targetFileLoader = loader
}

document.displayResources = displayResources

function importConfirmed() {
  const checkedResources = resourcesContainer.value.checkedResources
  // checkedResources.forEach((resource) => {
  //   if (resource.type === "model") {
  //     axios
  //       .get("/getFile" + resource.path + "/" + resource.name, {
  //         responseType: "blob",
  //       })
  //       .then((res) => {
  //         const data = res.data
  //         const objFile = new File([data], resource.name)
  //         props.editor.loader.loadFile(objFile)
  //         importDisplay.value = false
  //       })
  //       .catch((res) => {
  //         console.log(res)
  //       })
  //   }
  // })

  // const resource = checkedResources[0]
  checkedResources.forEach((resource) => {
    axios
      .get("/getFile" + resource.path + "/" + resource.name, {
        responseType: "blob",
      })
      .then((res) => {
        const data = res.data
        const objFile = new File([data], resource.name)
        targetFileLoader(objFile)
      })
      .catch((res) => {
        console.log(res)
      })
  })
  importDisplay.value = false
  checkedResources.length = 0
}

function importCancelled() {
  const checkedResources = resourcesContainer.value.checkedResources
  importDisplay.value = false
  checkedResources.length = 0
}

function publishConfirmed() {
  publishDisplay.value = false

  let output = props.editor.toJSON()
  output.metadata.type = "App"
  delete output.history

  output = JSON.stringify(output, null, "\t")
  output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, "$1")

  axios
    .post("/onlinePublish", {
      projectid: id,
      userid,
      name: publishName.value,
      content: output,
    })
    .then((res) => {
      // console.log(res.data)
    })
    .catch((res) => console.log(res))
}

function addStepConfirmed() {
  addStepDisplay.value = false
  emit("addStep", newStepName.value)
}

onMounted(() => {
  menubarContainer.value.appendChild(menubar.dom)
})

defineExpose({
  setSteps: menubar.menubarSteps.setSteps,
})
</script>

<style scoped></style>
