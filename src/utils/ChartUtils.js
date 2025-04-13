import {getPosition, getSymbol, unloadAxis} from "./CheckUtils.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../store/OptionConfig.js";

export const addSeries = (series, echartsOptions, data) => {
    const addItem = {
        id: series.id,
        name: series.name,
        emphasis: {
            focus: 'series'
        },
        areaStyle: null,
        itemStyle: {},
        label: {
            show: series.isLabel
        }
    }

    if (series.G.type === 0) { //折线 或 条形 或 散点
        console.log('构建折线模型或柱状')
        addItem.xAxisId = series.H.id
        addItem.yAxisId = series.V.id
        addSeriesForType0(addItem, series, data, echartsOptions)
    } else if (series.G.type === 1) { //极坐标系
        console.log('极坐标系')
        addItem.radiusAxis = series.H.id
        addItem.angleAxis = series.V.id
        addSeriesForType0(addItem, series, data, echartsOptions)
    } else if (series.type === 3) {//散点
        console.log('构建散点模型')
    } else if (series.type === 4) {//雷达
        console.log('构建雷达模型')
    }
    echartsOptions.value.series.push(addItem)
}

export const loadH = (H, echartsOptions) => {
    if (H.G.isStack && H.G.stackAxisType === 0 && H.type===1) {
        console.log('H轴使用堆叠轴,禁止加载')
        return
    }
    H.axisName = getFieldByIndex(H.field)
    console.log('尝试加载横轴', H)
    if (H.isLoad) { //已经加载过说明只是,字段变更
        console.log('横轴已加载,开始重载')
        if (H.G.type === 0) { //x0y类型
            console.log('加载x0y型')
            const targetXAxis = echartsOptions.value.xAxis.find(i => i.id === H.id)
            if (targetXAxis) {
                targetXAxis.name = H.axisName
                targetXAxis.type = H.type === 0 ? 'category' : 'value'
            }
        } else if (H.G.type === 1) { //极坐标
            console.log('加载极坐标型')
        } else if (H.G.type === 2) { //饼图
            console.log('加载饼图型')
        } else if (H.G.type === 3) { // 雷达
            console.log('加载雷达型')
        }

    } else {
        console.log('H轴未加载,开始加载')
        if (H.G.type === 0) { //x0y类型
            console.log('加载x0y型')
            addHForType0(H, echartsOptions)
        } else if (H.G.type === 1) { //极坐标
            console.log('加载极坐标型')
        } else if (H.G.type === 2) { //饼图
            console.log('加载饼图型')
        } else if (H.G.type === 3) { // 雷达
            console.log('加载雷达型')
        }
        H.isLoad = true
    }

}
export const loadV = (V, echartsOptions) => {
    if (V.G.isStack && V.G.stackAxisType === 1 && V.type===1) {
        console.log('V轴使用堆叠轴,禁止加载')
        return
    }

    V.axisName = getFieldByIndex(V.field)
    console.log('尝试加载纵轴', V)
    if (V.isLoad) { //已经加载过说明只是,字段变更
        console.log('V轴已加载,开始重载')
        if (V.G.type === 0) { //x0y类型
            console.log('加载x0y')
            const targetYAxis = echartsOptions.value.yAxis.find(i => i.id === V.id)
            if (targetYAxis) {
                targetYAxis.name = V.axisName
                targetYAxis.type = V.type === 0 ? 'category' : 'value'
            }
        } else if (V.G.type === 1) { //极坐标
            console.log('加载极坐标')
        } else if (V.G.type === 2) { //饼图
            console.log('加载饼图')
        } else if (V.G.type === 3) { // 雷达
            console.log('加载雷达')
        }

    } else {
        console.log('横轴未加载,开始加载')
        if (V.G.type === 0) { //x0y类型
            console.log('加载x0y')
            addVForType0(V, echartsOptions)
        } else if (V.G.type === 1) { //极坐标
            console.log('加载极坐标')
        } else if (V.G.type === 2) { //饼图
            console.log('加载饼图')
        } else if (V.G.type === 3) { // 雷达
            console.log('加载雷达')
        }

        V.isLoad = true
    }

}

//系列
const addSeriesForType0 = (addItem, series, data, echartsOptions) => {
    addItem.type = chartType[series.type]

    addItem.data = data
    addItem.itemStyle.color = series.color

    //曲线
    addItem.smooth = series.lineConfig.lineType === 1;
    //折线
    if (series.lineConfig.lineType === 2) addItem.step = startPoints[series.lineConfig.startPoint]
    //面积化
    if (series.lineConfig.isArea) addItem.areaStyle = {color: series.areaColor}

    //堆叠
    if (series.G.isStack && series.G.stackAxisType === 0 && series.H.type===1) {
        console.log('启用堆叠H轴,')
        addItem.xAxisId = -1 + series.G.name,
            addItem.stack = series.G.id + 'l'
    } else if (series.G.isStack && series.G.stackAxisType === 1 && series.V.type===1) {
        console.log('启用堆叠V轴,')
        addItem.yAxisId = -1 + series.G.name
        addItem.stack = series.G.id + 'l'
    } else if (series.G.isStack){
        console.log('堆叠启用但自身轴与堆叠轴不符')
        addItem.stack = series.G.id + 'l'
    }else {
        addItem.stack = null
    }


    console.log('载入系列模型', addItem)
}

//横轴
export const addHForType0 = (H, echartsOptions) => {
    echartsOptions.value.xAxis.push({
        id: H.id,
        type: H.type === 0 ? 'category' : 'value',   // 类目轴（离散数据）
        name: H.axisName,        // 坐标轴名称
        nameTextStyle: {     // 名称文本样式
            color: H.textColor,
            fontSize: 14,
            fontWeight: 'bold'
        },
        axisLabel: {         // 轴标签样式
            show: H.labelShow,
            color: H.labelColor,
            formatter: function (value) {
                return `${value + H.unit}`
            }
        },
        axisLine: {          // 轴线样式
            show: H.show,
            symbol: getSymbol(H.symbol),
            lineStyle: {
                color: H.lineColor,
            },
            onZero: false,
        },
        axisTick: {           // 刻度线样式
            show: H.tickLine,         // 是否显示刻度
            alignWithLabel: true, // 刻度与标签对齐

        },
        splitLine: {          // 分割线（网格线）
            show: H.splitLine         // 关闭x轴分割线
        },
        position: getPosition(H.position, 0),
        inverse: !H.symbol,
        gridIndex: H.G.gridIndex,
        offset: H.offset
    })
}

//纵轴
export const addVForType0 = (V, echartsOptions) => {
    echartsOptions.value.yAxis.push({
        id: V.id,
        type: V.type === 0 ? 'category' : 'value',   // 类目轴（离散数据）
        name: V.axisName,        // 坐标轴名称
        nameTextStyle: {     // 名称文本样式
            show: V.labelShow,
            color: V.textColor,
            fontSize: 14,
            fontWeight: 'bold'
        },
        axisLabel: {         // 轴标签样式
            color: V.labelColor,
            formatter: function (value) {
                return `${value + V.unit}`
            }
        },
        axisLine: {          // 轴线样式
            show: V.show,
            symbol: getSymbol(V.symbol),
            lineStyle: {
                color: V.lineColor,
            },
            onZero: false,
        },
        axisTick: {           // 刻度线样式
            show: V.tickLine,         // 是否显示刻度
            alignWithLabel: true, // 刻度与标签对齐

        },
        splitLine: {          // 分割线（网格线）
            show: V.splitLine         // 关闭x轴分割线
        },
        position: getPosition(V.position, 1),
        inverse: !V.symbol,
        gridIndex: V.G.gridIndex,
        offset: V.offset
    })
}


//获取字段
const getFieldByIndex = (index) => {
    const {dataset} = storeToRefs(useOptionConfig())
    return dataset.value.dimension[index]
}

export const startPoints = ['start', 'middle', 'end']

export const chartType = ['line', 'bar', 'scatter', 'pie', 'radar']

