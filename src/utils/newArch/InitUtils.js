import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {unloadSeries} from "./Check4Series.js";

export const init = ()=>{
    const store = useOptionConfig()
    const {Ds,echartsOptions,fileData,Ss} = storeToRefs(useOptionConfig())

    Ss.value.forEach(item=>{
        if (item.isLoad) unloadSeries(item,echartsOptions)
        item.category = -1
        item.number = -1
        item.D = Ds.value[0]
    })

    store.refreshDataset(Ds.value[0].id)
    echartsOptions.value.large = fileData.value.rowCount>=1000
}
