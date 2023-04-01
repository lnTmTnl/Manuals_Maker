<template>
  <div id="projects-container">
    <el-row id="btn-bar">
      <el-button type="primary" @click="createProjectVisible = true"
        >新建</el-button
      >

      <!-- 新建工程对话框 -->
      <el-dialog
        id="createProjectDialog"
        v-model="createProjectVisible"
        title="Create Project"
        width="30%"
      >
        <el-input
          v-model="newProjectName"
          placeholder="new Project name"
        ></el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="createProjectVisible = false">Cancel</el-button>
            <el-button type="primary" @click="createProject">
              Confirm
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-row>
    <el-table :data="projectsData" style="width: 100%; height: 100vh">
      <el-table-column fixed prop="id" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="operation" label="operation">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="onEditClick(scope.row)"
            >Edit</el-button
          >
          <el-button link type="primary" size="small" @click="onDeleteClick"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import axios from "axios"

const router = useRouter()
const route = useRoute()
const projectsData = ref()

const createProjectVisible = ref(false)
const newProjectName = ref("")

const userid = route.params.userid
const model = ref({
  userid,
})

onMounted(() => {
  getAllProjects()
})

function getAllProjects() {
  axios
    .post("/getAllProjects", model.value)
    .then((res) => {
      projectsData.value = res.data.data
    })
    .catch((res) => {
      console.log(res)
    })
}

function onEditClick(row) {
  const userid = row.userid
  const projectid = row.id
  router.replace({ name: "editor", params: { userid, projectid } })
}

function onDeleteClick(e) {
  console.log(e)
}

function createProject() {}
</script>

<style scoped></style>
