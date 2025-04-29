import {storeToRefs} from "pinia";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {getPolar} from "./Position.js";
import {loadAxis} from "./AxisUtis.js";

export const init = ()=>{
    const store = useOptionConfig()
    const {Ds,echartsOptions,fileData,sIndex,Ss,Cs} = storeToRefs(useOptionConfig())

    store.refreshDataset(Ds.value[0].id)

    sIndex.value = 0
    Ss.value.length = 0

    Ss.value.push(sObj())

    echartsOptions.value = echartsOptionsObj()
    echartsOptions.value.large = fileData.value.rowCount>=1000


}


const echartsOptionsObj = ()=>{
    return {
        backgroundColor: '#ffffff',
        toolbox: {
            feature: {
                saveAsImage: {
                    type: 'png',
                    icon: 'path://M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z',
                    pixelRatio: 1,
                    excludeComponents: ['dataZoom','toolbox']
                },

            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        dataZoom: [
            {
                type: 'inside',
                realtime: true,
                start: 30,
                end: 70,
                xAxisIndex: 'all'
            },
            {
                type: 'slider',
                realtime: true,
                start: 30,
                end: 70,
                xAxisIndex: 'all'
            }
        ],
        large: false,
        grid: [
            {
                containLabel: true,
            },
        ],
        polar: [],
        title: [
            {
                top: '1%',
                left: 'center',
                text: '',
                textStyle: {color: '#000',fontSize:34},
            }
        ],
        legend: {
            orient: 'vertical',
            top: '0%',
            left: '0%',
            textStyle: {
                fontSize: 12,
                fontWeight: 400,
                color: '#000'
            },

            itemWidth: 25,
            itemHeight: 14,
            icon: 'circle'
        },
        visualMap:undefined,
        xAxis: [],
        yAxis: [],
        angleAxis: [],
        radiusAxis: [],
        radar: [],
        series: []
    }

}
const sObj = ()=>{
    return    {
        id: 0,
        name: 'S0',
        seriesName: 'S0',
        C:null,
        category: -1,
        number: -1,
        isLoad: false,
        color: '#FF4081',
        type: 0, //0折线,1柱状,2散点,3饼图,4雷达
        areaColor: '#FF4081',

        isLabel: false,
        labelColor: '#000',

        lineConfig: {
            lineType: 0,  //直线,曲线,折线
            startPoint: 0,
            isArea: false,
        },
        barConfig: {

        },
        scatterConfig: {
            type: 0,
            mapField: -1,
        },

        pieConfig: {
            isRose: false,
            roseType: 0, //0,半径
            borderRadius: 10,
            padAngle: 0,
            position: 0, //内嵌
            labelLine: true,
            polar: getPolar()
        },
    }
}