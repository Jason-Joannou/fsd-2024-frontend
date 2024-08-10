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
      <div v-if="coinReport">
        <PlotlyChart :data="coinReport.data" :layout="coinReport.layout" />
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
        <el-table :data="formattedCoinProportionData" style="width: 100%; margin-top: 20px;">
          <el-table-column prop="name" label="Coin Name" />
          <el-table-column prop="date" label="Date" />
          <el-table-column prop="volume" label="Total Volume" />
          <el-table-column prop="marketCap" label="Market Cap" />
        </el-table>
      </div>
      <div v-else>
        <el-skeleton rows="10"></el-skeleton>
      </div>
    </el-card>
  </div>
</template>

<script>
import PlotlyChart from './PlotlyChart.vue';

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function simplifyNumber(value) {
  const units = ["", "K", "M", "B", "T"];
  const unit = Math.floor((value.toFixed(0).length - 1) / 3);
  const num = (value / ('1e' + unit * 3)).toFixed(2);
  return num + units[unit];
}

export default {
  name: 'DataInformation',
  components: {
    PlotlyChart
  },
  data() {
    return {
      selectedCoin: null,
      coinOptions: [],
      coinReport: null,
      coinProportion: null,
    };
  },
  computed: {
    formattedCoinProportionData() {
      if (!this.coinProportion) return [];
      return this.coinProportion.data.map(coin => ({
        name: coin.name,
        date: formatDate(coin.date),
        volume: simplifyNumber(coin.volume),
        marketCap: simplifyNumber(coin.marketCap),
      }));
    }
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
        this.coinReport = {
          data: JSON.parse(data.data.graph).data,
          layout: JSON.parse(data.data.graph).layout
        };
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
