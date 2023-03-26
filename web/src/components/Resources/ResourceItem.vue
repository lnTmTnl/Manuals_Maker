<template>
  <div id="resource-item">
    <el-checkbox-button :label="resource" @dblclick="resourceDblclick">
      <el-icon :size="20"
        ><component :is="resourceIcon(resource.type)"></component
      ></el-icon>
      <div class="resource-name ellipsis-hidden">{{ resource.name }}</div>
    </el-checkbox-button>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import {
  ArrowRight,
  Folder as IconFolder,
  Notebook as IconText,
  Document as IconUnknown,
  VideoPlay as IconVideo,
  Headset as IconMusic,
  Picture as IconImg,
  Box as IconModel,
} from "@element-plus/icons-vue"

const props = defineProps(["resource"])
const emit = defineEmits(["openResourceFile"])
const resource = props.resource

const resourceIcon = computed(() => (type) => {
  switch (type) {
    case "folder":
      return IconFolder
    case "text":
      return IconText
    case "video":
      return IconVideo
    case "music":
      return IconMusic
    case "img":
      return IconImg
    case "model":
      return IconModel
    default:
      return IconUnknown
  }
})

function resourceDblclick() {
  if (resource.type === "folder") {
    emit("openResourceFile", resource)
  }
}
</script>

<style scoped>
.resource-name {
  width: 50px;
}
</style>
