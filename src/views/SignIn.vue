<template>
  <el-container>
    <el-main>
      <el-row type="flex" justify="center" align="middle" class="form-row">
        <el-col :span="8">
          <el-card class="box-card">
            <h2>Sign In</h2>
            <el-form ref="form" :model="form" label-width="120px">
              <el-form-item label="Username">
                <el-input v-model="form.username"></el-input>
              </el-form-item>
              <el-form-item label="Password">
                <el-input type="password" v-model="form.password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">Sign In</el-button>
              </el-form-item>
              <!-- Error Alert -->
              <el-alert v-if="errorMessage" type="error" :closable="false" title="Error" :description="errorMessage" />
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SignIn',
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      errorMessage: '', // To store error messages
    }
  },
  methods: {
    async onSubmit() {
      if (this.form.username && this.form.password) {
        try {
          const response = await axios.post('http://127.0.0.1:8080/login/', this.form)
          if (response.status === 200) {
            localStorage.setItem('username', this.form.username)
            this.$router.push({ name: 'FinancialDashboard' })
          }
        } catch (error) {
          if (error.response && error.response.data) {
            this.errorMessage = error.response.data.detail; // Show server error message
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.'; // Show a generic error message
          }
        }
      } else {
        alert('Please fill in all fields.')
      }
    },
  },
}
</script>

<style scoped>
.form-row {
  height: calc(100vh - 60px);
}
.box-card {
  margin-top: 50px;
}
</style>