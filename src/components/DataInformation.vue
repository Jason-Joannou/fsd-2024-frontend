<template>
  <div>
    <!-- Coin Report Card -->
    <el-card class="box-card" style="margin-top: 20px;">
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

    <!-- Coin Proportion Card -->
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

    <!-- Cryptocurrency Overview Card -->
    <el-card class="box-card" style="margin-top: 20px;">
      <template v-slot:header>
        <span>Cryptocurrency Overview</span>
      </template>
      <div class="coin-info-content">
        <h3>Bitcoin (BTC)</h3>
        <p>
          Bitcoin is the first decentralized digital currency, created in 2009 by an unknown person or group using the pseudonym Satoshi Nakamoto. It allows peer-to-peer transactions without the need for a central authority, with a fixed supply of 21 million coins.
        </p>

        <h3>Ethereum (ETH)</h3>
        <p>
          Ethereum is a decentralized platform that enables the creation of smart contracts and decentralized applications (DApps). Launched in 2015 by Vitalik Buterin, Ethereum allows developers to build and deploy contracts that execute automatically when conditions are met.
        </p>

        <h3>Binance Coin (BNB)</h3>
        <p>
          Binance Coin is the native cryptocurrency of the Binance exchange, launched in 2017. BNB is used to pay for transaction fees on the Binance platform, and it powers the Binance ecosystem, including Binance Smart Chain, a blockchain platform for decentralized applications.
        </p>

        <h3>Solana (SOL)</h3>
        <p>
          Solana is a high-performance blockchain that supports high-speed transactions with low fees. Launched in 2020, Solana is designed to handle decentralized applications and crypto-currencies, providing scalability through its Proof of History (PoH) consensus mechanism.
        </p>

        <h3>Cardano (ADA)</h3>
        <p>
          Cardano is a proof-of-stake blockchain platform that aims to provide a more secure and scalable way to build and run decentralized applications. Launched in 2017, Cardano emphasizes a research-driven approach to design and development.
        </p>

        <!-- Additional coins summaries -->
        <h3>Litecoin (LTC)</h3>
        <p>
          Litecoin, created by Charlie Lee in 2011, is a peer-to-peer cryptocurrency that offers faster transaction times and lower fees compared to Bitcoin. It's often considered the silver to Bitcoin's gold.
        </p>

        <h3>Ripple (XRP)</h3>
        <p>
          Ripple is both a digital payment protocol and cryptocurrency, aimed at enabling fast, low-cost international money transfers. Unlike Bitcoin, Ripple is not mined and relies on a consensus ledger.
        </p>

        <h3>Polkadot (DOT)</h3>
        <p>
          Polkadot is a next-generation blockchain protocol that connects multiple specialized blockchains into one unified network. It aims to facilitate the transfer of data between different blockchains and improve scalability and interoperability.
        </p>

        <h3>Chainlink (LINK)</h3>
        <p>
          Chainlink is a decentralized oracle network that allows smart contracts on blockchain platforms to securely interact with external data feeds, web APIs, and traditional bank payments.
        </p>

        <h3>Dogecoin (DOGE)</h3>
        <p>
          Dogecoin started as a joke in 2013 but has since gained a significant following. It's known for its friendly and approachable brand, featuring the Shiba Inu dog from the popular "Doge" meme.
        </p>
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

.coin-info-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.coin-info-content h3 {
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
}
</style>
