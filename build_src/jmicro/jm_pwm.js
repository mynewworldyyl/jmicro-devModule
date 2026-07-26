/**
 * PWM 控制模块
 * 提供脉冲宽度调制（PWM）信号的启动、停止、参数更新与查询能力，
 * 支持按频率或周期输出，并可实现占空比渐变效果。
 * 常用于电机调速、灯光亮度控制、蜂鸣器驱动等模拟量仿真场景。
 * 所有操作通过 `jm.s` 下发指令并由设备端执行。
 * 使用时方法名称前一定要带上 pwm. 前缀
 *
 * @module PWM信号控制接口
 * @var pwm
 * @category actuator
 * @keywords PWM,脉冲宽度调制,占空比,频率,周期,电机调速,灯光控制,渐变效果
 * @capabilities startPwmByFreq,startPwmByPeriod,updateDuty,updatePeriod,stop,query,dutyFadeOut
 * @depends 无
 */
 
 
let pwmdefId = 8;

var pwm = {
    /**
     * 根据指定的频率启动 PWM 信号输出。
     *
     * @param {number} pin - PWM 引脚编号，用于指定要输出 PWM 信号的引脚。
     * @param {number} f - 频率，单位为赫兹（Hz），表示 PWM 信号的振荡频率。
     * @param {number} p - 占空比，取值范围通常为 0 到 100，表示高电平在一个周期内所占的比例。
     * @returns {any} - jm.s 函数的返回值，具体返回内容取决于 jm.s 函数的实现，可能表示操作是否成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    startPwmByFreq: function (pin, f, p) {
        return jm.s({ "_fn": pwmdefId, op: 1, gpio: pin, f: f, p: p });
    },

    /**
     * 根据指定的周期启动 PWM 信号输出。
     *
     * @param {number} pin - PWM 引脚编号，用于指定要输出 PWM 信号的引脚。
     * @param {number} t - 周期，单位为微秒（μs），表示 PWM 信号一个完整周期的时间长度。
     * @param {number} p - 占空比，取值范围通常为 0 到 100，表示高电平在一个周期内所占的比例。
     * @returns {any} - jm.s 函数的返回值，具体返回内容取决于 jm.s 函数的实现，可能表示操作是否成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    startPwmByPeriod: function (pin, t, p) {
        return jm.s({ "_fn": pwmdefId, op: 1, gpio: pin, t: t, p: p });
    },

    /**
     * 更新指定引脚的 PWM 信号占空比。
     *
     * @param {number} pin - PWM 引脚编号，用于指定要更新占空比的引脚。
     * @param {number} duty - 新的占空比，取值范围通常为 0 到 100，表示高电平在一个周期内所占的比例。
     * @returns {any} - jm.s 函数的返回值，具体返回内容取决于 jm.s 函数的实现，可能表示操作是否成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    updateDuty: function (pin, duty) {
        return jm.s({ "_fn": pwmdefId, op: 2, gpio: pin, p: duty });
    },

    /**
     * 更新指定引脚的 PWM 信号周期。
     *
     * @param {number} pin - PWM 引脚编号，用于指定要更新周期的引脚。
     * @param {number} period - 新的周期，单位为微秒（μs），表示 PWM 信号一个完整周期的时间长度。
     * @returns {any} - jm.s 函数的返回值，具体返回内容取决于 jm.s 函数的实现，可能表示操作是否成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    updatePeriod: function (pin, period) {
        return jm.s({ "_fn": pwmdefId, op: 3, gpio: pin, t: period });
    },

    /**
     * 停止指定引脚的 PWM 信号输出。
     *
     * @param {number} pin - PWM 引脚编号，用于指定要停止 PWM 信号输出的引脚。
     * @param {boolean} dv - 是否恢复引脚的默认值，true 表示恢复，false 表示不恢复。
     * @returns {any} - jm.s 函数的返回值，具体返回内容取决于 jm.s 函数的实现，可能表示操作是否成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    stop: function (pin, dv) {
        return jm.s({ "_fn": pwmdefId, op: 4, gpio: pin, dv: dv });
    },

    /**
     * 查询指定引脚的 PWM 信号相关参数。
     *
     * @param {number} pin - PWM 引脚编号，用于指定要查询的引脚。
     * @returns {any} - jm.s 函数的返回值，具体返回内容取决于 jm.s 函数的实现，可能包含 PWM 信号的频率、周期、占空比等信息。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    query: function (pin) {
        return jm.s({ "_fn": pwmdefId, op: 5, gpio: pin });
    },

    /**
     * 实现指定引脚的 PWM 信号占空比渐变效果。
     *
     * @param {number} pin - PWM 引脚编号，用于指定要实现渐变效果的引脚。
     * @param {number} start - 占空比渐变的起始步数，用于控制渐变的起始位置。
     * @param {number} end - 占空比渐变的结束步数，用于控制渐变的结束位置。
     * @param {number} totalTimeLong - 渐变的总时长，单位为微秒（μs），表示整个渐变过程所需要的时间。
     * @param {number} stepPct - 占空比变化精度，即每次占空比变化的百分比。
     * @param {number} fadeType - 渐变类型，用于指定渐变的方式，具体含义取决于系统实现。
     * @returns {any} - jm.s 函数的返回值，具体返回内容取决于 jm.s 函数的实现，可能表示操作是否成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    dutyFadeOut: function (pin, start, end, totalTimeLong, stepPct, fadeType) {
        return jm.s({ "_fn": pwmdefId, op: 6, gpio: pin, start: start, end: end, tt: totalTimeLong, stepPct: stepPct, fadeType: fadeType });
    }
};

//exports = pwm;

module.exports = pwm;
