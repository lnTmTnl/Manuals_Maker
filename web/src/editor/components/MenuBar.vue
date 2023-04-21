<template>
  <div id="menubar-container">
    <div ref="menubarContainer"></div>
    <el-dialog title="Import" v-model="importDisplay" width="800px">
      <div>
        <ResourcesContainer ref="resourcesContainer"></ResourcesContainer>
      </div>
      <div slot="footer">
        <el-button @click="importDisplay = false">取 消</el-button>
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
    <slot></slot>
  </div>
</template>

<script setup>
import { Menubar } from "@/editor/js/Menubar.js"
import { ref } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"
import { useRoute } from "vue-router"
import ResourcesContainer from "@/components/ResourcesContainer.vue"
import axios from "axios"
import utf8 from "utf8"

const route = useRoute()
const userid = route.params.userid

const menubarContainer = ref(null)
const resourcesContainer = ref(null)
const props = defineProps(["editor"])
const menubar = new Menubar(props.editor)
const importDisplay = menubar.menubarFile.importDisplay
const publishDisplay = menubar.menubarFile.publishDisplay
const publishName = ref("")

function importConfirmed() {
  const checkedResources = resourcesContainer.value.checkedResources
  checkedResources.forEach((resource) => {
    if (resource.type === "model") {
      axios
        .get("/getFile" + resource.path + "/" + resource.name, {
          responseType: "blob",
        })
        .then((res) => {
          const data = res.data
          const objFile = new File([data], resource.name)
          props.editor.loader.loadFiles([objFile])
          importDisplay.value = false
        })
        .catch((res) => {
          console.log(res)
        })
    }
  })
}

function publishConfirmed() {
  publishDisplay.value = false

  let output = props.editor.toJSON()
  output.metadata.type = "App"
  delete output.history

  output = JSON.stringify(output, null, "\t")
  output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, "$1")

  const path = "/" + userid
  console.log(publishName.value)

  axios
    .post("/onlinePublish", {
      userid,
      path,
      name: publishName.value,
      content: output,
    })
    .then((res) => {
      console.log(res.data)
    })
    .catch((res) => console.log(res))
}

onMounted(() => {
  menubarContainer.value.appendChild(menubar.dom)
})

defineExpose({
  setSteps: menubar.menubarSteps.setSteps,
})
</script>

<style scoped></style>
