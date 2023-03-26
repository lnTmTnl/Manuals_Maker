<template>
  <el-dialog v-model="props.visible" title="Upload" width="30%">
    <el-upload
      v-model:file-list="fileList"
      class="upload-demo"
      drag
      action=""
      :auto-upload="false"
      :on-change="onUploadChange"
      multiple
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="uploadResources"> Upload </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { UploadFilled } from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"
import { ref } from "vue"
import { judgeResourceType } from "@/js/resources/judgeResourceType.js"

const props = defineProps(["visible"])
const emit = defineEmits(["closeDialog, uploadResources"])

const closeDialog = () => {
  emit("closeDialog")
}

const fileList = ref([])

const reader = new FileReader()

function onUploadChange(file) {
  console.log(file.raw)
  const filename = file.raw.name
  const extension = filename.split(".").pop().toLowerCase()
}

function uploadResources() {
  const newFiles = fileList.value.map((file) => {
    const fileName = file.raw.name

    const fileType = judgeResourceType(fileName)
    return { name: fileName, type: fileType, content: file.raw }
  })
  emit("uploadResources", newFiles)
}
</script>

<style scoped></style>
