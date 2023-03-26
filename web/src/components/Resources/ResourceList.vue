<template>
  <div id="resource-list">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item
        v-for="(route, index) in resourceRoutes"
        :key="index"
        :to="{ path: '' }"
        @click="resourceBreadcrumbClick(index)"
        >{{ route }}</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-checkbox-group
      v-model="checkedResources"
      size="large"
      class="resource-group"
    >
      <ResourceItem
        v-for="resource in currentResources"
        :key="resource.name"
        :resource="resource"
        @openResourceFile="openResourceFile"
      ></ResourceItem>
    </el-checkbox-group>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import axios from "axios"
import ResourceItem from "@/components/Resources/ResourceItem.vue"

const props = defineProps(["userid", "currentResources"])
const emit = defineEmits([
  "resourceRoutesChanged",
  "currentResourcesChanged",
  "rootResourcesChanged",
])
const currentResources = ref([])
const checkedResources = ref([])
const resourceRoutes = ref(["root"])
let rootResources = [
  {
    name: "root",
    type: "folder",
    content: [],
  },
]
const model = ref({
  userid: props.userid,
})

onMounted(() => {
  axios
    .post("/getAResources", model.value)
    .then((res) => {
      //console.log(res.data.data)
      rootResources[0].content = res.data.data.content
      currentResources.value = rootResources[0].content

      emit("rootResourcesChanged", rootResources[0].content)
      emit("currentResourcesChanged", currentResources.value)
    })
    .catch((res) => {
      console.log(res)
    })
})

function openResourceFile(resource) {
  const name = resource.name
  const content = resource.content

  resourceRoutes.value.push(name)
  // currentResources.value = content

  emit("currentResourcesChanged", content)
  emit("resourceRoutesChanged", resourceRoutes)
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
  console.log(currentResources.value)

  emit("resourceRoutesChanged", resourceRoutes)
}
</script>

<style scoped>
.resource-group {
  display: flex;
}
</style>
