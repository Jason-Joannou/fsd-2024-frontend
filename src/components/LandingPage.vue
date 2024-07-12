<!-- src/components/LandingPage.vue -->
<template>
    <el-container>
      <el-header>
        <Navbar />
      </el-header>
      <el-main>
        <el-row type="flex" justify="center" align="middle" class="landing-row">
          <el-col :span="12">
            <el-card class="box-card">
              <div class="card-content">
                <h1 class="welcome-message">Welcome to My App</h1>
                <p>This is a simple landing page created using Element Plus.</p>
                <el-button type="primary" @click="navigateTo('signin')">Sign In</el-button>
                <el-button type="success" @click="navigateTo('signup')">Sign Up</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </template>
  
  <script>
  
  export default {
    name: 'LandingPage',
    methods: {
      navigateTo(page) {
        this.$router.push({ path: `/${page}` });
      }
    }
  };
  </script>
  
  <style scoped>
  .landing-row {
    height: calc(100vh - 60px);
  }
  .box-card {
    margin-top: 20px;
  }
  .welcome-message {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 1rem;
  }
  .card-content {
    text-align: center;
  }
  </style>