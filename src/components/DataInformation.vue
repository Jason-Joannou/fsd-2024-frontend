<template>
    <div>
      <el-card class="box-card">
        <template v-slot:header>
          <div class="header-container">
            <span>Coin Report</span>
            <el-select v-model="selectedCoin" placeholder="Select a coin" @change="fetchCoinReport" class="coin-select">
              <el-option v-for="coin in coinOptions" :key="coin" :label="coin" :value="coin"></el-option>
            </el-select>
          </div>
        </template>
        <div v-if="coinReportOther">
          <PlotlyChart :data="coinReportOther.data" :layout="coinReportOther.layout" />
        </div>
        <div v-if="coinReportMarket">
          <PlotlyChart :data="coinReportMarket.data" :layout="coinReportMarket.layout" />
        </div>
        <div v-if="coinReportVolume">
          <PlotlyChart :data="coinReportVolume.data" :layout="coinReportVolume.layout" />
        </div>
        <div v-else>
          <el-skeleton rows="10"></el-skeleton>
        </div>
      </el-card>

      <el-card class="box-card" style="margin-top: 20px;">
        <template v-slot:header>
          <span>Coin Proportion</span>
        </template>
        <div v-if="coinProportion">
          <PlotlyChart :data="coinProportion.pie_data" :layout="coinProportion.pie_layout" />
          <PlotlyChart :data="coinProportion.summary_data" :layout="coinProportion.summary_layout" />
        </div>
        <div v-else>
          <el-skeleton rows="10"></el-skeleton>
        </div>
      </el-card>
    </div>
  </template>

  <script>
  import PlotlyChart from './PlotlyChart.vue';

  export default {
    name: 'DataInformation',
    components: {
      PlotlyChart
    },
    data() {
      return {
        selectedCoin: null,
        coinOptions: [],
        coinReportOther: null,
        coinReportMarket: null,
        coinReportVolume: null,
        coinProportion: null,
      };
    },
    methods: {
      async fetchCoinNames() {
        try {
          const response = await fetch('http://127.0.0.1:8080/get_coin_names');
          const data = await response.json();
          this.coinOptions = JSON.parse(data.data).map(coin => coin.Name);
        } catch (error) {
          console.error('Error fetching coin names:', error);
        }
      },
      async fetchCoinReport(coinName) {
        if (!coinName) return;
        try {
          const response = await fetch(`http://127.0.0.1:8080/coin_reporting?coin_name=${coinName}`);
          const data = await response.json();
          this.coinReportOther = {
            data: JSON.parse(data.data.graph_other).data,
            layout: JSON.parse(data.data.graph_other).layout
          };
          this.coinReportMarket = {
            data: JSON.parse(data.data.graph_market).data,
            layout: JSON.parse(data.data.graph_market).layout
          }
          this.coinReportVolume = {
            data: JSON.parse(data.data.graph_volume).data,
            layout: JSON.parse(data.data.graph_volume).layout
          }
        } catch (error) {
          console.error('Error fetching coin report:', error);
        }
      },
      async fetchCoinProportion() {
        try {
          const response = await fetch('http://127.0.0.1:8080/coin_proportion');
          const data = await response.json();
          this.coinProportion = {
            pie_data: JSON.parse(data.data.pie_graph).data,
            pie_layout: JSON.parse(data.data.pie_graph).layout,
            summary_data: JSON.parse(data.data.summary_graph).data,
            summary_layout: JSON.parse(data.data.summary_graph).layout
          };
        } catch (error) {
          console.error('Error fetching coin proportion:', error);
        }
      },
    },
    created() {
      this.fetchCoinNames();
      this.fetchCoinProportion();
    },
  };
  </script>

  <style scoped>
  .box-card {
    margin-bottom: 20px;
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .coin-select {
    margin-left: 20px;
  }
  </style>

