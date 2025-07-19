import {checkSeries} from "./newArch/Check4Series.js";
import {loadAxis} from "./newArch/AxisUtis.js";
import {getGrid, getPolar} from "./newArch/Position.js";

export const getMockData = (lang) => {

    const mockData = [
        ['产品', '武汉', '长沙', '成都', '平均值'],
        [
            "A",
            34,
            78,
            15,
            42.33
        ],
        [
            "B",
            92,
            45,
            63,
            66.67
        ],
        [
            "C",
            7,
            29,
            81,
            39
        ],
        [
            "D",
            55,
            55,
            55,
            55
        ],
        [
            "E",
            12,
            96,
            3,
            37
        ],
        [
            "F",
            56,
            36,
            76,
            56
        ],
        [
            "G",
            52,
            45,
            34,
            43.6
        ],
        [
            "H",
            64,
            76,
            54,
            64.6
        ],
        [
            "I",
            86,
            35,
            67,
            62.6
        ]
    ]

    if(lang){
        mockData[0] = ['Product', 'Los Angeles', 'New York', 'Washington', 'Average']
    }

    return mockData
}



export const getMockSs1 = () => {
    return [
        {
            "id": 0,
            "name": "S0",
            "seriesName": "S0",
            "C": null,
            "category": 0,
            "number": 1,
            "isLoad": false,
            "color": "#FF4081",
            "type": 1,
            "areaColor": "#FF4081",
            "isLabel": false,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 0,
                "startPoint": 0,
                "isArea": false
            },
            "barConfig": {
                borderRadius: 5,
                barGap: 5,
                barWidth: 40,
                isAuto: true,
            },
            "scatterConfig": {
                "type": 0,
                "mapField": -1,
                range: [20, 50],
                size: 20,
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 0,
                "borderRadius": 10,
                "padAngle": 0,
                "position": 0,
                "labelLine": true,
                "polar":getPolar()
            },
            funnelConfig: {
                position: getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D": null
        },
        {
            "id": 1,
            "name": "S1",
            "seriesName": "S1",
            "C": null,
            "category": 0,
            "number": 2,
            "isLoad": false,
            "color": "#14FFEC",
            "type": 1,
            "areaColor": "#FF4081",
            "isLabel": false,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 0,
                "startPoint": 0,
                "isArea": false
            },
            "barConfig": {
                borderRadius: 5,
                barGap: 5,
                barWidth: 40,
                isAuto: true,
            },
            "scatterConfig": {
                "type": 0,
                "mapField": -1,
                range: [20, 50],
                size: 20,
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 0,
                "borderRadius": 10,
                "padAngle": 0,
                "position": 0,
                "labelLine": true,
                "polar": getPolar()
            },
            funnelConfig: {
                position: getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D": null
        },
        {
            "id": 2,
            "name": "S2",
            "seriesName": "S2",
            "C": null,
            "category": 0,
            "number": 3,
            "isLoad": false,
            "color": "#C5BAFF",
            "type": 1,
            "areaColor": "#FF4081",
            "isLabel": false,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 0,
                "startPoint": 0,
                "isArea": false
            },
            "barConfig": {
                borderRadius: 5,
                barGap: 5,
                barWidth: 40,
                isAuto: true,
            },
            "scatterConfig": {
                "type": 0,
                "mapField": -1,
                range: [20, 50],
                size: 20,
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 0,
                "borderRadius": 10,
                "padAngle": 0,
                "position": 0,
                "labelLine": true,
                "polar": getPolar()
            },
            funnelConfig: {
                position: getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D":null
        },
        {
            "id": 3,
            "name": "S3",
            "seriesName": "S3",
            "C": null,
            "category": 0,
            "number": 4,
            "isLoad": false,
            "color": "#A7FFE4",
            "type": 0,
            "areaColor": "#FF4081",
            "isLabel": false,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 0,
                "startPoint": 0,
                "isArea": false
            },
            "barConfig": {
                borderRadius: 5,
                barGap: 5,
                barWidth: 40,
                isAuto: true,
            },
            "scatterConfig": {
                "type": 0,
                "mapField": -1,
                range: [20, 50],
                size: 20,
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 0,
                "borderRadius": 10,
                "padAngle": 0,
                "position": 0,
                "labelLine": true,
                "polar":getPolar()
            },
            funnelConfig: {
                position:getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D": null
        }
    ]
}

export const getMockSs2 = () => {
    return [
        {
            "id": 0,
            "name": "S0",
            "seriesName": "S0",
            "C": null,
            "category": 0,
            "number": 1,
            "isLoad": false,
            "color": "#FE346E",
            "type": 1,
            "areaColor": "#FF4081",
            "isLabel": false,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 0,
                "startPoint": 0,
                "isArea": false
            },
            "barConfig": {
                "borderRadius": 0,
                "barGap": 5,
                "barWidth": 12,
                isAuto: true,
            },
            "scatterConfig": {
                "type": 0,
                "mapField": -1,
                "range": [
                    20,
                    50
                ],
                "size": 20
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 0,
                "borderRadius": 10,
                "padAngle": 0,
                "position": 0,
                "labelLine": true,
                "polar": getPolar()
            },
            funnelConfig: {
                position: getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D": null
        },
        {
            "id": 1,
            "name": "S1",
            "seriesName": "S1",
            "C": null,
            "category": 0,
            "number": 2,
            "isLoad": false,
            "color": "#0D6E6E",
            "type": 1,
            "areaColor": "#FF4081",
            "isLabel": false,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 0,
                "startPoint": 0,
                "isArea": false
            },
            "barConfig": {
                "borderRadius": 0,
                "barGap": 5,
                "barWidth": 12,
                isAuto: true,
            },
            "scatterConfig": {
                "type": 0,
                "mapField": -1,
                "range": [
                    20,
                    50
                ],
                "size": 20
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 0,
                "borderRadius": 10,
                "padAngle": 0,
                "position": 0,
                "labelLine": true,
                "polar":getPolar()
            },
            funnelConfig: {
                position: getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D":null
        }
    ]
}

export const getMockSs3 = () => {
    return [
        {
            "id": 0,
            "name": "S0",
            "seriesName": "S0",
            "C": null,
            "category": 0,
            "number": 1,
            "isLoad": false,
            "color": "#00FFF0",
            "type": 1,
            "areaColor": "#FF4081",
            "isLabel": false,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 0,
                "startPoint": 0,
                "isArea": false
            },
            "barConfig": {
                "borderRadius": 5,
                "barGap": 5,
                "barWidth": 40,
                isAuto: false,
            },
            "scatterConfig": {
                "type": 0,
                "mapField": -1,
                "range": [
                    20,
                    50
                ],
                "size": 20
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 0,
                "borderRadius": 10,
                "padAngle": 0,
                "position": 0,
                "labelLine": true,
                "polar": getPolar()
            },
            funnelConfig: {
                position:getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D": null
        },
        {
            "id": 1,
            "name": "S1",
            "seriesName": "S1",
            "C":null,
            "category": 0,
            "number": 2,
            "isLoad": false,
            "color": "#FF4081",
            "type": 1,
            "areaColor": "#FF4081",
            "isLabel": false,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 0,
                "startPoint": 0,
                "isArea": false
            },
            "barConfig": {
                "borderRadius": 5,
                "barGap": 5,
                "barWidth": 40,
                isAuto: false,
            },
            "scatterConfig": {
                "type": 0,
                "mapField": -1,
                "range": [
                    20,
                    50
                ],
                "size": 20
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 0,
                "borderRadius": 10,
                "padAngle": 0,
                "position": 0,
                "labelLine": true,
                "polar":getPolar()
            },
            funnelConfig: {
                position: getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D":null
        }
    ]
}

export const getMockSs4 = () => {
    return [
        {
            "id": 0,
            "name": "S0",
            "seriesName": "S0",
            "C": null,
            "category": 0,
            "number": 1,
            "isLoad": false,
            "color": "#FF4081",
            "type": 3,
            "areaColor": "#FF4081",
            "isLabel": true,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 0,
                "startPoint": 0,
                "isArea": false
            },
            "barConfig": {
                "borderRadius": 5,
                "barGap": 5,
                "barWidth": 40,
                isAuto: true,
            },
            "scatterConfig": {
                "type": 0,
                "mapField": -1,
                "range": [
                    20,
                    50
                ],
                "size": 20
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 1,
                "borderRadius": 5,
                "padAngle": 1,
                "position": 0,
                "labelLine": true,
                "polar": {
                    pi: 70,
                    po: 400,
                    pl: 500,
                    pt: 410
                }
            },
            funnelConfig: {
                position: getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D": null
        },
        {
            "id": 1,
            "name": "S1",
            "seriesName": "S1",
            "C": null,
            "category": 0,
            "number": 2,
            "isLoad": false,
            "color": "#FF4081",
            "type": 3,
            "areaColor": "#FF4081",
            "isLabel": true,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 0,
                "startPoint": 0,
                "isArea": false
            },
            "barConfig": {
                "borderRadius": 5,
                "barGap": 5,
                "barWidth": 40,
                isAuto: true,
            },
            "scatterConfig": {
                "type": 0,
                "mapField": -1,
                "range": [
                    20,
                    50
                ],
                "size": 20
            },
            "pieConfig": {
                "isRose": true,
                "roseType": 0,
                "borderRadius": 7.3,
                "padAngle": 1,
                "position": 1,
                "labelLine": true,
                "polar": {
                    pi: 0,
                    po: 200,
                    pl: 500,
                    pt: 410
                }
            },
            funnelConfig: {
                position: getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D": null
        }
    ]

}

export const getMockSs5 = () => {
    return [
        {
            "id": 0,
            "name": "S0",
            "seriesName": "S0",
            "C": null,
            "category": 0,
            "number": 1,
            "isLoad": false,
            "color": "#00FFF0",
            "type": 0,
            "areaColor": "#00FFF0",
            "isLabel": false,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 1,
                "startPoint": 0,
                "isArea": true
            },
            "barConfig": {
                "borderRadius": 5,
                "barGap": 5,
                "barWidth": 40,
                isAuto: true,
            },
            "scatterConfig": {
                "type": 0,
                "mapField": -1,
                "range": [
                    20,
                    50
                ],
                "size": 20
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 0,
                "borderRadius": 10,
                "padAngle": 0,
                "position": 0,
                "labelLine": true,
                "polar":getPolar()
            },
            funnelConfig: {
                position:getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D": null
        },
        {
            "id": 1,
            "name": "S1",
            "seriesName": "S1",
            "C":null,
            "category": 0,
            "number": 2,
            "isLoad": false,
            "color": "#7579E7",
            "type": 0,
            "areaColor": "#7579E7",
            "isLabel": false,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 1,
                "startPoint": 0,
                "isArea": true
            },
            "barConfig": {
                "borderRadius": 5,
                "barGap": 5,
                "barWidth": 40,
                isAuto: true,
            },
            "scatterConfig": {
                "type": 0,
                "mapField": -1,
                "range": [
                    20,
                    50
                ],
                "size": 20
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 0,
                "borderRadius": 10,
                "padAngle": 0,
                "position": 0,
                "labelLine": true,
                "polar": getPolar()
            },
            funnelConfig: {
                position: getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D": null
        },
        {
            "id": 2,
            "name": "S2",
            "seriesName": "S2",
            "C":null,
            "category": 0,
            "number": 2,
            "isLoad": false,
            "color": "#F6416C",
            "type": 0,
            "areaColor": "#F6416C",
            "isLabel": false,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 1,
                "startPoint": 0,
                "isArea": true
            },
            "barConfig": {
                "borderRadius": 5,
                "barGap": 5,
                "barWidth": 40,
                isAuto: true,
            },
            "scatterConfig": {
                "type": 0,
                "mapField": -1,
                "range": [
                    20,
                    50
                ],
                "size": 20
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 0,
                "borderRadius": 10,
                "padAngle": 0,
                "position": 0,
                "labelLine": true,
                "polar":getPolar()
            },
            funnelConfig: {
                position: getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D": null
        }
    ]
}

export const getMockSs6 = () => {
    return [
        {
            "id": 0,
            "name": "S0",
            "seriesName": "S0",
            "C":null,
            "category": 0,
            "number": 1,
            "isLoad": false,
            "color": "#00FFF0",
            "type": 2,
            "areaColor": "#00FFF0",
            "isLabel": false,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 1,
                "startPoint": 0,
                "isArea": true
            },
            "barConfig": {
                "borderRadius": 5,
                "barGap": 5,
                "barWidth": 40,
                isAuto: true,
            },
            "scatterConfig": {
                "type": 1,
                "mapField": 4,
                "range": [
                    36.244140625,
                    73.744140625
                ],
                "size": 20
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 0,
                "borderRadius": 10,
                "padAngle": 0,
                "position": 0,
                "labelLine": true,
                "polar": getPolar()
            },
            funnelConfig: {
                position:getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D": null
        },
        {
            "id": 1,
            "name": "S1",
            "seriesName": "S1",
            "C":null,
            "category": 0,
            "number": 2,
            "isLoad": false,
            "color": "#A7FFE4",
            "type": 2,
            "areaColor": "#A7FFE4",
            "isLabel": false,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 1,
                "startPoint": 0,
                "isArea": true
            },
            "barConfig": {
                "borderRadius": 5,
                "barGap": 5,
                "barWidth": 40,
                isAuto: true,
            },
            "scatterConfig": {
                "type": 1,
                "mapField": 4,
                "range": [
                    30.244140625,
                    80.744140625
                ],
                "size": 20
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 0,
                "borderRadius": 10,
                "padAngle": 0,
                "position": 0,
                "labelLine": true,
                "polar":getPolar()
            },
            funnelConfig: {
                position: getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D": null
        },
        {
            "id": 2,
            "name": "S2",
            "seriesName": "S2",
            "C": null,
            "category": 0,
            "number": 3,
            "isLoad": false,
            "color": "#FF4081",
            "type": 2,
            "areaColor": "#FF4081",
            "isLabel": false,
            "labelColor": "#000",
            "lineConfig": {
                "lineType": 1,
                "startPoint": 0,
                "isArea": true
            },
            "barConfig": {
                "borderRadius": 5,
                "barGap": 5,
                "barWidth": 40,
                isAuto: true,
            },
            "scatterConfig": {
                "type": 1,
                "mapField": 4,
                "range": [
                    25.244140625,
                    76.244140625
                ],
                "size": 20
            },
            "pieConfig": {
                "isRose": false,
                "roseType": 0,
                "borderRadius": 10,
                "padAngle": 0,
                "position": 0,
                "labelLine": true,
                "polar":getPolar()
            },
            funnelConfig: {
                position: getGrid(),
                sort: 0, //升 无 降
                gap: 2,
                labelPosition: 0, //左,中,右
                align: 1 //左,中,右
            },
            radarConfig: {
                isArea: false,
                areaColor: '#FF4081'
            },
            "D":null
        }
    ]

}

export const getMockCs2 = () => {
    return [
        {
            "id": -1,
            "name": "noSeries",
            "type": 2,
            "isStack": false
        },
        {
            "id": 0,
            "name": "C0",
            "type": 1,
            "polar": {
                "pi": 10,
                "po": 390,
                pl: 500,
                pt: 410
            },
            "isLoad": false,
            "axisType": true,
            "isStack": false,
            "H": {
                "name": "H0",
                "axisName": "H0",
                "unit": "",
                "textColor": "#00FFF0",
                "tickLine": false,
                "splitLine": false,
                "labelColor": "#00FFF0",
                "labelShow": true,
                "lineColor": "#0D6E6E",
                "show": true,
                "symbol": true,
                "position": true
            },
            "V": {
                "name": "V0",
                "axisName": "V0",
                "unit": "",
                "textColor": "#00FFF0",
                "tickLine": false,
                "splitLine": false,
                "labelColor": "#00FFF0",
                "labelShow": true,
                "lineColor": "#0D6E6E",
                "show": true,
                "symbol": true,
                "position": false,
                "sa": 30,
                "ea": 150
            }
        },
        {
            "id": 1,
            "name": "C1",
            "type": 1,
            "polar": {
                "pi": 10,
                "po": 390,
                pl: 500,
                pt: 410
            },
            "isLoad": false,
            "axisType": true,
            "isStack": false,
            "H": {
                "name": "H1",
                "axisName": "H1",
                "unit": "",
                "textColor": "#00FFF0",
                "tickLine": false,
                "splitLine": true,
                "labelColor": "#00FFF0",
                "labelShow": true,
                "lineColor": "#0D6E6E",
                "show": true,
                "symbol": true,
                "position": true
            },
            "V": {
                "name": "V1",
                "axisName": "V1",
                "unit": "",
                "textColor": "#00FFF0",
                "tickLine": false,
                "splitLine": true,
                "labelColor": "#00FFF0",
                "labelShow": true,
                "lineColor": "#0D6E6E",
                "show": true,
                "symbol": true,
                "position": false,
                "sa": 210,
                "ea": 330
            }
        }
    ]
}

export const getMockCs3 = () => {
    return [
        {
            "id": -1,
            "name": "noSeries",
            "type": 2,
            "isStack": false
        },
        {
            "id": 0,
            "name": "C0",
            "type": 0,
            "grid":{
                t: 400,
                l: 100,
                w: 800,
                h: 300,
            },
            "isLoad": false,
            "axisType": false,
            "isStack": false,
            "H": {
                "name": "H0",
                "axisName": "H0",
                "unit": "",
                "textColor": "#f5f5f5",
                "tickLine": false,
                "splitLine": false,
                "labelColor": "#f5f5f5",
                "labelShow": true,
                "lineColor": "#0D6E6E",
                "show": true,
                "symbol": false,
                "position": false,
                "offset": 0
            },
            "V": {
                "name": "V0",
                "axisName": "V0",
                "unit": "",
                "textColor": "#f5f5f5",
                "tickLine": false,
                "splitLine": false,
                "labelColor": "#f5f5f5",
                "labelShow": true,
                "lineColor": "#0D6E6E",
                "show": true,
                "symbol": false,
                "position": true,
                "offset": 0
            }
        },
        {
            "id": 1,
            "name": "C1",
            "type": 0,
            "grid": {
                t: 50,
                l: 100,
                w: 800,
                h: 300,
            },

            "isLoad": false,
            "axisType": false,
            "isStack": false,
            "H": {
                "name": "H1",
                "axisName": "H1",
                "unit": "",
                "textColor": "#f5f5f5",
                "tickLine": false,
                "splitLine": false,
                "labelColor": "#f5f5f5",
                "labelShow": true,
                "lineColor": "#0D6E6E",
                "show": true,
                "symbol": false,
                "position": true,
                "offset": 0
            },
            "V": {
                "name": "V1",
                "axisName": "V1",
                "unit": "",
                "textColor": "#f5f5f5",
                "tickLine": false,
                "splitLine": false,
                "labelColor": "#f5f5f5",
                "labelShow": true,
                "lineColor": "#0D6E6E",
                "show": true,
                "symbol": true,
                "position": true,
                "offset": 0
            }
        }
    ]

}

export const getMockCs4 = () => {
    return [
        {
            "id": -1,
            "name": "noSeries",
            "type": 2,
            "isStack": false
        }
    ]

}

export const getMockCs5 = () => {
    return [
        {
            "id": -1,
            "name": "noSeries",
            "type": 2,
            "isStack": false
        },
        {
            "id": 0,
            "name": "C0",
            "type": 0,
            "grid":getGrid(),
            "isLoad": false,
            "axisType": false,
            "isStack": true,
            "H": {
                "name": "H0",
                "axisName": "H0",
                "unit": "",
                "textColor": "#000",
                "tickLine": false,
                "splitLine": false,
                "labelColor": "#000",
                "labelShow": true,
                "lineColor": "#0D6E6E",
                "show": true,
                "symbol": true,
                "position": true,
                "offset": 0
            },
            "V": {
                "name": "V0",
                "axisName": "V0",
                "unit": "",
                "textColor": "#000",
                "tickLine": false,
                "splitLine": false,
                "labelColor": "#000",
                "labelShow": true,
                "lineColor": "#0D6E6E",
                "show": true,
                "symbol": true,
                "position": false,
                "offset": 0
            }
        }
    ]


}

export const getMockCs6 = () => {
    return [
        {
            "id": -1,
            "name": "noSeries",
            "type": 2,
            "isStack": false
        },
        {
            "id": 0,
            "name": "C0",
            "type": 0,
            "grid":getGrid(),
            "isLoad": false,
            "axisType": false,
            "isStack": false,
            "H": {
                "name": "H0",
                "axisName": "H0",
                "unit": "",
                "textColor": "#000",
                "tickLine": false,
                "splitLine": false,
                "labelColor": "#000",
                "labelShow": true,
                "lineColor": "#0D6E6E",
                "show": true,
                "symbol": true,
                "position": true,
                "offset": 0
            },
            "V": {
                "name": "V0",
                "axisName": "V0",
                "unit": "",
                "textColor": "#000",
                "tickLine": false,
                "splitLine": false,
                "labelColor": "#000",
                "labelShow": true,
                "lineColor": "#0D6E6E",
                "show": true,
                "symbol": true,
                "position": false,
                "offset": 0
            }
        }
    ]


}

export const handle1 = (Ss,Cs,sIndex,cIndex,global,echartsOptions,Ds)=>{
    Ss.value = getMockSs1()
    sIndex.value = 3
    cIndex.value = 0


    Cs.value.filter(i=>i.id>-1).forEach(i=>loadAxis(i,echartsOptions))
    Ss.value.forEach(i=> {
        i.C = Cs.value[1]
        i.D = Ds.value[0]
        checkSeries(i, echartsOptions)
    })

}

export const handle2 = (Ss,Cs,sIndex,cIndex,global,echartsOptions,Ds)=>{
    Ss.value = getMockSs2()
    Cs.value = getMockCs2()
    global.value.backGround = '#1d2e3d'

    echartsOptions.value.backgroundColor = '#1d2e3d'


    Cs.value.filter(i=>i.id>-1).forEach(i=>loadAxis(i,echartsOptions))

    Ss.value.forEach((i,index)=> {
        i.C = Cs.value[index+1]
        i.D = Ds.value[0]
        checkSeries(i, echartsOptions)
    })

    sIndex.value = 1
    cIndex.value = 1
}

export const handle3 = (Ss,Cs,sIndex,cIndex,global,echartsOptions,Ds)=>{
    Ss.value = getMockSs3()
    Cs.value = getMockCs3()

    echartsOptions.value.backgroundColor = '#1a1f2b'

    Cs.value.filter(i=>i.id>-1).forEach(i=>loadAxis(i,echartsOptions))

    Ss.value.forEach((i,index)=> {
        i.C = Cs.value[index+1]
        i.D = Ds.value[0]
        checkSeries(i, echartsOptions)
    })

    sIndex.value = 1
    cIndex.value = 1
}

export const handle4 = (Ss,Cs,sIndex,cIndex,global,echartsOptions,Ds)=>{
    Ss.value = getMockSs4()
    Cs.value = getMockCs4()
    const colors = getColors()
    Ss.value.forEach((i,index)=> {
        i.C = Cs.value[0]
        i.D = Ds.value[0]
        checkSeries(i, echartsOptions)
        const target = echartsOptions.value.series.find(item=>item.id===i.id)

        target.data.forEach((d,index)=>{
            d.itemStyle.color = colors[index]
        })
        checkSeries(i, echartsOptions)
    })

    sIndex.value = 1
    cIndex.value = 0
}

export const handle5= (Ss,Cs,sIndex,cIndex,global,echartsOptions,Ds)=>{
    Ss.value = getMockSs5()
    Cs.value = getMockCs5()

    Cs.value.filter(i=>i.id>-1).forEach(i=>loadAxis(i,echartsOptions))

    Ss.value.forEach((i,index)=> {
        i.C = Cs.value[1]
        i.D = Ds.value[0]
        checkSeries(i, echartsOptions)
    })

    sIndex.value = 2
    cIndex.value = 0
}

export const handle6= (Ss,Cs,sIndex,cIndex,global,echartsOptions,Ds)=>{
    Ss.value = getMockSs6()
    Cs.value = getMockCs6()

    global.value.visualMap.pieces = [
        {
            "gt": 0,
            "lte": 25,
            "color": "#FF4081"
        },
        {
            "gt": 25,
            "lte": 50,
            "color": "#4CD3C2"
        },
        {
            "gt": 50,
            "lte": 75,
            "color": "#A7FFE4"
        },
        {
            "gt": 75,
            "lte": 100,
            "color": "#00FFF0"
        }
    ]
    global.value.isLayer = true

    echartsOptions.value.visualMap = {
        pieces: global.value.visualMap.pieces,
        dimension: 1
    }

    Cs.value.filter(i=>i.id>-1).forEach(i=>loadAxis(i,echartsOptions))

    Ss.value.forEach((i)=> {
        i.C = Cs.value[1]
        i.D = Ds.value[0]
        checkSeries(i, echartsOptions)
    })

    sIndex.value = 2
    cIndex.value = 0
}

const getColors = ()=>{
    return [
        "#00E5FF",
        "#FF74B1",
        "#0D6E6E",
        "#4CD3C2",
        "#1d2e3d",
        "#F6416C",
        "#00fff0",
        "#ff004d",
        "#6930C3"
    ]
}