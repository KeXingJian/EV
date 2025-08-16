/**
 * Excel 列索引与字母转换工具（含常量池）
 */
const ExcelColumnMap = {
    // 预生成常量池（默认生成前 1000 列）
    _numToLetter: {},
    _letterToNum: {},

    // 初始化常量池
    init: function (maxColumns = 100) {
        for (let num = 1; num <= maxColumns; num++) {
            const letter = this.convertNumberToLetter(num);
            this._numToLetter[num] = letter;
            this._letterToNum[letter] = num;
        }
    },

    // 数字转列字母（支持常量池或动态计算）
    getLetter: function (num) {
        // 优先从常量池读取
        if (this._numToLetter[num]) return this._numToLetter[num];
        // 动态计算（超出常量池范围时）
        return this.convertNumberToLetter(num);
    },

    // 列字母转数字（支持常量池或动态计算）
    getNumber: function (letter) {
        const upperLetter = letter.toUpperCase();
        // 优先从常量池读取
        if (this._letterToNum[upperLetter]) return this._letterToNum[upperLetter];
        // 动态计算（超出常量池范围时）
        return this.convertLetterToNumber(upperLetter);
    },

    // 动态转换：数字 → 列字母
    convertNumberToLetter: function (num) {
        if (num < 1) return null;
        let letters = '';
        while (num > 0) {
            const remainder = (num - 1) % 26;
            letters = String.fromCharCode(65 + remainder) + letters;
            num = Math.floor((num - 1) / 26);
        }
        return letters;
    },

    // 动态转换：列字母 → 数字
    convertLetterToNumber: function (letters) {
        let num = 0;
        for (let i = 0; i < letters.length; i++) {
            const charCode = letters.charCodeAt(i) - 64; // A=1, B=2...
            if (charCode < 1 || charCode > 26) return null; // 非法字符
            num = num * 26 + charCode;
        }
        return num;
    },
};

// 初始化常量池（默认预生成前 1000 列）
ExcelColumnMap.init();

// 导出使用
export default ExcelColumnMap;