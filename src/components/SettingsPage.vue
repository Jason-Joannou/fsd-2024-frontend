<template>
    <el-card class="box-card">
      <template v-slot:header>
        <span>Settings</span>
      </template>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="Username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Save Settings</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </template>
  
  <script>
  export default {
    name: 'SettingsPage',
    data() {
      return {
        form: {
          username: localStorage.getItem('username') || '',
          email: localStorage.getItem('email') || '',
        }
      };
    },
    methods: {
      onSubmit() {
        localStorage.setItem('username', this.form.username);
        localStorage.setItem('email', this.form.email);
        this.$message.success('Settings saved successfully!');
      }
    }
  };
  </script>
  
  <style scoped>
  .box-card {
    width: 100%;
  }
  </style>