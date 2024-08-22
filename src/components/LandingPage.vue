<template>
  <el-container class="full-screen">
    <el-main class="full-screen">
      <el-row type="flex" justify="center" align="middle" class="landing-row">
        <el-col :span="10">
          <el-card class="box-card">
            <div class="card-content">
              <h1 class="welcome-message">Financial System Design</h1>
              <p class="subheading">Your Comprehensive Financial Dashboard</p>
              <el-row type="flex" justify="center" align="middle" class="chart-container">
                <plotly-chart :data="chartData" :layout="chartLayout" :options="chartOptions" class="chart"></plotly-chart>
              </el-row>
              <el-row type="flex" justify="center" align="middle" class="button-row">
                <el-button type="primary" @click="navigateTo('signin')" class="custom-button">Sign In</el-button>
                <el-button type="success" @click="navigateTo('signup')" class="custom-button">Sign Up</el-button>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import PlotlyChart from './PlotlyChart.vue';

export default {
  name: 'LandingPage',
  components: {
    PlotlyChart,
  },
  data() {
    return {
      chartData: [
        {
          x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          y: [120, 132, 101, 134, 90, 230, 210],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: '#409EFF' },
        },
      ],
      chartLayout: {
        title: 'Crypto Market Overview',
        titlefont: {
          size: 24,
          color: '#333',
        },
      },
      chartOptions: {},
    };
  },
  methods: {
    navigateTo(page) {
      this.$router.push({ path: `/${page}` });
    },
  },
};
</script>

<style scoped>
.full-screen {
  height: 100vh;
  background-color: #f0f2f5;
}

.landing-row {
  height: calc(100vh - 60px);
}

.box-card {
  margin-top: 20px;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.box-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.welcome-message {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}

.subheading {
  text-align: center;
  color: #888;
  font-size: 1.25rem;
  margin-bottom: 20px;
}

.card-content {
  text-align: center;
  padding: 20px;
}

.chart-container {
  margin-top: 20px;
}

.chart {
  width: 100%;
  height: 400px;
}

.button-row {
  margin-top: 20px;
}

.custom-button {
  margin: 0 10px;
  padding: 14px 24px;
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.custom-button:hover {
  transform: translateY(-2px);
}
</style>
