import {useOptionConfig} from "../store/OptionConfig.js";
import {unloadSeries} from "./newArch/Check4Series.js";
import {storeToRefs} from "pinia";

export const init = () => {

    const {
        Ds,
        echartsOptions,
        fileData,
        Ss,
        refreshDataset,Cs,chartInstance
    } = useOptionConfig()
    const {isLoadRelation} = storeToRefs(useOptionConfig())

    const keep = Cs[0]
    Cs.length = 0
    Cs.push(keep)
    Ss.length = 0

    echartsOptions.series.length = 0
    echartsOptions.radar.length = 0
    echartsOptions.radiusAxis.length = 0
    echartsOptions.angleAxis.length = 0
    echartsOptions.yAxis.length = 0
    echartsOptions.xAxis.length = 0
    echartsOptions.polar.length = 0
    echartsOptions.grid.length = 0

    const elements = echartsOptions.graphic.elements
    if (elements.length > 2) elements
        .splice(2, elements.length - 2)

    chartInstance.off('selectchanged')
    chartInstance.off('mousedown')
    isLoadRelation.value = false

    refreshDataset(Ds[0].id)
    echartsOptions.large = fileData.rowCount >= 1000
}
