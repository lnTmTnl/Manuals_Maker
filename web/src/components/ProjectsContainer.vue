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

      <!--  -->
    </el-row>
    <el-table
      :data="projectsData"
      :default-sort="{ prop: 'date', order: 'descending' }"
      style="width: 100%; height: 100vh"
    >
      <el-table-column prop="id" label="ID" v-if="false" />
      <el-table-column fixed prop="date" label="Date" sortable />
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
          <el-button
            link
            type="primary"
            size="small"
            @click="onDeleteClick(scope.row)"
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
import { ElMessageBox } from "element-plus"
import { Editor } from "@/editor/js/Editor.js"
import { formatteDate } from "@/js/utilsTools.js"
import axios from "axios"
import { v1 as uuidv1 } from "uuid"

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
        .map((item) => {
          return { ...item, date: formatteDate(item.date) }
        })
        .sort((a, b) => {
          if (a.date < b.date) {
            return 1
          } else if (a.date > b.date) {
            return -1
          } else {
            return 0
          }
        })
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

function onDeleteClick(row) {
  const userid = row.userid
  const projectid = row.id
  ElMessageBox.confirm("确认删除?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteProject(projectid)
    })
    .catch(() => {})
}

function createProject() {
  if (newProjectName.value.length === 0) return
  const projectid = uuidv1()
  const newEditor = new Editor()
  newEditor.clear()
  const editorJSON = newEditor.toJSON()
  let editorJSONString = JSON.stringify(editorJSON, null, "\t")
  editorJSONString = editorJSONString.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, "$1")
  axios
    .post("/updateProjects", {
      id: projectid,
      name: newProjectName.value,
      userid: userid,
      content: editorJSONString,
    })
    .then((res) => {
      getAllProjects()
      createProjectVisible.value = false
    })
    .catch((res) => {
      console.log(res)
    })
}

function deleteProject(projectid) {
  axios
    .delete("/deleteProject", { data: { id: projectid, userid } })
    .then((res) => {
      console.log(res)
      getAllProjects()
    })
    .catch((res) => {
      console.log(res)
    })
}
</script>

<style scoped></style>
