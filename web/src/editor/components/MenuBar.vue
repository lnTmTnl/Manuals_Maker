<template>
  <div id="menubar-container" ref="menubarContainer">
    <el-dialog title="Import" v-model="importDisplay" width="800px">
      <div>
        <ResourcesContainer ref="resourcesContainer"></ResourcesContainer>
      </div>
      <div slot="footer">
        <el-button @click="importDisplay = false">取 消</el-button>
        <el-button type="primary" @click="importConfirmed">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { Menubar } from "@/editor/js/Menubar.js"
import { ref } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"
import ResourcesContainer from "@/components/ResourcesContainer.vue"
import axios from "axios"

const menubarContainer = ref(null)
const resourcesContainer = ref(null)
const props = defineProps(["editor"])
const menubar = new Menubar(props.editor)
const importDisplay = menubar.menubarFile.importDisplay

function importConfirmed() {
  const checkedResources = resourcesContainer.value.checkedResources
  checkedResources.forEach((resource) => {
    if (resource.type === "model") {
      axios
        .post("/getFile", { path: resource.path, filename: resource.name })
        .then((res) => {
          const data = res.data
          const objFile = new File([data], "model.obj")
          props.editor.loader.loadFiles([objFile])
        })
        .catch((res) => {
          console.log(res)
        })
    }
  })
}

onMounted(() => {
  menubarContainer.value.appendChild(menubar.dom)
})
</script>

<style scoped></style>
