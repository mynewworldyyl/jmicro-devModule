/**
 * IO 口读写及中断处理函数模块
 * 该模块提供了类似 Arduino 的数字引脚操作功能，支持引脚模式设置、读写操作、反转状态以及板载 LED 控制。
 * @see {@link https://docs.arduino.cc/language-reference/ Arduino 语言参考文档}
 * 
 * 使用时方法名称前一定要带上gpio.前缀
 
* GPIO API 返回值说明：
 * 
 * 大多数方法返回的对象结构如下：
 * @typedef {Object} GPIOResult
 * @property {number} code - 状态码，0 表示成功，非 0 表示错误
 *   - 0: 操作成功
 *   - 1: 无效的操作码
 *   - 3: 无效的 GPIO 引脚号（ESP8266 上引脚超出 0-15 范围）
 *   - 13: 缺少操作码或引脚参数
 * @property {number} [status] - 引脚状态（仅 readDigit 方法返回）
 *   - 0: 低电平（LOW）
 *   - 1: 高电平（HIGH）
 * @property {string} [msg] - 错误消息（仅在 code != 0 时返回）
 * 
 * 使用示例：
 * ```javascript
 * 
 * // 写入高电平
 * gpio.writeDigit(13, gpio.HIGH);
 * 
 * // 读取引脚状态
 * let value = gpio.readDigit(2);
 * console.log("引脚状态: " + (value ? "高电平" : "低电平"));
 * 
 * // 反转引脚状态
 * gpio.reverse(13);
 * 
 * // 板载 LED 闪烁
 * gpio.boardLedFlash();
 * ```
 * 
 * @module GPIO数字输入输出模块
 * @var gpio
 * @category gpio
 * @keywords GPIO,数字引脚,输入,输出,上拉,下拉,开漏,高低电平,反转,板载LED,中断,Arduino
 * @capabilities pinMode,readDigit,writeDigit,reverse,boardLedFlash,writeHight,writeLow
 * @depends 无
 */


let gd = 53;

var gpio = {

    /**
     * 高电平常量，表示引脚状态为高。
     * @constant {number} HIGH
     */
    HIGH: 1,

    /**
     * 低电平常量，表示引脚状态为低。
     * @constant {number} LOW
     */
    LOW: 0,

    /**
     * 输入模式常量，表示引脚模式为输入。
     * @constant {number} INPUT
     */
    INPUT: 0,

    /**
     * 输出模式常量，表示引脚模式为输出。
     * @constant {number} OUTPUT
     */
    OUTPUT: 1,

    /**
     * 上拉输入模式常量，表示引脚模式为上拉输入。
     * @constant {number} INPUT_PULLUP
     */
    INPUT_PULLUP: 0x02,

    /**
     * 下拉输入模式常量，仅适用于引脚 16。
     * @constant {number} INPUT_PULLDOWN_16
     */
    INPUT_PULLDOWN_16: 0x04,

    /**
     * 开漏输出模式常量，表示引脚模式为开漏输出。
     * @constant {number} OUTPUT_OPEN_DRAIN
     */
    OUTPUT_OPEN_DRAIN: 0x03,

    /**
     * 板载 LED 引脚常量。
     * @constant {number} LED_BUILTIN
     */
    LED_BUILTIN: 0x02,

    /**
     * 设置指定引脚的模式。
     * 注意readDigit，writeDigit，reverse等此模块的方法都会自动调用合适的pinMode方法，
     * 所以在这些方法前无需提前调用pinMode方法，以节省设备调用时间
     * 
     * 支持的引脚模式：
     * - INPUT: 输入模式
     * - OUTPUT: 输出模式
     * - INPUT_PULLUP: 上拉输入模式
     * - INPUT_PULLDOWN_16: 下拉输入模式（仅引脚16）
     * - OUTPUT_OPEN_DRAIN: 开漏输出模式
     * 
     * 注意：ESP8266 上有效引脚范围为 0-15
     *
     * @function pinMode
     * @param {number} pin - 需要设置的引脚号（GPIO编号）
     * @param {number} mode - 引脚模式（使用预定义常量）
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {GPIOResult} 返回操作结果对象，code为0表示成功
     * 
     * @example
     * // 设置引脚 13 为输出模式
     * gpio.pinMode(13, gpio.OUTPUT);
     * 
     * // 设置引脚 2 为上拉输入模式
     * gpio.pinMode(2, gpio.INPUT_PULLUP);
     */
    pinMode: function (pin, mode, targetDevId, sync) {
        return jm.s({ "_fn": gd, op: 7, gpioNo: pin, m: mode , "_d": targetDevId, "_s": sync });
    },

    /**
     * 读取指定引脚的数字值。
     * 
     * 该方法读取指定 GPIO 引脚的当前电平状态。
     * 无需提前调用pinMode为INPUT
     *
     * @function readDigit
     * @param {number} pin - 需要读取的引脚号（GPIO编号）
     * @returns {number} 返回引脚的数字值：
     *   - 0: 低电平（LOW）
     *   - 1: 高电平（HIGH）
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @throws {Object} 如果读取失败，抛出错误对象（code非0）
     * 
     * @example
     * // 读取引脚 2 的数字值
     * let rst = gpio.readDigit(2);
     * if ((rst.code == 0 && rst.status === gpio.HIGH) {
     *     console.log("引脚为高电平");
     * } else {
     *     console.log("引脚为低电平");
     * }
     * 
     * // 带错误处理的读取
     * try {
     *     let rst = gpio.readDigit(16);
     *     if ((rst.code == 0 && rst.status === gpio.HIGH) {
     *          console.log("引脚为高电平");
     *     } else {
     *          console.log("引脚为低电平");
     *     }
     * } catch(e) {
     *     console.log("读取失败: " + e.msg);
     * }
     */
    readDigit: function (pin, targetDevId, sync) {
        return jm.s({ "_fn": gd, op: 0, gpioNo: pin, "_d": targetDevId, "_s": sync  });
    },

    /**
     * 向指定引脚写入数字值。
     * 
     * 该方法向指定 GPIO 引脚输出高电平或低电平。
      * 无需提前调用pinMode为OUTPUT。
     *
     * @function writeDigit
     * @param {number} pin - 需要写入的引脚号（GPIO编号）
     * @param {number} val - 需要写入的值：
     *   - gpio.HIGH (1): 输出高电平
     *   - gpio.LOW (0): 输出低电平
     * 
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {GPIOResult} 返回操作结果对象，code为0表示成功
     * 
     * @example
     * // 向引脚 13 写入高电平
     * gpio.writeDigit(13, gpio.HIGH);
     * 
     * // 向引脚 5 写入低电平
     * gpio.writeDigit(5, gpio.LOW);
     */
    writeDigit: function (pin, val, targetDevId, sync) {
        return jm.s({ "_fn": gd, op: 13, gpioNo: pin, v: val, "_d": targetDevId, "_s": sync  });
    },

    /**
     * 反转指定引脚的状态（HIGH 变 LOW，LOW 变 HIGH）。
     * 
     * 该方法读取引脚当前状态，然后输出相反的电平。
     * 相当于执行：新值 = 当前值 ? LOW : HIGH
    * 无需提前调用pinMode为OUTPUT。
    * 
     * @function reverse
     * @param {number} pin - 需要反转状态的引脚号（GPIO编号）
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {GPIOResult} 返回操作结果对象，code为0表示成功
     * 
     * @example
     * // 反转引脚 13 的状态
     * gpio.reverse(13);
     * 
     * // 实现 LED 闪烁效果
     * setInterval(function() {
     *     gpio.reverse(13);
     * }, 500);
     */
    reverse: function (pin, targetDevId, sync) {
        return jm.s({ "_fn": gd, op: 3, gpioNo: pin, "_d": targetDevId, "_s": sync  });
    },

    /**
     * 控制板载 LED 闪烁。
     * 
     * 该方法使板载 LED 闪烁一次或多次。
     * 具体行为由底层实现决定（通常闪烁 1000 次，每次亮 1000ms、灭 500ms）。
     * 
     * @function boardLedFlash
     * @returns {GPIOResult} 返回操作结果对象，code为0表示成功
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @example
     * // 使板载 LED 闪烁
     * gpio.boardLedFlash();
     * 
     * // 在 WiFi 连接状态变化时闪烁
     * if (wifiConnected) {
     *     gpio.boardLedFlash();
     * }
     */
    boardLedFlash: function ( targetDevId, sync) {
        return jm.s({ "_fn": gd, op: 4, "_d": targetDevId, "_s": sync  });
    },

    /**
     * 向指定引脚写入高电平。
     * 
     * 该方法等同于 writeDigit(pin, gpio.HIGH)。
    * 无需提前调用pinMode为OUTPUT。
     *
     * @function writeHight
     * @param {number} pin - 需要写入的引脚号（GPIO编号）
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {GPIOResult} 返回操作结果对象，code为0表示成功
     * 
     * @example
     * // 向引脚 5 写入高电平
     * gpio.writeHight(5);
     */
    writeHight: function (pin, targetDevId, sync) {
        return jm.s({ "_fn": gd, op: 1, gpioNo: pin, "_d": targetDevId, "_s": sync  });
    },

    /**
     * 向指定引脚写入低电平。
     * 
     * 该方法等同于 writeDigit(pin, gpio.LOW)。
     * 无需提前调用pinMode为OUTPUT。
     *
     * @function writeLow
     * @param {number} pin - 需要写入的引脚号（GPIO编号）
    * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {GPIOResult} 返回操作结果对象，code为0表示成功
     * 
     * @example
     * // 向引脚 6 写入低电平
     * gpio.writeLow(6);
     */
    writeLow: function (pin, targetDevId, sync) {
        return jm.s({ "_fn": gd, op: 2, gpioNo: pin, "_d": targetDevId, "_s": sync  });
    }
};

// 导出模块
// exports = gpio;
