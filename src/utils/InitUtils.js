import {useOptionConfig} from "../store/OptionConfig.js";
import {unloadSeries} from "./newArch/Check4Series.js";

export const init = () => {

    const {
        Ds,
        echartsOptions,
        fileData,
        Ss,
        refreshDataset
    } = useOptionConfig()

    Ss.forEach(item => {
        if (item.isLoad) unloadSeries(item, echartsOptions)
        item.category = -1
        item.number = -1
        item.D = Ds[0]
    })

    refreshDataset(Ds[0].id)
    echartsOptions.large = fileData.rowCount >= 1000
}
