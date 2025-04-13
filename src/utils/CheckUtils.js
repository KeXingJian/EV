import {useOptionConfig} from "../store/OptionConfig.js";
import {storeToRefs} from "pinia";
import emitter from "../emitter/emitter.js";
import {getGridSet} from "./GridSetUtils.js";
import {addSeries, loadH, loadV} from "./ChartUtils.js";

export const checkAxis = (axis, type) => {
    console.log('检查轴类型变更合法性')
    //检查变更轴类型字段是否为数值
    const {fileData} = storeToRefs(useOptionConfig())
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

    console.log('卸载横轴')
    if (H.isLoad) unloadAxis(H, 0)

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

export const allSeriesCheck = () => {
    const {Ss} = storeToRefs(useOptionConfig())
    console.log('对所有系列进行检查')
    Ss.value.forEach(s => {
        seriesChange(s)
    })
}

export const unloadAxis = (axis, type) => {
    const {echartsOptions,Ss} = storeToRefs(useOptionConfig())
    if (type === 0) {
        console.log('H轴卸载')
        echartsOptions.value.xAxis = echartsOptions.value.xAxis.filter(i => i.id !== axis.id)
    } else {
        console.log('V轴卸载')
        echartsOptions.value.yAxis = echartsOptions.value.yAxis.filter(i => i.id !== axis.id)
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
        console.log('准予加载')
        //合法性检验通过,准予加载
        loadOptions(series)
    }
}

//加载配置项!
export const loadOptions = (series) => {
    const {echartsOptions} = storeToRefs(useOptionConfig())
    console.log('构建数据')
    const data = getData(series.H.field, series.V.field)

    loadH(series.H,echartsOptions)
    loadV(series.V,echartsOptions)

    if (series.isLoad) { //仅引用变更
        console.log('为重载,从echartsOptions尝试找到系列')
        const targetSeries = echartsOptions.value.series.find(i => i.id === series.id)
        console.log('系列找到,开始重载')
        if (series.G.type === 0) { //x0y类型
            console.log('重载x0y系')
            targetSeries.data = data
        } else if (series.G.type === 1) { //极坐标
            console.log('重载极坐标系')
        } else if (series.G.type === 2) { //饼图
            console.log('重载饼图系')
        } else if (series.G.type === 3) { // 雷达
            console.log('重载雷达系')
        }

    } else {
        console.log('开始加载系列',series)
        addSeries(series,echartsOptions,data)
        series.isLoad = true
    }

    emitter.emit('load-chart')
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
            echartsOptions.value.xAxis.find(i => i.id === h.id).gridIndex = h.G.gridIndex
        }
    })
    console.log('修改所有已加载V轴echartsOptions的gridIndex')
    Vs.value.forEach(v => {
        if (v.isLoad) {
            echartsOptions.value.yAxis.find(i => i.id === v.id).gridIndex = v.G.gridIndex
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

const getData = (hIndex, vIndex) => {
    const {dataset} = storeToRefs(useOptionConfig())
    return dataset.value.source.map(item => {
        return [
            item[hIndex],
            item[vIndex]
        ]
    })
}
