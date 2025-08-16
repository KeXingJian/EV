
export const parseCondition = (expression, columnStats)=> {

    // 增强正则表达式，明确捕获不同类型值
    const validationRegExp = /^([A-Z]+)\s*(=|!=|<=|>=|<|>)\s*(?:'([^']*)'|([+-]?\d+\.?\d*)|(true|false))$/;
    const match = expression.match(validationRegExp);

    if (!match) return false


    const field = match[1];
    const operator = match[2];
    const strValue = match[3];  // 字符串值（不带引号）
    const numValue = match[4];  // 数字值
    const boolValue = match[5]; // 布尔值

    // 获取字段元数据
    const colIndex = field.charCodeAt(0) - 'A'.charCodeAt(0) + 1
    const meta = columnStats.find(c => c.index === colIndex);
    if (!meta) {
        //console.log(`字段 ${field} 不存在`);
        return false
    }

    // 类型校验逻辑
    let value;
    if (strValue !== undefined) {
        if (meta.type !== 'string') {
            //console.log(`[${field}] 是数字类型，必须使用数值，字符串需单引号包裹`);
            return false
        }
        value = strValue;
    } else if (numValue !== undefined) {
        if (meta.type !== 'number') {
            //console.log(`[${field}] 是字符串类型，必须用单引号包裹值`);
            return false
        }
        value = parseFloat(numValue);
        //if (isNaN(value)) console.log(`无效数字值: ${numValue}`);
    } else if (boolValue !== undefined) {
        value = boolValue === 'true';
    } else {
        //console.log('无法识别的值类型');
        return false
    }

    // 操作符校验
    if (meta.type === 'string' && !['=', '!='].includes(operator)) {
        //console.log(`字符串字段 [${field}] 只支持 = 和 != 操作符`);
        return false
    }

    return {
        field: colIndex,
        operator,
        value,
        rawExpression: expression
    };
}

export const createFilter =  (condition) => {


    return (record, index) => {
        const fieldValue = String(record[condition.field]);

        switch (condition.operator) {
            case 'like':
                return condition.indexs.includes(index)
            case '=':
                return fieldValue === condition.value
            case '!=':
                return fieldValue !== condition.value
            case '<':
                return fieldValue < condition.value
            case '<=':
                return fieldValue <= condition.value
            case '>':
                return fieldValue > condition.value
            case '>=':
                return fieldValue >= condition.value
            default:
                return false
        }
    }
}
