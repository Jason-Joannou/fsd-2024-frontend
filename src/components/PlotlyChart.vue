<template>
    <div ref="plotlyChart" style="width: 100%; height: 100%;"></div>
  </template>
  
  <script>
  import Plotly from 'plotly.js-dist';
  
  export default {
    name: 'PlotlyChart',
    props: {
      data: {
        type: Array,
        required: true
      },
      layout: {
        type: Object,
        required: false,
        default: () => ({})
      },
      options: {
        type: Object,
        required: false,
        default: () => ({})
      }
    },
    mounted() {
      this.drawChart();
    },
    methods: {
      drawChart() {
        Plotly.newPlot(this.$refs.plotlyChart, this.data, this.layout, this.options);
      }
    },
    watch: {
      data: function() {
        this.drawChart();
      },
      layout: function() {
        this.drawChart();
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add styles for the Plotly component if needed */
  </style>