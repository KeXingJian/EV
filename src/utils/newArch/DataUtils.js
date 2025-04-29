import {useOptionConfig} from "../../store/OptionConfig.js";

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
    return store.getDataFromD(dataset).filter(i =>
        (i[hIndex]!==null && i[hIndex] !== '') &&
        (i[vIndex]!==null && i[vIndex] !== '')
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