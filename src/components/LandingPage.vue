<template>
  <el-container class="full-screen">
    <el-main class="full-screen">
      <el-row type="flex" justify="center" align="middle" class="landing-row">
        <el-col :span="12">
          <el-card class="box-card">
            <div class="card-content">
              <h1 class="welcome-message">Financial System Design</h1>
              <p>Financial Dashboard</p>
              <el-row type="flex" justify="center" align="middle" style="margin-top: 20px;">
                <plotly-chart :data="chartData" :layout="chartLayout" :options="chartOptions" class="chart"></plotly-chart>
              </el-row>
              <el-row type="flex" justify="center" align="middle" style="margin-top: 20px;">
                <el-button type="primary" @click="navigateTo('signin')">Sign In</el-button>
                <el-button type="success" @click="navigateTo('signup')">Sign Up</el-button>
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
    PlotlyChart
  },
  data() {
    return {
      chartData: [
        {
          x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          y: [120, 132, 101, 134, 90, 230, 210],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'red' },
        }
      ],
      chartLayout: {
        title: 'Crypto Graph'
      },
      chartOptions: {}
    };
  },
  methods: {
    navigateTo(page) {
      this.$router.push({ path: `/${page}` });
    }
  }
};
</script>

<style scoped>
.full-screen {
  height: 100vh;
}
.landing-row {
  height: calc(100vh - 60px);
}
.box-card {
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  transition: transform 0.3s;
}
.box-card:hover {
  transform: translateY(-10px);
}
.welcome-message {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}
.card-content {
  text-align: center;
}
.el-button {
  margin: 10px 5px;
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 5px;
}
.chart {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}
</style>