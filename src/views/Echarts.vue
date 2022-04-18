<template>
  <div style="color: #666;font-size: 16px;">
    <!--    <div style="padding-bottom: 20px">
          <b>欢迎你！{{ user.nickname }}</b>
        </div>-->
    <!--    <b>欢迎您! <span style="color:green;font-size: 18px">{{user.cname}}</span> 来到爱心捐赠管理系统!</b>-->
    <el-row :gutter="10" style="margin-bottom: 60px">
      <el-col :span="8">
        <el-card style="color: #409EFF">
          <div><i class="el-icon-user-solid" /> 用户总数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
            {{userList}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="color: #f56c6c">
          <div><i class="el-icon-money" /> 物品总量</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
            {{goodsNum}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="color: #67C23A">
          <div><i class="el-icon-bank-card" /> 爱心值总量</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
            {{loveNum}}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div id="main" style="width: 700px; height: 450px" ref="chart"></div>
      </el-col>

      <el-col :span="12">
        <div id="pie" style="width: 600px; height: 400px"></div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
var echarts = require("echarts");
export default {
  name: "Echarts",
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      userList:'',
      goodsNum:'',
      loveNum:''
    }
  },
  mounted() {
    var mainOption={
      title: {
        text: "物品数量统计",
        left: 'center'
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          interval:0
        },
        data: ['A', 'B', 'C']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150],
          type: 'line'
        }
      ],
      tooltip: {
        //trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      // xAxis: {
      //   type:'category',
      //   data: []
      // },
      // yAxis: {
      //   type:'value'
      // },
      // series: [
      //   {
      //     name: "数量",
      //     type: "bar",
      //     data: [],
      //     barWidth: '45%',
      //     barCategoryGap: '5%',
      //     itemStyle: {
      //       barBorderRadius: 2,
      //       borderWidth: 0.5,
      //       borderType: 'solid',
      //       borderColor: '#73c0de',
      //       shadowColor: '#5470c6',
      //       shadowBlur: 1
      //     }
      //   }
      // ]

    };

    var pieOption = {
      title:{
        text: "物品总爱心值统计",
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'right'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          // center: ['70%', '30%'],
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },


      ]
    };

    this.request.get("/goods/findAllGoods").then(res => {
      var mainDataX=[];
      var mainDataS=[];
      var pieData=[];
      // console.log(res.data)
      res.data.forEach(element=>{
        mainDataX.push(element.gname);
        mainDataS.push(element.gnumber);
        pieData.push({name:element.gname,value:(element.glove)*(element.gnumber)});
      });
      //console.log(mainDataX);
      //console.log(mainDataS);
      //console.log(pieData);
      mainOption.xAxis.data=mainDataX;
      mainOption.series[0].data=mainDataS;
      echarts.init(this.$refs.chart).setOption(mainOption);
      pieOption.series[0].data=pieData;
      var pieDom = document.getElementById('pie');
      var pieChart = echarts.init(pieDom);
      pieChart.setOption(pieOption);

    });
    this.request.get("/goods/findChartNum").then(res=>{
      //console.log(res);
      this.goodsNum=res.data[0];
      this.loveNum=res.data[1];
      this.userList=res.data[2];
    })

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

