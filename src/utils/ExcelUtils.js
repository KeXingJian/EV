
// 类型检测函数
import {useOptionConfig} from "../store/OptionConfig.js";

export const detectValueType = (value) => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'number' && !isNaN(value)) return 'number';
    // 增强字符串类型检测
    return typeof value === 'string' && isNaN(value) ? 'string' : typeof value;
}

export const analyzeColumns2 = (rows, header,isNeedSoleCheck=true) => {
    const stats = header.map((field, index) => ({
        index,
        field,
        type: 'unknown',
        hasAnomaly: false,
        numericStats: {

        },
        frequency: new Map(),
        change4N: [],//记录number被强转

        isUnique: false,

    }))

    // 处理数据行（排除表头）
    rows.forEach((row,index) => {
        row.forEach((value, col) => {

            if (col===0) return

            const current = stats[col]
            // 空值检测
            if (value === null || value === "" || value === undefined) {
                current.hasAnomaly = true;
                return
            }

            // 类型检测
            let valueType = detectValueType(value)

            if (current.type === 'unknown') {
                //初始类型
                current.type = valueType
            } else if (current.type === 'number' && valueType !== 'number') {
                stats[col].change4N.push(index+1)
                value = 0
                row[col] = 0
            }

            // 数值统计
            if (current.type === 'number') {
                const num = Number(value);
                if (!isNaN(num)) {
                    current.numericStats.min = Math.min(current.numericStats?.min || Infinity, num);
                    current.numericStats.max = Math.max(current.numericStats?.max || -Infinity, num);
                }
            }

            if (!isNeedSoleCheck) return
            // 频率统计（排除空值）
            const key = String(value)

            current.frequency.set(key, (current.frequency.get(key) || 0) + 1);
        });
    });

    // 计算统计指标
    stats.forEach(col => {
        if (col===0) {
            col.isUnique = true
            return
        }

        if (col.frequency.size === 0) return;



        let maxCount = 0;

        col.frequency.forEach((count) => {
            if (count > maxCount) {
                maxCount = count;
            }
        })

        // 判断是否所有值唯一（且至少有一个值）
        if (isNeedSoleCheck) col.isUnique = maxCount === 1 && col.frequency.size >= 1;


    })

    return stats;
}

export const reloadNumericStats = ()=>{
    const {dataset:{source},fileData:{columnStats}}=useOptionConfig()

    source.forEach(row => {
        row.forEach((value,index) => {
            if (index === 0) return

            const current = columnStats[index]

            if (current.type === 'string') return

            current.numericStats.min = Math.min(current.numericStats.min, value);
            current.numericStats.max = Math.max(current.numericStats.max, value);

        })
    })
}

export const reloadNumericStats4One = (col)=>{
    const {dataset:{source},fileData:{columnStats}}=useOptionConfig()

    source.forEach(row => {
        row.forEach((value,index) => {
            if (index!==col) return

            const current = columnStats[index]

            if (current.type === 'string') return

            current.numericStats.min = Math.min(current.numericStats.min, value);
            current.numericStats.max = Math.max(current.numericStats.max, value);

        })
    })
}