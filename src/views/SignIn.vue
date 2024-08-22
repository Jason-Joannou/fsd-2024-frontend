<template>
  <el-container>
    <el-main>
      <el-row type="flex" justify="center" align="middle" class="form-row">
        <el-col :span="8">
          <el-card class="box-card">
            <h2 class="form-title">Sign In</h2>
            <el-form ref="form" :model="form" label-width="120px" class="sign-in-form">
              <el-form-item label="Username" class="form-item">
                <el-input v-model="form.username" placeholder="Enter your username"></el-input>
              </el-form-item>
              <el-form-item label="Password" class="form-item">
                <el-input type="password" v-model="form.password" placeholder="Enter your password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit" class="sign-in-button">Sign In</el-button>
              </el-form-item>
              <!-- Error Alert -->
              <el-alert
                v-if="errorMessage"
                type="error"
                :closable="false"
                title="Error"
                :description="errorMessage"
                class="error-alert"
              />
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignIn',
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      errorMessage: '', // To store error messages
    };
  },
  methods: {
    async onSubmit() {
      if (this.form.username && this.form.password) {
        try {
          const response = await axios.post('http://127.0.0.1:8080/login/', this.form);
          if (response.status === 200) {
            localStorage.setItem('username', this.form.username);
            this.$router.push({ name: 'FinancialDashboard' });
          }
        } catch (error) {
          if (error.response && error.response.data) {
            this.errorMessage = error.response.data.detail; // Show server error message
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.'; // Show a generic error message
          }
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
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
}

.box-card {
  margin-top: 20px;
  padding: 20px 30px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.box-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.form-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

.sign-in-form {
  max-width: 100%;
}

.form-item {
  margin-bottom: 20px;
}

.sign-in-button {
  width: 100%;
  font-size: 1rem;
  padding: 12px 0;
  border-radius: 8px;
}

.error-alert {
  margin-top: 20px;
}
</style>
