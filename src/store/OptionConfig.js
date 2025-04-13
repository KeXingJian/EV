import {defineStore} from 'pinia'

export const useOptionConfig = defineStore('optionConfig', {
    state() {
        return {
            fileData: {
                rowCount: 0,
            },
            Ds: [],
            gIndex: 0,
            hIndex: 0,
            vIndex: 0,
            sIndex: 0,
            dataset: {
                source: null,
                dimension: null
            },
            Gs: [
                {
                    id: 0,
                    name: 'G0',
                    isLoad: false,
                    gridIndex: 0,
                    type: 0,//x为0,极为1,饼为2,雷3
                    t:10,
                    b:0,
                    l:8,
                    r:0,
                    w:84,
                    h:81,
                    isStack: false,
                    stackAxisType: -1,
                    isLayer:false,
                    pieces:[],
                    outOfRange: '#FF3D3D',
                }
            ],
            Hs: [
                {
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
            ],
            Vs: [
                {
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
            ],
            Ss: [
                {
                    id: 0,
                    name: 'S0',
                    G: null,
                    D: null,
                    H: null,
                    V: null,
                    isLoad: false,
                    color: '#FF3D3D',
                    type: 0, //0折线,1柱状,2散点,3饼图,4雷达
                    areaColor: '#FF3D3D',
                    isLabel: false,
                    lineConfig: {
                        lineType: 0,  //直线,曲线,折线
                        startPoint: 0,
                        isArea: false,
                    },
                    barConfig:{

                    },
                    pieConfig: {

                    },
                    scatterConfig: {

                    },
                    radarConfig: {

                    }
                }
            ],

            echartsOptions: {
                backgroundColor: '#1d2e3d',
                toolbox: {
                    feature: {
                        saveAsImage: {
                            type: 'png',
                            icon: 'path://M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z'
                        },
                        restore: {},

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
                large: true,
                grid: [
                    {
                        containLabel: true,
                    },
                ],
                title: [
                    {
                        left: 'center',
                        text: 'Gradient along the y axis',
                        textStyle: {color: '#fff'}
                    }
                ],
                legend: {
                    orient: 'vertical',
                    top: 'auto',
                    left: 'auto',
                    textStyle: {
                        fontSize: 12,
                        fontWeight: 'bold',
                    },
                    icon: 'circle'
                },
                visualMap: [],
                xAxis: [],
                yAxis: [],
                radar: [],
                angleAxis:[],
                radiusAxis:[],
                series: []
            },
            palettes: [
                {
                    name: '我的',
                    isLove: true,
                    colors: ['#0D6E6E', '#afffff', '#0D1F2D', '#1d2e3d', '#FF3D3D', '#FFFFFF']
                },
                {
                    name: 'P1',
                    isLove: true,
                    colors: ['#00B8A9', '#E0E2E5', '#F8F3D4', '#ffffff', '#F6416C', '#292524']
                },
                {
                    name: 'P2',
                    isLove: true,
                    colors: ['#26A69A', '#cdfaf6', '#E0F2F1', '#D0EBEA', '#43A49B', '#263339']
                },
                {
                    name: 'P3',
                    isLove: true,
                    colors: ['#8B5FBF', '#FFFFFF', '#F5F3F7', '#E9E4ED', '#9A73B5', '#4A4A4A']
                },
                {
                    name: 'P4',
                    isLove: true,
                    colors: ['#E4DCCF', '#3F5B62', '#576F72', '#7D9D9C', '#D69955', '#EEEEEE']
                },
                {
                    name: 'P5',
                    isLove: true,
                    colors: ['#61C0BF', '#E0E2E5', '#FCEEF5', '#ffffff', '#FFB6B9', '#292524']
                },
                {
                    name: 'P6',
                    isLove: false,
                    colors: ['#6c35de', '#ffc7ff', '#241b35', '#342a45', '#cb80ff', '#ffffff']
                },
                {
                    name: 'P7',
                    isLove: false,
                    colors: ['#0D6E6E', '#afffff', '#0D1F2D', '#1d2e3d', '#FF3D3D', '#FFFFFF']
                },
                {
                    name: 'P8',
                    isLove: false,
                    colors: ['#de283b', '#ffccc4', '#ffffff', '#f5f5f5', '#25b1bf', '#1a1a1a']
                },
                {
                    name: 'P9',
                    isLove: false,
                    colors: ['#019b98', '#c1ffff', '#fbfbfb', '#f1f1f1', '#dd0025', '#014e60']
                },
                {
                    name: 'P10',
                    isLove: false,
                    colors: ['#2C3A4F', '#b4c2dc', '#1A1F2B', '#292e3b', '#FF4D4D', '#FFFFFF']
                },
                {
                    name: 'P11',
                    isLove: false,
                    colors: ['#FF4081', '#ffe4ff', '#F5F5F5', '#ebebeb', '#00E5FF', '#333333']
                },
                {
                    name: 'P12',
                    isLove: false,
                    colors: ['#3F51B5', '#FFFFFF', '#1A1F2B', '#f5f5f5', '#2196F3', '#333333']
                },
            ]
        }
    }
})
