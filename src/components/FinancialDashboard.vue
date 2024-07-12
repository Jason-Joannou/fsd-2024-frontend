<template>
    <el-container>
      <el-header>Financial Dashboard</el-header>
      <el-main>
        <el-card class="box-card">
          <template v-slot:header>
            <span>Welcome</span>
          </template>
          <div>
            Welcome to your financial dashboard.
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px;">
          <template v-slot:header>
            <span>Chart</span>
          </template>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="date" label="Date" width="180"></el-table-column>
            <el-table-column prop="name" label="Name" width="180"></el-table-column>
            <el-table-column prop="address" label="Address"></el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>
  </template>
  
  <script>
  export default {
    name: 'FinancialDashboard',
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: 'Tom',
          address: 'New York No. 1 Lake Park'
        }, {
          date: '2016-05-04',
          name: 'Tom',
          address: 'New York No. 1 Lake Park'
        }, {
          date: '2016-05-01',
          name: 'Tom',
          address: 'New York No. 1 Lake Park'
        }]
      }
    }
  }
  </script>
  
  <style scoped>
  .box-card {
    margin-bottom: 20px;
  }
  </style>