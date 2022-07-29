<template>
  <div class="app-container">
    <div class="dashboard-text">欢迎回来，{{ name }}~</div>
    <div class="dashboard-text">你的权限:<span v-for="role in roles" :key="role">{{ role }}</span></div>
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-date-picker
          v-model="searchObj.begin"
          type="date"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="date"
          placeholder="选择截止日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-button
        :disabled="btnDisabled"
        type="primary"
        icon="el-icon-search"
        @click="conditionChart()"
        >查询</el-button
      >
      <el-button type="primary" icon="el-icon-search" @click="nowChart"
        >当日实时数据</el-button
      >
    </el-form>
    <div class="chart-container">
      <div id="chart" class="chart" style="height: 500px; width: 100%" />
    </div>
  </div>
</template>

<script>
import staApi from "@/api/edu/sta";
import * as echarts from "echarts";
import { mapGetters } from 'vuex'
export default {
  name: "Dashboard",
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  data() {
    return {
      day: "",
      btnDisabled: false,
      searchObj: {
        begin: "",
        end: "",
      },
      chart: null,
      title: "",
      xData: [],
      loginData: [],
      registerData: [],
      videoViewData: [],
      courseNumData: [],
    };
  },
  created() {},
  mounted () {
    this.nowChart()
  },
  methods: {
    nowChart() {
      echarts.init(document.getElementById("chart")).dispose(); //销毁前一个实例
      staApi.nowChart().then((response) => {
        this.loginData = response.data.loginList;
        this.registerData = response.data.registerList;
        this.videoViewData = response.data.videoViewList;
        this.courseNumData = response.data.courseNumList;
        // 横轴时间
        this.xData = response.data.dateList;
        this.setChartNow();
      });
    },
    conditionChart() {
      echarts.init(document.getElementById("chart")).dispose(); //销毁前一个实例
      this.initConditionChartData();
    },
    // 准备图表数据
    initConditionChartData() {
      staApi.showChart(this.searchObj).then((response) => {
        // 数据
        this.loginData = response.data.loginList;
        this.registerData = response.data.registerList;
        this.videoViewData = response.data.videoViewList;
        this.courseNumData = response.data.courseNumList;
        // 横轴时间
        this.xData = response.data.dateList;
        this.setChartCondition();
      });
    },
    // 设置图标参数
    setChartCondition() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById("chart"));
      // console.log(this.chart)
      // 指定图表的配置项和数据
      var option = {
        color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
        title: {
          text: "统计结果",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: ["注册人数", "访问量", "课程播放量", "课程数量"],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.xData,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "注册人数",
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(128, 255, 165)",
                },
                {
                  offset: 1,
                  color: "rgb(1, 191, 236)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: this.registerData,
          },
          {
            name: "访问量",
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(0, 221, 255)",
                },
                {
                  offset: 1,
                  color: "rgb(77, 119, 255)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: this.loginData,
          },
          {
            name: "课程播放量",
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(55, 162, 255)",
                },
                {
                  offset: 1,
                  color: "rgb(116, 21, 219)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: this.videoViewData,
          },
          {
            name: "课程数量",
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 0, 135)",
                },
                {
                  offset: 1,
                  color: "rgb(135, 0, 157)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: this.courseNumData,
          },
        ],
        dataZoom: [
          {
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon:
              "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
            handleSize: "110%",
            handleStyle: {
              color: "#d3dee5",
            },
            textStyle: { color: "#fff" },
            borderColor: "#90979c",
          },
          {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35,
          },
        ],
      };
      this.chart.setOption(option);
    },
    //设置今日的图标
    setChartNow() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById("chart"));
      var option = {
        title: {
          text: "今日统计结果",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: ["今日注册人数", "今日访问量", "今日视频播放量", "课程总量"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [
              {
                value: this.registerData[0],
                itemStyle: {
                  color: "#a90000",
                },
              },
              {
                value: this.loginData[0],
                itemStyle: {
                  color: " #228B22",
                },
              },
              {
                value: this.videoViewData[0],
                itemStyle: {
                  color: " #FFA500",
                },
              },
              {
                value: this.courseNumData[0],
                itemStyle: {
                  color: "#EE82EE",
                },
              },
            ],
            type: "bar",
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
