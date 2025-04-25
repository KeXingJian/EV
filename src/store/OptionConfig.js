import {defineStore} from 'pinia'
import {createFilter, parseCondition} from "../utils/ExpressionParser.js";


export const useOptionConfig = defineStore('optionConfig', {
    state() {
        return {
            fileData: {
                rowCount: 0,
                columnStats: []
            },
            datasetTree: {
                root: null,
                current: null
            },
            dataset: {
                source: [],
                dimension: []
            },

            Ds: [],
            polarCount: 0,
            gIndex: 0,
            hIndex: 0,
            vIndex: 0,
            sIndex: 0,
            dIndex: 0,

            global: {
                isLarge: false,
                isSvg: false,
                pixelRatio: 1,
                title: {
                    t: 1,
                    l: 46,
                    text: '标题',
                    show: true,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: 0,
                    isAlign: false,
                    isJustify: true
                },
                legend: {
                    t: 0,
                    l: 0,
                    w: 16,
                    h: 12,
                    show: true,
                    type: false,
                    fontSize: 12,
                    fontWeight: 400,
                    icon: 'circle',
                    color: '#fff',
                },
                backGround: '#1d2e3d'
            },
            Gs: [
                {
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
            ],
            echartsOptions: {
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
                        textStyle: {color: '#fff'}
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
    },
    actions: {
        // 应用过滤条件
        applyFilter(dataset, expression) {
            const condition = parseCondition(expression, this.fileData.columnStats)
            if (!condition) return false
            console.log('表达式对象映射', condition)
            dataset.filterConditions.push(condition)
            this.refreshDataset(dataset.id)
            return true
        },

        // 刷新数据集数据
        refreshDataset(datasetId) {
            const dataset = this.Ds.find(i => i.id === datasetId)
            if (!dataset) return

            console.log('开始重载数据集', dataset)
            const conditions = this.getInheritedConditions(dataset)

            // 生成过滤链
            const filterChain = conditions.map(cond => createFilter(cond))
            dataset.filterChain = filterChain
            console.log('生成过滤链', filterChain)

            // 应用过滤
            dataset.count = this.dataset.source.filter(record =>
                filterChain.every(filter => filter(record))
            ).length
            console.log('获得数据集', dataset)

            // 级联更新子集
            dataset.groupCondition.forEach(child => {
                console.log('重载子数据集', child)
                this.refreshDataset(child.child.id)
            })
        },

        getInheritedConditions(dataset) {
            const conditions = []

            // 添加当前数据集的条件（前置插入保证顺序）
            conditions.unshift(...dataset.filterConditions)
            let childId = dataset.id
            let current = dataset.parent
            while (current){
                conditions.unshift(...current.filterConditions)
                const child = current.groupCondition.find(i => i.child.id === childId)
                console.log(child)
                console.log(conditions)
                conditions.push(child.condition)
                childId = current.id
                current = current.parent
            }

            console.log('找到所有链路的过滤语句', conditions)
            return conditions
        },

        createGroup(parent, expression) {

            const condition = parseCondition(expression, this.fileData.columnStats)
            if (!condition) return false

            const newDataset = this.createDatasetNode(parent)

            parent.groupCondition.push({
                child: newDataset,
                condition
            })

            this.Ds.push({
                ...newDataset,
                name: 'D' + this.dIndex++,
                alias: expression,
                from: parent.name + ' BY ' + expression,
            })
            this.refreshDataset(newDataset.id)

            return true
        },

        getDataFromD(dataset){
            console.log(this.dataset.source)
            return this.dataset.source.filter(record =>
                dataset.filterChain.every(filter => filter(record))
            )
        },

        // 创建增强版数据集结构
        createDatasetNode(parent = null, groupCondition = []) {
            return {
                id: this.generateUUID(),
                parent: parent || null,
                groupCondition,
                filterConditions: [],
                filterChain: null,
                cachedData: [],
                count: 0
            }
        },

        generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
            })
        }

    }
})
