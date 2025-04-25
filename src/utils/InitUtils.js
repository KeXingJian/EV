import {storeToRefs} from "pinia";
import {useOptionConfig} from "../store/OptionConfig.js";

export const init = ()=>{
    const store = useOptionConfig()
    const {Hs,Vs,Gs,Ds,Ss,gIndex,hIndex,vIndex,sIndex,dIndex,echartsOptions,fileData} = storeToRefs(useOptionConfig())
    Ds.value.length = 0
    Hs.value.length = 0
    Vs.value.length = 0
    Ss.value.length = 0
    Gs.value.length = 0


    gIndex.value=0
    hIndex.value=0
    vIndex.value=0
    sIndex.value=0
    dIndex.value=0

    Hs.value.push(hObj())
    Vs.value.push(vObj())
    Ss.value.push(sObj())
    Gs.value.push(gObj())

    // 创建根数据集
    const rootNode = store.createDatasetNode()
    console.log('创建ROOT数据集')
    Ds.value.push({
        ...rootNode,
        name: 'ROOT',
        alias: '主数据集',
        from: 'excel-import',
    })

    defaultGraph(Hs,Vs,Ss,Gs)
    defaultSeries(Hs,Vs,Ss,Ds)

    echartsOptions.value = echartsOptionsObj()
    echartsOptions.value.large = fileData.value.rowCount>=1000

    if (fileData.value.rowCount>=5000){
        echartsOptions.value.sampling= 'lttb'
    }
}

const defaultGraph = (Hs,Vs,Ss,Gs)=>{
    Hs.value[0].G = Gs.value[0]
    Vs.value[0].G = Gs.value[0]
    Ss.value[0].G = Gs.value[0]
    console.log('装载第一图')
}

const defaultSeries = (Hs,Vs,Ss,Ds)=>{
    console.log('装载第一系列')
    Ss.value[0].H = Hs.value[0]
    Ss.value[0].V = Vs.value[0]
    Ss.value[0].D = Ds.value[0]
}

const echartsOptionsObj = ()=>{
    return {
        backgroundColor: '#1d2e3d',
        toolbox: {
            feature: {
                saveAsImage: {
                    type: 'png',
                    icon: 'path://M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z',
                    pixelRatio: 1
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
                text: '标题',
                textStyle: {color: '#fff',fontSize:50},

            }
        ],
        legend: {
            orient: 'vertical',
            top: '0%',
            left: '0%',
            textStyle: {
                fontSize: 12,
                fontWeight: 400,
                color: '#fff'
            },

            itemWidth: 25,
            itemHeight: 14,
            icon: 'circle'
        },
        visualMap: [],
        xAxis: [],
        yAxis: [],
        angleAxis: [],
        radiusAxis: [],
        radar: [],
        series: []
    }

}
const sObj = ()=>{
    return  {
        id: 0,
        name: 'S0',
        G: null,
        D: null,
        H: null,
        V: null,
        isLoad: false,
        color: '#FF4081',
        type: 0, //0折线,1柱状,2散点,3饼图,4雷达
        areaColor: '#FF4081',
        isLabel: false,
        labelColor: '#fff',
        lineConfig: {
            lineType: 0,  //直线,曲线,折线
            startPoint: 0,
            isArea: false,
        },
        barConfig: {},
        scatterConfig: {
            type: 0,
            mapField: -1,
        },

        pieConfig: {
            isRose: false,
            roseType: 0, //0,半径
            borderRadius: 10,
            padAngle: 2,
            position: 0, //内嵌
            labelLine: true,
            pi: 0,
            po: 80,
            pt: 50,
            pl: 50,
        },
    }
}

const hObj = () => {
    return {
        id: 0,
        name: 'H0',
        G: null,
        isLoad: false,
        field: -1,
        type: 0,
        axisName: '',
        unit: '',
        textColor: '#fff',
        labelColor: '#fff',
        lineColor: '#0D6E6E',
        tickLine: false,
        splitLine: false,
        labelShow: true,
        show: true,
        symbol: true,
        position: true,
        offset: 0,
    }
}

const vObj =   ()=>{
    return {
        id: 0,
        name: 'V0',
        G: null,
        isLoad: false,
        field: -1,
        type: 1,
        axisName: '',
        unit: '',
        textColor: '#fff',
        labelColor: '#fff',
        lineColor: '#0D6E6E',
        tickLine: false,
        splitLine: false,
        labelShow: true,
        show: true,
        symbol: true,
        position: false,
        offset: 0,
    }
}

const gObj =  ()=>{
    return {
        id: 0,
        name: 'G0',
        isLoad: false,
        gridIndex: 0,
        polarIndex: 0,
        type: 0,//x为0,极为1,饼为2,雷3
        stackType: false,
        t: 10,
        b: 0,
        l: 8,
        r: 0,
        w: 84,
        h: 81,
        pi: 0,
        po: 88,
        pl: 50,
        pt: 50,
        isStack: false,
        isStackAxisLoad: false,
        isPolarAxisLoad: false,
        polarType: false,
    }
}