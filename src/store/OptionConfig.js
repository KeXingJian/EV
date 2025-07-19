import {defineStore} from 'pinia'
import {createFilter, parseCondition} from "../utils/ExpressionParser.js";
import {getGrid, getPolar} from "../utils/newArch/Position.js";
import emitter from "../emitter/emitter.js";
export const useOptionConfig = defineStore('optionConfig', {
    state() {
        return {
            theme: false,
            isLock: true,
            lang:false,//中文

            fileData: {
                rowCount: 0,
                columnStats: [],
            },
            dataset: {
                source: [],
                dimension: []
            },

            sIndex: 0,
            dIndex: 0,
            cIndex: 0,

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
            Cs: [
                {
                    id: -1,
                    name: 'noSeries',
                    type: 2, //0:x0y系;1:极坐标系;2无系
                    isStack: false,
                },
                {
                    id: 0,
                    name: 'C0',
                    type: 0, //0:x0y系;1:极坐标系;2无系
                    grid: getGrid(),
                    polar:null,
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
                            excludeComponents: ['toolbox', 'dataZoom','graphic']
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
                        id: '1',
                        type: 'slider',
                        realtime: true,
                        start: 30,
                        end: 70,
                        xAxisIndex: 'all',
                        radiusAxisIndex: 'all',
                        orient:'horizontal',
                        bottom: 10,
                        left: 'center',
                        width: '80%',
                    },
                    {
                        id: '2',
                        type: 'slider',
                        realtime: true,
                        start: 0,
                        end: 100,
                        yAxisIndex: 'all',
                        angleAxisIndex: 'all',
                        orient:'vertical',
                        bottom: 10,
                        top: 'center',
                        height: '80%',
                    },
                    {
                        id: '3',
                        type: 'inside',
                        realtime: true,
                        start: 30,
                        end: 70,
                        xAxisIndex: 'all',
                        radiusAxisIndex: 'all',
                    },
                    {
                        id: '4',
                        type: 'inside',
                        realtime: true,
                        start: 0,
                        end: 100,
                        yAxisIndex: 'all',
                        angleAxisIndex: 'all',

                    }
                ],
                large: false,
                grid: [],
                polar: [],

                visualMap: undefined,
                xAxis: [],
                yAxis: [],
                angleAxis: [],
                radiusAxis: [],
                radar: [],
                series: [],
                legend: {
                    orient: 'vertical',
                    top: 0,
                    left: 0,
                    textStyle: {
                        fontSize: 12,
                        fontWeight: 400,
                        color: '#000'
                    },

                    itemWidth: 25,
                    itemHeight: 14,
                    icon: 'circle'
                },
                graphic: {
                    elements: [
                        // 标题文本
                        {
                            type: 'text',

                            key: 'custom-title',
                            position: [200,0],
                            draggable: true,
                            invisible: false,
                            z: 100,
                            style: {
                                text: '',
                                fontSize: 12,
                                fontWeight: 800,
                                fill: '#333'
                            },
                            ondrag: null
                        },
                        {
                            type: 'rect',

                            key: 'custom-legend',
                            position: [-10,-10],
                            draggable: true,
                            invisible: true,
                            z: -1,
                            style: {
                                fill: '#000',
                                opacity: 0.5
                            },
                            shape:null,
                            ondrag: null,
                            pointerEvents: 'none'
                        },

                    ]
                },
                animation: false
            },


        }
    },
    actions: {
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

        changeLock(){
            this.isLock = !this.isLock
            const {echartsOptions} = this
            echartsOptions.animation = this.isLock
            echartsOptions.graphic.elements.forEach((i,index) => {
                if(index!==0 && index !== 1){
                    i.draggable = !this.isLock
                    i.invisible = this.isLock
                }
            })

            emitter.emit('merge-option')
        }

    }
})
