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
          <el-card class="box-card">
            <div>Welcome to your financial dashboard.</div>
          </el-card>
          <el-card class="box-card" style="margin-top: 20px;">
            <template v-slot:header>
              <div class="chart-header">
                <span>Chart selection</span>
                <el-select v-model="selectedGraph" placeholder="Select a graph" @change="onGraphSelect" class="graph-select">
                  <el-option v-for="option in graphOptions" :key="option.endpoint" :label="option.name" :value="option.endpoint">
                  </el-option>
                </el-select>
              </div>
            </template>
            <div v-if="selectedGraph">
              <el-select v-if="showCoinSelect" v-model="selectedCoins" multiple placeholder="Select coins" class="coin-select">
                <el-option :label="'All'" :value="'all'"></el-option>
                <el-option v-for="coin in coinOptions" :key="coin" :label="coin" :value="coin">
                </el-option>
              </el-select>
              <el-input v-if="showWindowInput" v-model="windowInput" type="number" placeholder="Enter window size" class="window-input"></el-input>
              <el-button type="primary" @click="fetchGraphData">Fetch Data</el-button>
            </div>
            <div v-if="graphData">
              <PlotlyChart :data="graphData.data" :layout="graphData.layout" />
            </div>
          </el-card>
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
import axios from 'axios';
import SettingsPage from './SettingsPage.vue';
import HomePage from './HomePage.vue';
import DataInformation from './DataInformation.vue';
import PlotlyChart from './PlotlyChart.vue';

export default {
  name: 'FinancialDashboard',
  data() {
    return {
      username: localStorage.getItem('username') || '', // Retrieve stored username
      currentView: 'dashboard', // Default view
      selectedGraph: '', // No default graph type
      selectedCoins: [], // Selected coins
      windowInput: null, // Input for the window parameter
      graphData: null, // Data for the selected graph
      graphOptions: [], // Options for the graph dropdown
      coinOptions: [], // Options for the coin dropdown
      showCoinSelect: false, // Flag to show/hide coin select
      showWindowInput: false // Flag to show/hide window input
    };
  },
  created() {
    this.fetchGraphOptions();
    this.fetchCoinOptions();
  },
  methods: {
    async fetchGraphOptions() {
      try {
        const response = await axios.get('http://127.0.0.1:8080/available_analyses');
        if (response.data.transaction_state === 200) {
          this.graphOptions = response.data.data;
        } else {
          console.error('Error fetching graph options:', response.data.error);
        }
      } catch (error) {
        console.error('API call error:', error);
      }
    },
    async fetchCoinOptions() {
      try {
        const response = await axios.get('http://127.0.0.1:8080/get_coin_names');
        if (response.data.transaction_state === 200) {
          this.coinOptions = JSON.parse(response.data.data).map(coin => coin.Name);
        } else {
          console.error('Error fetching coin options:', response.data.error);
        }
      } catch (error) {
        console.error('API call error:', error);
      }
    },
    onGraphSelect(value) {
      this.selectedGraph = value;
      this.resetInputFields();

      // Show/hide input fields based on selected graph
      if (value === '/daily_price_change' || value === '/daily_price_range' || value === '/correlation_analysis') {
        this.showCoinSelect = true;
      } else if (value === '/moving_averages') {
        this.showCoinSelect = true;
        this.showWindowInput = true;
      }
    },
    resetInputFields() {
      this.selectedCoins = [];
      this.windowInput = null;
      this.showCoinSelect = false;
      this.showWindowInput = false;
    },
    handleAllCoinsSelection() {
      if (this.selectedCoins.includes('all')) {
        // Only set selectedCoins to all if 'all' is not already selected
        if (this.selectedCoins.length === 1) {
          this.selectedCoins = [...this.coinOptions];
        }
      }
    },
    async fetchGraphData() {
      try {
        this.handleAllCoinsSelection();
        
        // Create a URLSearchParams object to handle query parameters
        const params = new URLSearchParams();
        
        // Append each coin name as a separate parameter
        if (this.showCoinSelect) {
            this.selectedCoins.forEach(coin => {
                params.append('coin_names', coin);
            });
        }
        
        // Append the window parameter if needed
        if (this.showWindowInput) {
            params.append('window', this.windowInput);
        }
        
        // Convert the params object to a query string
        let queryString = params.toString();
        
        // Replace all '+' signs with spaces
        queryString = queryString.replace(/\+/g, ' ');
        
        // Construct the URL with the modified query string
        const url = `http://127.0.0.1:8080${this.selectedGraph}?${queryString}`;
        console.log('Sending URL:', url); // Debugging line
        
        const response = await axios.get(url);
        if (response.data.transaction === 200) {
            this.graphData = {
                data: JSON.parse(response.data.data.graph),
                layout: response.data.layout || {}
            };
        } else {
            console.error('Error fetching graph data:', response.data.error);
        }
      } catch (error) {
        console.error('API call error:', error);
      }
    },
    onSignOut() {
      // Handle sign out logic here (e.g., clear authentication tokens, redirect to sign-in page)
      localStorage.removeItem('username'); // Clear username from local storage
      this.$router.push({ name: 'SignIn' });
    },
    handleMenuSelect(index) {
      this.currentView = index;
    }
  },
  watch: {
    selectedCoins(newValue) {
      // Prevent recursive updates by checking if 'all' is included
      if (newValue.includes('all')) {
        this.handleAllCoinsSelection();
      }
    }
  },
  components: {
    SettingsPage,
    HomePage,
    DataInformation,
    PlotlyChart
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

.graph-select,
.coin-select,
.window-input {
  margin-left: 12px;
}

.chart-header {
  display: flex;
  align-items: center;
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
