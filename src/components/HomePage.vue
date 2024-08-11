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
        <span>Your Favorite Charts</span>
      </template>
      <div v-for="chart in favoriteCharts" :key="chart.id" class="chart-item">
        <p class="chart-title">{{ chart.title }}</p>
        <div v-if="chart.type === 'table'">
          <el-table :data="chart.data" border style="width: 100%">
            <el-table-column prop="date" label="Date" width="180"></el-table-column>
            <el-table-column prop="name" label="Name" width="180"></el-table-column>
            <el-table-column prop="address" label="Address"></el-table-column>
          </el-table>
        </div>
        <div v-else-if="chart.type === 'line'">
          <!-- Line chart implementation -->
          <p>Line chart will be displayed here.</p>
        </div>
        <div v-else-if="chart.type === 'bar'">
          <!-- Bar chart implementation -->
          <p>Bar chart will be displayed here.</p>
        </div>
      </div>
    </el-card>
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
      favoriteCharts: [] // Placeholder for user's favorite charts
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
    fetchFavoriteCharts() {
      // Placeholder function to fetch user's favorite charts
      this.favoriteCharts = [
        { id: 1, title: 'My Favorite Table', type: 'table', data: [
          { date: '2016-05-02', name: 'Tom', address: 'New York No. 1 Lake Park' },
          { date: '2016-05-04', name: 'Tom', address: 'New York No. 1 Lake Park' },
          { date: '2016-05-01', name: 'Tom', address: 'New York No. 1 Lake Park' },
        ]},
        { id: 2, title: 'My Favorite Line Chart', type: 'line', data: [] },
        { id: 3, title: 'My Favorite Bar Chart', type: 'bar', data: [] }
      ];
    }
  },
  created() {
    this.fetchCryptoNews();
    this.fetchFavoriteCharts();
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

.chart-item {
  margin-top: 20px;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 10px;
}
</style>
