<template>
  <!-- <router-view></router-view> -->
  <EditView></EditView>
</template>

<script setup>
import EditView from "@/views/EditView.vue"
import { RouterLink, RouterView } from "vue-router"
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
}
</style>
