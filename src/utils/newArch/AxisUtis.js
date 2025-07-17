import {buildGrid, buildPolar, getPosition, getSymbol} from "./Position.js";
import emitter from "../../emitter/emitter.js";

import {unloadSeriesLazy} from "./Check4Series.js";
import {getRadarCData} from "./DataUtils.js";


export const loadAxis = (c, echartsOptions) => {

    if (c.type === 0) loadX0yAxis(c, echartsOptions)
    else if (c.type === 1) loadPolarAxis(c, echartsOptions)
    //else if (c.type === 3) loadRadarAxis(c, echartsOptions)

    emitter.emit('load-chart')
}

const loadX0yAxis = (c, echartsOptions) => {

    const grid = buildGrid(c.grid.t, c.grid.b, c.grid.l, c.grid.r, c.grid.w, c.grid.h)

    grid.id = c.id
    //console.log('构建定位模型', grid)

    const xAxis = getSimpleAxisModel(c.H)
    xAxis.id = c.id
    xAxis.offset = c.H.offset
    xAxis.position = getPosition(c.H.position, 0)
    xAxis.gridId = c.id
    xAxis.type = !c.axisType ? 'category' : 'value'  // 类目轴（离散数据）
    xAxis.z = 2
    //console.log("构建x轴模型", xAxis)

    const yAxis = getSimpleAxisModel(c.V)
    yAxis.id = c.id
    yAxis.offset = c.V.offset
    yAxis.position = getPosition(c.V.position, 1)
    yAxis.gridId = c.id
    yAxis.type = c.axisType ? 'category' : 'value'
    yAxis.z = 2
    //console.log("构建y轴模型", yAxis)

    echartsOptions.value.xAxis.push(xAxis)
    echartsOptions.value.yAxis.push(yAxis)
    echartsOptions.value.grid.push(grid)

}

const loadPolarAxis = (c, echartsOptions) => {
    const polar = buildPolar(c.polar.pi, c.polar.po, c.polar.pl, c.polar.pt)
    polar.id = c.id
    //console.log('构建定位模型', polar)

    const R = getSimpleAxisModel(c.H)
    R.id = c.id
    R.polarId = c.id
    R.type = !c.axisType ? 'category' : 'value'  // 类目轴（离散数据）
    R.z = 2
    //console.log("构建半径轴模型", R)

    const A = getSimpleAxisModel(c.V)
    A.id = c.id
    A.polarId = c.id
    A.type = c.axisType ? 'category' : 'value'
    A.startAngle = c.V.sa
    A.endAngle = c.V.ea
    A.z = 2
    //console.log("构建角度轴模型", A)

    echartsOptions.value.radiusAxis.push(R)
    echartsOptions.value.angleAxis.push(A)
    echartsOptions.value.polar.push(polar)
}

const loadRadarAxis = (c, echartsOptions) => {
    const radar = buildPolar(c.polar.pi, c.polar.po, c.polar.pl, c.polar.pt)

    radar.id = c.id
    radar.indicator = getRadarCData(c.field, c.max, c.axisLabelColor)
    radar.shape = shape[c.shape]

    radar.splitNumber = c.splitNumber
    radar.splitLine = {
        show: c.isSplitLine,
        lineStyle: {
            color: c.splitColor
        }
    }

    radar.splitArea = {
        areaStyle: {
            color: c.colorSet,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 10
        }
    }

    radar.axisLabel = {
        show: c.axisLabel,
        color:c.axisLabelColor,
        hideOverlap: c.hideOverlap
    }

    radar.axisLine = {
        show: c.isAxisLine,
        color:c.axisLineColor,
    }

    //console.log('构建定位模型', radar)
    echartsOptions.value.radar.push(radar)

}

export const changeAxisType = (c, echartsOptions) => {

    if (c.type === 0) {
        //console.log('改变x0y轴类型')
        const targetXAxis = echartsOptions.value.xAxis.find(i => i.id === c.id)
        const targetYAxis = echartsOptions.value.yAxis.find(i => i.id === c.id)

        if (targetXAxis && targetYAxis) {
            targetXAxis.type = !c.axisType ? 'category' : 'value'
            targetYAxis.type = c.axisType ? 'category' : 'value'
        }

    } else if (c.type === 1) {
        //console.log('改变极坐标轴类型')

        const targetXAxis = echartsOptions.value.radiusAxis.find(i => i.id === c.id)
        const targetYAxis = echartsOptions.value.angleAxis.find(i => i.id === c.id)

        if (targetXAxis && targetYAxis) {
            targetXAxis.type = !c.axisType ? 'category' : 'value'
            targetYAxis.type = c.axisType ? 'category' : 'value'
        }
    } else {
        //console.log('改变饼图')
    }

    emitter.emit('load-chart')
}

export const deleteAxis = (c, Cs, Ss, echartsOptions) => {
    if (c.type === 0) {
        //console.log('卸载x0y系')
        echartsOptions.value.xAxis = echartsOptions.value.xAxis.filter(i => i.id !== c.id)
        echartsOptions.value.yAxis = echartsOptions.value.yAxis.filter(i => i.id !== c.id)
        echartsOptions.value.grid = echartsOptions.value.grid.filter(i => i.id !== c.id)
        Cs.value = Cs.value.filter(i => i.id !== c.id)

    } else if (c.type === 1) {
        //console.log('卸载极坐标系')
        echartsOptions.value.radiusAxis = echartsOptions.value.radiusAxis.filter(i => i.id !== c.id)
        echartsOptions.value.angleAxis = echartsOptions.value.angleAxis.filter(i => i.id !== c.id)
        echartsOptions.value.polar = echartsOptions.value.polar.filter(i => i.id !== c.id)
        Cs.value = Cs.value.filter(i => i.id !== c.id)
    }
    //console.log('卸载受影响的系列')
    Ss.value.filter(i => i.C?.id === c.id).forEach((i) => {
        if (i.isLoad) unloadSeriesLazy(i, echartsOptions)
        i.C = null
    })
    emitter.emit('load-chart')

}

const getSimpleAxisModel = (axis) => {
    return {
        name: axis.axisName,        // 坐标轴名称
        nameTextStyle: {     // 名称文本样式
            color: axis.textColor, fontSize: 14, fontWeight: 'bold'
        }, axisLabel: {         // 轴标签样式
            show: axis.labelShow, color: axis.labelColor, formatter: function (value) {
                return `${value + axis.unit}`
            }
        }, axisLine: {          // 轴线样式
            show: axis.show, symbol: getSymbol(axis.symbol), lineStyle: {
                color: axis.lineColor,
            }, onZero: false,
        }, axisTick: {           // 刻度线样式
            show: axis.tickLine,         // 是否显示刻度
            alignWithLabel: true, // 刻度与标签对齐

        }, splitLine: {          // 分割线（网格线）
            show: axis.splitLine         // 关闭x轴分割线
        }, inverse: !axis.symbol,

    }
}

const shape = ['circle', 'polygon']