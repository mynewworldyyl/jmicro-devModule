/**
 * 舵机模块
 * 该模块提供了一系列控制舵机的方法，包括舵机的连接、脱离、角度设置、微秒脉冲设置、
 * 状态读取、循环转动以及相对角度转动等功能。
 * 所有操作通过 `jm.s` 下发指令，由设备端完成舵机控制。
 * 使用时方法名称前一定要带上 servo. 前缀
 * 
 *  * 舵机 API 返回值说明：
 * 
 * 所有方法返回的对象结构如下：
 * @typedef {Object} ServoResult
 * @property {number} code - 状态码，0 表示成功，非 0 表示错误
 *   - 0: 操作成功
 *   - 1: 缺少 op（操作码）参数
 *   - 2: 缺少 p（引脚）参数
 *   - 3: 缺少 val（角度/脉冲值）参数或模式无效
 *   - 6: 无效的操作码
 *   - 7: 缺少角度增量值参数
 *   - 20: 舵机实例未初始化（调用操作前未 attach）
 * @property {number} [v] - 返回值（仅查询操作返回）
 *   - read(): 返回当前角度值（0-180）
 *   - readMicroseconds(): 返回当前微秒脉冲值
 *   - attached(): 返回布尔值，表示舵机是否已连接
 * 
 * 使用方法示例：
 * ```javascript
 * // 连接舵机到引脚9，初始角度90度
 * servo.attach(9, 500, 2500, 90);
 * 
 * // 设置舵机角度为45度
 * servo.write(9, 45);
 * 
 * // 读取当前角度
 * let angle = servo.read(9);
 * console.log("当前角度: " + angle.v);
 * ```
 *
 * @module 舵机控制接口
 * @var servo
 * @category actuator
 * @keywords 舵机,Servo,角度控制,微秒脉冲,循环转动,机器人关节,RC舵机
 * @capabilities attach,detach,write,writeMicroseconds,read,readMicroseconds,attached,startLoop,stopLoop,turnByAngle
 * @depends 无
 */

let servodefId = 23;

let servo = {
    /**
     * 将舵机连接到指定引脚，并设置相关参数。
     * 
     * 此方法用于初始化舵机，将其连接到指定的引脚，并可以设置舵机的最小脉冲、最大脉冲和初始角度值。
     * 如果舵机已经连接在相同引脚，会先断开原有连接再重新连接。
     * 
     * @param {number} pin - 舵机连接的GPIO引脚编号（如9、10等）
     * @param {number} [min] - 舵机的最小脉冲宽度（微秒），通常为500-1000μs，对应0°位置
     * @param {number} [max] - 舵机的最大脉冲宽度（微秒），通常为2000-2500μs，对应180°位置
     * @param {number} [val] - 舵机的初始角度值（0-180），设置后舵机立即转动到该角度
     * @returns {ServoResult} 返回操作结果对象，code为0表示连接成功
     * 
     * @example
     * // 基本连接，使用默认脉冲范围(500-2500μs)
     * servo.attach(9);
     * 
     * // 连接并设置初始角度为90度
     * servo.attach(9, 500, 2500, 90);
     * 
     * // 自定义脉冲范围（适用于特殊舵机）
     * servo.attach(9, 1000, 2000);
     */
    attach: function (pin, min, max, val) {
        return jm.s({ "_fn": servodefId, op: 1, p: pin, v: val, mi: min, ma: max });
    },

    /**
     * 使舵机脱离指定引脚。
     * 
     * 该方法用于停止对指定引脚连接的舵机的控制，断开与舵机的连接。
     * 断开后该引脚可用于其他功能。
     * 
     * @param {number} pin - 舵机当前连接的GPIO引脚编号
     * @returns {ServoResult} 返回操作结果对象，code为0表示脱离成功
     * 
     * @example
     * servo.detach(9);
     */
    detach: function (pin) {
        return jm.s({ "_fn": servodefId, op: 2, p: pin });
    },

    /**
     * 设置舵机的角度。
     * 
     * 此方法用于将指定引脚连接的舵机转动到指定的角度。
     * 角度范围通常为0-180度，具体取决于舵机的规格。
     * 
     * @param {number} pin - 舵机连接的GPIO引脚编号
     * @param {number} val - 要设置的舵机角度值（0-180）
     * @returns {ServoResult} 返回操作结果对象，code为0表示设置成功
     * 
     * @example
     * // 将舵机转到45度位置
     * servo.write(9, 45);
     * 
     * // 将舵机转到最大角度（180度）
     * servo.write(9, 180);
     */
    write: function (pin, val) {
        return jm.s({ "_fn": servodefId, op: 3, p: pin, v: val });
    },

    /**
     * 通过微秒脉冲设置舵机位置。
     * 
     * 该方法使用微秒级的脉冲信号来精确控制指定引脚连接的舵机的位置。
     * 标准的舵机脉冲范围为500-2500μs，对应0-180度。
     * 
     * @param {number} pin - 舵机连接的GPIO引脚编号
     * @param {number} val - 用于控制舵机位置的微秒脉冲值（通常500-2500μs）
     * @returns {ServoResult} 返回操作结果对象，code为0表示设置成功
     * 
     * @example
     * // 设置脉冲为1500μs（通常对应90度中位）
     * servo.writeMicroseconds(9, 1500);
     * 
     * // 设置脉冲为2000μs（通常对应180度）
     * servo.writeMicroseconds(9, 2000);
     */
    writeMicroseconds: function (pin, val) {
        return jm.s({ "_fn": servodefId, op: 4, p: pin, v: val });
    },

    /**
     * 读取舵机当前的角度。
     * 
     * 此方法用于获取指定引脚连接的舵机当前的角度值。
     * 
     * @param {number} pin - 舵机连接的GPIO引脚编号
     * @returns {ServoResult} 返回包含角度值的对象
     *   - code: 状态码，0表示成功
     *   - v: 当前角度值（0-180）
     * 
     * @example
     * let result = servo.read(9);
     * if (result.code === 0) {
     *     console.log("当前角度: " + result.v + "度");
     * }
     */
    read: function (pin) {
        return jm.s({ "_fn": servodefId, op: 5, p: pin });
    },

    /**
     * 读取舵机当前位置对应的微秒脉冲值。
     * 
     * 该方法用于获取指定引脚连接的舵机当前位置所对应的微秒脉冲值。
     * 
     * @param {number} pin - 舵机连接的GPIO引脚编号
     * @returns {ServoResult} 返回包含微秒脉冲值的对象
     *   - code: 状态码，0表示成功
     *   - v: 当前微秒脉冲值
     * 
     * @example
     * let result = servo.readMicroseconds(9);
     * if (result.code === 0) {
     *     console.log("当前脉冲: " + result.v + "μs");
     * }
     */
    readMicroseconds: function (pin) {
        return jm.s({ "_fn": servodefId, op: 6, p: pin });
    },

    /**
     * 检查舵机是否已连接到指定引脚。
     * 
     * 此方法用于判断指定引脚是否连接有舵机实例。
     * 
     * @param {number} pin - 要检查的GPIO引脚编号
     * @returns {ServoResult} 返回包含连接状态的对象
     *   - code: 状态码，0表示成功
     *   - v: 布尔值，true表示已连接，false表示未连接
     * 
     * @example
     * let result = servo.attached(9);
     * if (result.code === 0 && result.v) {
     *     console.log("舵机已连接");
     * }
     */
    attached: function (pin) {
        return jm.s({ "_fn": servodefId, op: 7, p: pin });
    },

    /**
     * 启动舵机的循环转动。
     * 
     * 该方法可以让指定引脚连接的舵机在指定的角度范围内，按照指定的步长和时间间隔进行循环转动。
     * 
     * 模式说明：
     * - mode=1: 从起始角度到结束角度单向转动一次，结束后停止
     * - mode=2: 从起始角度到结束角度往复摆动（来回摆动）
     * - mode=3: 从起始角度到结束角度，然后回到起始位置重新开始（单向循环）
     * 
     * @param {number} pin - 舵机连接的GPIO引脚编号
     * @param {number} from - 循环转动的起始角度（0-180）
     * @param {number} to - 循环转动的结束角度（0-180）
     * @param {number} step - 每次转动的角度步长（1-180），值越小转动越平滑
     * @param {number} interval - 每次转动之间的时间间隔（毫秒），值越大转动越慢
     * @param {number} mode - 转动模式（1/2/3），详见上述说明
     * @returns {ServoResult} 返回操作结果对象，code为0表示循环启动成功
     * 
     * @example
     * // 模式1：从0度转到180度，步长2度，间隔20ms
     * servo.startLoop(9, 0, 180, 2, 20, 1);
     * 
     * // 模式2：在0-90度之间来回摆动
     * servo.startLoop(9, 0, 90, 1, 10, 2);
     * 
     * // 模式3：从30度到150度循环转动（单向）
     * servo.startLoop(9, 30, 150, 3, 15, 3);
     */
    startLoop: function (pin, from, to, step, interval, mode) {
        return jm.s({ "_fn": servodefId, op: 8, p: pin, f: from, t: to, s: step, i: interval, m: mode });
    },

    /**
     * 停止舵机的循环转动。
     * 
     * 此方法用于停止指定引脚连接的舵机的循环转动操作。
     * 调用后舵机会停在当前位置。
     * 
     * @param {number} pin - 舵机连接的GPIO引脚编号
     * @returns {ServoResult} 返回操作结果对象，code为0表示停止成功
     * 
     * @example
     * servo.stopLoop(9);
     */
    stopLoop: function (pin) {
        return jm.s({ "_fn": servodefId, op: 9, p: pin });
    },

    /**
     * 使舵机按指定角度增量转动。
     * 
     * 该方法用于让指定引脚连接的舵机在当前角度基础上转动指定的角度增量。
     * 正数表示顺时针/正转，负数表示逆时针/反转。
     * 最终角度会被限制在0-180度范围内。
     * 
     * @param {number} pin - 舵机连接的GPIO引脚编号
     * @param {number} val - 要转动的角度增量值（可正可负）
     * @returns {ServoResult} 返回操作结果对象，code为0表示转动成功
     * 
     * @example
     * // 在当前角度基础上增加10度
     * servo.turnByAngle(9, 10);
     * 
     * // 在当前角度基础上减少15度
     * servo.turnByAngle(9, -15);
     */
    turnByAngle: function (pin, val) {
        return jm.s({ "_fn": servodefId, op: 10, p: pin, v: val });
    }
};

//exports = servo