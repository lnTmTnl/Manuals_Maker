<template>
  <div id="manual-view">
    <el-table :data="manualsData" style="width: 100%; height: 100vh">
      <el-table-column fixed prop="id" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="operation" label="operation">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="onViewClick(scope.row)"
            >View</el-button
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
import * as THREE from "@/editor/build/three.module.js"
import { APP } from "@/editor/js/libs/app.js"
import { VRButton } from "@/editor/examples/jsm/webxr/VRButton.js"
import { onMounted, reactive, ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import axios from "axios"

const router = useRouter()
const route = useRoute()
const manualsData = ref()

const userid = route.params.userid
const model = ref({
  userid,
})

onMounted(() => {
  axios
    .post("/getAllManuals", model.value)
    .then((res) => {
      manualsData.value = res.data.data
    })
    .catch((res) => {
      console.log(res)
    })
})

function onViewClick(row) {
  const userid = row.userid
  const manualid = row.id
  router.replace({ name: "manual", params: { userid, manualid } })
}

function onDeleteClick(row) {
  const userid = row.userid
  const manualid = row.id
  console.log(userid, manualid)
}
</script>

<style scoped></style>
