import {getData, getData3, getPieData, getRelationData, getSingle} from "./DataUtils.js";
import emitter from "../../emitter/emitter.js";
import {buildPolar, getRandomInt, labelTypeForPosition, roseTypeSelect} from "./Position.js";
import {pushMsg} from "../MsgUtils.js";
import {useOptionConfig} from "../../store/OptionConfig.js";
import zoomIcon from "../../assets/zoom.svg";
import {debounce} from "../DebounceUtils.js";
import {
    chartType,
    funnelAlign,
    funnelLabel,
    funnelSort, legendStyleSelect,
    relationEdgeLabelPosition,
    relationEdgeSymbol,
    relationLabelPosition,
    relationLayout, relationStyleSelect,
    startPoints
} from "./ConstantPool.js";
import {storeToRefs} from "pinia";


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
        id: s.id,
        name: s.seriesName,
        emphasis: {
            focus: 'series',
            itemStyle: {
                shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        },
        areaStyle: null,
        itemStyle: {},
        label: {
            show: s.isLabel,
            color: s.labelColor
        },
        labelLine: {},
        data: []
    }
    //检查使用什么系列
    if (s.C?.type === 0) {

        addItem.coordinateSystem = 'cartesian2d'
        addItem.xAxisId = s.C.id
        addItem.yAxisId = s.C.id
        addSeriesForType0(addItem, s)

    } else if (s.C?.type === 1) {
        addItem.coordinateSystem = 'polar'
        addItem.polarId = s.C.id
        addSeriesForType0(addItem, s)
    } else if (s.C?.type === 2) {
        //获取数据
        addItem.data = getPieData(s.category, s.number, s.color, s.D,s.id)

        if (s.type === 3) addPie(addItem, s,echartsOptions)
        else addFunnel(addItem, s,echartsOptions)

        pushMsg(0, `无系图颜色调整方式:点击对应区域`)

    }else if(s.type === 5){
        if (s.isAI) addRelation2(addItem,s)
        else addRelation(addItem,s)
    }

    echartsOptions.series.push(addItem)

    emitter.emit('load-chart')

}

//系列配置加载
const addSeriesForType0 = (addItem, series) => {
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

    x0y(series,addItem)
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

const addRelation = (addItem,s)=>{

    const {getChartSize} = useOptionConfig()

    const {width, height} = getChartSize()

    const data = getRelationData(s)
    const nodeMap = new Map();
    const edges = [];
    const ids =  getSingle(0)
    const {
        labelConfig,symbolConfig,
        categoryConfig,otherConfig,
        colorSet,edgeLabel,weightConfig
    } = s

    addItem.type = chartType[5]
    addItem.data = undefined
    addItem.nodeScaleRatio = 0

    addItem.emphasis.focus = 'adjacency'
    addItem.emphasis.scale = 1

    addItem.roam = true
    addItem.draggable = true
    addItem.selectedMode = 'multiple'

    addItem.layout = relationLayout[s.layout]
    addItem.select = {
        lineStyle:{
            width: 3,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10
        }
    }

    //以上不修改
    addItem.color = symbolConfig.color
    addItem.symbol = relationStyleSelect[symbolConfig.symbol].label
    addItem.symbolSize = weightConfig.symbolSize

    addItem.label.show = labelConfig.isLabel
    addItem.label.color = labelConfig.labelColor
    addItem.label.position = relationLabelPosition[labelConfig.position]

    addItem.edgeLabel = {
        show:edgeLabel.show,
        position: relationEdgeLabelPosition[edgeLabel.position],
        fontSize: 10,
        color: edgeLabel.color
    }
    addItem.lineStyle = {
        width:1,
        color: edgeLabel.color
    }
    addItem.edgeSymbol = relationEdgeSymbol[otherConfig.isDirected*1]


    const {canCategoryMap} = categoryConfig
    const {canWeightMap} = weightConfig


    //节点类目
    const categoryData =  canCategoryMap ?
        getSingle(5) : null
    //去重
    const category = canCategoryMap ?
        [...new Set(categoryData)].map((i,index)=>{
            const length = colorSet.length
            return {
                name: i,
                itemStyle:{
                    color: length > 0 ? colorSet[index % length] : symbolConfig.color
                }
            }
        }) : []

    const weightData = canWeightMap ?
        getSingle(4) : null

    const nodesItem = [...new Set(getSingle(1))]


    const {max, min} = canWeightMap ? getFieldDetails(4) : {min: 0, max: 0}
    const [rMin,rMax] = weightConfig.symbolRange


    data.forEach((d,index) => {
        //从map中查询
        const target = nodeMap.get(d[0])

        if (
            d[0]&& d[2] &&
            d[0]!=='' && d[2]!=='' &&
            nodesItem.includes(d[2])
        ) {
            //取无效边
            edges.push({
                idEV:ids[index],
                source: d[0],
                target: d[2],
                label:{
                    formatter: d[1],
                },
                lineStyle:{

                },

            })
        }

        let currentCategory = undefined

        //处理节点
        let size = undefined
        let position = {
            x: getRandomInt(250,500),
            y: getRandomInt(250,500),
        }

        if (category)  currentCategory = category.findIndex(
            i=> i.name === categoryData[index]
        )

        if (canWeightMap){

            size  = rMin + (rMax - rMin) * (weightData[index] - min) / (max - min)

            if (canCategoryMap) position = centerSpreadWithRegion(
                    width, height, min, max, weightData[index],
                    category.length,currentCategory,4
            )
            else position = centerSpread(
                    width, height, min, max, weightData[index], 1
            )

        }else if (canCategoryMap)position = partitionOnly(
                width, height, category.length, currentCategory, 3
        )


        if (!target){
            nodeMap.set(d[0],{
                idEV: [ids[index]],
                name: d[0],
                symbolSize: size,
                itemStyle:{},
                category: currentCategory,
                ...position
            })

        }else {
            //覆盖
            if (canWeightMap) target.symbolSize = size
            target.idEV.push(ids[index])
        }


    })


    addItem.categories = category
    addItem.nodes = Array.from(nodeMap.values())
    addItem.edges = edges

}

const addRelation2 = (addItem,s)=>{

    const {getChartSize} = useOptionConfig()

    const {width, height} = getChartSize()

    const data = getRelationData(s)
    const nodeMap = new Map();
    const edges = [];
    const ids =  getSingle(0)
    const {
        labelConfig,symbolConfig,otherConfig,
        edgeLabel,weightConfig
    } = s

    addItem.type = chartType[5]
    addItem.data = undefined
    addItem.nodeScaleRatio = 0

    addItem.emphasis.focus = 'adjacency'
    addItem.emphasis.scale = 1

    addItem.roam = true
    addItem.draggable = true
    addItem.selectedMode = 'multiple'

    addItem.layout = relationLayout[s.layout]
    addItem.select = {
        lineStyle:{
            width: 3,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10
        }
    }

    //以上不修改
    addItem.color = symbolConfig.color
    addItem.symbol = relationStyleSelect[symbolConfig.symbol].label
    addItem.symbolSize = weightConfig.symbolSize

    addItem.label.show = labelConfig.isLabel
    addItem.label.color = labelConfig.labelColor
    addItem.label.position = relationLabelPosition[labelConfig.position]

    addItem.edgeLabel = {
        show:edgeLabel.show,
        position: relationEdgeLabelPosition[edgeLabel.position],
        fontSize: 10,
        color: edgeLabel.color
    }
    addItem.lineStyle = {
        width:1,
        color: edgeLabel.color
    }
    addItem.edgeSymbol = relationEdgeSymbol[otherConfig.isDirected*1]



    const {canWeightMap} = weightConfig


    const weightDataS = canWeightMap ?
        getSingle(4) : null
    const weightDataO = canWeightMap ?
        getSingle(5) : null


    const {max, min} = canWeightMap ? getFieldDetails(4) : {min: 0, max: 0}
    const [rMin,rMax] = weightConfig.symbolRange


    data.forEach((d,index) => {
        //从map中查询


        if (
            d[0] && d[2]
            &&
            d[0]!=='' && d[2]!==''
        ) edges.push({
                idEV:ids[index],
                source: d[0],
                target: d[2],
                label:{
                    formatter: d[1],
                },
                lineStyle:{

                },

        })
        handleRelation(
            nodeMap,d[0],min,max,rMin,rMax,index,canWeightMap,
                width,height,weightDataS,ids
        )

        handleRelation(
            nodeMap,d[2],min,max,rMin,rMax,index,canWeightMap,
            width,height,weightDataO,ids
        )


    })


    addItem.nodes = Array.from(nodeMap.values())
    addItem.edges = edges

}

//系列变更
const updateSeries = (s, echartsOptions) => {
    const targetSeries = echartsOptions.series.find(i => i.id === s.id)
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
        targetSeries.data = getPieData(s.category, s.number, s.color, s.D,s.id)

        if (targetSeries.data.length >= 500) {
            if (!lang) pushMsg(1, `系列[${targetSeries.name}]数据条目超过500开启视口取样优化`)
            else pushMsg(1, `series [${targetSeries.name}] enable viewport sampling optimization when data entries exceed 500`)
            targetSeries.sampling = 'lttb'
        } else targetSeries.sampling = undefined
    }


    if (s.C.isStack) targetSeries.stack = s.C.id + 'stack' + s.type
    else targetSeries.stack = undefined

    emitter.emit('load-chart')

}

export const unloadSeries = (s, echartsOptions) => {
    echartsOptions.series = echartsOptions.series.filter(i => i.id !== s.id)
    s.isLoad = false
    emitter.emit('load-chart')
}

export const unloadSeriesLazy = (s, echartsOptions) => {
    echartsOptions.series = echartsOptions.series.filter(i => i.id !== s.id)
    s.isLoad = false
}

export const deleteSeries = (s, Ss, echartsOptions) => {

    if (s.type === 5){
        const { isLoadRelation,chartInstance} = storeToRefs(useOptionConfig())
        chartInstance.value.off('selectchanged')
        chartInstance.value.off('mousedown')
        isLoadRelation.value = false
    }
    unloadSeries(s, echartsOptions)
    Ss.splice(Ss.findIndex(i => i.id !== s.id),1)
}

const checkLink = (s) => {

    return(
        (s.type===5 && s.from !==-1 && s.to !==-1 && s.relationship !==-1)
        ||
        (!(s.category === -1 || s.number === -1 || !s.C || !s.D))
    )
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

//缩放区域
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

    echartsOptions.graphic.elements.push(rect)
    echartsOptions.graphic.elements.push(point)
}

export const unloadPieArea = (id,echartsOptions)=>{
    echartsOptions.graphic.elements = echartsOptions
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

    echartsOptions.graphic.elements.push(rect)
    echartsOptions.graphic.elements.push(point)
}

export const unLoadFunnelArea = (id,echartsOptions)=>{
    echartsOptions.graphic.elements = echartsOptions
        .graphic
        .elements
        .filter(i=>i.key!=='funnel'+id)
}

//系列配置更新
export const updateLine = (newVal,echartsOptions)=>{
    const target = echartsOptions.series.find(i=>i.id===newVal.id)

    x0y(newVal,target)

    target.smooth = newVal.lineConfig.lineType === 1 ? 0.5 : 0

    if (newVal.lineConfig.lineType === 2) target.step = startPoints[newVal.lineConfig.startPoint]
    else target.step=''

    if (newVal.lineConfig.isArea) target.areaStyle = {color: newVal.areaColor}
    else target.areaStyle = null

}

export const updateBar = (newVal,echartsOptions)=>{
    const target = echartsOptions.series.find(i=>i.id===newVal.id)
    if(newVal.barConfig.isAuto){
        target.barWidth = undefined
    }else {
        target.barWidth = newVal.barConfig.barWidth
    }
    target.itemStyle.borderRadius = newVal.barConfig.borderRadius
    x0y(newVal,target)
}

export const updateScatter = (newVal,echartsOptions)=>{

    const target = echartsOptions.series.find(i => i.id === newVal.id)

    x0y(newVal, target)

    getDataForSimpleSeries(target,newVal)

    const {scatterConfig} = newVal

    if (scatterConfig.type === 1 && scatterConfig.mapField !==-1){
        const {max,min} = getFieldDetails(scatterConfig.mapField)
        target.symbolSize =  function (val) {
            return (scatterConfig.range[1]-scatterConfig.range[0]) *((val[2]-min) / (max-min)) +scatterConfig.range[0];
        }
    }else {
        target.symbolSize = scatterConfig.size;
    }

}

export const pieInit = (newVal,echartsOptions)=>{
    const target = echartsOptions.series.find(i => i.id === newVal.id)
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

    target.data = getPieData(newVal.category, newVal.number, newVal.color, newVal.D,newVal.id)


}

export const funnelInit = (newVal,echartsOptions)=>{
    const funnelConfig = newVal.funnelConfig
    const target = echartsOptions.series.find(i => i.id === newVal.id)

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
    target.data = getPieData(newVal.category, newVal.number, newVal.color, newVal.D,newVal.id)

}

//工具
export const x0y = (newVal,target)=>{
    target.itemStyle.color = newVal.color
    target.label.show = newVal.isLabel
    target.name = newVal.seriesName
}

export const getFieldDetails = (mapIndex)=>{
    const {fileData:{columnStats}} = useOptionConfig()
    return columnStats[mapIndex].numericStats
}

// 增加区域约束的中心散布算法
export function centerSpreadWithRegion(width, height, minWeight, maxWeight, currentWeight, regionCount, regionIndex, span = 1) {

    const weightRatio = (currentWeight - minWeight) / (maxWeight - minWeight);

    const distanceRatio = 1 - weightRatio + 0.2

    const maxRadius = Math.min(width, height)
    const radius = maxRadius * distanceRatio * (1+Math.random()) /2

    // 计算扇形区域的角度范围
    const sectorAngle = (2 * Math.PI) / regionCount;
    const baseStartAngle = regionIndex * sectorAngle;
    const baseEndAngle = (regionIndex + 1) * sectorAngle;

    // 根据跨度扩展扇形区域
    const spanAngle = sectorAngle * span;
    const startAngle = baseStartAngle - (spanAngle - sectorAngle) / 2;
    const endAngle = baseEndAngle + (spanAngle - sectorAngle) / 2;

    // 在扩展的扇形区域内随机选择角度
    const randomAngle = startAngle + Math.random() * (endAngle - startAngle);

    // 计算坐标
    const centerX = width / 2;
    const centerY = height / 2;

    const x = centerX + radius * Math.cos(randomAngle);
    const y = centerY + radius * Math.sin(randomAngle);

    return { x, y };
}
// 基础中心散布算法
export function centerSpread(width, height, minWeight, maxWeight, currentWeight, spreadFactor) {

    const weightRatio = (currentWeight - minWeight) / (maxWeight - minWeight);

    const distanceRatio = 1 - weightRatio + 0.2

    const maxRadius = Math.min(width, height)
    const radius = maxRadius * distanceRatio * spreadFactor * (1+Math.random()) /2

    const angle = Math.random() * 2 * Math.PI;

    const centerX = width / 2;
    const centerY = height / 2;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    return { x, y };
}

export function partitionOnly(width, height, regionCount, regionIndex, span = 1) {
    // 计算扇形区域的角度范围
    const sectorAngle = (2 * Math.PI) / regionCount;
    const baseStartAngle = regionIndex * sectorAngle;
    const baseEndAngle = (regionIndex + 1) * sectorAngle;

    // 根据跨度扩展扇形区域
    const spanAngle = sectorAngle * span;
    const startAngle = baseStartAngle - (spanAngle - sectorAngle) / 2;
    const endAngle = baseEndAngle + (spanAngle - sectorAngle) / 2;

    // 在扩展的扇形区域内随机选择角度
    const randomAngle = startAngle + Math.random() * (endAngle - startAngle);

    // 计算半径（随机在扇形区域内）
    const maxRadius = Math.min(width, height) / 2;
    const radius = Math.random() * maxRadius;

    // 计算坐标
    const centerX = width / 2;
    const centerY = height / 2;

    const x = centerX + radius * Math.cos(randomAngle);
    const y = centerY + radius * Math.sin(randomAngle);

    return { x, y };
}

const handleRelation = (
    nodeMap,node,min,max,rMin,rMax,index,canWeightMap,
    width,height,weightData,ids
)=>{

    const target = nodeMap.get(node)

    //处理节点
    let size = undefined
    let position = {
        x: getRandomInt(250,500),
        y: getRandomInt(250,500),
    }

    if (canWeightMap){
        size  = rMin + (rMax - rMin) * (weightData[index] - min) / (max - min)
        position = centerSpread(
            width, height, min, max, weightData[index], 1
        )

    }


    if (!target){
        nodeMap.set(node,{
            idEV: [ids[index]],
            name: node,
            symbolSize: size,
            itemStyle:{},
            ...position
        })

    }else {
        //覆盖
        if (canWeightMap) target.symbolSize = size
        target.idEV.push(ids[index])
    }

}


