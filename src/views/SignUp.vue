<!-- src/views/SignUp.vue -->
<template>
    <el-container>
      <el-header>
        <Navbar />
      </el-header>
      <el-main>
        <el-row type="flex" justify="center" align="middle" class="form-row">
          <el-col :span="8">
            <el-card class="box-card">
              <h2>Sign Up</h2>
              <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="Email">
                  <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="Name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="Password">
                  <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">Sign Up</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </template>
  
  <script>
  
  export default {
    name: 'SignUp',
    data() {
      return {
        form: {
          email: '',
          name: '',
          password: '',
        },
      };
    },
    methods: {
      async onSubmit() {
        if (this.form.email && this.form.name && this.form.password) {
          try {
            const response = await this.$axios.post('/api/signup', this.form);
            if (response.status === 200) {
              this.$router.push({ name: 'FinancialDashboard' });
            }
          } catch (error) {
            console.error('There was an error signing up:', error);
          }
        } else {
          alert('Please fill in all fields.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .form-row {
    height: calc(100vh - 60px);
  }
  .box-card {
    margin-top: 50px;
  }
  </style>