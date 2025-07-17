import {useOptionConfig} from "../../store/OptionConfig.js";
import {storeToRefs} from "pinia";

export const getData = (hIndex, vIndex, dataset) => {
    const store = useOptionConfig()
    return store.getDataFromD(dataset).filter(i =>
        (i[hIndex]!==null && i[hIndex] !== '') && (i[vIndex]!==null && i[vIndex] !== '')
    ).map(item => {
        return [
            item[hIndex],
            item[vIndex]
        ]
    })
}

export const getData3 = (hIndex, vIndex, mapIndex, dataset) => {
    const store = useOptionConfig()
    return store.getDataFromD(dataset).filter(i =>
        (i[hIndex]!==null && i[hIndex] !== '') &&
        (i[vIndex]!==null && i[vIndex] !== '') &&
        (i[mapIndex]!==null && i[mapIndex] !== '')
    ).map(item => {
        return [
            item[hIndex],
            item[vIndex],
            item[mapIndex],
        ]
    })
}

export const getPieData = (hIndex, vIndex, color, dataset,addItem) => {
    const store = useOptionConfig()
    //console.log("addd",addItem)
    return store.getDataFromD(dataset).filter(i =>
        (i[hIndex]!==null && i[hIndex] !== '') &&
        (i[vIndex]!==null && i[vIndex] !== '')
        //过滤横轴或纵轴为空
    ).map((item,index) => {
        return {
            name: item[hIndex],
            value: item[vIndex],
            itemStyle: {
                color: addItem ? addItem.data[index].itemStyle.color : color,
            },
        }
    })
}

export const getRadarCData = (hIndex,max,color) => {
    const store = useOptionConfig()
    const {Ds} = storeToRefs(useOptionConfig())
    return store.getDataFromD(Ds.value[0]).filter(i =>
            (i[hIndex]!==null && i[hIndex] !== '')
        //过滤横轴或纵轴为空
    ).map((item) => {
        return {
            text: item[hIndex],
            color: color,
            max: max
        }
    })
}

export const getRadarVData = (hIndex) => {
    const store = useOptionConfig()
    const {Ds,} = storeToRefs(useOptionConfig())
    return store.getDataFromD(Ds.value[0]).filter(i =>
            (i[hIndex]!==null && i[hIndex] !== '')
        //过滤横轴或纵轴为空
    ).map((item) => item[hIndex])
}