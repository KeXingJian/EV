import {defineStore} from "pinia";

export const usePalettesConfig = defineStore('palettesConfig', {
    state() {
        return {
            palettes: [
                {
                    name: 'My',
                    isLove: true,
                    colors: [
                        '#0D6E6E', '#afffff', '#0D1F2D',
                        '#1d2e3d', '#FF3D3D', '#FFFFFF'
                    ]
                },
                {
                    name: 'P1',
                    isLove: true,
                    colors: [
                        '#F7CFD8', '#F4F8D3', '#A6D6D6',
                        '#8E7DBE', '#F6416C', '#292524'
                    ]
                },
                {
                    name: 'P2',
                    isLove: true,
                    colors: [
                        '#26A69A', '#cdfaf6', '#E0F2F1',
                        '#D0EBEA', '#43A49B', '#263339'
                    ]
                },
                {
                    name: 'P3',
                    isLove: true,
                    colors: [
                        '#F6F6F6', '#EAE9E9', '#D4D7DD',
                        '#420000', '#D2FAFB', '#6BC5D2'
                    ]
                },
                {
                    name: 'P4',
                    isLove: true,
                    colors: [
                        '#F7E8F6', '#F1C6E7', '#E5B0EA',
                        '#BD83CE', '#0C093C', '#DF42D1'
                    ]
                },
                {
                    name: 'P5',
                    isLove: true,
                    colors: [
                        '#EEA5F6', '#E0E2E5', '#FFF1E9',
                        '#FFD5D5', '#FC7FB2', '#45454D'
                    ]
                },
                {
                    name: 'P6',
                    isLove: false,
                    colors: [
                        '#6c35de', '#ffc7ff', '#241b35',
                        '#342a45', '#cb80ff', '#ffffff'
                    ]
                },
                {
                    name: 'P7',
                    isLove: false,
                    colors: [
                        '#39375B', '#745C97', '#D597CE',
                        '#F5B0CB', '#272343', '#E3F6F5'
                    ]
                },
                {
                    name: 'P8',
                    isLove: false,
                    colors: [
                        '#BAE8E8', '#ffccc4', '#F1F3F4',
                        '#f5f5f5', '#79BAC1', '#1a1a1a'
                    ]
                },
                {
                    name: 'P9',
                    isLove: false,
                    colors: [
                        '#FBCFFC', '#BE79DF', '#FFBCBC',
                        '#4CD3C2', '#B7EFCD', '#512B58'
                    ]
                },
                {
                    name: 'P10',
                    isLove: false,
                    colors: [
                        '#FE346E', '#D2FAFB', '#1A1F2B',
                        '#292e3b', '#FF4D4D', '#CFF1EF'
                    ]
                },
                {
                    name: 'P11',
                    isLove: false,
                    colors: [
                        '#9DDFD3', '#ffe4ff', '#F5F5F5',
                        '#FF74B1', '#00E5FF', '#FFA1CF'
                    ]
                },
                {
                    name: 'P12',
                    isLove: false,
                    colors: [
                        '#FFD6EC', '#A7FFE4', '#1A1F2B',
                        '#f5f5f5', '#2196F3', '#333333'
                    ]
                },
                {
                    name: 'P13',
                    isLove: false,
                    colors: [
                        '#034C53', '#007074', '#F38C79',
                        '#FFC1B4', '#6439FF', '#4F75FF'
                    ]
                },
                {
                    name: 'P14',
                    isLove: false,
                    colors: [
                        '#00CCDD', '#7CF5FF', '#FF004D',
                        '#5A082D', '#33030D', '#212121'
                    ]
                },
                {
                    name: 'P15',
                    isLove: false,
                    colors: [
                        '#323232', '#0D7377', '#14FFEC',
                        '#f5f5f5', '#00FFF0', '#7579E7'
                    ]
                },
                {
                    name: 'P16',
                    isLove: false,
                    colors: [
                        '#9AB3F5', '#A3D8F4', '#B9FFFC',
                        '#6930C3', '#252525', '#6930C3'
                    ]
                },
                {
                    name: 'P17',
                    isLove: false,
                    colors: [
                        '#ACE1AF', '#B0EBB4', '#BFF6C3',
                        '#E0FBE2', '#5A639C', '#E2BBE9'
                    ]
                },
                {
                    name: 'P18',
                    isLove: false,
                    colors: [
                        '#B9F3FC', '#AEE2FF', '#93C6E7',
                        '#FEDEFF', '#FFF8DB', '#FFC7ED'
                    ]
                },
                {
                    name: 'P19',
                    isLove: false,
                    colors: [
                        '#7D8ABC', '#304463', '#1A1F2B',
                        '#FEF9F2', '#FFE3E3', '#CDC1FF'
                    ]
                },
                {
                    name: 'P20',
                    isLove: false,
                    colors: [
                        '#FFF6E3', '#A7FFE4', '#FF90BB',
                        '#FFC1DA', '#8ACCD5', '#C5BAFF'
                    ]
                },
            ],
        }
    }
})