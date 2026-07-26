/**
 * 模拟输入输出模块
 * 该模块提供了类似 Arduino 的模拟量读写功能，支持模拟信号的读取、写入以及分辨率的设置。
 * 所有操作通过 `jm.s` 方法发送指令，指令中包含操作类型、引脚号、值等参数。
 * 使用时方法名称前一定要带上analog.前缀
 
* 模拟模块 API 返回值说明：
 * 
 * 所有方法返回的对象结构如下：
 * @typedef {Object} AnalogResult
 * @property {number} code - 状态码，0 表示成功，非 0 表示错误
 *   - 0: 操作成功
 *   - 1: 无效的操作码
 *   - 2: 映射操作缺少目标范围下限参数（tl）
 *   - 3: 映射操作缺少目标范围上限参数（th）
 *   - 3: 无效的 GPIO 引脚号（ESP8266 上引脚超出 0-15 范围）
 *   - 13: 缺少操作码或引脚参数
 * @property {number} [status] - GPIO 状态（仅 op=0 返回）
 * @property {number} [v] - 读取到的模拟值（仅读取操作返回）
 *   - analogRead: 返回 0-1023（ESP8266）或 0-4095（ESP32）
 *   - analogReadMap: 返回映射后的值
 * @property {string} [msg] - 错误消息（仅在 code != 0 时返回）
 * 
 * 使用示例：
 * ```javascript
 * // 读取模拟值
 * let result = analog.analogRead(0);
 * if (result.code === 0) {
 *     console.log("模拟值: " + result.v);
 * }
 * 
 * // 写入模拟值（PWM）
 * analog.analogWrite(3, 128);
 * 
 * // 读取并映射到 0-255 范围
 * let mapped = analog.analogReadMap(0, 0, 1023, 0, 255);
 * ```
 * 
 * @module 模拟输入输出模块
 * @var analog
 * @category communication
 * @keywords 模拟,模拟信号,模拟读取,模拟写入,分辨率,analogRead,analogWrite,analogReadResolution,analogWriteResolution,analogReadMap,Arduino
 * @capabilities analogRead,analogWrite,analogReadResolution,analogWriteResolution,analogReadMap
 * @depends 无
 */

var analog = {

    anadefId : 53,

    /**
     * 读取指定引脚的模拟量值。
     * 
     * 该方法读取指定 GPIO 引脚的模拟输入值。
     * 
     * 不同平台的读取范围：
     * - ESP8266: 仅支持 A0 引脚，返回 0-1023（10位分辨率）
     * - ESP32: 支持多个 ADC 引脚，返回 0-4095（12位分辨率），
     *   默认分辨率可通过 analogReadResolution 设置
     * 
     * @function analogRead
     * @param {number} pin - 需要读取的引脚号。
     *                       注意：ESP8266 只能使用 A0（通常为 0）
     * @returns {AnalogResult} 返回操作结果对象
     *   - code: 状态码，0表示成功
     *   - v: 读取到的模拟值
     * 
     * @example
     * // 读取引脚 A0 的模拟量值
     * let result = analog.analogRead(0);
     * if (result.code === 0) {
     *     console.log("模拟值: " + result.v);
     *     let voltage = result.v * 3.3 / 1024; // 转换为电压值
     *     console.log("电压: " + voltage + "V");
     * }
     */
    analogRead: function (pin) {
        return jm.s({ "_fn": this.this.anadefId, op: 8, gpioNo: pin });
    },

    /**
     * 向指定引脚写入模拟量值（PWM输出）。
     * 
     * 该方法向指定 GPIO 引脚输出 PWM 信号，模拟模拟电压值。
     * 
     * 注意事项：
     * - 写入值范围取决于分辨率，默认 8-12 位
     * - 仅支持具有 PWM 输出能力的引脚
     * - ESP8266: 引脚 0-15 中部分支持 PWM
     * - ESP32: 所有引脚都支持 LEDC PWM
     * 
     * @function analogWrite
     * @param {number} pin - 需要写入的引脚号。
     * @param {number} val - 需要写入的模拟量值。
     *                       范围 0 到 (2^分辨率 - 1)
     * @returns {AnalogResult} 返回操作结果对象，code为0表示成功
     * 
     * @example
     * // 向引脚 3 写入 50% 占空比（假设 8位分辨率，0-255）
     * analog.analogWrite(3, 128);
     * 
     * // 逐渐增加亮度
     * for (let i = 0; i <= 255; i++) {
     *     analog.analogWrite(5, i);
     *     delay(10);
     * }
     */
    analogWrite: function (pin, val) {
        return jm.s({ "_fn": this.this.anadefId, op: 9, gpioNo: pin, v: val });
    },

    /**
     * 设置模拟量读取的分辨率。
     * 
     * 该方法设置 analogRead 的 ADC 分辨率。
     * 
     * 平台支持：
     * - ESP8266: 不支持此功能（固定 10位）
     * - ESP32: 支持 9-12 位分辨率
     * 
     * 分辨率与最大值对应关系：
     * - 9位: 0-511
     * - 10位: 0-1023
     * - 11位: 0-2047
     * - 12位: 0-4095
     * 
     * @function analogReadResolution
     * @param {number} reso - 分辨率值（位数），范围 9-12
     * @returns {AnalogResult} 返回操作结果对象，code为0表示成功
     * 
     * @example
     * // 设置模拟读取为 12 位分辨率
     * analog.analogReadResolution(12);
     * 
     * // 设置模拟读取为 10 位分辨率
     * analog.analogReadResolution(10);
     */
    analogReadResolution: function (reso) {
        return jm.s({ "_fn": this.anadefId, op: 10, r: reso });
    },

    /**
     * 设置模拟量写入的分辨率。
     * 
     * 该方法设置 analogWrite 的 PWM 分辨率。
     * 
     * 平台支持：
     * - Arduino 框架: 支持设置 PWM 分辨率
     * - ESP8266: 部分支持
     * - ESP32: 支持 1-16 位分辨率
     * 
     * 分辨率与最大值对应关系：
     * - 8位: 0-255
     * - 10位: 0-1023
     * - 12位: 0-4095
     * - 16位: 0-65535
     * 
     * @function analogWriteResolution
     * @param {number} reso - 分辨率值（位数），范围 1-16
     * @returns {AnalogResult} 返回操作结果对象，code为0表示成功
     * 
     * @example
     * // 设置 PWM 分辨率为 8 位
     * analog.analogWriteResolution(8);
     * analog.analogWrite(3, 255); // 最大输出
     * 
     * // 设置 PWM 分辨率为 12 位
     * analog.analogWriteResolution(12);
     * analog.analogWrite(3, 2048); // 50% 占空比
     */
    analogWriteResolution: function (reso) {
        return jm.s({ "_fn": this.anadefId, op: 11, r: reso });
    },

    /**
     * 读取指定引脚的模拟量值，并将其映射到指定的范围内。
     * 
     * 该方法读取模拟值后，使用 map 函数将值从原始范围映射到目标范围。
     * 
     * 映射公式：
     * ```
     * result = (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow
     * ```
     * 
     * 适用场景：
     * - 将传感器读数转换为实际物理量（如温度、距离）
     * - 将 ADC 值映射到 PWM 输出范围
     * - 数据归一化处理
     * 
     * @function analogReadMap
     * @param {number} pin - 需要读取的引脚号。
     * @param {number} fromLow - 原始范围的最小值。
     * @param {number} fromHigh - 原始范围的最大值。
     * @param {number} toLow - 目标范围的最小值。
     * @param {number} toHigh - 目标范围的最大值。
     * @returns {AnalogResult} 返回操作结果对象
     *   - code: 状态码，0表示成功
     *   - v: 映射后的值
     * 
     * @example
     * // 将引脚 0 的模拟值（0-1023）映射到角度（0-180）
     * let result = analog.analogReadMap(0, 0, 1023, 0, 180);
     * if (result.code === 0) {
     *     console.log("角度: " + result.v + "°");
     * }
     * 
     * @example
     * // 读取温度传感器（LM35，每10mV=1°C）
     * // 假设参考电压 3.3V，ADC范围 0-4095
     * // 电压 = value * 3.3 / 4095
     * // 温度 = 电压 / 0.01 = value * 3.3 / 4095 / 0.01
     * // 简化后：温度 = value * 330 / 4095
     * let tempResult = analog.analogReadMap(34, 0, 4095, 0, 330);
     * console.log("温度: " + (tempResult.v / 100) + "°C");
     * 
     * @example
     * // 将光敏电阻读数映射为 0-100% 亮度百分比
     * let light = analog.analogReadMap(0, 200, 800, 0, 100);
     * console.log("光照强度: " + light.v + "%");
     */
    analogReadMap: function (pin, fromLow, fromHigh, toLow, toHigh) {
        return jm.s({
            "_fn": this.anadefId, op: 12, gpioNo: pin, fl: fromLow,
            fh: fromHigh, tl: toLow, th: toHigh
        });
    }
};

// 导出模块
// exports = analog;

module.exports = analog;
