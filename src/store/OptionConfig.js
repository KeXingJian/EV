import {defineStore} from 'pinia'
import {createFilter, parseCondition} from "../utils/ExpressionParser.js";
import {getPolar} from "../utils/newArch/Position.js";
export const useOptionConfig = defineStore('optionConfig', {
    state() {
        return {
            theme: false,
            fileData: {
                rowCount: 0,
                columnStats: []
            },
            dataset: {
                source: [],
                dimension: []
            },
            prevColumnStats: [], // 新增用于跟踪前一次状态
            lang:false,//中文
            Ds: [
                {
                    id: -1,
                    name: 'ROOT',
                    alias: '主数据集',
                    from: '临时数据',
                    parent: null,
                    groupCondition: [],
                    filterConditions: [],
                    filterChain: null,
                    count: 0
                }
            ],
            sIndex: 0,
            dIndex: 0,
            cIndex: 0,

            global: {
                isLayer: false,
                isLarge: false,
                isSvg: false,
                pixelRatio: 1,
                title: {
                    t: 1,
                    l: 46,
                    text: '',
                    show: true,
                    color: '#000',
                    fontSize: 34,
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
                    color: '#000',
                },
                backGround: '#ffffff',
                visualMap: {
                    type: false,
                    mode: false,
                    min: 0,
                    max: 100,
                    pieces: [
                        {
                            "gt": 0,
                            "lte": 100,
                            "color": "#FF4081"
                        }
                    ]
                }
            },

            Cs: [
                {
                    id: -1,
                    name: '无系',
                    type: 2, //0:x0y系;1:极坐标系;2无系
                    isStack: false,
                },
                {
                    id: 0,
                    name: 'C0',
                    type: 0, //0:x0y系;1:极坐标系;2无系
                    grid: {
                        t: 7,
                        b: 0,
                        l: 8,
                        r: 0,
                        w: 85,
                        h: 80
                    },
                    isLoad: false,
                    axisType: false, //横轴为类目
                    isStack: false,
                    H: {
                        name: 'H0',
                        axisName: 'H' + 0,
                        unit: '',
                        textColor: '#000', //轴名称
                        tickLine: false, //标线
                        splitLine: false, //隔线

                        labelColor: '#000', //下标
                        labelShow: true, //下标

                        lineColor: '#0D6E6E', //轴线
                        show: true, //轴线

                        symbol: true, //向右
                        position: true, //下

                        offset: 0,
                    },
                    V: {
                        name: 'V0',
                        axisName: 'V' + 0,
                        unit: '',
                        textColor: '#000', //轴名称
                        tickLine: false, //标线
                        splitLine: false, //隔线

                        labelColor: '#000', //下标
                        labelShow: true, //下标

                        lineColor: '#0D6E6E', //轴线
                        show: true, //轴线

                        symbol: true, //向上
                        position: false, //左

                        offset: 0,
                    }
                },
            ],
            Ss: [
                {
                    id: 0,
                    name: 'S0',
                    seriesName: 'S0',
                    C: null,
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
                        borderRadius: 5,
                        barGap: 5,
                        barWidth: 40,
                    },
                    scatterConfig: {
                        type: 0,
                        mapField: -1,
                        range: [20, 50],
                        size: 20,
                    },

                    pieConfig: {
                        isRose: false,
                        roseType: 0, //0,半径
                        borderRadius: 10,
                        padAngle: 2,
                        position: 0, //内嵌
                        labelLine: true,
                        polar: getPolar()
                    },

                    funnelConfig: {
                        position: {
                            t: 7,
                            b: 0,
                            l: 8,
                            r: 0,
                            w: 85,
                            h: 80
                        },
                        sort: 0, //升 无 降
                        gap: 2,
                        labelPosition: 0, //左,中,右
                        align: 1 //左,中,右
                    },
                    radarConfig: {
                        isArea: false,
                        areaColor: '#FF4081'
                    }
                }
            ],
            echartsOptions: {
                backgroundColor: '#ffffff',
                toolbox: {
                    feature: {
                        saveAsImage: {
                            type: 'png',
                            icon: 'path://M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z',
                            pixelRatio: 1,
                            excludeComponents: ['toolbox', 'dataZoom']
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
                        xAxisIndex: 'all',
                        radiusAxisIndex: 'all',
                        yAxisIndex: 'all',
                        angleAxisIndex: 'all',
                        orient:'horizontal'
                    },
                    {
                        type: 'slider',
                        realtime: true,
                        start: 30,
                        end: 70,
                        xAxisIndex: 'all',
                        radiusAxisIndex: 'all',
                        yAxisIndex: 'all',
                        angleAxisIndex: 'all',
                        orient:'horizontal'
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 100,
                        end: 100,
                        xAxisIndex: 'all',
                        radiusAxisIndex: 'all',
                        yAxisIndex: 'all',
                        angleAxisIndex: 'all',
                        orient:'vertical'
                    },
                    {
                        type: 'slider',
                        realtime: true,
                        start: 100,
                        end: 100,
                        xAxisIndex: 'all',
                        radiusAxisIndex: 'all',
                        yAxisIndex: 'all',
                        angleAxisIndex: 'all',
                        orient:'vertical'
                    }
                ],
                large: false,
                grid: [],
                polar: [],

                title: [
                    {
                        top: '1%',
                        left: 'center',
                        text: '',
                        textStyle: {
                            color: '#000',
                            fontSize: 12,
                            fontWeight: 800,
                        }
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
                visualMap: undefined,
                xAxis: [],
                yAxis: [],
                angleAxis: [],
                radiusAxis: [],
                radar: [],
                series: []
            },
            palettes: [
                {
                    name: 'My',
                    isLove: true,
                    colors: ['#0D6E6E', '#afffff', '#0D1F2D', '#1d2e3d', '#FF3D3D', '#FFFFFF']
                },
                {
                    name: 'P1',
                    isLove: true,
                    colors: ['#F7CFD8', '#F4F8D3', '#A6D6D6', '#8E7DBE', '#F6416C', '#292524']
                },
                {
                    name: 'P2',
                    isLove: true,
                    colors: ['#26A69A', '#cdfaf6', '#E0F2F1', '#D0EBEA', '#43A49B', '#263339']
                },
                {
                    name: 'P3',
                    isLove: true,
                    colors: ['#F6F6F6', '#EAE9E9', '#D4D7DD', '#420000', '#D2FAFB', '#6BC5D2']
                },
                {
                    name: 'P4',
                    isLove: true,
                    colors: ['#F7E8F6', '#F1C6E7', '#E5B0EA', '#BD83CE', '#0C093C', '#DF42D1']
                },
                {
                    name: 'P5',
                    isLove: true,
                    colors: ['#EEA5F6', '#E0E2E5', '#FFF1E9', '#FFD5D5', '#FC7FB2', '#45454D']
                },
                {
                    name: 'P6',
                    isLove: false,
                    colors: ['#6c35de', '#ffc7ff', '#241b35', '#342a45', '#cb80ff', '#ffffff']
                },
                {
                    name: 'P7',
                    isLove: false,
                    colors: ['#39375B', '#745C97', '#D597CE', '#F5B0CB', '#272343', '#E3F6F5']
                },
                {
                    name: 'P8',
                    isLove: false,
                    colors: ['#BAE8E8', '#ffccc4', '#F1F3F4', '#f5f5f5', '#79BAC1', '#1a1a1a']
                },
                {
                    name: 'P9',
                    isLove: false,
                    colors: ['#FBCFFC', '#BE79DF', '#FFBCBC', '#4CD3C2', '#B7EFCD', '#512B58']
                },
                {
                    name: 'P10',
                    isLove: false,
                    colors: ['#FE346E', '#D2FAFB', '#1A1F2B', '#292e3b', '#FF4D4D', '#CFF1EF']
                },
                {
                    name: 'P11',
                    isLove: false,
                    colors: ['#9DDFD3', '#ffe4ff', '#F5F5F5', '#FF74B1', '#00E5FF', '#FFA1CF']
                },
                {
                    name: 'P12',
                    isLove: false,
                    colors: ['#FFD6EC', '#A7FFE4', '#1A1F2B', '#f5f5f5', '#2196F3', '#333333']
                },
                {
                    name: 'P13',
                    isLove: false,
                    colors: ['#034C53', '#007074', '#F38C79', '#FFC1B4', '#6439FF', '#4F75FF']
                },
                {
                    name: 'P14',
                    isLove: false,
                    colors: ['#00CCDD', '#7CF5FF', '#FF004D', '#5A082D', '#33030D', '#212121']
                },
                {
                    name: 'P15',
                    isLove: false,
                    colors: ['#323232', '#0D7377', '#14FFEC', '#f5f5f5', '#00FFF0', '#7579E7']
                },
                {
                    name: 'P16',
                    isLove: false,
                    colors: ['#9AB3F5', '#A3D8F4', '#B9FFFC', '#6930C3', '#252525', '#6930C3']
                },
                {
                    name: 'P17',
                    isLove: false,
                    colors: ['#ACE1AF', '#B0EBB4', '#BFF6C3', '#E0FBE2', '#5A639C', '#E2BBE9']
                },
                {
                    name: 'P18',
                    isLove: false,
                    colors: ['#B9F3FC', '#AEE2FF', '#93C6E7', '#FEDEFF', '#FFF8DB', '#FFC7ED']
                },
                {
                    name: 'P19',
                    isLove: false,
                    colors: ['#7D8ABC', '#304463', '#1A1F2B', '#FEF9F2', '#FFE3E3', '#CDC1FF']
                },
                {
                    name: 'P20',
                    isLove: false,
                    colors: ['#FFF6E3', '#A7FFE4', '#FF90BB', '#FFC1DA', '#8ACCD5', '#C5BAFF']
                },
            ]
        }
    },
    actions: {
        // 新增状态追踪方法
        trackColumnStatsChange(newStats) {
            const changes = []

            this.prevColumnStats.forEach(oldCol => {
                const newCol = newStats.find(c => c.field === oldCol.field)
                if (!newCol) return

                if (oldCol.isUnique && !newCol.isUnique) {
                    changes.push({
                        field: newCol.field,
                        from: true,
                        to: false,
                        index: newCol.index
                    })
                }
            })

            this.prevColumnStats = [...newStats] // 保存当前状态作为下次的旧状态
            return changes
        },
        // 应用过滤条件
        applyFilter(dataset, expression) {
            const condition = parseCondition(expression, this.fileData.columnStats)
            if (!condition) return false
            //console.log('表达式对象映射', condition)
            dataset.filterConditions.push(condition)
            this.refreshDataset(dataset.id)
            return true
        },

        // 刷新数据集数据
        refreshDataset(datasetId) {
            const dataset = this.Ds.find(i => i.id === datasetId)
            if (!dataset) return

            //console.log('开始重载数据集', dataset)
            const conditions = this.getInheritedConditions(dataset)

            const filterChain = conditions.map(cond =>
                createFilter(cond)
            )

            dataset.filterChain = filterChain
            //console.log('生成过滤链', filterChain)

            // 应用过滤
            dataset.count = this.dataset.source.filter((record, index) =>
                filterChain.every(filter => filter(record, index))
            ).length


            // 级联更新子集
            dataset.groupCondition.forEach(child => {

                this.refreshDataset(child.child.id)
            })
        },

        getInheritedConditions(dataset) {
            const conditions = []

            // 添加当前数据集的条件（前置插入保证顺序）
            conditions.unshift(...dataset.filterConditions)
            let childId = dataset.id
            let current = dataset.parent
            while (current) {
                conditions.unshift(...current.filterConditions)
                const child = current.groupCondition.find(i => i.child.id === childId)
                //console.log(child)
                //console.log(conditions)
                conditions.push(child.condition)
                childId = current.id
                current = current.parent
            }

            //console.log('找到所有链路的过滤语句', conditions)
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

        getDataFromD(dataset) {
            return this.dataset.source.filter((record, index) =>
                dataset.filterChain.every(filter => filter(record, index))
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
        },

    }
})
