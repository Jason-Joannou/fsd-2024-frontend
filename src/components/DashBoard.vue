<template>
    <div class="dashboard-container">
      <el-card class="box-card dashboard-intro">
        <div>Welcome to your financial dashboard.</div>
      </el-card>
      <el-card class="box-card chart-card">
        <template v-slot:header>
          <div class="chart-header">
            <span>Chart selection</span>
            <el-select v-model="selectedGraph" placeholder="Select a graph" @change="onGraphSelect" class="graph-select">
              <el-option v-for="option in graphOptions" :key="option.endpoint" :label="option.name" :value="option.endpoint">
              </el-option>
            </el-select>
          </div>
        </template>
        <div v-if="selectedGraph" class="chart-options">
          <el-select v-if="showCoinSelect" v-model="selectedCoins" multiple placeholder="Select coins" class="coin-select">
            <el-option :label="'All'" :value="'all'"></el-option>
            <el-option v-for="coin in coinOptions" :key="coin" :label="coin" :value="coin">
            </el-option>
          </el-select>
          <el-input v-if="showWindowInput" v-model="windowInput" type="number" placeholder="Enter window size" class="window-input"></el-input>
          <el-button type="primary" @click="fetchGraphData" class="fetch-button">Fetch Data</el-button>
        </div>
        <div v-if="graphData" class="chart-display">
          <PlotlyChart :data="graphData.data" :layout="graphData.layout" />
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import PlotlyChart from './PlotlyChart.vue';
  
  export default {
    name: 'DashBoard',
    data() {
      return {
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
      PlotlyChart
    }
  };
  </script>
  
  <style scoped>
  .dashboard-container {
    display: flex;
    flex-direction: column;
    gap: 20px; /* Space between cards */
  }
  
  .dashboard-intro {
    margin-bottom: 20px;
  }
  
  .chart-card {
    padding: 20px;
  }
  
  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px; /* Space between header and options */
  }
  
  .chart-options {
    margin-bottom: 20px; /* Space between options and the chart display */
  }
  
  .graph-select,
  .coin-select,
  .window-input {
    margin-right: 12px; /* Space between input elements */
  }
  
  .fetch-button {
    margin-top: 10px; /* Adds space between the last input element and the button */
  }
  
  .chart-display {
    /* Add any specific styles for the chart display section if needed */
  }
  </style>
  