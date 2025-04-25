import {defineStore} from "pinia";

export const useNotice = defineStore('notice', {
    state() {
        return {
            info:[],
            warning:[],
            error:[]
        }
    }
})