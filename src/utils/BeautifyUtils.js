import {storeToRefs} from "pinia";
import {useOptionConfig} from "../store/OptionConfig.js";

export const x0y = (newVal,echartsOptions,target)=>{
    target.itemStyle.color = newVal.color
    target.label.show = newVal.isLabel
    target.name = newVal.seriesName
}

export const getFieldDetails = (mapIndex)=>{
    const {fileData} = storeToRefs(useOptionConfig())
    return fileData.value.columnStats[mapIndex].numericStats
}


export const legendTypeSelect = ['horizontal','vertical']

export const legendStyleSelect = [
    {index:'circle',label:'circle'},
    {index:'roundRect',label: 'roundRect'},
    {index:'triangle',label: 'triangle'},
    {index:'diamond',label: 'diamond'},
    {index:'pin',label: 'pin'},
    {index:'arrow',label: 'arrow'},
]