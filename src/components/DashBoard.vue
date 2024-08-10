<template>
  <div class="dashboard-container">
    <el-card class="box-card dashboard-intro">
      <div>Welcome to your financial dashboard.</div>
    </el-card>
    <el-card class="box-card chart-card">
      <template v-slot:header>
        <div class="chart-header">
          <span>Select Coins</span>
          <el-select v-model="selectedCoins" multiple placeholder="Select coins" class="coin-select">
            <el-option :label="'All'" :value="'all'"></el-option>
            <el-option v-for="coin in coinOptions" :key="coin" :label="coin" :value="coin">
            </el-option>
          </el-select>
          <el-button type="primary" @click="fetchAllGraphData" class="fetch-button">Fetch Data</el-button>
          <el-button type="default" @click="clearSelections" class="clear-button">Clear Selection</el-button>
        </div>
      </template>
    </el-card>
    <div class="charts-container">
      <el-card class="box-card chart-card" v-if="graphData.priceGraph">
        <template v-slot:header>Price Graph</template>
        <PlotlyChart :data="graphData.priceGraph.data" :layout="graphData.priceGraph.layout" />
      </el-card>
      <el-card class="box-card chart-card" v-if="graphData.volumeBarGraph">
        <template v-slot:header>Volume Bar Graph</template>
        <PlotlyChart :data="graphData.volumeBarGraph.data" :layout="graphData.volumeBarGraph.layout" />
      </el-card>
      <el-card class="box-card chart-card" v-if="graphData.candlestickChart">
        <template v-slot:header>Candlestick Chart</template>
        <PlotlyChart :data="graphData.candlestickChart.data" :layout="graphData.candlestickChart.layout" />
      </el-card>
      <el-card class="box-card chart-card" v-if="graphData.rsiGraph">
        <template v-slot:header>RSI Graph</template>
        <PlotlyChart :data="graphData.rsiGraph.data" :layout="graphData.rsiGraph.layout" />
      </el-card>
      <el-card class="box-card chart-card" v-if="graphData.correlationMatrix">
        <template v-slot:header>Correlation Matrix</template>
        <PlotlyChart :data="graphData.correlationMatrix.data" :layout="graphData.correlationMatrix.layout" />
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import PlotlyChart from './PlotlyChart.vue';

export default {
  name: 'DashBoard',
  data() {
    return {
      selectedCoins: [], // Selected coins
      graphData: {}, // Data for the graphs
      coinOptions: [], // Options for the coin dropdown
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
          this.coinOptions = JSON.parse(response.data.data).map(coin => coin.Name);
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
    async fetchAllGraphData() {
      try {
        this.handleAllCoinsSelection();
        const coinNames = this.selectedCoins.join(',');

        const endpoints = {
          priceGraph: '/daily_price_change',
          volumeBarGraph: '/volume_bar_graph',
          candlestickChart: '/candlestick_chart',
          rsiGraph: '/rsi_graph',
          correlationMatrix: '/correlation_analysis'
        };

        const graphData = {};

        for (const [key, endpoint] of Object.entries(endpoints)) {
          const url = `http://127.0.0.1:8080${endpoint}?coin_names=${coinNames}`;
          console.log(`Fetching ${key} data from:`, url); // Debugging line

          try {
            const response = await axios.get(url);
            if (response.data.transaction === 200) {
              graphData[key] = {
                data: JSON.parse(response.data.data.graph),
                layout: response.data.layout || {}
              };
            } else {
              console.error(`Error fetching ${key} data:`, response.data.error);
            }
          } catch (error) {
            console.error(`API call error for ${key}:`, error);
          }
        }

        this.graphData = graphData;
      } catch (error) {
        console.error('API call error:', error);
      }
    },
    clearSelections() {
      this.selectedCoins = [];
      this.graphData = {};
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
  font-size: 18px;
  text-align: center;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.chart-card {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px; /* Space between header and options */
  font-size: 16px;
  font-weight: bold;
}

.coin-select {
  margin-right: 12px; /* Space between input elements */
  width: 300px;
}

.fetch-button,
.clear-button {
  margin-top: 10px; /* Adds space between the last input element and the buttons */
  width: 150px;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.grid-item {
  background-color: #f9f9f9;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.grid-item-wide {
  grid-column: span 2;
}
</style>


