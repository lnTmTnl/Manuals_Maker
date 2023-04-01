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
      <el-button type="danger" @click="onDeleteClick">删除</el-button>

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
import { ElMessage, ElMessageBox } from "element-plus"
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
  getAResources()
})

const resourceRoutes = ref(["root"])

function getAResources() {
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
}

function openResourceFile(resource) {
  const name = resource.name
  const content = resource.content

  checkedResources.value = []

  resourceRoutes.value.push(name)
  currentResources.value = content
}

function updateResources() {
  model.value.content = rootResources[0].content
  axios
    .post("/updateResources", model.value)
    .then((res) => {
      console.log(res.data)
      getAResources()
    })
    .catch((res) => {
      console.log(res)
    })
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
  //console.log(loadResource(rootResources[0].content[0].content))

  let formData = new FormData()
  formData.append("userid", userid)
  formData.append("path", getFolderPathUrl())
  newFiles.forEach((file) => {
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
      updateResources()
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
  CurrentFolder.value.content.push({
    name,
    path: getFolderPathUrl(),
    type: "folder",
    content: [],
  })
  axios
    .post("/createNewFolder", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      updateResources()
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
  checkedResources.value = []
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

function onDeleteClick() {
  ElMessageBox.confirm("确认删除?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const filenames = checkedResources.value.map(
        (resource) => resource.path + "/" + resource.name
      )
      deleteResources(filenames)
    })
    .catch(() => {})
}

function deleteResources(filenames) {
  axios
    .delete("/deleteResource", { data: { filenames } })
    .then(function (res) {
      const CurrentFolder = findCurrentFolder()
      CurrentFolder.value.content = CurrentFolder.value.content.filter(
        (item) => !checkedResources.value.includes(item)
      )
      updateResources()
      getAResources()
    })
    .catch(function (error) {
      console.log(error)
    })
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
