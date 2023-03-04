<template>
  <div id="projects-container">
    <el-table :data="tableData" style="width: 100%; height: 100vh">
      <el-table-column fixed prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="operation" label="operation"
        ><el-button link type="primary" size="small" @click="onEditClick"
          >Edit</el-button
        >
        <el-button link type="primary" size="small" @click="onDeleteClick"
          >Delete</el-button
        ></el-table-column
      >
    </el-table>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()
const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    operation: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    state: "California",
    operation: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    state: "California",
    operation: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    state: "California",
    operation: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-08",
    name: "Tom",
    state: "California",
    operation: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-06",
    name: "Tom",
    state: "California",
    operation: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
  {
    date: "2016-05-07",
    name: "Tom",
    state: "California",
    operation: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
  },
]

const userid = route.params.userid

function onEditClick(e) {
  router.replace({ name: "editor", params: { userid } })
}

function onDeleteClick(e) {
  console.log(e)
}
</script>

<style scoped></style>
