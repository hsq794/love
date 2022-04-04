<template>
  <div>
    <div id="main" ref="chart"></div>
  </div>
</template>

<script>
var echarts = require("echarts");
export default {
  name: "charts",
  data() {
    return {
      data: {
        title: {
          text: "ECharts 入门示例"
        },
        tooltip: {},
        xAxis: {
          data: ["书", "文具盒", "衣服", "裤子", "铅笔", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
    }
  },
  mounted() {
    echarts.init(this.$refs.chart).setOption(this.data);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main {
  width: 600px;
  height: 400px;
  /*background-color:blanchedalmond;*/
}
</style>

