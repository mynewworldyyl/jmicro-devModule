/**
 * 随机数模块
 * 该模块提供了类似 Arduino 的随机数生成功能，支持生成指定范围内的随机数以及设置随机数种子。
 * 所有操作通过 `jm.s` 方法发送指令，指令中包含操作类型、最小值、最大值或种子值等参数。
 * 
 * 使用时方法名称前一定要带上ran.前缀
 * 
 * 随机数 API 返回值说明：
 * - random(): 直接返回随机数值（number类型）
 * - randomSeed(): 返回操作结果对象，code为0表示成功
 * 
 * 使用示例：
 * ```javascript
 * // 设置随机种子
 * ran.randomSeed(1234);
 * 
 * // 生成 0-99 的随机数（直接返回数值）
 * let num1 = ran.random(0, 100);
 * console.log("随机数: " + num1);
 * 
 * // 生成 50-100 的随机数
 * let num2 = ran.random(50, 101);
 * console.log("随机数: " + num2);
 * 
 * // 生成多个随机数
 * for (let i = 0; i < 10; i++) {
 *     console.log(ran.random(1, 7)); // 模拟掷骰子
 * }
 * ```
 * 
 * @module 随机数模块
 * @var ran
 * @category data
 * @keywords 随机数,随机种子,随机值,random,randomSeed,Arduino
 * @capabilities random,randomSeed
 * @depends 无
 */

var ran = {

    /**
     * 生成指定范围内的随机数。
     * 
     * 该方法生成一个大于等于 min 且小于 max 的随机整数。
     * 
     * 随机数范围说明：
     * - 生成的随机数范围为 [min, max)，即包含最小值，不包含最大值
     * - 例如：random(1, 100) 返回 1 到 99 之间的整数
     * - 如果需要包含最大值，可以使用 random(min, max+1)
     * 
     * 随机数质量：
     * - 使用硬件随机数生成器（ESP32/ESP8266）或标准库随机函数
     * - 建议在使用前调用 randomSeed() 设置种子以获得更好的随机性
     * - 不设置种子时，每次启动生成的随机数序列相同
     * 
     * 返回值类型：
     * - 直接返回随机数值（number类型
     * 
     * @function random
     * @param {number} min - 随机数的最小值（包含），范围 0-2147483647
     * @param {number} max - 随机数的最大值（不包含），范围 min+1 到 2147483648
     * @returns {number} 生成的随机整数
     * 
     * @example
     * // 生成 0 到 99 之间的随机数
     * let result = ran.random(0, 100);
     * console.log("随机数: " + result);
     * 
     * // 模拟掷骰子（1-6）
     * let dice = ran.random(1, 7);
     * console.log("骰子点数: " + dice);
     * 
     * // 生成随机 RGB 颜色值（0-255）
     * let r = ran.random(0, 256);
     * let g = ran.random(0, 256);
     * let b = ran.random(0, 256);
     * console.log("RGB颜色: (" + r + "," + g + "," + b + ")");
     * 
     * // 生成随机布尔值
     * let isTrue = ran.random(0, 2) === 1;
     * console.log("随机布尔: " + isTrue);
     * 
     * // 生成随机数组元素
     * let fruits = ["苹果", "香蕉", "橙子", "葡萄"];
     * let idx = ran.random(0, fruits.length);
     * console.log("随机水果: " + fruits[idx]);
     */
    random: function (min, max) {
        return jm.s({ op: 8, mi: min, ma: max });
    },

    /**
     * 设置随机数种子。
     * 
     * 该方法初始化随机数生成器的种子值。
     * 相同的种子值会产生相同的随机数序列。
     * 
     * 种子设置说明：
     * - 如果不调用 randomSeed()，每次设备重启后生成的随机数序列相同
     * - 使用不同的种子值可以获得不同的随机数序列
     * - 可以使用系统时间、模拟输入引脚值等作为种子
     * - 种子值范围为 0 到 4294967295（32位无符号整数）
     * 
     * 获取随机种子的常用方法：
     * - 使用系统时间：jm.getMs()
     * - 读取未连接的模拟引脚（浮动值）
     * - 使用 MAC 地址或芯片 ID
     * 
     * @function randomSeed
     * @param {number} seed - 随机数种子值（0-4294967295）
     * @returns {void} 无返回值
     * 
     * @example
     * // 使用固定种子
     * ran.randomSeed(12345);
     * 
     * // 使用系统时间作为种子
     * ran.randomSeed(jm.getMs());
     * 
     * // 使用模拟引脚读取值作为种子
     * let seed = analog.analogRead(0);
     * ran.randomSeed(seed);
     * 
     * // 使用组合种子
     * let seed = (jm.getMs() << 16) | (analog.analogRead(0) & 0xFFFF);
     * ran.randomSeed(seed);
     * 
     * // 验证相同种子产生相同序列
     * ran.randomSeed(100);
     * let a1 = ran.random(1, 100);
     * let a2 = ran.random(1, 100);
     * ran.randomSeed(100);
     * let b1 = ran.random(1, 100);
     * let b2 = ran.random(1, 100);
     * // a1 === b1, a2 === b2
     */
    randomSeed: function (seed) {
        return jm.s({ op: 9, s: seed });
    }
};

// 导出模块
// exports = ran;
