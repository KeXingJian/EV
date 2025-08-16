import {defineStore} from 'pinia'
import {createFilter, parseCondition} from "../utils/ExpressionParser.js";
import {getGrid, getPolar} from "../utils/newArch/Position.js";
import emitter from "../emitter/emitter.js";
import {loadAxis} from "../utils/newArch/AxisUtis.js";
import {activeColor, fontColor, themeColor} from "../utils/newArch/ConstantPool.js";
import {checkSeries} from "../utils/newArch/Check4Series.js";

export const useOptionConfig = defineStore('optionConfig', {
    state() {
        return {
            theme: false,
            isLock: true,
            lang:false,//中文

            isLoadRelation: false,


            fileData: {
                rowCount: -1,
                columnStats: [],
            },
            dataset: {
                source: [],
                dimension: []
            },

            sIndex: 0,
            dIndex: 0,
            cIndex: 0,
            nodeIndex: 0,
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
                    name: '无系图',
                    type: 2, //0:x0y系;1:极坐标系;2无系
                    isStack: false,
                },

            ],
            Ss: [],

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
                        restore: { show: true },

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

                    },
                    {
                        id: '4',
                        type: 'inside',
                        realtime: true,
                        start: 0,
                        end: 100,
                        //yAxisIndex: 'all',


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
                animation: true
            },
            chartInstance: null,
            selects: [],
            selectsE: [],
        }
    },
    actions: {
        //画布实例
        getChartSize(){
          return{
              width: this.chartInstance.getWidth(),
              height: this.chartInstance.getHeight(),
          }
        },

        //映射层处理
        addX0Y(isLazy= false){
            if (this.isLoadRelation) return
            const c =  {
                id: ++this.cIndex,
                name: 'C'+this.cIndex,
                type: 0, //0:x0y系;1:极坐标系;2无系
                grid: getGrid(),
                polar: {},
                isLoad:false,
                axisType: false, //横轴为类目
                isStack: false,
                H:{
                    name: 'H'+this.cIndex,
                    axisName: 'H'+this.cIndex,
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
                V:{
                    name: 'V'+this.cIndex,
                    axisName: 'V'+this.cIndex,
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
            }
            this.Cs.push(c)
            if (!isLazy) loadAxis(c,this.echartsOptions)
        },

        addPolar(isLazy= false){
            if (this.isLoadRelation) return
            const c = {
                id: ++this.cIndex,
                name: 'C'+this.cIndex,
                type: 1, //0:x0y系;1:极坐标系;2无系
                grid: {},
                polar: getPolar(),
                isLoad:false,
                axisType: false, //横轴为类目
                isStack: false,
                H:{
                    name: 'H'+this.cIndex,
                    axisName: 'H'+this.cIndex,
                    unit: '',
                    textColor: fontColor, //轴名称
                    tickLine: false, //标线
                    splitLine: false, //隔线

                    labelColor: fontColor, //下标
                    labelShow: true, //下标

                    lineColor: themeColor, //轴线
                    show: true, //轴线

                    symbol: true, //向右
                    position: true, //下

                },
                V:{
                    name: 'V'+this.cIndex,
                    axisName: 'V'+this.cIndex,
                    unit: '',
                    textColor: fontColor, //轴名称
                    tickLine: false, //标线
                    splitLine: false, //隔线

                    labelColor: fontColor, //下标
                    labelShow: true, //下标

                    lineColor: themeColor, //轴线
                    show: true, //轴线

                    symbol: true, //向上
                    position: false, //左

                    sa: 0,
                    ea: 360
                }
            }
            this.Cs.push(c)
            if (!isLazy) loadAxis(c,this.echartsOptions)
        },

        addSeries(){
            if (this.isLoadRelation) return
            const s = {
                id: ++this.sIndex,
                name: 'S'+this.sIndex,
                seriesName: 'S'+this.sIndex,
                C:null,
                category: -1,
                number: -1,
                isLoad: false,
                color: activeColor,
                type: 0, //0折线,1柱状,2散点,3饼图,4雷达
                areaColor: activeColor,
                D:this.Ds[0],
                isLabel: false,
                labelColor: fontColor,

                lineConfig: {
                    lineType: 0,  //直线,曲线,折线
                    startPoint: 0,
                    isArea: false,
                },
                barConfig: {
                    borderRadius: 5,
                    barGap: 5,
                    barWidth: 40,
                    isAuto: true,
                },
                scatterConfig: {
                    type: 0,
                    mapField: -1,
                    range: [30,70],
                    size: 20,
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
                funnelConfig: {
                    position:getGrid(),
                    sort: 0, //升 无 降
                    gap: 2,
                    labelPosition: 0, //左,中,右
                    align: 1 //左,中,右
                },

            }
            this.Ss.push(s)
        },

        addRelation(){
            if (
                this.isLoadRelation ||
                this.Cs.length !== 1 ||
                this.Ss.length !== 0
            ) {
                emitter.emit("toast", '关系图独立唯一,不予以添加')
                return
            }

            const length = this.dataset.dimension.length

            let canWeightMap = false
            let canCategoryMap = false


            if (length < 4){
                emitter.emit("toast", '数据缺失,不符合初节点-关系-末节点')
                return
            }else if (length === 5){
                //仅启用权重
                if (this.fileData.columnStats[4].type === 'number'){
                    canWeightMap = true
                }else {
                    canWeightMap = false
                    emitter.emit("toast", '第4列不为数字,不启用权重映射')
                }
            }else if (length >= 6){
                //仅启用权重
                if (this.fileData.columnStats[4].type === 'number'){
                    canWeightMap = true
                }else {
                    canWeightMap = false
                    emitter.emit("toast", '第4列不为数字,不予启用权重映射')
                }

                canCategoryMap = true
            }


            this.isLoadRelation = true
            const selects = this.selects
            const selectsE = this.selectsE

            const s = {

                id: ++this.sIndex,
                type: 5,
                name: '关系图',
                seriesName: '关系图',
                isLoad: false,
                layout: 0, //0普通,重力,2环形

                //映射
                from: 1,
                relationship: 2,
                to: 3,

                //标签
                labelConfig: {
                    position: 2,//右侧
                    isLabel: true,
                    labelColor: fontColor,
                },

                //图标
                symbolConfig:{
                    color:activeColor,
                    symbol: 0, //圆形
                },

                weightConfig:{
                    symbolSize: 20,
                    symbolRange: [10,70],
                    isWeightMap: canWeightMap,
                    canWeightMap: canWeightMap
                },

                categoryConfig:{
                    isCategoryMap: canCategoryMap,
                    canCategoryMap: canCategoryMap
                },

                edgeLabel:{
                    show:true,
                    position: 0,
                    color: fontColor
                },

                otherConfig: {
                    isDirected: false,
                    isHideOverlap: false,
                },

                colorSet: [
                    '#6930C3', '#14FFEC', '#FF90BB',
                    '#FF004D', '#0D6E6E', '#FFC7ED'
                ]
            }

            this.Ss.push(s)

            checkSeries(s,this.echartsOptions)

            this.chartInstance.on('mousedown', (eDown) =>{
                if (
                    eDown.componentSubType!=='graph' ||
                    eDown.componentType!=='series' ||
                    eDown.dataType !== 'node'
                ) return

                const target = this.echartsOptions.series[eDown.componentIndex].nodes[eDown.dataIndex]

                const dragCoords = [eDown.event?.offsetX, eDown.event?.offsetY]

                this.chartInstance.on('mouseup', (eUp) =>{
                    const { offsetX, offsetY } =  eUp.event
                    target.x +=(offsetX - dragCoords[0])
                    target.y +=(offsetY - dragCoords[1])
                    this.chartInstance.off('mouseup')
                })
            })

            this.chartInstance.on('selectchanged',(p)=>{
                const {fromActionPayload,fromAction} = p

                if (
                    fromAction === 'select' &&
                    fromActionPayload.dataType ==='node'
                ) {
                    selects.push(fromActionPayload.dataIndexInside)
                }else if (
                    fromAction === 'unselect'&&
                    fromActionPayload.dataType ==='node'
                ){
                    selects.splice(selects.indexOf(fromActionPayload.dataIndexInside),1)
                }else if (
                    fromAction === 'select' &&
                    fromActionPayload.dataType ==='edge'
                ){
                    selectsE.push(fromActionPayload.dataIndexInside)
                }else if (
                    fromAction === 'unselect' &&
                    fromActionPayload.dataType ==='edge'
                ){
                    selectsE.splice(selectsE.indexOf(fromActionPayload.dataIndexInside),1)
                }


            })

        },

        addRelation2(){
            if (
                this.isLoadRelation ||
                this.Cs.length !== 1 ||
                this.Ss.length !== 0
            ) {
                emitter.emit("toast", '关系图独立唯一,不予以添加')
                return
            }

            const length = this.dataset.dimension.length

            let canWeightMap = false
            let canCategoryMap = false


            if (length < 4){
                emitter.emit("toast", '数据缺失,不符合初节点-关系-末节点')
                return
            }else if (length === 5){
                //仅启用权重
                if (this.fileData.columnStats[4].type === 'number'){
                    canWeightMap = true
                }else {
                    canWeightMap = false
                    emitter.emit("toast", '第4列不为数字,不启用权重映射')
                }
            }else if (length >= 6){
                //仅启用权重
                if (this.fileData.columnStats[4].type === 'number'){
                    canWeightMap = true
                }else {
                    canWeightMap = false
                    emitter.emit("toast", '第4列不为数字,不予启用权重映射')
                }

                canCategoryMap = true
            }


            this.isLoadRelation = true
            const selects = this.selects
            const selectsE = this.selectsE

            const s = {
                isAI: true,
                id: ++this.sIndex,
                type: 5,
                name: '关系图',
                seriesName: '关系图',
                isLoad: false,
                layout: 0, //0普通,重力,2环形

                //映射
                from: 1,
                relationship: 2,
                to: 3,

                //标签
                labelConfig: {
                    position: 2,//右侧
                    isLabel: true,
                    labelColor: fontColor,
                },

                //图标
                symbolConfig:{
                    color:activeColor,
                    symbol: 0, //圆形
                },

                weightConfig:{
                    symbolSize: 20,
                    symbolRange: [10,70],
                    isWeightMap: canWeightMap,
                    canWeightMap: canWeightMap
                },

                categoryConfig:{
                    isCategoryMap: false,
                    canCategoryMap: false
                },

                edgeLabel:{
                    show:true,
                    position: 0,
                    color: fontColor
                },

                otherConfig: {
                    isDirected: false,
                    isHideOverlap: false,
                },

                colorSet: [
                    '#6930C3', '#14FFEC', '#FF90BB',
                    '#FF004D', '#0D6E6E', '#FFC7ED'
                ]
            }

            this.Ss.push(s)

            checkSeries(s,this.echartsOptions)

            this.chartInstance.on('mousedown', (eDown) =>{
                if (
                    eDown.componentSubType!=='graph' ||
                    eDown.componentType!=='series' ||
                    eDown.dataType !== 'node'
                ) return

                const target = this.echartsOptions.series[eDown.componentIndex].nodes[eDown.dataIndex]

                const dragCoords = [eDown.event?.offsetX, eDown.event?.offsetY]

                this.chartInstance.on('mouseup', (eUp) =>{
                    const { offsetX, offsetY } =  eUp.event
                    target.x +=(offsetX - dragCoords[0])
                    target.y +=(offsetY - dragCoords[1])
                    this.chartInstance.off('mouseup')
                })
            })

            this.chartInstance.on('selectchanged',(p)=>{
                const {fromActionPayload,fromAction} = p

                console.log(fromActionPayload)
                console.log(fromAction)
                if (
                    fromAction === 'select' &&
                    fromActionPayload.dataType ==='node'
                ) {
                    selects.push(fromActionPayload.dataIndexInside)
                }else if (
                    fromAction === 'unselect'&&
                    fromActionPayload.dataType ==='node'
                ){
                    selects.splice(selects.indexOf(fromActionPayload.dataIndexInside),1)
                }else if (
                    fromAction === 'select' &&
                    fromActionPayload.dataType ==='edge'
                ){
                    selectsE.push(fromActionPayload.dataIndexInside)
                }else if (
                    fromAction === 'unselect' &&
                    fromActionPayload.dataType ==='edge'
                ){
                    selectsE.splice(selectsE.indexOf(fromActionPayload.dataIndexInside),1)
                }


            })

        },
        //数据处理
        applyFilter(dataset, expression) {
            const condition = parseCondition(expression, this.fileData.columnStats)
            if (!condition) return false

            dataset.filterConditions.push(condition)
            this.refreshDataset(dataset.id)
            return true
        },

        // 刷新数据集数据
        refreshDataset(datasetId) {
            const dataset = this.Ds.find(i => i.id === datasetId)
            if (!dataset) return

            const conditions = this.getInheritedConditions(dataset)

            const filterChain = conditions.map(cond =>
                createFilter(cond)
            )

            dataset.filterChain = filterChain
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

            conditions.unshift(...dataset.filterConditions)
            let childId = dataset.id
            let current = dataset.parent
            while (current) {
                conditions.unshift(...current.filterConditions)
                const child = current.groupCondition.find(i => i.child.id === childId)
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
        //解锁
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
