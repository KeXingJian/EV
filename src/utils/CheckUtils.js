import {useOptionConfig} from "../store/OptionConfig.js";
import {storeToRefs} from "pinia";
import emitter from "../emitter/emitter.js";
import {getGridSet, getPolarSet} from "./GridSetUtils.js";
import {addHForType1, addSeries, addVForType1, load4Stack, loadH, loadV} from "./ChartUtils.js";


export const checkAxis = (axis, type) => {
    console.log('检查轴类型变更合法性')
    //检查变更轴类型字段是否为数值
    const {fileData,Ss} = storeToRefs(useOptionConfig())
    const index = axis.field
    //类型->判断存在->是否符合->变为-1
    if (
        (
            axis.type === 1 &&
            fileData.value.columnStats &&
            !fileData.value.columnStats.filter(
                item => item.type === 'number'
            ).some(i => i.index === index)
        )//为数值,但不为数字
        || //或者
        (
            axis.type === 0 &&
            fileData.value.columnStats.find(
                item => item.index === axis.field
            ) &&  //找到且不唯一
            !fileData.value.columnStats.find(
                item => item.index === axis.field
            ).isUnique
        ) //为类目,但不为唯一
    ) {
        console.error('检查轴类型变更不合法性')
        axis.field = -1
        if (axis.isLoad) {
            if (type===0){
                Ss.value.forEach(item=>{
                    if (item.isLoad && item.H.id === axis.id){
                        seriesChange(item)
                    }
                })
            }else {
                Ss.value.forEach(item=>{
                    if (item.isLoad && item.V.id === axis.id){
                        seriesChange(item)
                    }
                })
            }


            console.log('发现其已加载,开始卸载')
            unloadAxis(axis, type)
        }
    }

}

export const checkSeriesForVDelete = (V) => {
    console.log('检查由于V轴删除所影响的数据集')
    const {Ss} = storeToRefs(useOptionConfig())

    console.log('卸载横轴')
    if (V.isLoad) unloadAxis(V, 1)

    console.log('检查所有数据集')
    Ss.value.forEach(s => {
        if (!s.V) {
            console.log('不存在V轴返回')
            return
        }
        if (s.V.id === V.id) {
            console.log('发现轴引用')
            if (s.isLoad) {
                console.log('发现系列已加载,尝试卸载')
                unloadSeries(s)
            }
            console.log('断开轴引用')
            s.V = null
        }
    })

}

export const checkSeriesForHDelete = (H) => {
    console.log('检查由于H轴删除所影响的数据集')
    const {Ss} = storeToRefs(useOptionConfig())

    console.log('检查所有数据集')
    Ss.value.forEach(s => {
        if (!s.V) {
            console.log('不存在V轴返回')
            return
        }
        if (s.H.id === H.id) {
            console.log('发现轴引用')
            if (s.isLoad) {
                console.log('发现系列已加载,尝试卸载')
                unloadSeries(s)
            }
            console.log('断开轴引用')
            s.H = null
        }
    })

    console.log('卸载横轴')
    if (H.isLoad) unloadAxis(H, 0)

}

export const checkGraphDelete = (gid) => {
    const {Hs, Vs, Ss} = storeToRefs(useOptionConfig())
    console.log('检查图删除事件')
    Ss.value = Ss.value.filter(
        i => {
            if (i.G.id === gid && i.isLoad) unloadSeries(i)
            return i.G.id !== gid
        }
    )

    console.log('相关H轴从映射配置中移除,如果已加载着卸载')
    Hs.value = Hs.value.filter(
        i => {
            if (i.G.id === gid && i.isLoad) unloadAxis(i, 0)
            return i.G.id !== gid
        }
    )
    console.log('相关V轴从映射配置中移除,如果已加载着卸载')
    Vs.value = Vs.value.filter(
        i => {
            if (i.G.id === gid && i.isLoad) unloadAxis(i, 1)
            return i.G.id !== gid
        }
    )
    console.log('相关系列从映射配置中移除,如果已加载着卸载')
    emitter.emit('load-chart')
}

export const allSeriesCheck = (gId) => {
    const {Ss} = storeToRefs(useOptionConfig())
    console.log('对所有系列进行检查')
    Ss.value.filter(i=>i.G.id ===gId).forEach(s => {
        seriesChange(s)
    })
}

export const allSeriesCheckByD = () => {
    const {Ss} = storeToRefs(useOptionConfig())
    console.log('对所有系列进行检查')
    Ss.value.forEach(s => {
        seriesChange(s)
    })
}

export const unloadAxis = (axis, type) => {
    const {echartsOptions,Hs,Vs} = storeToRefs(useOptionConfig())
    if (type === 0) {
        console.log('H轴卸载4x0y系')
        echartsOptions.value.xAxis = echartsOptions.value.xAxis.filter(i => i.id !== axis.id)
        echartsOptions.value.radiusAxis = echartsOptions.value.radiusAxis.filter(i => i.id !== axis.id)

    } else if (type === 1){
        console.log('V轴卸载4x0y系')
        echartsOptions.value.yAxis = echartsOptions.value.yAxis.filter(i => i.id !== axis.id)
        echartsOptions.value.angleAxis = echartsOptions.value.angleAxis.filter(i => i.id !== axis.id)

    }
    if (axis.id === -2+axis.G?.name) {
        console.log('重映射中移除')
        Hs.value = Hs.value.filter(i => i.id !== axis.id)
        echartsOptions.value.polar = echartsOptions.value.polar.filter(i => i.id !== axis.G.id)
    }

    axis.isLoad = false
    console.log('轴卸载完成',axis)
}

//series合法性检验
export const seriesChange = (series) => {
    console.log('series合法性检验',series)
    //如果已加载,就尝试卸载,未加载尝试加载
    if (series.isLoad) {
        console.log('系列已加载,尝试卸载')
        if (!series.D ||
            (!series.H || series.H.field === -1) ||
            (!series.V || series.V.field === -1)) {
            console.log('负向变更,开始卸载')
            unloadSeries(series)
        }
        else {
            console.log('正向变更,开始重载')
            loadOptions(series)
        }
    } else {
        console.log('系列未加载,尝试加载')
        //TODO数据集合法性检查
        if (!series.D) {
            console.log('加载失败')
            return
        }

        if (!series.H || series.H.field === -1) {
            console.log('加载失败')
            return
        }

        if (!series.V || series.V.field === -1) {
            console.log('加载失败')
            return
        }

        if (series.G.type===0 && series.G.isStack && series.H.type === 0 && series.V.type===0){
            console.log('堆叠图使用双类目轴不准允加载')
            return
        }
        if (series.G.type===0 && series.G.isStack && ((!series.G.stackType && series.V.type === 0) || (series.G.stackType && series.H.type===0)) ) {
            console.log('堆叠图数值轴不一致,不准允加载')
            return
        }

        if (series.G.type === 1 && ((series.H.type===0 && series.V.type === 0) || (series.H.type===1 && series.V.type === 1))) {
            console.log("极坐标下轴类型不成对,不准予加载")
            return
        }

        if (series.G.type === 1 && ((!series.G.polarType && series.V.type === 0) || series.G.polarType && series.H.type===0 )){
            console.log("极坐标下,数值轴不一致不准予加载")
            return
        }


        if (series.G.type === 2 && series.V.type ===0){
            console.log('饼图下V轴不为数值轴,不准予加载')
            return
        }

        console.log('准予加载')
        //合法性检验通过,准予加载
        loadOptions(series)
    }
}

//加载配置项!
export const loadOptions = (series) => {
    const {echartsOptions,Ss,Hs,Vs,Gs} = storeToRefs(useOptionConfig())

    console.log('构建数据')
    const data = getData(series.H.field, series.V.field,series.D)

    if (series.G.type !== 1 && series.G.isStack && !series.G.isStackAxisLoad){
        load4Stack(series.G,Ss,Hs,Vs,echartsOptions)
    }

    const polarSet = getPolarSet()
    const polarCount = Gs.value.filter(i => i.type === 1).length

    console.log('根据极坐标数载入polar', polarCount)
    if (polarCount===0) echartsOptions.value.polar=[]

    if (series.G.type === 1 && !series.G.isPolarAxisLoad){

        console.log('载入占位轴')
        Gs.value.filter(i=> i.type === 1 && !Hs.value.some(h => h.id === (-2 + i.name))
        )
            .forEach(i => {
                console.log('发现极坐标加载请求',i)

                const polar = polarSet[polarCount - 1].item
                polar.id = i.id
                i.pi = polarSet[polarCount - 1].args.pi
                i.po = polarSet[polarCount - 1].args.po
                i.pl = polarSet[polarCount - 1].args.pl
                i.pt = polarSet[polarCount - 1].args.pt

                echartsOptions.value.polar.push(polar)
                const polarHAxis =  {
                    id: null,
                    name: null,
                    G: null,
                    isLoad: true,
                    field: -1,
                    type: 0,
                    axisName: 'null',
                    unit: '',
                    textColor: '#fff',
                    labelColor: '#fff',
                    lineColor: '#0D6E6E',
                    tickLine: false,
                    splitLine: false,
                    labelShow: true,
                    show: true,
                    symbol: true,
                    position: false,
                    offset: 0,
                    polarId: -1,
                }
                const polarVAxis =  {
                    id: null,
                    name: null,
                    G: null,
                    isLoad: true,
                    field: -1,
                    type: 0,
                    axisName: null,
                    unit: '',
                    textColor: '#fff',
                    labelColor: '#fff',
                    lineColor: '#0D6E6E',
                    tickLine: false,
                    splitLine: false,
                    labelShow: true,
                    show: true,
                    symbol: true,
                    position: false,
                    offset: 0,
                    polarId: -1,
                    sa: 0,
                    ea:360
                }

                polarHAxis.id = -2+i.name
                polarHAxis.G = i
                polarHAxis.name = '极坐标轴-'+i.name
                polarHAxis.axisName = '极坐标轴-'+i.name
                polarHAxis.polarId = i.id
                polarHAxis.type = i.polarType ? 1 : 0
                Hs.value.push(polarHAxis)
                addHForType1(polarHAxis,echartsOptions)

                polarVAxis.id = -2+i.name
                polarVAxis.G = i
                polarVAxis.name = '极坐标轴-'+i.name
                polarVAxis.axisName = '极坐标轴-'+i.name
                polarVAxis.polarId = i.id
                polarVAxis.type = i.polarType ? 0 : 1
                Vs.value.push(polarVAxis)
                addVForType1(polarVAxis,echartsOptions)
            })
    }

    loadH(series.H,echartsOptions)
    loadV(series.V,echartsOptions)

    if (series.isLoad) { //仅引用变更
        console.log('为重载,从echartsOptions尝试找到系列')
        const targetSeries = echartsOptions.value.series.find(i => i.id === series.id)
        console.log('系列找到,开始重载')
        if (series.G.type === 0 || series.G.type === 1) { //x0y类型
            console.log('重载x0y系')
            targetSeries.data = data
            if (series.type === 2 && series.scatterConfig.type === 1 && series.scatterConfig.mapField !==-1) {
                console.log('重载为气泡,更新数据')
                targetSeries.data = getData3(series.H.field, series.V.field, series.scatterConfig.mapField,series.D)
            }

        } else if (series.G.type === 2) { //饼图
            console.log('重载饼图系')
            targetSeries.data = getPieData(
                series.H.field,
                series.V.field,
                series.color,
                series.D
            )
        }
    } else {
        console.log('开始加载系列',series)
        addSeries(series,echartsOptions,data)
        series.isLoad = true
    }

    emitter.emit('load-chart',series.G.type)
}

export const unloadSeries = (s) => {
    const {echartsOptions} = storeToRefs(useOptionConfig())
    s.isLoad = false
    console.log('卸载系列',s)
    echartsOptions.value.series = echartsOptions.value.series.filter(i => i.id !== s.id)
    emitter.emit('load-chart')
}

export const reloadGraph = () => {
    const {Gs, Hs, Vs, echartsOptions} = storeToRefs(useOptionConfig())
    const gridSet = getGridSet()

    console.log('开始重载图')
    console.log('令所有图变更gridIndex,以及初始化边距和大小')
    Gs.value.forEach((g, index) => {
        g.gridIndex = index
        g.t = gridSet[Gs.value.length - 1][index].args.t
        g.b = gridSet[Gs.value.length - 1][index].args.b
        g.l = gridSet[Gs.value.length - 1][index].args.l
        g.r = gridSet[Gs.value.length - 1][index].args.r
        g.w = gridSet[Gs.value.length - 1][index].args.w
        g.h = gridSet[Gs.value.length - 1][index].args.h
    })
    console.log('修改所有已加载H轴echartsOptions的gridIndex')
    Hs.value.forEach(h => {
        if (h.isLoad) {
            const target =echartsOptions.value.xAxis.find(i => i.id === h.id)
                if (target) target.gridIndex = h.G.gridIndex
        }
    })
    console.log('修改所有已加载V轴echartsOptions的gridIndex')
    Vs.value.forEach(v => {
        if (v.isLoad) {
            const target =echartsOptions.value.yAxis.find(i => i.id === v.id)
            if (target) target.gridIndex = v.G.gridIndex
        }
    })

    emitter.emit('merge-option')

}

export const getPosition = (is, type) => {
    if (type === 1) {
        if (is) return 'right'
        else return 'left'
    } else {
        if (is) return 'bottom'
        else return 'top'
    }
}

export const getSymbol = (is) => {
    if (is) return ['none', 'arrow']
    else return ['arrow', 'none']
}

export const buildGrid = (t, b, l, r, w, h) => {
    return {
        top: `${t}%`,
        bottom: `${b}%`,
        left: `${l}%`,
        right: `${r}%`,
        width: `${w}%`,
        height: `${h}%`,
        containLabel: true,
    }
}

export const buildPolar = (pi,po,pl,pt)=>{
    return {
        radius: [`${pi}%`,`${po}%`],
        center: [`${pl}%`, `${pt}%`]
    }
}

export const getData = (hIndex, vIndex,dataset) => {

    console.log(hIndex)
    console.log(vIndex)

    const store = useOptionConfig()
    return store.getDataFromD(dataset).map(item => {
        return [
            item[hIndex],
            item[vIndex]
        ]
    })
}

export const getData3 = (hIndex, vIndex,mapIndex,dataset) => {
    const store = useOptionConfig()
    return store.getDataFromD(dataset).map(item => {
        return [
            item[hIndex],
            item[vIndex],
            item[mapIndex],
        ]
    })
}

export const getPieData = (hIndex, vIndex,color,dataset)=>{
    const store = useOptionConfig()
    return store.getDataFromD(dataset).map(item => {
        return {
            name:item[hIndex],
            value:item[vIndex],
            itemStyle: {
                color: color
            },
    }
    })
}
