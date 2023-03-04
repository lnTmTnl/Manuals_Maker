<template>
  <div id="sider-nav">
    <el-checkbox-button v-model="isExpand">
      <el-icon><icon-menu /></el-icon>
    </el-checkbox-button>
    <el-menu
      default-active="projects"
      class="el-menu-vertical-demo"
      :collapse="!isExpand"
      :router="true"
    >
      <el-menu-item index="projects">
        <el-icon><Box /></el-icon>
        <template #title>Projects</template>
      </el-menu-item>
      <el-menu-item index="manuals">
        <el-icon><Reading /></el-icon>
        <template #title>Manuals</template>
      </el-menu-item>
      <el-menu-item index="account">
        <el-icon><User /></el-icon>
        <template #title>Account</template>
      </el-menu-item>
      <el-menu-item index="settings">
        <el-icon><Setting /></el-icon>
        <template #title>Settings</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { ref } from "vue"
import {
  Menu as IconMenu,
  Box,
  Reading,
  User,
  Setting,
} from "@element-plus/icons-vue"

const isExpand = ref(true)
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100vh;
}
</style>
