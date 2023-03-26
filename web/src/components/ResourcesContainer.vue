<template>
  <div id="resources-container">
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item
        v-for="(route, index) in resourceRoutes"
        :key="index"
        :to="{ path: '' }"
        @click="resourceBreadcrumbClick(index)"
        >{{ route }}</el-breadcrumb-item
      >
    </el-breadcrumb>

    <!-- 按钮栏 -->
    <el-row id="btn-bar">
      <el-button type="primary" @click="uploadDialogVisible = true"
        >上传</el-button
      >
      <el-button type="primary" @click="createFolderDialogVisible = true"
        >新建</el-button
      >

      <!-- 新建目录对话框 -->
      <el-dialog
        id="createFolderDialog"
        v-model="createFolderDialogVisible"
        title="Create Folder"
        width="30%"
      >
        <el-input
          v-model="newFolderName"
          placeholder="new folder name"
        ></el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="() => confirmCreateFolderDialog(false)"
              >Cancel</el-button
            >
            <el-button
              type="primary"
              @click="() => confirmCreateFolderDialog(true)"
            >
              Confirm
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-row>

    <!-- 上传文件对话框 -->
    <UploadDialog
      :visible="uploadDialogVisible"
      @closeDialog="uploadDialogVisible = false"
      @uploadResources="uploadResources"
    ></UploadDialog>

    <!-- 资源列表 -->
    <div id="resource-list">
      <el-checkbox-group
        v-model="checkedResources"
        size="large"
        class="resource-group"
      >
        <ResourceItem
          v-for="resource in currentResources"
          :key="resource"
          :resource="resource"
          @openResourceFile="openResourceFile"
        ></ResourceItem>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import { ElMessage } from "element-plus"
import axios from "axios"
import ResourceItem from "@/components/Resources/ResourceItem.vue"
import UploadDialog from "@/components/Resources/UploadDialog.vue"
import {} from "@/js/resources/loadResource.js"

const router = useRouter()
const route = useRoute()

const uploadDialogVisible = ref(false)
const createFolderDialogVisible = ref(false)

const checkedResources = ref([])

let rootResources = [
  {
    name: "root",
    type: "folder",
    content: [],
  },
]

const currentResources = ref([])

const userid = route.params.userid
const model = ref({
  userid,
})

onMounted(() => {
  axios
    .post("/getAResources", model.value)
    .then((res) => {
      //console.log(res.data.data)
      rootResources[0].content = res.data.data.content
      currentResources.value = rootResources[0].content
    })
    .catch((res) => {
      console.log(res)
    })
})

const resourceRoutes = ref(["root"])

function openResourceFile(resource) {
  const name = resource.name
  const content = resource.content

  resourceRoutes.value.push(name)
  currentResources.value = content
}

function uploadResources(newFiles) {
  const CurrentFolder = findCurrentFolder()
  // console.log(resourceRoutes.value)
  newFiles.forEach((file) => {
    CurrentFolder.value.content.push(file)
  })
  // CurrentFolder.value.content = CurrentFolder.value.content.concat(newFiles)
  // console.log(CurrentFolder.value)
  // currentResources.value = currentResources.value.concat(newFiles)
  // console.log(newFiles)
  console.log(rootResources[0])
  //console.log(loadResource(rootResources[0].content[0].content))
  model.value.content = rootResources[0].content
  let formData = new FormData()
  formData.append("userid", userid)
  formData.append("path", getFolderPathUrl())
  newFiles.forEach((file) => {
    console.log(file.content)
    formData.append("file", file.content)
  })
  axios
    .post("/uploadResources", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      newFiles.forEach((file) => {
        file.path = res.data
      })
      axios
        .post("/updateResources", model.value)
        .then((res) => {
          console.log(res.data)
        })
        .catch((res) => {
          console.log(res)
        })
    })
    .catch((res) => {
      console.log(res)
    })
  uploadDialogVisible.value = false
}

const newFolderName = ref("")

function createFolder(name) {
  const CurrentFolder = findCurrentFolder()
  console.log(CurrentFolder.value)
  const newPath = getFolderPathUrl() + "/" + name
  let formData = new FormData()
  formData.append("path", newPath)
  // currentResources.value.push({ name, type: "folder", content: [] })
  CurrentFolder.value.content.push({ name, type: "folder", content: [] })
  axios
    .post("/createNewFolder", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log("uploaded")
    })
    .catch((res) => {
      console.log(res)
    })
}

function confirmCreateFolderDialog(flag) {
  if (flag) {
    let isRepeated = false
    currentResources.value.forEach((resource) => {
      if (resource.name === newFolderName.value) {
        isRepeated = true
      }
    })
    if (isRepeated) {
      ElMessage.error("Repeated name!")
    } else {
      createFolder(newFolderName.value)
      createFolderDialogVisible.value = false
      newFolderName.value = ""
    }
  } else {
    createFolderDialogVisible.value = false
    newFolderName.value = ""
  }
}

function resourceBreadcrumbClick(index) {
  resourceRoutes.value.splice(index + 1)
  const targetFolder = ref()
  let current_folder = rootResources
  resourceRoutes.value.forEach((route) => {
    targetFolder.value = current_folder.find(
      (resource) => resource.name === route
    )
    if (targetFolder.value !== null) {
      current_folder = targetFolder.value.content
    }
  })
  currentResources.value = targetFolder.value.content
}

function findCurrentFolder() {
  const targetFolder = ref()
  let current_folder = rootResources
  resourceRoutes.value.forEach((route) => {
    targetFolder.value = current_folder.find(
      (resource) => resource.name === route
    )
    if (targetFolder.value !== null) {
      current_folder = targetFolder.value.content
    }
  })
  return targetFolder
}

function getFolderPathUrl() {
  const url = resourceRoutes.value
    .slice(1)
    .reduce((pre, cur) => pre + "/" + cur, "/" + userid)
  console.log(url)
  return url
}

defineExpose({
  checkedResources,
})
</script>

<style scoped>
.resource-group {
  display: flex;
}
</style>
