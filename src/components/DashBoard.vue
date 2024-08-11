<template>
  <div class="dashboard-container">
    <el-card class="box-card dashboard-header">
      <div class="dashboard-controls">
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
        <el-button type="primary" @click="fetchAllGraphsData" class="fetch-button">Fetch Data</el-button>
        <el-button type="default" @click="clearSelections" class="clear-button">Clear Selection</el-button>
      </div>
    </el-card>

    <!-- Display each graph in its own row -->
    <div v-for="(graph, index) in graphsData" :key="index" class="chart-row">
      <el-card class="box-card chart-card">
        <div class="chart-header">
          <div class="chart-title">{{ graph.title }}</div>
          <el-tooltip class="item" effect="dark" :content="getGraphHelpText(graph.title)" placement="top">
            <i class="el-icon-question">?</i>
          </el-tooltip>
        </div>
        <PlotlyChart :data="graph.data.data" :layout="graph.data.layout" />
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import PlotlyChart from './PlotlyChart.vue';

export default {
  name: 'FinancialDashboard',
  data() {
    return {
      selectedCoins: [],
      selectedDate: null,
      coinOptions: [],
      graphsData: [],
      helpText: {
        'Daily Price Change': 'This graph shows the daily changes in the price of the selected coins over the specified period.',
        'Volume Bar Graph': 'This graph displays the trading volume of the selected coins over time.',
        'RSI Graph': 'This graph represents the Relative Strength Index (RSI), which helps identify overbought or oversold conditions in the market.',
        'Candlestick Chart': 'This chart visualizes the price movements of the selected coins using candlesticks, showing open, high, low, and close prices.',
        'Correlation Matrix': 'This matrix displays the correlation between different coins, helping to identify how their prices move in relation to each other.',
      },
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
    handleAllCoinsSelection() {
      if (this.selectedCoins.includes('all')) {
        if (this.selectedCoins.length === 1) {
          this.selectedCoins = [...this.coinOptions];
        }
      }
    },
    formatDate(date) {
      return date ? date.toISOString().slice(0, 10) : null;
    },
    async fetchAllGraphsData() {
      this.handleAllCoinsSelection();

      const graphEndpoints = [
        { title: 'Daily Price Change', endpoint: '/daily_price_change' },
        { title: 'Volume Bar Graph', endpoint: '/volume_bar_graph' },
        { title: 'RSI Graph', endpoint: '/rsi_graph' },
        { title: 'Candlestick Chart', endpoint: '/candlestick_chart' },
        { title: 'Correlation Matrix', endpoint: '/correlation_analysis' },
      ];

      this.graphsData = [];

      for (let graph of graphEndpoints) {
        try {
          const params = new URLSearchParams();
          this.selectedCoins.forEach((coin) => params.append('coin_names', coin));

          // Format the dates into YYYY-MM-DD and add to parameters
          if (this.selectedDate && this.selectedDate.length === 2) {
            const startDate = this.formatDate(this.selectedDate[0]);
            const endDate = this.formatDate(this.selectedDate[1]);
            params.append('start_date', startDate);
            params.append('end_date', endDate);
          }

          const response = await axios.get(`http://127.0.0.1:8080${graph.endpoint}?${params.toString()}`);
          if (response.data.transaction === 200) {
            this.graphsData.push({ title: graph.title, data: JSON.parse(response.data.data.graph) });
          } else {
            console.error(`Error fetching data for ${graph.title}:`, response.data.error);
          }
        } catch (error) {
          console.error(`API call error for ${graph.title}:`, error);
        }
      }
    },
    clearSelections() {
      this.selectedCoins = [];
      this.selectedDate = null;
      this.graphsData = [];
    },
    getGraphHelpText(title) {
      return this.helpText[title] || 'No description available';
    },
  },
  components: {
    PlotlyChart,
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dashboard-controls {
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

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.el-icon-question {
  cursor: pointer;
  font-size: 18px;
  color: #409EFF;
}
</style>
