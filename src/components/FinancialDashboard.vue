<template>
  <el-container>
    <!-- Header -->
    <el-header class="header">
      <div class="navbar">
        <div class="navbar-left">
          <span class="navbar-text">Welcome, {{ username }}!</span>
        </div>
        <div class="navbar-right">
          <el-button type="danger" @click="onSignOut" class="signout-button">Sign Out</el-button>
        </div>
      </div>
    </el-header>

    <el-container>
      <!-- Aside -->
      <el-aside width="200px" class="aside">
        <el-menu :default-active="currentView" class="el-menu-vertical-demo" @select="handleMenuSelect">
          <el-menu-item index="welcome"><i class="el-icon-house"></i>Home</el-menu-item>
          <el-menu-item index="dashboard"><i class="el-icon-s-data"></i>Dashboard</el-menu-item>
          <el-menu-item index="data-info"><i class="el-icon-document"></i>Data Information</el-menu-item>
          <el-menu-item index="machine-learning"><i class="el-icon-s-opportunity"></i>Machine Learning</el-menu-item>
          <el-menu-item index="settings"><i class="el-icon-setting"></i>Settings</el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Main content -->
      <el-main class="main-content">
        <div v-if="currentView === 'welcome'">
          <HomePage />
        </div>
        <div v-else-if="currentView === 'dashboard'">
          <DashBoard />
        </div>
        <div v-else-if="currentView === 'data-info'">
          <DataInformation />
        </div>
        <div v-else-if="currentView === 'machine-learning'">
          <el-card class="box-card">
            <MachineLearningPage />
          </el-card>
        </div>
        <div v-else-if="currentView === 'settings'">
          <SettingsPage />
        </div>
      </el-main>
    </el-container>

    <!-- Footer -->
    <el-footer class="footer">
      &copy; 2023 My Financial Dashboard
    </el-footer>
  </el-container>
</template>

<script>
import SettingsPage from './SettingsPage.vue';
import HomePage from './HomePage.vue';
import DataInformation from './DataInformation.vue';
import DashBoard from './DashBoard.vue';
import MachineLearningPage from './MachineLearningPage.vue';

export default {
  name: 'FinancialDashboard',
  data() {
    return {
      username: localStorage.getItem('username') || '', // Retrieve stored username
      currentView: 'welcome', // Default view
    };
  },
  methods: {
    onSignOut() {
      // Handle sign out logic here (e.g., clear authentication tokens, redirect to sign-in page)
      localStorage.removeItem('username'); // Clear username from local storage
      this.$router.push({ name: 'SignIn' });
    },
    handleMenuSelect(index) {
      this.currentView = index;
    }
  },
  components: {
    SettingsPage,
    HomePage,
    DataInformation,
    DashBoard,
    MachineLearningPage
  }
};
</script>

<style scoped>
.header {
  background-color: #34495e;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.navbar-left, .navbar-right {
  display: flex;
  align-items: center;
}

.navbar-text {
  font-size: 18px;
  font-weight: 500;
}

.navbar-right {
  justify-content: flex-end;
}

.signout-button {
  margin-left: 12px;
}

.aside {
  background-color: #2c3e50;
  color: white;
  padding-top: 20px;
}

.el-menu-vertical-demo {
  background-color: transparent;
}

.el-menu-item {
  color: white;
  font-weight: 500;
}

.el-menu-item:hover, .el-menu-item.is-active {
  background-color: #1abc9c !important;
  color: white !important;
}

.main-content {
  padding: 20px;
  background-color: #ecf0f1;
}

.footer {
  text-align: center;
  padding: 10px 0;
  background-color: #34495e;
  color: white;
  border-top: 1px solid #eaeaea;
}

.box-card {
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 20px;
  transition: transform 0.3s ease;
}

.box-card:hover {
  transform: translateY(-5px);
}

.el-button--danger {
  background-color: #e74c3c;
  border-color: #e74c3c;
  color: white;
}

.el-button--danger:hover {
  background-color: #c0392b;
  border-color: #c0392b;
}
</style>