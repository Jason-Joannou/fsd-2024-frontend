<!-- src/App.vue -->
<template>
  <el-container style="height: 100vh;">
    <router-view />
  </el-container>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
/* Add any global styles here */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>