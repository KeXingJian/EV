import {storeToRefs} from "pinia";
import {useOptionConfig} from "../store/OptionConfig.js";

export const x0y = (newVal,echartsOptions,target)=>{
    target.itemStyle.color = newVal.color
    target.label.show = newVal.isLabel
    target.name = newVal.name
}

export const getFieldDetails = (mapIndex)=>{
    const {fileData} = storeToRefs(useOptionConfig())
    return fileData.value.columnStats[mapIndex].numericStats
}


export const legendTypeSelect = ['horizontal','vertical']

export const fontFamilySelect = ['sans-serif','serif','monospace','Arial','Courier New']

export const legendStyleSelect = [
    {index:'circle',label:'圆形'},
    {index:'roundRect',label: '方形'},
    {index:'triangle',label: '三角形'},
    {index:'diamond',label: '菱形'},
    {index:'pin',label: '水滴'},
    {index:'arrow',label: '箭头'},
]