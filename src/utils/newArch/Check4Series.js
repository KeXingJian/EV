import {getData, getData3, getPieData, getRadarVData} from "./DataUtils.js";
import {getFieldDetails, x0y} from "../BeautifyUtils.js";
import emitter from "../../emitter/emitter.js";
import {buildGrid, buildPolar} from "./Position.js";
import {pushMsg} from "../MsgUtils.js";
import {useOptionConfig} from "../../store/OptionConfig.js";


export const checkSeries = (s, echartsOptions) => {
    if (s.isLoad) {
        if (checkLink(s)) updateSeries(s, echartsOptions)
        else unloadSeries(s, echartsOptions)
    } else {
        if (checkLink(s)) loadSeries(s, echartsOptions)
    }

}

const loadSeries = (s, echartsOptions) => {

    const addItem = {
        id: s.id, name: s.seriesName, emphasis: {
            focus: 'series', itemStyle: {
                shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }, areaStyle: null, itemStyle: {}, label: {
            show: s.isLabel, color: s.labelColor
        }, labelLine: {}, data: []
    }
    //检查使用什么系列
    if (s.C.type === 0) {
        //console.log('加载x0y系列')
        addItem.coordinateSystem = 'cartesian2d'
        addItem.xAxisId = s.C.id
        addItem.yAxisId = s.C.id
        addSeriesForType0(addItem, s, echartsOptions)

    } else if (s.C.type === 1) {
        addItem.coordinateSystem = 'polar'
        addItem.polarId = s.C.id
        addSeriesForType0(addItem, s, echartsOptions)
    } else if (s.C.type === 2) {
        //获取数据
        addItem.data = getPieData(s.category, s.number, s.color, s.D)

        //标签
        addItem.label.show = s.isLabel
        addItem.label.color = s.labelColor

        if (s.type === 3) addPie(addItem, s)
        else addFunnel(addItem, s)

        pushMsg(0, `无系图颜色调整方式:点击对应区域`)

    }// else if (s.C.type === 3) addRadar(addItem, s,echartsOptions)

    echartsOptions.value.series.push(addItem)
    //console.log('载入系列模型', addItem)
    emitter.emit('load-chart')
    s.isLoad = true
}

//系列
const addSeriesForType0 = (addItem, series, echartsOptions) => {

    addItem.type = chartType[series.type]
    getDataForSimpleSeries(addItem, series)
    if (series.type === 0) {
        //曲线
        addItem.smooth = series.lineConfig.lineType === 1;
        //折线
        if (series.lineConfig.lineType === 2) addItem.step = startPoints[series.lineConfig.startPoint]
        //面积化
        if (series.lineConfig.isArea) addItem.areaStyle = {color: series.areaColor}
    } else if (series.type === 1) {
        //自动
        if (series.barConfig.isAuto) addItem.barWidth = undefined
        else addItem.barWidth = series.barConfig.barWidth

        addItem.itemStyle.borderRadius = series.barConfig.borderRadius
        getDataForSimpleSeries(addItem, series)

    } else if (series.type === 2) { //散点

        if (series.scatterConfig.type === 1 && series.scatterConfig.mapField !== -1) {
            const {max, min} = getFieldDetails(series.scatterConfig.mapField)
            addItem.symbolSize = function (val) {
                return (series.scatterConfig.range[1] - series.scatterConfig.range[0]) * ((val[2] - min) / (max - min)) + series.scatterConfig.range[0];
            }
        } else addItem.symbolSize = series.scatterConfig.size;

    }

    if (series.C.isStack) addItem.stack = series.C.id + 'stack' + series.type

    x0y(series, echartsOptions, addItem)

}

const addPie = (addItem, series) => {
    // series.type = 3

    //优化
    if (addItem.data.length >= 500) {
        pushMsg(1, `系列[${addItem.name}]数据条目超过500开启视口取样优化`)
        addItem.sampling = 'lttb'
    } else addItem.sampling = undefined

    //设置类型
    addItem.type = chartType[series.type]

    //圆角与间距
    addItem.itemStyle.borderRadius = series.pieConfig.borderRadius
    addItem.padAngle = series.pieConfig.padAngle

    //标线
    addItem.label.position = labelTypeForPosition[series.pieConfig.position]
    addItem.labelLine.show = series.pieConfig.labelLine

    const position = buildPolar(series.pieConfig.polar.pi, series.pieConfig.polar.po, series.pieConfig.polar.pl, series.pieConfig.polar.pt)

    addItem.radius = position.radius
    addItem.center = position.center

    if (series.pieConfig.isRose) addItem.roseType = roseTypeSelect[series.pieConfig.roseType]
    else addItem.roseType = false

}

const addFunnel = (addItem, s) => {
    addItem.funnelAlign = funnelAlign[s.funnelConfig.align]
    addItem.sort = funnelSort[s.funnelConfig.sort]
    addItem.label.position = funnelLabel[s.funnelConfig.labelPosition]

    addItem.gap = s.funnelConfig.gap

    const position = buildGrid(s.funnelConfig.position.t, s.funnelConfig.position.b, s.funnelConfig.position.l, s.funnelConfig.position.r, s.funnelConfig.position.w, s.funnelConfig.position.h,)

    addItem.width = position.width
    addItem.height = position.height
    addItem.top = position.top
    addItem.left = position.left

}

const addRadar = (addItem, s, echartsOptions) => {
    addItem.radarIndex = echartsOptions.value.radar.findIndex(i => s.C.id === i.id)

    addItem.type = 'radar'
    addItem.data.push({
        value: getRadarVData(s.number), name: s.seriesName, label: {
            show: s.isLabel, color: s.labelColor,
        }, itemStyle: {
            color: s.color
        }, areaStyle: {
            color: s.radarConfig.isArea ? s.radarConfig.areaColor : undefined
        }
    })
}

const updateSeries = (s, echartsOptions) => {
    const targetSeries = echartsOptions.value.series.find(i => i.id === s.id)
    const {lang} = useOptionConfig()
    if (s.C.type === 0) {
        targetSeries.coordinateSystem = 'cartesian2d'
        targetSeries.xAxisId = s.C.id
        targetSeries.yAxisId = s.C.id

        getDataForSimpleSeries(targetSeries, s)
    } else if (s.C.type === 1) {
        getDataForSimpleSeries(targetSeries, s)
        targetSeries.coordinateSystem = 'polar'
        targetSeries.polarId = s.C.id
    } else if (s.C.type === 2) {
        //console.log("update")
        targetSeries.data = getPieData(s.category, s.number, s.color, s.D, targetSeries)

        if (targetSeries.data.length >= 500) {
            if (!lang) pushMsg(1, `系列[${targetSeries.name}]数据条目超过500开启视口取样优化`)
            else pushMsg(1, `series [${targetSeries.name}] enable viewport sampling optimization when data entries exceed 500`)
            targetSeries.sampling = 'lttb'
        } else targetSeries.sampling = undefined
    }//else if (s.C.type === 3) targetSeries.data[0].value = getRadarVData(s.number)


    if (s.C.isStack) targetSeries.stack = s.C.id + 'stack' + s.type
    else targetSeries.stack = undefined

    emitter.emit('load-chart')

}

export const unloadSeries = (s, echartsOptions) => {
    echartsOptions.value.series = echartsOptions.value.series.filter(i => i.id !== s.id)
    s.isLoad = false
    emitter.emit('load-chart')
}

export const unloadSeriesLazy = (s, echartsOptions) => {
    echartsOptions.value.series = echartsOptions.value.series.filter(i => i.id !== s.id)
    s.isLoad = false
}

export const deleteSeries = (s, Ss, echartsOptions) => {
    unloadSeries(s, echartsOptions)
    Ss.value = Ss.value.filter(i => i.id !== s.id)
}

const checkLink = (s) => {
/*    if (s.C && s.C.type === 3) {
        if (s.D) pushMsg(1, '雷达系数据源锁定为ROOT,您可以通过过滤ROOT改变数据源')
        if (!s.category === -1) pushMsg(1, '雷达系类目锁定,您可以通过过滤ROOT改变类目')
        return !(s.number === -1)
    }*/
    return !(s.category === -1 || s.number === -1 || !s.C || !s.D)
}

export const getDataForSimpleSeries = (addItem, series) => {

    const {lang} = useOptionConfig()

    if (series.C.axisType && series.type !== 2) {
        addItem.data = getData(series.number, series.category, series.D)
    } else if ((!series.C.axisType) && series.type !== 2) {
        addItem.data = getData(series.category, series.number, series.D)
    } else if (series.C.axisType) {
        if (series.scatterConfig.mapField !== -1) addItem.data = getData3(series.number, series.category, series.scatterConfig.mapField, series.D)
        else addItem.data = getData(series.number, series.category, series.D)
    } else {
        if (series.scatterConfig.mapField !== -1) addItem.data = getData3(series.category, series.number, series.scatterConfig.mapField, series.D)
        else addItem.data = getData(series.category, series.number, series.D)
    }

    if (addItem.data.length >= 500) {
        if (!lang) pushMsg(1, `系列[${series.name}]数据条目超过500开启视口取样优化`)
        else pushMsg(1, `series [${series.name}] enable viewport sampling optimization when data entries exceed 500`)
        addItem.sampling = 'lttb'
    } else addItem.sampling = undefined
}

export const startPoints = ['start', 'middle', 'end']

export const funnelLabel = ['left', 'inside', 'right']

export const funnelAlign = ['left', 'center', 'right']

export const funnelSort = ['ascending', 'none', 'descending']

export const chartType = ['line', 'bar', 'scatter', 'pie', 'funnel', 'radar']

export const labelTypeForPosition = ['inner', 'outside']

export const roseTypeSelect = ['radius', 'area']