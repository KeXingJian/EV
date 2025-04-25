import {storeToRefs} from "pinia";
import {useNotice} from "../store/Notice.js";

export const pushMsg = (type,msg,link='')=>{
    const {info,warning,error} = storeToRefs(useNotice())
    if (type === 0) info.value.push({msg,link})
    else if (type===1) warning.value.push({msg,link})
    else if (type===2) error.value.push({msg,link})
}