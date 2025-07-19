import {defineStore} from "pinia";

export const useGlobalConfig = defineStore('globalConfig', {
        state() {
            return{
                global: {
                    zoom:[false,true],
                    isLayer: false,
                    isLarge: false,
                    isSvg: false,
                    pixelRatio: 1,
                    title: {
                        t: 100,
                        l: 100,
                        text: '',
                        show: true,
                        color: '#000',
                        fontSize: 12,
                        fontWeight: 800,
                        fontFamily: 0,
                        isAlign: false,
                        isJustify: true
                    },
                    legend: {
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
            }
        }
    }
)
