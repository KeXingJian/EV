import * as XLSX from 'xlsx';

// 列分析函数
export const analyzeColumns = (rows,header) => {
    const stats = [];

    // 获取列数
    const colCount = rows[0]?.length || 0;

    // 初始化列结构
    for (let col = 0; col < colCount; col++) {
        stats.push({
            index: col,
            field: header[col],
            type: 'unknown',
            hasAnomaly: false, // 新增异常标识
            numericStats: null,
            mode: null,
            isUnique: false
        })
    }

    // 确定列类型（根据首行数据）
    rows[0].forEach((_, col) => {
        const sampleValue = rows[1]?.[col];
        stats[col].type = detectValueType(sampleValue);
    });

    // 统计计算
    rows.slice(1).forEach(row => {
        row.forEach((value, col) => {
            const current = stats[col];
            // 如果已发现异常则跳过
            if (current.hasAnomaly) return;

            // 空值检测
            if (value === null || value === "" || value === undefined) {
                current.hasAnomaly = true;
                return;
            }

            // 类型一致性检测
            const actualType = detectValueType(value);
            if (actualType !== current.type) {
                current.hasAnomaly = true;
                return;
            }
            // 类型一致性检查
            const valueType = detectValueType(value);
            if (valueType !== current.type) {
                current.type = 'mixed';
            }

            // 数值统计
            if (current.type === 'number') {
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                    current.numericStats = current.numericStats || {
                        min: Infinity,
                        max: -Infinity,
                        sum: 0,
                        count: 0
                    };

                    current.numericStats.min = Math.min(current.numericStats.min, numValue);
                    current.numericStats.max = Math.max(current.numericStats.max, numValue);
                    current.numericStats.sum += numValue;
                    current.numericStats.count++;
                }
            }

            // 频次统计
            current.frequency = current.frequency || new Map();
            const key = value !== null ? value.toString() : 'NULL';
            current.frequency.set(key, (current.frequency.get(key) || 0) + 1);
        });
    });

    // 计算最终统计值
    Object.values(stats).forEach(col => {
        if (col.frequency) {
            let maxCount = 0;
            col.mode = [];

            col.frequency.forEach((count, value) => {
                if (count > maxCount) {
                    maxCount = count;
                    col.mode = [value];
                } else if (count === maxCount) {
                    col.mode.push(value);
                }
            });

            col.isUnique = maxCount === 1;
        }

        if (col.type === 'number' && col.numericStats) {
            col.numericStats.avg = col.numericStats.sum / col.numericStats.count;
        }
    });

    return stats;
};

// 类型检测函数
export const detectValueType = (value) => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'number' && !isNaN(value)) return 'number';
    if (value instanceof Date) return 'date';
    return typeof value;
};

// 行数检测函数示例
export const detectRowCount = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array', sheetRows: 1 });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const range = XLSX.utils.decode_range(sheet['!ref']);
            resolve(range.e.r + 1);
        };
        reader.readAsArrayBuffer(file);
    });
};
