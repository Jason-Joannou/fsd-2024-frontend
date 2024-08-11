<template>
    <div class="machine-learning-container">
      <el-card class="box-card ml-header">
        <div class="ml-controls">
          <el-select v-model="selectedCoins" multiple placeholder="Select coins" class="coin-select">
            <el-option :label="'All'" :value="'all'"></el-option>
            <el-option v-for="coin in coinOptions" :key="coin" :label="coin" :value="coin"></el-option>
          </el-select>
          <el-date-picker
            v-model="selectedDate"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            class="date-picker"
          />
          <el-button type="primary" @click="fetchRegressionModelData" class="fetch-button">Run Model</el-button>
          <el-button type="default" @click="clearSelections" class="clear-button">Clear Selection</el-button>
        </div>
      </el-card>
  
      <div v-if="modelData" class="chart-row">
        <el-card class="box-card chart-card">
          <div class="chart-title">Regression Model Results</div>
          <PlotlyChart :data="this.modelData.data" :layout="this.modelData.layout" />
        </el-card>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import PlotlyChart from './PlotlyChart.vue';
  
  export default {
    name: 'MachineLearningPage',
    data() {
      return {
        selectedCoins: [],
        selectedDate: null,
        coinOptions: [],
        modelData: null,
      };
    },
    created() {
      this.fetchCoinOptions();
    },
    methods: {
      async fetchCoinOptions() {
        try {
          const response = await axios.get('http://127.0.0.1:8080/get_coin_names');
          if (response.data.transaction_state === 200) {
            this.coinOptions = JSON.parse(response.data.data).map((coin) => coin.Name);
          } else {
            console.error('Error fetching coin options:', response.data.error);
          }
        } catch (error) {
          console.error('API call error:', error);
        }
      },
      async fetchRegressionModelData() {
        try {
          const params = {
            coin_names: this.selectedCoins,
            start_date: this.formatDate(this.selectedDate ? this.selectedDate[0] : null),
            end_date: this.formatDate(this.selectedDate ? this.selectedDate[1] : null),
          };
  
          const response = await axios.post('http://127.0.0.1:8080/run_regression_model', params);
          if (response.data.transaction === 200) {
            this.modelData = JSON.parse(response.data.data.graph);
            console.log(this.modelData);
          } else {
            console.error('Error fetching regression model data:', response.data.error);
          }
        } catch (error) {
          console.error('API call error:', error);
        }
      },
      formatDate(date) {
        return date ? date.toISOString().slice(0, 10) : null;
      },
      clearSelections() {
        this.selectedCoins = [];
        this.selectedDate = null;
        this.modelData = null;
      },
    },
    components: {
      PlotlyChart,
    },
  };
  </script>
  
  <style scoped>
  .machine-learning-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .ml-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .ml-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .coin-select,
  .date-picker,
  .fetch-button,
  .clear-button {
    margin-right: 10px;
  }
  
  .chart-row {
    margin-top: 20px;
    width: 100%;
  }
  
  .chart-card {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
  }
  
  .chart-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  </style>
  