/**
 * Arduino 字符操作模块
 * 该模块提供了类似 Arduino 的字符操作功能，支持字符类型的判断（如字母、数字、控制字符等）。
 * 所有操作通过 `jm.s` 方法发送指令，指令中包含操作类型和字符值。
 * 使用时方法名称前一定要带上char.前缀
 * 
 * 字符操作 API 返回值说明：
 * - 所有方法直接返回布尔值（boolean类型），true 表示符合条件，false 表示不符合
 * 
 * 使用示例：
 * ```javascript
 * // 判断字符是否为字母
 * let isAlpha = char.isAlpha('A');
 * if (isAlpha) {
 *     console.log("是字母");
 * }
 * 
 * // 判断字符是否为数字
 * let isNum = char.isDigit('5');
 * console.log("是否为数字: " + isNum);
 * 
 * // 遍历字符串统计字母数量
 * let str = "Hello123";
 * let count = 0;
 * for (let i = 0; i < str.length; i++) {
 *     if (char.isAlpha(str[i])) {
 *         count++;
 *     }
 * }
 * console.log("字母数量: " + count);
 * ```
 * 
 * @module Arduino字符操作模块
 * @var char
 * @category data
 * @keywords 字符,字符判断,字母,数字,ASCII,控制字符,十六进制,大小写,标点,空格,空白字符,Arduino
 * @capabilities isAlpha,isAlphaNumeric,isAscii,isControl,isDigit,isGraph,isHexadecimalDigit,isLowerCase,isPrintable,isPunct,isSpace,isUpperCase,isWhitespace
 * @depends 无
 */

var char = {

    /**
     * 判断字符是否为字母（A-Z 或 a-z）
     * 
     * 字母判断标准：
     * - 大写字母：A-Z（ASCII 65-90）
     * - 小写字母：a-z（ASCII 97-122）
     * 
     * @function isAlpha
     * @param {string} ch - 需要判断的单个字符
     * @returns {boolean} true表示是字母，false表示不是
     * 
     * @example
     * char.isAlpha('A');  // 返回 true
     * char.isAlpha('1');  // 返回 false
     * char.isAlpha('z');  // 返回 true
     */
    isAlpha: function (ch) {
        return jm.s({ op: 29, v: ch });
    },

    /**
     * 判断字符是否为字母或数字（A-Z, a-z, 0-9）
     * 
     * 判断标准：
     * - 字母：A-Z、a-z
     * - 数字：0-9（ASCII 48-57）
     * 
     * @function isAlphaNumeric
     * @param {string} ch - 需要判断的单个字符
     * @returns {boolean} true表示是字母或数字，false表示不是
     * 
     * @example
     * char.isAlphaNumeric('A');  // 返回 true
     * char.isAlphaNumeric('5');  // 返回 true
     * char.isAlphaNumeric('@');  // 返回 false
     */
    isAlphaNumeric: function (ch) {
        return jm.s({ op: 30, v: ch });
    },

    /**
     * 判断字符是否为 ASCII 字符（0-127）
     * 
     * ASCII 字符范围：
     * - 十进制 0-127 对应的字符
     * - 包括控制字符、数字、字母、标点符号等
     * 
     * @function isAscii
     * @param {string} ch - 需要判断的单个字符
     * @returns {boolean} true表示是 ASCII 字符，false表示不是
     * 
     * @example
     * char.isAscii('A');    // 返回 true
     * char.isAscii('@');    // 返回 true
     * char.isAscii('\n');   // 返回 true
     * // 非 ASCII 字符（如中文）返回 false
     * char.isAscii('中');    // 返回 false
     */
    isAscii: function (ch) {
        return jm.s({ op: 31, v: ch });
    },

    /**
     * 判断字符是否为控制字符
     * 
     * 控制字符范围：
     * - ASCII 0-31（如 NULL、换行符、制表符等）
     * - ASCII 127（DEL 删除字符）
     * 
     * @function isControl
     * @param {string} ch - 需要判断的单个字符
     * @returns {boolean} true表示是控制字符，false表示不是
     * 
     * @example
     * char.isControl('\n');  // 返回 true
     * char.isControl('\t');  // 返回 true
     * char.isControl('A');   // 返回 false
     * char.isControl(' ');   // 返回 false（空格不是控制字符）
     */
    isControl: function (ch) {
        return jm.s({ op: 32, v: ch });
    },

    /**
     * 判断字符是否为数字（0-9）
     * 
     * 数字判断标准：
     * - 字符 '0' 到 '9'（ASCII 48-57）
     * 
     * @function isDigit
     * @param {string} ch - 需要判断的单个字符
     * @returns {boolean} true表示是数字，false表示不是
     * 
     * @example
     * char.isDigit('5');  // 返回 true
     * char.isDigit('0');  // 返回 true
     * char.isDigit('A');  // 返回 false
     */
    isDigit: function (ch) {
        return jm.s({ op: 33, v: ch });
    },

    /**
     * 判断字符是否为可打印字符（非空格且可显示）
     * 
     * 可打印字符范围：
     * - ASCII 33-126（不包括空格）
     * - 包括字母、数字、标点符号等
     * - 与 isPrintable 的区别：isGraph 不包括空格
     * 
     * @function isGraph
     * @param {string} ch - 需要判断的单个字符
     * @returns {boolean} true表示是可打印字符（非空格），false表示不是
     * 
     * @example
     * char.isGraph('!');   // 返回 true
     * char.isGraph('A');   // 返回 true
     * char.isGraph(' ');   // 返回 false（空格不是图形字符）
     * char.isGraph('\n');  // 返回 false
     */
    isGraph: function (ch) {
        return jm.s({ op: 34, v: ch });
    },

    /**
     * 判断字符是否为十六进制数字（0-9, A-F, a-f）
     * 
     * 十六进制数字范围：
     * - 数字：0-9
     * - 大写字母：A-F
     * - 小写字母：a-f
     * 
     * @function isHexadecimalDigit
     * @param {string} ch - 需要判断的单个字符
     * @returns {boolean} true表示是十六进制数字，false表示不是
     * 
     * @example
     * char.isHexadecimalDigit('F');  // 返回 true
     * char.isHexadecimalDigit('a');  // 返回 true
     * char.isHexadecimalDigit('9');  // 返回 true
     * char.isHexadecimalDigit('G');  // 返回 false
     * char.isHexadecimalDigit('x');  // 返回 false
     */
    isHexadecimalDigit: function (ch) {
        return jm.s({ op: 35, v: ch });
    },

    /**
     * 判断字符是否为小写字母（a-z）
     * 
     * 小写字母范围：
     * - ASCII 97-122（a-z）
     * 
     * @function isLowerCase
     * @param {string} ch - 需要判断的单个字符
     * @returns {boolean} true表示是小写字母，false表示不是
     * 
     * @example
     * char.isLowerCase('a');  // 返回 true
     * char.isLowerCase('z');  // 返回 true
     * char.isLowerCase('A');  // 返回 false
     * char.isLowerCase('1');  // 返回 false
     */
    isLowerCase: function (ch) {
        return jm.s({ op: 36, v: ch });
    },

    /**
     * 判断字符是否为可打印字符（包括空格）
     * 
     * 可打印字符范围：
     * - ASCII 32-126（包括空格）
     * - 包括空格、字母、数字、标点符号等
     * 
     * @function isPrintable
     * @param {string} ch - 需要判断的单个字符
     * @returns {boolean} true表示是可打印字符，false表示不是
     * 
     * @example
     * char.isPrintable(' ');  // 返回 true（空格是可打印字符）
     * char.isPrintable('A');  // 返回 true
     * char.isPrintable('\n'); // 返回 false
     * char.isPrintable('\t'); // 返回 false
     */
    isPrintable: function (ch) {
        return jm.s({ op: 37, v: ch });
    },

    /**
     * 判断字符是否为标点符号
     * 
     * 标点符号范围：
     * - ASCII 33-47、58-64、91-96、123-126
     * - 包括 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
     * 
     * @function isPunct
     * @param {string} ch - 需要判断的单个字符
     * @returns {boolean} true表示是标点符号，false表示不是
     * 
     * @example
     * char.isPunct('.');   // 返回 true
     * char.isPunct(',');   // 返回 true
     * char.isPunct('!');   // 返回 true
     * char.isPunct('A');   // 返回 false
     * char.isPunct(' ');   // 返回 false
     */
    isPunct: function (ch) {
        return jm.s({ op: 38, v: ch });
    },

    /**
     * 判断字符是否为空格字符
     * 
     * 空格字符范围：
     * - 空格 ' '（ASCII 32）
     * - 水平制表符 '\t'（ASCII 9）
     * - 垂直制表符（ASCII 11）
     * - 换页符（ASCII 12）
     * 
     * @function isSpace
     * @param {string} ch - 需要判断的单个字符
     * @returns {boolean} true表示是空格字符，false表示不是
     * 
     * @example
     * char.isSpace(' ');   // 返回 true
     * char.isSpace('\t');  // 返回 true
     * char.isSpace('\n');  // 返回 false（换行符不属于 isSpace）
     * char.isSpace('A');   // 返回 false
     */
    isSpace: function (ch) {
        return jm.s({ op: 39, v: ch });
    },

    /**
     * 判断字符是否为大写字母（A-Z）
     * 
     * 大写字母范围：
     * - ASCII 65-90（A-Z）
     * 
     * @function isUpperCase
     * @param {string} ch - 需要判断的单个字符
     * @returns {boolean} true表示是大写字母，false表示不是
     * 
     * @example
     * char.isUpperCase('A');  // 返回 true
     * char.isUpperCase('Z');  // 返回 true
     * char.isUpperCase('a');  // 返回 false
     * char.isUpperCase('1');  // 返回 false
     */
    isUpperCase: function (ch) {
        return jm.s({ op: 40, v: ch });
    },

    /**
     * 判断字符是否为空白字符
     * 
     * 空白字符范围：
     * - 空格 ' '（ASCII 32）
     * - 水平制表符 '\t'（ASCII 9）
     * - 换行符 '\n'（ASCII 10）
     * - 回车符 '\r'（ASCII 13）
     * - 换页符（ASCII 12）
     * - 垂直制表符（ASCII 11）
     * 
     * 与 isSpace 的区别：isWhitespace 包括换行符和回车符
     * 
     * @function isWhitespace
     * @param {string} ch - 需要判断的单个字符
     * @returns {boolean} true表示是空白字符，false表示不是
     * 
     * @example
     * char.isWhitespace(' ');   // 返回 true
     * char.isWhitespace('\t');  // 返回 true
     * char.isWhitespace('\n');  // 返回 true（isWhitespace 包括换行符）
     * char.isWhitespace('\r');  // 返回 true
     * char.isWhitespace('A');   // 返回 false
     * 
     * @example
     * // 去除字符串两端空白字符
     * function trim(str) {
     *     let start = 0, end = str.length - 1;
     *     while (start <= end && char.isWhitespace(str[start])) start++;
     *     while (end >= start && char.isWhitespace(str[end])) end--;
     *     return str.substring(start, end + 1);
     * }
     */
    isWhitespace: function (ch) {
        return jm.s({ op: 41, v: ch });
    }
};

// 导出模块
// exports = char;
