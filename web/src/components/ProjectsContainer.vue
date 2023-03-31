<template>
  <div id="projects-container">
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

const userid = route.params.userid
const model = ref({
  userid,
})

onMounted(() => {
  axios
    .post("/getAllProjects", model.value)
    .then((res) => {
      projectsData.value = res.data.data
    })
    .catch((res) => {
      console.log(res)
    })
})

function onEditClick(row) {
  const userid = row.userid
  const projectid = row.id
  router.replace({ name: "editor", params: { userid, projectid } })
}

function onDeleteClick(e) {
  console.log(e)
}
</script>

<style scoped></style>
