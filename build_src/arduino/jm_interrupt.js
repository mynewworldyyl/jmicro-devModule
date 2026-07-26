/**
 * IO 中断模块
 * 该模块提供了类似 Arduino 的引脚中断功能，支持配置引脚的中断模式（如上升沿、下降沿、电平变化等）。
 * 所有操作通过 `jm.s` 或 `jm.e` 方法发送指令，指令中包含操作类型、引脚号、中断模式等参数。
 * @see {@link https://docs.arduino.cc/language-reference/ Arduino 语言参考文档}
 * 
 * 使用时方法名称前一定要带上interrupt.前缀
 * 
 * 返回值说明：
 * - 本模块所有方法的返回值均无实际意义（可视为 void），无需处理返回值
 * - attachInterrupt() 方法：如果回调函数为空，返回错误对象 `{code: 100, msg: 'cb null'}`，否则返回值无意义
 * - 其他方法：返回值无实际意义，直接调用即可
 * 
 * 常量说明：
 * - interrupt.RISING   (0x01) : 上升沿中断模式，当引脚从低电平变为高电平时触发中断
 * - interrupt.FALLING  (0x02) : 下降沿中断模式，当引脚从高电平变为低电平时触发中断
 * - interrupt.CHANGE   (0x03) : 电平变化中断模式，当引脚电平发生变化时（上升或下降）触发中断
 * - interrupt.ONLOW    (0x04) : 低电平中断模式，当引脚处于低电平时触发中断
 * - interrupt.ONHIGH   (0x05) : 高电平中断模式，当引脚处于高电平时触发中断
 * 
 * @module GPIO中断操作模块
 * @var interrupt
 * @category gpio
 * @keywords 中断,GPIO中断,上升沿,下降沿,电平变化,高电平,低电平,attachInterrupt,detachInterrupt,noInterrupts,interrupts,Arduino
 * @capabilities attachInterrupt,detachInterrupt,noInterrupts,interrupts
 * @depends 无
 */

var interrupt = {

    /**
     * 上升沿中断模式常量。
     * @constant {number} RISING
     */
    RISING: 0x01,

    /**
     * 下降沿中断模式常量。
     * @constant {number} FALLING
     */
    FALLING: 0x02,

    /**
     * 电平变化中断模式常量。
     * @constant {number} CHANGE
     */
    CHANGE: 0x03,

    /**
     * 低电平中断模式常量。
     * @constant {number} ONLOW
     */
    ONLOW: 0x04,

    /**
     * 高电平中断模式常量。
     * @constant {number} ONHIGH
     */
    ONHIGH: 0x05,

    /**
     * 为指定引脚绑定中断处理函数。
     * 
     * 该方法为指定 GPIO 引脚注册中断处理函数，当引脚电平满足指定模式时触发回调。
     * 
     * 注意：
     * - 中断服务函数（ISR）应尽量简短，避免使用 delay 等阻塞函数
     * - 在中断函数中避免执行可能引起调度的操作（如内存分配、打印等）
     * - 多个中断可以同时注册，但同一引脚不能重复注册
     *
     * @function attachInterrupt
     * @param {number} pin - 需要绑定中断的 GPIO 引脚号
     * @param {Function} isr - 中断处理函数（回调函数），不能为空
     * @param {number} [mode] - 中断模式（如 RISING、FALLING、CHANGE 等）。如果未提供，使用默认模式
     * @returns {Object|null} 返回值无实际意义。如果回调函数为空，返回错误对象 `{code: 100, msg: 'cb null'}`
     * 
     * @example
     * // 上升沿触发中断
     * interrupt.attachInterrupt(2, () => {
     *     console.log('上升沿触发!');
     * }, interrupt.RISING);
     * 
     * // 下降沿触发中断
     * interrupt.attachInterrupt(3, () => {
     *     console.log('下降沿触发!');
     * }, interrupt.FALLING);
     * 
     * // 电平变化触发中断
     * interrupt.attachInterrupt(4, () => {
     *     console.log('电平发生变化!');
     * }, interrupt.CHANGE);
     * 
     * // 错误示例：回调函数为空
     * let result = interrupt.attachInterrupt(2, null);
     * if (result && result.code === 100) {
     *     console.log("回调函数不能为空");
     * }
     */
    attachInterrupt: function (pin, isr, mode) {
        if (!isr) {
            return { code: 100, msg: 'cb null' };
        }
        if (mode) {
            return jm.e(6, { p: pin, m: mode }, isr);
        } else {
            return jm.e(6, { p: pin }, isr);
        }
    },

    /**
     * 解除指定引脚的中断绑定。
     * 
     * 该方法移除指定 GPIO 引脚上已注册的中断处理函数。
     * 解除后，该引脚不再响应中断事件。
     *
     * @function detachInterrupt
     * @param {number} pin - 需要解除中断绑定的 GPIO 引脚号
     * @returns {void} 返回值无实际意义
     * 
     * @example
     * // 解除引脚 2 的中断绑定
     * interrupt.detachInterrupt(2);
     */
    detachInterrupt: function (pin) {
        return jm.e(7, pin, null);
    },

    /**
     * 关闭所有中断。
     * 
     * 该方法临时禁用所有中断（包括定时器中断、串口中断等）。
     * 通常用于保护临界区代码不被中断打断。
     * 
     * 注意：
     * - 关闭中断后，应尽快执行 critical 代码并重新开启中断
     * - 长时间关闭中断可能导致系统响应延迟或功能异常
     *
     * @function noInterrupts
     * @returns {void} 返回值无实际意义
     * 
     * @example
     * // 保护临界区
     * interrupt.noInterrupts();
     * // 执行需要保护的代码
     * sharedVariable++;
     * // 重新开启中断
     * interrupt.interrupts();
     */
    noInterrupts: function () {
        return jm.s({ op: 17 });
    },

    /**
     * 开启所有中断。
     * 
     * 该方法重新启用之前被 noInterrupts() 禁用的所有中断。
     * 通常与 noInterrupts() 配对使用，保护临界区代码。
     *
     * @function interrupts
     * @returns {void} 返回值无实际意义
     * 
     * @example
     * // 开启所有中断
     * interrupt.interrupts();
     * 
     * // 完整示例：保护共享变量
     * interrupt.noInterrupts();
     * counter++;
     * interrupt.interrupts();
     */
    interrupts: function () {
        return jm.s({ op: 18 });
    }
};

// 导出模块
// exports = interrupt;

module.exports = interrupt;
