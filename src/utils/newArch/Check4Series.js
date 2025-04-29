import {getData, getData3, getPieData} from "./DataUtils.js";
import {getFieldDetails, x0y} from "../BeautifyUtils.js";
import emitter from "../../emitter/emitter.js";
import {buildPolar} from "./Position.js";
import {pushMsg} from "../MsgUtils.js";


export const checkSeries = (s,echartsOptions)=>{
    console.log('检查系列',s)
    if (s.isLoad){
        console.log('发现已加载尝试重载')
        if (checkLink(s)){
            console.log('正向变更,开始重载')
            updateSeries(s,echartsOptions)
        }else {
            console.log('负向变更,开始卸载')
            unloadSeries(s,echartsOptions)
        }
    }else {
        console.log('开始加载')
        if (checkLink(s)) loadSeries(s,echartsOptions)
    }

}

const loadSeries = (s,echartsOptions)=>{

    const addItem = {
        id: s.id,
        name: s.seriesName,
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
            show: s.isLabel,
            color: s.labelColor
        },
        labelLine:{

        }
    }
    //检查使用什么系列
    if(s.C.type === 0){
        console.log('加载x0y系列')
        addItem.coordinateSystem = 'cartesian2d'
        addItem.xAxisId = s.C.id
        addItem.yAxisId = s.C.id
        addSeriesForType0(addItem,s,echartsOptions)

    }else if(s.C.type === 1){
        console.log('加载极坐标系列')
        addItem.coordinateSystem = 'polar'
        addItem.polarId = s.C.id
        addSeriesForType0(addItem,s,echartsOptions)
    }else {
        console.log('加载饼图')
        addPie(addItem,s)
        pushMsg(0,`饼图颜色调整方式:点击扇叶`)

    }
    echartsOptions.value.series.push(addItem)
    console.log('载入系列模型', addItem)
    emitter.emit('load-chart')
    s.isLoad = true
}

//系列
const addSeriesForType0 = (addItem, series, echartsOptions) => {

    addItem.type = chartType[series.type]
    getDataForSimpleSeries(addItem,series)
    if (series.type === 0) {
        //曲线
        addItem.smooth = series.lineConfig.lineType === 1;
        //折线
        if (series.lineConfig.lineType === 2) addItem.step = startPoints[series.lineConfig.startPoint]
        //面积化
        if (series.lineConfig.isArea) addItem.areaStyle = {color: series.areaColor}
    } else if(series.type === 1){
        addItem.barWidth = series.barConfig.barWidth

        addItem.itemStyle.borderRadius = series.barConfig.borderRadius
        getDataForSimpleSeries(addItem,series)

    }else if (series.type === 2) { //散点
        console.log('载入散点配置')
        if (series.scatterConfig.type === 1 && series.scatterConfig.mapField !== -1) {
            console.log('且为气泡')
            const {max, min} = getFieldDetails(series.scatterConfig.mapField)
            addItem.symbolSize =  function (val) {
                return (series.scatterConfig.range[1]-series.scatterConfig.range[0]) *((val[2]-min) / (max-min)) +series.scatterConfig.range[0];
            }
        }else {
            addItem.symbolSize = series.scatterConfig.size;

        }
    }

    if (series.C.isStack){
        addItem.stack = series.C.id+'stack'+series.type
    }

    x0y(series, echartsOptions, addItem)

}

const addPie = (addItem,series)=>{
    series.type = 3

    addItem.data = getPieData(series.category,series.number,series.color,series.D)

    if (addItem.data.length>=500) {
        pushMsg(1,`系列[${addItem.name}]数据条目超过500开启视口取样优化`)
        addItem.sampling = 'lttb'
    }
    else addItem.sampling = undefined

    addItem.type = chartType[series.type]

    addItem.itemStyle.borderRadius = series.pieConfig.borderRadius
    addItem.padAngle = series.pieConfig.padAngle

    addItem.label.show = series.isLabel
    addItem.label.color = series.labelColor

    addItem.label.position = labelTypeForPosition[series.pieConfig.position]
    addItem.labelLine.show = series.pieConfig.labelLine

    const position = buildPolar(
        series.pieConfig.polar.pi,
        series.pieConfig.polar.po,
        series.pieConfig.polar.pl,
        series.pieConfig.polar.pt
    )

    addItem.radius = position.radius
    addItem.center = position.center

    if (series.pieConfig.isRose) addItem.roseType = roseTypeSelect[series.pieConfig.roseType]
    else addItem.roseType = false


}

const updateSeries = (s,echartsOptions)=>{
    const targetSeries = echartsOptions.value.series.find(i=>i.id===s.id)
    if (s.C.type === 0){
        targetSeries.coordinateSystem = 'cartesian2d'
        targetSeries.xAxisId = s.C.id
        targetSeries.yAxisId = s.C.id

        getDataForSimpleSeries(targetSeries,s)
    }else if (s.C.type===1){
        getDataForSimpleSeries(targetSeries,s)
        targetSeries.coordinateSystem = 'polar'
        targetSeries.polarId = s.C.id
    }else {
        targetSeries.data = getPieData(s.category,s.number,s.color,s.D,targetSeries)

        if (targetSeries.data.length>=500) {
            pushMsg(1,`系列[${targetSeries.name}]数据条目超过500开启视口取样优化`)
            targetSeries.sampling = 'lttb'
        }
        else targetSeries.sampling = undefined
    }


    if (s.C.isStack){
        targetSeries.stack = s.C.id+'stack'+s.type
    }else {
        targetSeries.stack = undefined
    }
    emitter.emit('load-chart')

}

export const unloadSeries = (s,echartsOptions)=>{
    echartsOptions.value.series = echartsOptions.value.series.filter(i=>i.id!==s.id)
    s.isLoad = false
    emitter.emit('load-chart')
}

export const unloadSeriesLazy = (s,echartsOptions)=>{
    echartsOptions.value.series = echartsOptions.value.series.filter(i=>i.id!==s.id)
    s.isLoad = false
}

export const deleteSeries = (s,Ss,echartsOptions)=>{
    unloadSeries(s,echartsOptions)
    Ss.value = Ss.value.filter(i=>i.id!==s.id)
}

const checkLink = (s)=>{
    return !(s.category === -1 || s.number === -1 || !s.C || !s.D);
}

export const getDataForSimpleSeries = (addItem,series)=>{
    if (series.C.axisType && series.type!==2){
        addItem.data = getData(series.number,series.category,series.D)
    }else if((!series.C.axisType) && series.type!==2) {
        addItem.data = getData(series.category,series.number,series.D)
    }else if (series.C.axisType){
        if (series.scatterConfig.mapField!==-1) addItem.data = getData3(
            series.number, series.category, series.scatterConfig.mapField,series.D
        )
        else addItem.data = getData(series.number,series.category,series.D)
    }else {
        if (series.scatterConfig.mapField!==-1) addItem.data = getData3(
            series.category, series.number, series.scatterConfig.mapField,series.D
        )
        else addItem.data = getData(series.category,series.number,series.D)
    }

    if (addItem.data.length>=500) {
        pushMsg(1,`系列[${addItem.name}]数据条目超过500开启视口取样优化`)
        addItem.sampling = 'lttb'
    }
    else addItem.sampling = undefined
}

export const startPoints = ['start', 'middle', 'end']

export const chartType = ['line', 'bar', 'scatter', 'pie', 'radar']

export const labelTypeForPosition = ['inner','outside']

export const roseTypeSelect = ['radius','area']