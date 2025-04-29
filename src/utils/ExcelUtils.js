import * as XLSX from 'xlsx';

// 类型检测函数
export const detectValueType = (value) => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'number' && !isNaN(value)) return 'number';
    if (value instanceof Date) return 'date';
    // 增强字符串类型检测
    return typeof value === 'string' && isNaN(value) ? 'string' : typeof value;
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


export const analyzeColumns2 = (rows, header) => {
    const stats = header.map((field, index) => ({
        index,
        field,
        type: 'unknown',
        hasAnomaly: false,
        numericStats: null,
        frequency: new Map(),
        mode: null,
        isUnique: false,
        invertedIndex: new Map(), // 改用Map提升性能
    }));

    // 处理数据行（排除表头）
    rows.slice(1).forEach((row,rowIndex) => {
        row.forEach((value, col) => {
            const current = stats[col];
            // 空值检测
            if (value === null || value === "" || value === undefined) {
                current.hasAnomaly = true;
                return;
            }

            // 类型检测
            const valueType = detectValueType(value);
            if (current.type === 'unknown') {
                current.type = valueType;
            } else if (current.type !== valueType) {
                current.hasAnomaly = true;
                current.type = 'mixed';
            }

            // 数值统计
            if (valueType === 'number') {
                const num = Number(value);
                if (!isNaN(num)) {
                    current.numericStats = current.numericStats || {
                        min: Infinity,
                        max: -Infinity,
                        sum: 0,
                        count: 0
                    };
                    current.numericStats.min = Math.min(current.numericStats.min, num);
                    current.numericStats.max = Math.max(current.numericStats.max, num);
                    current.numericStats.sum += num;
                    current.numericStats.count++;
                }
            }

            // 频率统计（排除空值）
            const key = String(value);
            current.frequency.set(key, (current.frequency.get(key) || 0) + 1);
        });
    });

    // 计算统计指标
    stats.forEach(col => {
        if (col.frequency.size === 0) return;

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

        // 判断是否所有值唯一（且至少有一个值）
        col.isUnique = maxCount === 1 && col.frequency.size >= 1;

        // 处理数值统计
        if (col.numericStats && col.numericStats.count > 0) {
            col.numericStats.avg = col.numericStats.sum / col.numericStats.count;
        } else {
            col.numericStats = null;
        }
    });

    return stats;
};




