<!-- src/components/Navbar.vue -->
<template>
    <el-header>
      <el-row>
        <el-col :span="24">
          <el-menu
            class="el-menu-demo"
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="1">
              <router-link to="/">Home</router-link>
            </el-menu-item>
            <el-menu-item index="2">
              <router-link to="/signin">Sign In</router-link>
            </el-menu-item>
            <el-menu-item index="3">
              <router-link to="/signup">Sign Up</router-link>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-header>
  </template>
  
  <script>
  export default {
    name: 'NavBar'
  };
  </script>
  
  <style scoped>
  .el-menu-demo {
    line-height: 60px;
  }
  </style>