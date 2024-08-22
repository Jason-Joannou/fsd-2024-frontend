<template>
  <div>
    <el-card class="box-card">
      <div class="welcome-message">Welcome to My Financial Dashboard, {{ username }}!</div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px;">
      <template v-slot:header>
        <span>Latest Crypto News</span>
      </template>
      <div v-for="news in cryptoNews" :key="news.title" class="news-item">
        <a :href="news.link" target="_blank">{{ news.title }}</a>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px;">
      <template v-slot:header>
        <span>Top 5 Cryptocurrencies</span>
      </template>
      <div class="crypto-container">
        <el-card class="crypto-card" style="margin-right: 10px;">
          <template v-slot:header>
            <span>Price</span>
          </template>
          <el-table :data="cryptoData" border style="width: 100%">
            <el-table-column prop="name" label="Name" width="180"></el-table-column>
            <el-table-column prop="price" label="Price (USD)" width="180"></el-table-column>
          </el-table>
        </el-card>
        <el-card class="crypto-card" style="margin-right: 10px;">
          <template v-slot:header>
            <span>Volume</span>
          </template>
          <el-table :data="cryptoData" border style="width: 100%">
            <el-table-column prop="name" label="Name" width="180"></el-table-column>
            <el-table-column prop="volume" label="Volume (USD)" width="180"></el-table-column>
          </el-table>
        </el-card>
        <el-card class="crypto-card">
          <template v-slot:header>
            <span>Market Cap</span>
          </template>
          <el-table :data="cryptoData" border style="width: 100%">
            <el-table-column prop="name" label="Name" width="180"></el-table-column>
            <el-table-column prop="market_cap" label="Market Cap (USD)" width="180"></el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-card>

    <!-- New Layout -->
    <div class="market-container">
      <!-- Market Data on the left -->
      <el-card class="market-card">
        <template v-slot:header>
          <span>Market Data</span>
        </template>
        <div>
          <p class="market-cap">${{ formatNumber(marketData.market_cap) }}</p>
          <p class="market-label">Market Cap</p>
          <p class="market-cap-change">{{ marketData.cap_direction }}</p>

          <p class="market-volume">${{ formatNumber(marketData.market_volume) }}</p>
          <p class="market-label">24h Trading Volume</p>
          <p class="market-volume-change">{{ marketData.volume_direction }}</p>
        </div>
      </el-card>

      <!-- Trending Coins in the middle -->
      <el-card class="market-card">
        <template v-slot:header>
          <span>🔥 Trending</span>
        </template>
        <div>
          <el-table :data="trendingCoins" border style="width: 100%">
            <el-table-column prop="name" label="Name" width="180"></el-table-column>
            <el-table-column prop="percentage_change_7d" label="7d % Change" width="180"></el-table-column>
          </el-table>
        </div>
      </el-card>

      <!-- Largest Gainers on the right -->
      <el-card class="market-card">
        <template v-slot:header>
          <span>Largest Gainers</span>
        </template>
        <div>
          <el-table :data="topGainers" border style="width: 100%">
            <el-table-column prop="name" label="Name" width="180"></el-table-column>
            <el-table-column prop="price_change_percentage_24h" label="24h % Change" width="180"></el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      username: localStorage.getItem('username') || '', // Retrieve stored username
      cryptoNews: [], // Placeholder for crypto news
      cryptoData: [], // Placeholder for top 5 cryptocurrencies' data
      marketData: {}, // Placeholder for market data
      trendingCoins: [], // Placeholder for trending coins
      topGainers: [] // Placeholder for top gainers
    };
  },
  methods: {
    async fetchCryptoNews() {
      try {
        const response = await axios.get('http://127.0.0.1:8080/get_crypto_news');
        this.cryptoNews = response.data;
      } catch (error) {
        console.error('Error fetching crypto news:', error);
      }
    },
    async fetchCryptoData() {
      try {
        const response = await axios.get('http://127.0.0.1:8080/get_top_5_crypto');
        this.cryptoData = response.data;
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    },
    async fetchMarketData() {
      try {
        const response = await axios.get('http://127.0.0.1:8080/get_market_data');
        this.marketData = response.data;
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    },
    async fetchTrendingCoins() {
      try {
        const response = await axios.get('http://127.0.0.1:8080/get_trending_coins');
        this.trendingCoins = response.data;
      } catch (error) {
        console.error('Error fetching trending coins:', error);
      }
    },
    async fetchTopGainers() {
      try {
        const response = await axios.get('http://127.0.0.1:8080/get_top_gainers');
        this.topGainers = response.data.top_gainers;
      } catch (error) {
        console.error('Error fetching top gainers:', error);
      }
    },
    formatNumber(value) {
      return new Intl.NumberFormat().format(value);
    }
  },
  created() {
    this.fetchCryptoNews();
    this.fetchCryptoData();
    this.fetchMarketData();
    this.fetchTrendingCoins();
    this.fetchTopGainers();
  }
};
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 20px;
}

.box-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.welcome-message {
  font-size: 1.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.news-item {
  margin: 10px 0;
  font-size: 1rem;
}

.news-item a {
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s ease;
}

.news-item a:hover {
  color: #2980b9;
}

.crypto-container {
  display: flex;
  gap: 20px;
}

.crypto-card {
  flex: 1;
  min-width: 0;
}

/* New Layout Styles */
.market-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.market-card {
  width: 32%;
}

.market-cap, .market-volume {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.market-label {
  font-size: 16px;
  color: #666;
}

.market-cap-change, .market-volume-change {
  font-size: 16px;
  color: green;
}

.market-cap-change.down, .market-volume-change.down {
  color: red;
}
</style>


