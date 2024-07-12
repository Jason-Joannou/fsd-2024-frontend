<!-- src/App.vue -->
<template>
  <div id="app">
    <FinancialDashboard />
  </div>
</template>

<script>
import FinancialDashboard from './components/FinancialDashboard.vue'

export default {
  name: 'App',
  components: {
    FinancialDashboard
  }
}
</script>

<style>
/* Add any global styles here */
</style>