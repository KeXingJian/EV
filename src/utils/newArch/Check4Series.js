import {getData, getData3, getPieData, getRadarVData} from "./DataUtils.js";
import {getFieldDetails, x0y} from "../BeautifyUtils.js";
import emitter from "../../emitter/emitter.js";
import {buildGrid, buildPolar} from "./Position.js";
import {pushMsg} from "../MsgUtils.js";
import {useOptionConfig} from "../../store/OptionConfig.js";
import zoomIcon from "../../assets/zoom.svg";
import {debounce} from "../DebounceUtils.js";


export const checkSeries = (s, echartsOptions) => {
    if (s.isLoad) {
        if (checkLink(s)) updateSeries(s, echartsOptions)
        else unloadSeries(s, echartsOptions)
    } else {
        if (checkLink(s)) loadSeries(s, echartsOptions)
    }

}

const loadSeries = (s, echartsOptions) => {

    s.isLoad = true
    emitter.emit('init-legend-area')

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

        if (s.type === 3) addPie(addItem, s,echartsOptions)
        else addFunnel(addItem, s,echartsOptions)

        pushMsg(0, `无系图颜色调整方式:点击对应区域`)

    }// else if (s.C.type === 3) addRadar(addItem, s,echartsOptions)

    echartsOptions.value.series.push(addItem)

    emitter.emit('load-chart')

}

//系列
const addSeriesForType0 = (addItem, series, echartsOptions) => {

    addItem.type = chartType[series.type]
    getDataForSimpleSeries(addItem, series)
    if (series.type === 0) {
        const lineConfig = series.lineConfig
        //曲线
        addItem.smooth = lineConfig.lineType === 1;
        //折线
        if (lineConfig.lineType === 2) addItem.step = startPoints[lineConfig.startPoint]
        //面积化
        if (lineConfig.isArea) addItem.areaStyle = {color: series.areaColor}
    } else if (series.type === 1) {
        const barConfig = series.barConfig
        //自动
        if (barConfig.isAuto) addItem.barWidth = undefined
        else addItem.barWidth = barConfig.barWidth

        addItem.itemStyle.borderRadius = barConfig.borderRadius
        getDataForSimpleSeries(addItem, series)

    } else if (series.type === 2) { //散点
        const scatterConfig = series.scatterConfig

        if (scatterConfig.type === 1 && scatterConfig.mapField !== -1) {
            const {max, min} = getFieldDetails(scatterConfig.mapField)
            addItem.symbolSize = function (val) {
                return (scatterConfig.range[1] - scatterConfig.range[0]) * ((val[2] - min) / (max - min)) + series.scatterConfig.range[0];
            }
        } else addItem.symbolSize = scatterConfig.size;

    }

    if (series.C.isStack) addItem.stack = series.C.id + 'stack' + series.type

    x0y(series, echartsOptions, addItem)

}

const addPie = (addItem, series,echartsOptions) => {
    // series.type = 3
    const pieConfig = series.pieConfig
    //优化
    if (addItem.data.length >= 500) {
        pushMsg(1, `系列[${addItem.name}]数据条目超过500开启视口取样优化`)
        addItem.sampling = 'lttb'
    } else addItem.sampling = undefined

    //设置类型
    addItem.type = chartType[series.type]

    //圆角与间距
    addItem.itemStyle.borderRadius = pieConfig.borderRadius
    addItem.padAngle = pieConfig.padAngle

    //标线
    addItem.label.position = labelTypeForPosition[pieConfig.position]
    addItem.labelLine.show = pieConfig.labelLine

    const position = buildPolar(
        pieConfig.polar.pi * pieConfig.polar.po / 100,
        pieConfig.polar.po,
        pieConfig.polar.pl,
        pieConfig.polar.pt
    )


    addItem.radius = position.radius
    addItem.center = position.center

    if (pieConfig.isRose) addItem.roseType = roseTypeSelect[pieConfig.roseType]
    else addItem.roseType = false

    loadPieArea(pieConfig,series.id,addItem,echartsOptions)

}

const addFunnel = (addItem, s,echartsOptions) => {
    const funnelConfig = s.funnelConfig
    addItem.funnelAlign = funnelAlign[funnelConfig.align]
    addItem.sort = funnelSort[funnelConfig.sort]
    addItem.label.position = funnelLabel[funnelConfig.labelPosition]

    addItem.gap = funnelConfig.gap

    addItem.width =  funnelConfig.position.w
    addItem.height = funnelConfig.position.h
    addItem.top =    funnelConfig.position.t
    addItem.left = funnelConfig.position.l

    loadFunnelArea(funnelConfig,s.id,addItem,echartsOptions)

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

//组装任何类型数据
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

export const loadPieArea = (pieConfig,id,targetPie,echartsOptions)=>{
    const {isLock} = useOptionConfig()

    const r = pieConfig.polar.po + 10
    const R = r * 2
    const top = pieConfig.polar.pt - r
    const left = pieConfig.polar.pl - r

    const rect = {
        position: [left ,  top ],
        type: 'rect',
        key: 'pie' + id,
        shape: {
            width: R,
            height: R
        },
        style: {
            fill:'#000',
            opacity: 0.1,
            stroke: '#000',
            lineWidth: 2, // 可选：增加线宽以增强虚线效果
            lineDash: [5, 5] // 虚线模式：5px 实线 + 5px 空白
        },
        invisible: isLock,
        draggable: !isLock,
        ondrag: null,
    }

    const point = {
        position: [left , top ],
        type: 'image',
        key: 'pie' + id,
        style: {
            fill: '000',
            image:zoomIcon,
            opacity: 1
        },
        shape:{
            width: 24,
            height: 24
        },
        invisible: isLock,
        draggable: !isLock,
        ondrag: null
    }

    rect.ondrag = (p) => {

        debounce(() => {

            const currentR  = pieConfig.polar.po + 10
            pieConfig.polar.pt = p.target.y + currentR
            pieConfig.polar.pl = p.target.x + currentR

            targetPie.center[1] = p.target.y + currentR
            targetPie.center[0] = p.target.x + currentR

            rect.position[0] = p.target.x
            rect.position[1] = p.target.y

            point.position[0] = p.target.x
            point.position[1] = p.target.y


            emitter.emit('merge-option')

        }, 100)()

    }

    point.ondrag = (p) => {
        debounce(() => {

            const dx = p.target.x - point.position[0]
            const dy = p.target.y - point.position[1]

            const d = Math.max(dx,dy)

            if (d>pieConfig.polar.po) {
                emitter.emit('merge-option')
                return
            }

            const currentR = pieConfig.polar.po + 10 - d

            pieConfig.polar.po = currentR - 10

            pieConfig.polar.pt = p.target.y + currentR
            pieConfig.polar.pl = p.target.x + currentR

            targetPie.radius[1] = currentR - 10

            targetPie.center[1] = p.target.y + currentR
            targetPie.center[0] = p.target.x + currentR

            rect.shape.width -= (d * 2)
            rect.shape.height -= (d * 2)

            rect.position[0] = p.target.x
            rect.position[1] = p.target.y

            point.position[0] = p.target.x
            point.position[1] = p.target.y


            emitter.emit('merge-option')

        }, 200)()
    }

    echartsOptions.value.graphic.elements.push(rect)
    echartsOptions.value.graphic.elements.push(point)
}

export const unloadPieArea = (id,echartsOptions)=>{
    echartsOptions.value.graphic.elements = echartsOptions.value
        .graphic
        .elements
        .filter(i=>i.key!=='pie'+id)
}

export const loadFunnelArea = (funnelConfig,id,targetFunnel,echartsOptions)=>{
    const {isLock} = useOptionConfig()

    const width = funnelConfig.position.w + 20
    const height = funnelConfig.position.h + 20
    const top = funnelConfig.position.t
    const left = funnelConfig.position.l


    const rect = {
        position: [left - 10,  top - 10],
        type: 'rect',
        key: 'funnel' + id,
        shape: {
            width: width,
            height: height
        },
        style: {
            fill:'#000',
            opacity: 0.1,
            stroke: '#000',
            lineWidth: 2, // 可选：增加线宽以增强虚线效果
            lineDash: [5, 5] // 虚线模式：5px 实线 + 5px 空白
        },
        invisible: isLock,
        draggable: !isLock,
        ondrag: null,


    }

    // 使用 SVG 图形作为缩放手柄

    const point = {
        position: [left - 10, top - 10],
        type: 'image',
        key: 'funnel' + id,
        style: {
            fill: '000',
            image:zoomIcon,
            opacity: 1
        },
        shape:{
            width: 24,
            height: 24
        },
        invisible: isLock,
        draggable: !isLock,
        ondrag: null
    }


    rect.ondrag = (p) => {
        debounce(() => {


            targetFunnel.left = p.target.x + 10
            targetFunnel.top = p.target.y + 10

            funnelConfig.position.l = p.target.x + 10
            funnelConfig.position.t = p.target.y + 10

            rect.position[0] = p.target.x
            rect.position[1] = p.target.y

            point.position[0] = p.target.x
            point.position[1] = p.target.y

        }, 100)()
    }


    point.ondrag = (p)=>{

        debounce(() => {

            const dx = p.target.x - point.position[0]
            const dy = p.target.y - point.position[1]

            targetFunnel.left = p.target.x + 10
            targetFunnel.top = p.target.y + 10

            funnelConfig.position.l = p.target.x + 10
            funnelConfig.position.t = p.target.y + 10

            rect.position[0] = p.target.x
            rect.position[1] = p.target.y

            point.position[0] = p.target.x
            point.position[1] = p.target.y


            rect.shape.width -= dx
            rect.shape.height -= dy

            targetFunnel.width = rect.shape.width - 20
            targetFunnel.height = rect.shape.height -20

            funnelConfig.position.w = rect.shape.width -20
            funnelConfig.position.h = rect.shape.height -20


            emitter.emit('merge-option')

        }, 100)()


    }

    echartsOptions.value.graphic.elements.push(rect)
    echartsOptions.value.graphic.elements.push(point)
}

export const unLoadFunnelArea = (id,echartsOptions)=>{
    echartsOptions.value.graphic.elements = echartsOptions.value
        .graphic
        .elements
        .filter(i=>i.key!=='funnel'+id)
}

export const pieInit = (newVal,echartsOptions)=>{
    const target = echartsOptions.value.series.find(i => i.id === newVal.id)
    const pieConfig = newVal.pieConfig

    target.label.show = newVal.isLabel
    target.label.color = newVal.labelColor

    target.itemStyle.borderRadius = pieConfig.borderRadius
    target.padAngle = pieConfig.padAngle

    target.label.position = labelTypeForPosition[pieConfig.position]
    target.labelLine.show = pieConfig.labelLine

    const position = buildPolar(
        pieConfig.polar.pi,
        pieConfig.polar.po,
        pieConfig.polar.pl,
        pieConfig.polar.pt
    )
    target.height = undefined
    target.width = undefined
    target.top = undefined
    target.left = undefined
    position.radius[0] = pieConfig.polar.po * pieConfig.polar.pi / 100
    target.radius = position.radius
    target.center = position.center


    if (pieConfig.isRose) target.roseType = roseTypeSelect[pieConfig.roseType]
    else target.roseType = false


}

export const funnelInit = (newVal,echartsOptions)=>{
    const funnelConfig = newVal.funnelConfig
    const target = echartsOptions.value.series.find(i => i.id === newVal.id)

    target.label.show = newVal.isLabel
    target.label.color = newVal.labelColor
    target.funnelAlign = funnelAlign[funnelConfig.align]
    target.sort = funnelSort[funnelConfig.sort]
    target.label.position = funnelLabel[funnelConfig.labelPosition]

    target.gap = funnelConfig.gap

    target.radius = undefined
    target.center = undefined

    target.width = funnelConfig.position.w
    target.height = funnelConfig.position.h
    target.top = funnelConfig.position.t
    target.left = funnelConfig.position.l
}

export const startPoints = ['start', 'middle', 'end']

export const funnelLabel = ['left', 'inside', 'right']

export const funnelAlign = ['left', 'center', 'right']

export const funnelSort = ['ascending', 'none', 'descending']

export const chartType = ['line', 'bar', 'scatter', 'pie', 'funnel', 'radar']

export const labelTypeForPosition = ['inner', 'outside']

export const roseTypeSelect = ['radius', 'area']