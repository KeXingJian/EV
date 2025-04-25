import {
    buildPolar,
    getData,
    getData3, getPieData,
    getPosition,
    getSymbol,
    unloadAxis,
    unloadSeries
} from "./CheckUtils.js";
import {storeToRefs} from "pinia";
import {useOptionConfig} from "../store/OptionConfig.js";
import {getFieldDetails, x0y} from "./BeautifyUtils.js";

export const addSeries = (series, echartsOptions, data) => {
    const addItem = {
        id: series.id,
        name: series.name,
        emphasis: {
            focus: 'series',
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        },
        areaStyle: null,
        itemStyle: {},
        label: {
            show: series.isLabel,
            color: series.labelColor
        },
        labelLine:{

        }
    }

    if (series.G.type === 0) { //折线 或 条形 或 散点
        console.log('构建折线模型或柱状或散点')
        addItem.coordinateSystem = 'cartesian2d'
        addItem.xAxisId = series.H.id
        addItem.yAxisId = series.V.id
        addSeriesForType0(addItem, series, data, echartsOptions)
    } else if (series.G.type === 1) { //极坐标系
        addItem.coordinateSystem = 'polar'
        console.log('极坐标系')
        addItem.polarId = series.G.id
        addSeriesForType0(addItem, series, data, echartsOptions)
    } else if (series.G.type === 2) {//饼图
        console.log('构建饼图模型')

        addSeriesForType1(addItem, series, echartsOptions)
    }

    if (data.length>5000) addItem.sampling= 'lttb'
    else if(data.length >=1000 && series.G.type === 1) addItem.sampling= 'lttb'


    echartsOptions.value.series.push(addItem)
}

export const loadH = (H, echartsOptions) => {

    if(H.G.type===2){
        console.log('为饼图禁止加载轴')
        return
    }

    if (H.G.isStack && H.G.stackType && H.type === 1) {
        console.log('H轴使用堆叠轴,禁止加载')
        return
    }

    if (H.G.type === 1){
        console.log('极坐标不加载任何轴')
        return
    }

    H.axisName = getFieldByIndex(H.field)

    console.log('尝试加载横轴', H)
    if (H.isLoad) { //已经加载过说明只是,字段变更
        console.log('横轴已加载,开始重载')
        let targetAxis = null
        if (H.G.type === 0) { //x0y类型
            console.log('为x0y型,找到xAxis')
            targetAxis = echartsOptions.value.xAxis.find(i => i.id === H.id)
        } else if (H.G.type === 2) { //饼图
            console.log('加载饼图型')
        } else if (H.G.type === 3) { // 雷达
            console.log('加载雷达型')
        }

        if (targetAxis) {
            targetAxis.name = H.axisName
            targetAxis.type = H.type === 0 ? 'category' : 'value'
            console.log('重载')
        }


    } else {
        console.log('H轴未加载,开始加载')
        if (H.G.type === 0) { //x0y类型 极坐标
            addHForType0(H, echartsOptions)
        } else if (H.G.type === 2) { //饼图
            console.log('加载饼图型')
        } else if (H.G.type === 3) { // 雷达
            console.log('加载雷达型')
        }
        H.isLoad = true
    }

}

export const loadV = (V, echartsOptions) => {

    if(V.G.type===2){
        console.log('为饼图禁止加载轴')
        return
    }

    if (V.G.isStack && !V.G.stackType && V.type === 1) {
        console.log('V轴使用堆叠轴,禁止加载')
        return
    }

    if (V.G.type === 1){
        console.log('极坐标不加载任何轴')
        return
    }

    V.axisName = getFieldByIndex(V.field)

    console.log('尝试加载纵轴', V)
    if (V.isLoad) { //已经加载过说明只是,字段变更
        console.log('V轴已加载,开始重载')
        let targetAxis = null
        if (V.G.type === 0) { //x0y类型
            console.log('为x0y型,找到yAxis')
            targetAxis = echartsOptions.value.yAxis.find(i => i.id === V.id)
        } else if (V.G.type === 2) { //饼图
            console.log('加载饼图')
        } else if (V.G.type === 3) { // 雷达
            console.log('加载雷达')
        }

        if (targetAxis) {
            targetAxis.name = V.axisName
            targetAxis.type = V.type === 0 ? 'category' : 'value'
            console.log('重载')
        }
    } else {
        console.log('纵轴未加载,开始加载')
        if (V.G.type === 0) { //x0y类型
            addVForType0(V, echartsOptions)
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

    if (series.type === 0) {
        //曲线
        addItem.smooth = series.lineConfig.lineType === 1;
        //折线
        if (series.lineConfig.lineType === 2) addItem.step = startPoints[series.lineConfig.startPoint]
        //面积化
        if (series.lineConfig.isArea) addItem.areaStyle = {color: series.areaColor}

    } else if (series.type === 2) { //散点
        console.log('载入散点配置')
        if (series.scatterConfig.type === 1 && series.scatterConfig.mapField !== -1) {
            console.log('且为气泡')
            const {max, min} = getFieldDetails(series.scatterConfig.mapField)
            addItem.data = getData3(series.H.field, series.V.field, series.scatterConfig.mapField,series.D)
            addItem.symbolSize = function (val) {
                return 40 * ((val[2] - min) / (max - min)) + 20;
            }
        } else {
            addItem.data = getData(series.H.field, series.V.field,series.D)
            addItem.symbolSize = function (val) {
                return 10;
            }
        }
    }

    //堆叠


   if (series.G.type===1){
        if (series.G.isStack) addItem.stack = series.G.id + 'l'
        else addItem.stack = null
    } else if (series.G.isStack && series.G.stackType && series.H.type === 1) {
        console.log('启用堆叠H轴,')
        addItem.xAxisId = -1 + series.G.name
        addItem.stack = series.G.id + 'l'
    } else if (series.G.isStack && !series.G.stackType && series.V.type === 1) {
        console.log('启用堆叠V轴,')
        addItem.yAxisId = -1 + series.G.name
        addItem.stack = series.G.id + 'l'
    } else {
        addItem.stack = null
    }


    x0y(series, echartsOptions, addItem)

    console.log('载入系列模型', addItem)
}

const addSeriesForType1 = (addItem, series)=>{
    addItem.data = getPieData(series.H.field,series.V.field,series.color,series.D)
    series.type = 3
    addItem.type = chartType[series.type]

    addItem.itemStyle.borderRadius = series.pieConfig.borderRadius
    addItem.padAngle = series.pieConfig.padAngle

    addItem.label.position = labelTypeForPosition[series.pieConfig.position]
    addItem.labelLine.show = series.pieConfig.labelLine



    const position = buildPolar(0,80,50,50)
    addItem.radius = position.radius
    addItem.center = position.center

    if (series.pieConfig.isRose) addItem.roseType = roseTypeSelect[series.pieConfig.roseType]
    else addItem.roseType = false
}
//横轴
export const addHForType0 = (H, echartsOptions) => {

    const model = {
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
        inverse: !H.symbol,
        offset: H.offset
    }

    model.gridIndex = H.G.gridIndex
    model.position = getPosition(H.position, 0)
    console.log('加载x0y型')
    echartsOptions.value.xAxis.push(model)
}

export const addHForType1 = (H, echartsOptions) => {
    const model = {
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
        inverse: !H.symbol,
        z:2
    }
    model.polarId = H.polarId
    console.log('加载极坐标型')
    echartsOptions.value.radiusAxis.push(model)
}
//纵轴
export const addVForType0 = (V, echartsOptions) => {

    const model = {
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
        inverse: !V.symbol,
    }


    console.log('加载x0y')
    model.gridIndex = V.G.gridIndex
    model.position = getPosition(V.position, 1)
    model.offset = V.offset
    echartsOptions.value.yAxis.push(model)


}

export const addVForType1 = (V, echartsOptions) => {
    const model = {
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
        inverse: !V.symbol,

    }

    console.log('加载极坐标')
    model.polarId = V.polarId
    model.startAngle = V.sa
    model.endAngle = V.ea
    echartsOptions.value.angleAxis.push(model)

}

//获取字段
const getFieldByIndex = (index) => {
    const {dataset} = storeToRefs(useOptionConfig())
    return dataset.value.dimension[index]
}

export const startPoints = ['start', 'middle', 'end']

export const chartType = ['line', 'bar', 'scatter', 'pie', 'radar']

export const unloadGraphHasLoadItem = (item, Ss, Hs, Vs) => {
    Ss.value.filter(i => i.isLoad && i.G.id === item.id).forEach((i) => {
        unloadSeries(i)
    })

    Hs.value.filter(i => i.isLoad && i.G.id === item.id).forEach((i) => {
        console.log("卸载横轴", i)
        unloadAxis(i, 0)
    })

    Vs.value.filter(i => i.isLoad && i.G.id === item.id).forEach((i) => {
        console.log("卸载纵轴", i)
        unloadAxis(i, 1)
    })
    item.isStackAxisLoad = false
}

export const load4Stack = (item, Ss, Hs, Vs, echartsOptions) => {

    const stackAxis = {
        id: -1 + item.name,
        name: '堆叠轴-' + item.name,
        G: item,
        isLoad: true,
        field: -1,
        type: 1,
        axisName: '堆叠轴',
        unit: '',
        textColor: '#fff',
        labelColor: '#fff',
        lineColor: '#0D6E6E',
        tickLine: false,
        splitLine: false,
        textShow: true,
        show: true,
        symbol: true,
        position: false,
        offset: 0,
    }
    console.log('添加堆叠轴')
    if (item.stackType) { //倾向加载V轴
        Hs.value.push(stackAxis)
        console.log('载入堆叠轴')
        addHForType0(stackAxis, echartsOptions)
    } else {
        Vs.value.push(stackAxis)
        console.log('载入堆叠轴')
        addVForType0(stackAxis, echartsOptions)
    }


    item.isStackAxisLoad = true

}

export const unload4Stack = (stackType, Hs, Vs, echartsOptions, props) => {
    console.log('从echartsOptions卸载堆叠轴')
    if (stackType) {
        echartsOptions.value.xAxis = echartsOptions.value.xAxis.filter(i => i.id !== -1 + props.item.name,)
        console.log('从映射配置中移除')
        Hs.value = Hs.value.filter(item =>
            item.id !== -1 + props.item.name,
        )
    } else {
        echartsOptions.value.yAxis = echartsOptions.value.yAxis.filter(i => i.id !== -1 + props.item.name,)
        console.log('从映射配置中移除')
        Vs.value = Vs.value.filter(item =>
            item.id !== -1 + props.item.name,
        )
    }
}

export const labelTypeForPie = ['none','edge']

export const labelTypeForPosition = ['inner','outside']

export const roseTypeSelect = ['radius','area']