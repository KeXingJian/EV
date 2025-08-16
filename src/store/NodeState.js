import {defineStore} from "pinia";

export const useNodeState = defineStore('nodeState', {
        state() {
            return {
                colorPie: new Map()
            }
        },
        actions:{
            setColorPie(id, color) {
                this.colorPie.set(id, color);
            },

            getColorPie(id) {
                return this.colorPie.get(id);
            },
        }
    }
)
