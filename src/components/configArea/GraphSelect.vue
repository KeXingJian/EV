<template>
  <div class="top-div">
    <div class="chart-container">
      <div ref="mixed" class="chart"></div>
      <span>折线与条形图</span>
    </div>
    <div class="chart-container">
      <div ref="pie" class="chart"></div>
      <span>饼图</span>
    </div>
    <div class="chart-container">
      <div ref="scatter" class="chart"></div>
      <span>点散图</span>
    </div>
    <div class="chart-container">
      <div ref="radar" class="chart"></div>
      <span>雷达图</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import emitter from "../../emitter/emitter.js";

const mixed = ref(null)
const pie = ref(null)
const scatter = ref(null)
const radar = ref(null)

let mixedInstance=null
let pieInstance =null
let scatterInstance=null
let radarInstance=null

// 新增线性回归计算函数
const linearRegression = (data) => {
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0
  const n = data.length

  data.forEach(([x, y]) => {
    sumX += x
    sumY += y
    sumXY += x * y
    sumXX += x * x
  })

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // 生成回归线起止点
  const xValues = data.map(d => d[0])
  const minX = Math.min(...xValues)
  const maxX = Math.max(...xValues)

  return [
    [minX, slope * minX + intercept],
    [maxX, slope * maxX + intercept]
  ]
}

// 示例数据
const baseData = {
  mixed: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      {
        name: '柱状图', type: 'bar', data: [120, 200, 150, 80, 70, 110, 130],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0,  color: 'rgb(255, 158, 68)' },
            { offset: 1,color: 'rgb(255, 70, 131)' }
          ])
        },
      },
      {
        name: '折线图', type: 'line', data: [80, 150, 100, 200, 170, 140, 190],
        itemStyle: {
          color: 'rgb(255, 70, 131)'
        },

      }
    ]
  },
  pie: {
    data: [
      { value: 30, name: 'rose 1' },
      { value: 28, name: 'rose 2' },
      { value: 26, name: 'rose 3' },
      { value: 24, name: 'rose 4' },
      { value: 22, name: 'rose 5' },
      { value: 20, name: 'rose 6' },
      { value: 18, name: 'rose 7' },
      { value: 16, name: 'rose 8' }
    ]
  },
  scatter: {
    data: [
      [10.0, 8.04],
      [8.0, 6.95],
      [13.0, 7.58],
      [9.0, 8.81],
      [11.0, 8.33],
      [14.0, 9.96],
      [6.0, 7.24],
      [4.0, 4.26],
      [12.0, 10.84]
    ],
    // 新增回归线数据
    regressionLine: linearRegression([
      [10.0, 8.04],
      [8.0, 6.95],
      [13.0, 7.58],
      [9.0, 8.81],
      [11.0, 8.33],
      [14.0, 9.96],
      [6.0, 7.24],
      [4.0, 4.26],
      [12.0, 10.84]
    ])
  },
  radar: {
    indicators: [
      { name: '', max: 6500 },
      { name: '', max: 16000 },
      { name: '', max: 30000 },
      { name: '', max: 38000 },
      { name: '', max: 52000 },
      { name: '', max: 25000 }
    ],
  }
}

const getChartOption = (type) => {
  const cleanBase = {
    title: { show: false },
    toolbox: { show: false },
    grid: { containLabel: false, top: 10, bottom: 10 }
  }

  switch (type) {
    case 0:
      return {
        ...cleanBase,
        xAxis: {
          type: 'category',
          data: baseData.mixed.categories,
          show: false
        },
        yAxis: {show: false},
        series: baseData.mixed.series
      }
    case 1:
      return {
        ...cleanBase,
        series: [{
          type: 'pie',
          radius: '75%',
          data: baseData.pie.data,
          label: {show: false},
          roseType: 'radius',
          itemStyle: {
            borderRadius: 5
          },
        }]
      }
    case 2:
      return {
        ...cleanBase,
        xAxis: {
          show: false,
          min: Math.min(...baseData.scatter.data.map(d => d[0])) - 2,
          max: Math.max(...baseData.scatter.data.map(d => d[0])) + 2
        },
        yAxis: {
          show: false,
          min: Math.min(...baseData.scatter.data.map(d => d[1])) - 2,
          max: Math.max(...baseData.scatter.data.map(d => d[1])) + 2
        },
        series: [
          {
            name: '数据点',
            type: 'scatter',
            data: baseData.scatter.data,
            symbolSize: 16,
            itemStyle: {
              color: '#FF4081',
            },
          },
          {
            name: '回归线',
            type: 'line',
            data: baseData.scatter.regressionLine,
            smooth: true,
            symbol: 'none',
            lineStyle: {
              color: '#00E5FF',
              width: 3,
              type: 'dashed'
            },
            animationEasing: 'elasticOut',
            tooltip: {
              formatter: () => {
                const [start, end] = baseData.scatter.regressionLine
                const slope = (end[1] - start[1]) / (end[0] - start[0])
                return `回归方程: y = ${slope.toFixed(2)}x + ${start[1].toFixed(2)}`
              }
            }
          }
        ]
      }
    case 3:
      return {
        ...cleanBase,
        radar: {
          indicator: baseData.radar.indicators,
          axisLine: {show: false},
          splitLine: {show: false},
          splitArea: {
            areaStyle: {
              color: ['#cdfaf6','#43A49B'],
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 10
            },
          },
        },
        series: [{
          type: 'radar',
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: 'Allocated Budget',
              lineStyle: {
                color: '#FF3D3D'
              },
              itemStyle: {
                color: '#FF3D3D'
              }
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: 'Actual Spending',
              lineStyle: {
                color: '#354656'
              },
              itemStyle: {
                color: '#354656'
              }
            }
          ]
        }]
      }
    default:
      return {}
  }
}

const resizeChart = () => {
  mixedInstance.resize()
  pieInstance.resize()
  scatterInstance.resize()
  radarInstance.resize()
}

emitter.on('resize',resizeChart)

onMounted(() => {
  mixedInstance = echarts.init(mixed.value)
  mixedInstance.setOption(getChartOption(0),true)
  pieInstance = echarts.init(pie.value)
  pieInstance.setOption(getChartOption(1),true)
  scatterInstance = echarts.init(scatter.value)
  scatterInstance.setOption(getChartOption(2),true)
  radarInstance = echarts.init(radar.value)
  radarInstance.setOption(getChartOption(3),true)
})

onBeforeUnmount(() => {
  emitter.off('resize',resizeChart)
})

</script>

<style scoped>
.top-div{
  display: grid;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.top-div::-webkit-scrollbar {
  display: none;
}

.chart-container {
  border-radius: 8px;
  border: 1px solid var(--2-background-color);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 200px;
  transition: 300ms ease-in-out;
}
.chart-container:hover {
  transform: scale(1.1);
  background: var(--theme-hover-color);
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.chart {
  width: 100%;
  height: 100%;
}


</style>