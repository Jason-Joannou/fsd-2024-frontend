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
          <el-menu-item index="welcome"><i class="el-icon-menu"></i>Home</el-menu-item>
          <el-menu-item index="dashboard"><i class="el-icon-menu"></i>Dashboard</el-menu-item>
          <el-menu-item index="data-info"><i class="el-icon-menu"></i>Data Information</el-menu-item>
          <el-menu-item index="machine-learning"><i class="el-icon-menu"></i>Machine Learning</el-menu-item>
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
            <div>Machine Learning content goes here.</div>
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

export default {
  name: 'FinancialDashboard',
  data() {
    return {
      username: localStorage.getItem('username') || '', // Retrieve stored username
      currentView: 'dashboard', // Default view
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
    DashBoard
  }
};
</script>

<style scoped>
.header {
  background-color: #324057; /* Change to suit your theme */
  color: white;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  height: 64px; /* ensure the header height matches the elements */
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
}

.navbar-right {
  justify-content: flex-end;
}

.signout-button,
.settings-button {
  margin-left: 12px;
}

.aside {
  background-color: #f0f2f5;
}

.main-content {
  padding: 20px;
  background-color: #f9f9f9;
}

.footer {
  text-align: center;
  padding: 10px 0;
  background-color: #324057;
  color: white;
}

.box-card {
  margin-bottom: 20px;
}
</style>
