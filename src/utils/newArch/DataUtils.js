import {useOptionConfig} from "../../store/OptionConfig.js";
import {useNodeState} from "../../store/NodeState.js";

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

export const getPieData = (hIndex, vIndex, color, dataset,id) => {
    const {getDataFromD} = useOptionConfig()
    const {getColorPie} = useNodeState()

    return getDataFromD(dataset).filter(i =>
        (i[hIndex]!==null && i[hIndex] !== '') &&
        (i[vIndex]!==null && i[vIndex] !== '')
        //过滤横轴或纵轴为空
    ).map(item => {
        return {
            id: item[0],
            name: item[hIndex],
            value: item[vIndex],
            itemStyle: {
                color: getColorPie(item[0]+id) || color,
            },
        }
    })
}

export const getRelationData = (s)=>{
    const {dataset:{source}} = useOptionConfig()
    return source.map(item => {
        return [item[s.from], item[s.relationship], item[s.to]]
    })
}

export const getSingle = (index)=>{
    const {dataset:{source}} = useOptionConfig()
    return source.map(item => {
        return item[index]
    })
}