/**
 * 引脚脉冲控制模块
 * 该模块提供了类似 Arduino 的引脚脉冲控制功能，支持生成音调、读取脉冲宽度、移位操作等。
 * 所有操作通过 `jm.s` 方法发送指令，指令中包含操作类型、引脚号、频率、持续时间等参数。
 * 
 * @see {@link https://docs.arduino.cc/language-reference/ Arduino 语言参考文档}
 * 
 * 使用时方法名称前一定要带上pulse.前缀
 * 
 * 常量说明：
 * - pulse.HIGH      (1) : 高电平状态常量，用于读取脉冲宽度时指定脉冲状态为高电平
 * - pulse.LOW       (0) : 低电平状态常量，用于读取脉冲宽度时指定脉冲状态为低电平
 * - pulse.LSBFIRST  (0) : 最低位优先常量，用于移位操作时指定位顺序为最低有效位优先传输
 * - pulse.MSBFIRST  (1) : 最高位优先常量，用于移位操作时指定位顺序为最高有效位优先传输
 * 
 * 脉冲控制 API 返回值说明：
 * - tone(): 无返回值（void）
 * - noTone(): 无返回值（void）
 * - pulseIn(): 返回脉冲宽度（微秒），直接返回数值，不需要 .v 访问，超时返回 0
 * - pulseInLong(): 返回长脉冲宽度（微秒），直接返回数值，不需要 .v 访问，超时返回 0
 * - shiftIn(): 返回读取到的字节值（0-255），直接返回数值，不需要 .v 访问
 * - shiftOut(): 无返回值（void）
 * 
 * 使用示例：
 * ```javascript
 * // 生成 440Hz 音调，持续 1 秒
 * pulse.tone(3, 440, 1000);
 * 
 * // 停止音调
 * pulse.noTone(3);
 * 
 * // 读取高电平脉冲宽度（直接返回数值）
 * let width = pulse.pulseIn(2, pulse.HIGH, 1000000);
 * console.log("脉冲宽度: " + width + "微秒");
 * 
 * // 移位读取数据（74HC165，直接返回数值）
 * let data = pulse.shiftIn(4, 5, pulse.LSBFIRST);
 * console.log("读取数据: 0x" + data.toString(16));
 * 
 * // 移位输出数据（74HC595）
 * pulse.shiftOut(4, 5, pulse.MSBFIRST, 0x55);
 * ```
 * 
 * @module 引脚脉冲控制模块
 * @var pulse
 * @category gpio
 * @keywords 脉冲,音调,频率,脉冲宽度,移位输入,移位输出,tone,noTone,pulseIn,pulseInLong,shiftIn,shiftOut,LSBFIRST,MSBFIRST,Arduino
 * @capabilities tone,noTone,pulseIn,pulseInLong,shiftIn,shiftOut
 * @depends 无
 */

var pulse = {

    /**
     * 高电平常量
     * @constant {number} HIGH
     */
    HIGH: 1,

    /**
     * 低电平常量
     * @constant {number} LOW
     */
    LOW: 0,

    /**
     * 最低位优先常量
     * @constant {number} LSBFIRST
     */
    LSBFIRST: 0,

    /**
     * 最高位优先常量
     * @constant {number} MSBFIRST
     */
    MSBFIRST: 1,

    /**
     * 在指定引脚上生成指定频率的音调。
     * 
     * 该方法通过 PWM 方式在指定引脚上产生方波信号，驱动蜂鸣器发出声音。
     * 
     * 注意：
     * - 一个引脚上同时只能播放一个音调
     * - 同一时间只能有一个引脚播放音调（取决于硬件定时器资源）
     * - 频率范围通常为 31Hz 到 65535Hz，实际取决于硬件 PWM 能力
     * - 该方法无返回值
     *
     * @function tone
     * @param {number} pin - 需要生成音调的 GPIO 引脚号（需支持 PWM 输出）
     * @param {number} frequency - 音调频率（单位：Hz），范围 31-65535
     * @param {number} [duration] - 音调持续时间（单位：毫秒），范围 1-60000。
     *                              如果未提供或为 0，则持续播放直到调用 `noTone`。
     * @returns {void} 无返回值
     * 
     * @example
     * // 播放 440Hz 音调，持续 1 秒
     * pulse.tone(3, 440, 1000);
     * 
     * // 播放 262Hz（C4）音调，持续播放
     * pulse.tone(3, 262);
     * // 稍后停止
     * pulse.noTone(3);
     * 
     * // 播放报警声（交替频率）
     * pulse.tone(3, 1000, 200);
     * delay(200);
     * pulse.tone(3, 2000, 200);
     */
    tone: function (pin, frequency, duration) {
        return jm.s({ op: 11, p: pin, f: frequency, d: duration });
    },

    /**
     * 停止在指定引脚上生成音调。
     * 
     * 该方法立即停止指定引脚上的音调输出，并将引脚恢复为高阻态。
     * 该方法无返回值。
     *
     * @function noTone
     * @param {number} pin - 需要停止音调的 GPIO 引脚号
     * @returns {void} 无返回值
     * 
     * @example
     * // 播放音调
     * pulse.tone(3, 440);
     * // 1秒后停止
     * delay(1000);
     * pulse.noTone(3);
     */
    noTone: function (pin) {
        return jm.s({ op: 12, p: pin });
    },

    /**
     * 读取指定引脚上的脉冲宽度（适用于短脉冲）。
     * 
     * 该方法等待指定引脚上的电平跳变，然后测量脉冲的持续时间。
     * 
     * 工作原理：
     * - 等待引脚电平变为指定状态
     * - 开始计时
     * - 等待引脚电平变回相反状态
     * - 返回计时值
     * 
     * 适用场景：
     * - 超声波传感器 HC-SR04 的回波脉冲测量
     * - 红外接收头的脉冲解码
     * - 编码器脉冲测量
     * 
     * 返回值说明：
     * - 直接返回脉冲宽度数值（微秒），超时返回 0
     *
     * @function pulseIn
     * @param {number} pin - 需要读取脉冲宽度的 GPIO 引脚号
     * @param {number} state - 脉冲状态（pulse.HIGH 或 pulse.LOW）
     * @param {number} [timeout] - 超时时间（单位：微秒），默认 1000000（1秒）。
     *                             超过此时间未检测到脉冲则返回 0。
     * @returns {number} 脉冲宽度（微秒），超时返回 0
     * 
     * @example
     * // 测量高电平脉冲宽度
     * let width = pulse.pulseIn(2, pulse.HIGH, 1000000);
     * if (width > 0) {
     *     console.log("脉冲宽度: " + width + "μs");
     * }
     * 
     * // 使用超声波传感器测距
     * // 触发脉冲
     * gpio.writeDigit(triggerPin, gpio.HIGH);
     * delayMicroseconds(10);
     * gpio.writeDigit(triggerPin, gpio.LOW);
     * // 测量回波脉冲宽度
     * let duration = pulse.pulseIn(echoPin, pulse.HIGH, 30000);
     * // 距离(cm) = 脉冲宽度(μs) / 58
     * let distance = duration / 58;
     */
    pulseIn: function (pin, state, timeout) {
        return jm.s({ op: 13, p: pin, s: state, t: timeout });
    },

    /**
     * 读取指定引脚上的长脉冲宽度（适用于更长的脉冲）。
     * 
     * 该方法与 pulseIn 功能相同，但使用中断方式实现，可以测量更长的脉冲。
     * 
     * 与 pulseIn 的区别：
     * - pulseIn: 使用忙等待，适合短脉冲，精度高
     * - pulseInLong: 使用中断，适合长脉冲（毫秒级），不会阻塞其他任务
     * 
     * 适用场景：
     * - 编码器长脉冲测量
     * - 遥控器解码
     * - 超长脉冲检测
     * 
     * 返回值说明：
     * - 直接返回脉冲宽度数值（微秒），超时返回 0
     *
     * @function pulseInLong
     * @param {number} pin - 需要读取脉冲宽度的 GPIO 引脚号
     * @param {number} state - 脉冲状态（pulse.HIGH 或 pulse.LOW）
     * @param {number} [timeout] - 超时时间（单位：微秒），默认 1000000（1秒）。
     *                             超过此时间未检测到脉冲则返回 0。
     * @returns {number} 脉冲宽度（微秒），超时返回 0
     * 
     * @example
     * // 读取长脉冲（如遥控器信号）
     * let width = pulse.pulseInLong(2, pulse.LOW, 50000);
     * if (width > 0) {
     *     console.log("低电平脉冲宽度: " + width + "μs");
     * }
     */
    pulseInLong: function (pin, state, timeout) {
        return jm.s({ op: 14, p: pin, s: state, t: timeout });
    },

    /**
     * 从指定引脚移位读取数据。
     * 
     * 该方法通过数据引脚和时钟引脚实现串行数据读取，
     * 常用于读取移位寄存器（如 74HC165）或 SPI 接口设备。
     * 
     * 工作原理：
     * - 对于每个位：先拉高时钟引脚，读取数据引脚电平，然后拉低时钟引脚
     * - 按指定位顺序（LSBFIRST 或 MSBFIRST）组合成字节
     * 
     * 返回值说明：
     * - 直接返回读取到的字节数值（0-255）
     *
     * @function shiftIn
     * @param {number} dataPin - 数据引脚号（读取数据的 GPIO 引脚）
     * @param {number} clockPin - 时钟引脚号（产生时钟信号的 GPIO 引脚）
     * @param {number} bitOrder - 位顺序：
     *   - pulse.LSBFIRST (0): 最低有效位优先，先读取 LSB
     *   - pulse.MSBFIRST (1): 最高有效位优先，先读取 MSB
     * @returns {number} 读取到的字节值（0-255）
     * 
     * @example
     * // 从 74HC165 读取 8 位并行输入数据
     * // 连接：数据引脚 GPIO4，时钟引脚 GPIO5，锁存引脚 GPIO6
     * // 锁存数据
     * gpio.writeDigit(6, gpio.LOW);
     * delayMicroseconds(1);
     * gpio.writeDigit(6, gpio.HIGH);
     * // 读取数据（直接返回数值）
     * let data = pulse.shiftIn(4, 5, pulse.LSBFIRST);
     * console.log("输入状态: 0x" + data.toString(16));
     * 
     * // 读取 2 字节（16 位）数据
     * let lowByte = pulse.shiftIn(4, 5, pulse.LSBFIRST);
     * let highByte = pulse.shiftIn(4, 5, pulse.LSBFIRST);
     * let value = (highByte << 8) | lowByte;
     */
    shiftIn: function (dataPin, clockPin, bitOrder) {
        return jm.s({ op: 15, p: dataPin, c: clockPin, b: bitOrder });
    },

    /**
     * 向指定引脚移位写入数据。
     * 
     * 该方法通过数据引脚和时钟引脚实现串行数据写入，
     * 常用于控制移位寄存器（如 74HC595）或 LED 驱动芯片。
     * 
     * 工作原理：
     * - 对于每个位：先设置数据引脚电平，然后拉高时钟引脚产生脉冲，再拉低时钟引脚
     * - 按指定位顺序（LSBFIRST 或 MSBFIRST）逐位发送数据
     * 
     * 注意：该方法无返回值
     *
     * @function shiftOut
     * @param {number} dataPin - 数据引脚号（输出数据的 GPIO 引脚）
     * @param {number} clockPin - 时钟引脚号（产生时钟信号的 GPIO 引脚）
     * @param {number} bitOrder - 位顺序：
     *   - pulse.LSBFIRST (0): 最低有效位优先，先发送 LSB
     *   - pulse.MSBFIRST (1): 最高有效位优先，先发送 MSB
     * @param {number} value - 需要写入的数据值（0-255）
     * @returns {void} 无返回值
     * 
     * @example
     * // 控制 74HC595 输出 8 位 LED 状态
     * // 连接：数据引脚 GPIO4，时钟引脚 GPIO5，锁存引脚 GPIO6
     * // 发送数据
     * pulse.shiftOut(4, 5, pulse.MSBFIRST, 0x55); // 交替亮灭
     * // 锁存输出
     * gpio.writeDigit(6, gpio.LOW);
     * delayMicroseconds(1);
     * gpio.writeDigit(6, gpio.HIGH);
     * 
     * // 发送 2 字节（16 位）数据到 LED 驱动器
     * pulse.shiftOut(4, 5, pulse.MSBFIRST, (value >> 8) & 0xFF);
     * pulse.shiftOut(4, 5, pulse.MSBFIRST, value & 0xFF);
     * 
     * // 流水灯效果
     * for (let i = 0; i < 8; i++) {
     *     pulse.shiftOut(4, 5, pulse.MSBFIRST, 1 << i);
     *     gpio.writeDigit(6, gpio.LOW);
     *     gpio.writeDigit(6, gpio.HIGH);
     *     delay(100);
     * }
     */
    shiftOut: function (dataPin, clockPin, bitOrder, value) {
        return jm.s({ op: 16, p: dataPin, c: clockPin, b: bitOrder, v: value });
    }
};

// 导出模块
// exports = pulse;

module.exports = pulse;
