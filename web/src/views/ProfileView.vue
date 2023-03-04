<template>
  <div id="profile-view">
    <SiderNavComponent></SiderNavComponent>
    <div id="main-container" style="width: 100%">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import SiderNavComponent from "@/components/SiderNavComponent.vue"
</script>

<style scoped>
#profile-view {
  display: flex;
}

#main-container {
  width: 100%;
}
</style>
