<template>
  <div class="machine-learning-container">
    <!-- Explanation Card -->
    <el-card class="box-card ml-explanation">
      <div class="ml-explanation-content">
        <h2 class="ml-title">Machine Learning Process Overview</h2>
        <p>
          The ML component of this dashboard is focused on predicting cryptocurrency prices and analyzing market trends using sophisticated models and techniques. The pipeline is structured to ensure modularity, scalability, and ease of integration, allowing for continuous improvement and extension. Ridge Regression and XGBoost models are trained on the processed data to generate accurate predictions and insightful trends.
        </p>
      </div>
    </el-card>

    <!-- Controls for Model Selection and Date Range -->
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

    <!-- Display Chart with Model Data -->
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

/* Explanation Card */
.ml-explanation {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ml-explanation-content {
  font-size: 1rem;
  color: #333;
}

.ml-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

/* Controls Card */
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

/* Chart Card */
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
