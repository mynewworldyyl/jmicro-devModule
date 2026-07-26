/**
 * 步进电机模块
 * 该模块提供了步进电机的控制功能，包括创建、删除步进电机实例，
 * 更新速度，以及多种顺时针、逆时针转动控制方式（按步数、按角度、绝对/相对位置），
 * 同时支持同步与异步执行模式。
 * 通过构造函数 Stepper(in1, in2, in3, in4) 创建电机实例，
 * 所有控制方法均通过 `jm.s` 下发指令并由设备端执行。
  * 步进电机 API 返回值说明：
 * 
 * 所有方法返回的对象结构如下：
 * @typedef {Object} StepperResult
 * @property {number} code - 状态码，0 表示成功，非 0 表示错误
 *   - 0: 操作成功
 *   - 1: 缺少 op（操作码）参数
 *   - 2: 缺少引脚参数或实例不存在
 *   - 3: 缺少 p3/p4 引脚参数（创建实例时）
 *   - 4: 参数 val 为 0（无效）
 *   - 5: 更新速度时 val 为 0（无效）
 *   - 6: 无效的操作码
 *   - 13: 步进电机哈希表未初始化
 * 
 * 使用示例：
 * ```javascript
 * // 创建步进电机实例（使用引脚 D1, D2, D3, D4）
 * let motor = new Stepper(D1, D2, D3, D4);
 * 
 * // 初始化电机，设置转速为60RPM，步距为4096
 * motor.create(60, 4096);
 * 
 * // 顺时针转动1000步
 * motor.moveClockwise(1000);
 * 
 * // 异步逆时针转动90度
 * motor.asyncMoveReverseDegreesClock(90);
 * 
 * // 停止所有异步动作
 * motor.asyncStop();
 * ```
 * @module 步进电机控制接口
 * @var Stepper
 * @category actuator
 * @keywords 步进电机,Stepper,步进驱动,四相步进,同步控制,异步控制,角度转动,步数控制
 * @capabilities create,delete,updateSpeed,moveClockwise,moveReverseClock,moveToClockwise,moveToReverseClock,moveDegreesClockwise,moveReverseDegreesClock,moveToDegreesClockwise,moveToReverseDegreesClock,asyncMoveClockwise,asyncMoveReverseClock,asyncMoveToClockwise,asyncMoveToReverseClock,asyncMoveDegreesClockwise,asyncMoveReverseDegreesClock,asyncMoveToDegreesClockwise,asyncMoveToReverseDegreesClock,asyncStop
 * @depends 无
 */

let stepdefId = 25;

/**
 * 步进电机构造函数
 * 通过四个引脚创建步进电机实例，引脚组合决定电机的唯一ID
 * 
 * @param {number} i1 - 步进电机的第一个输入引脚编号（高位，用于生成PID）
 * @param {number} i2 - 步进电机的第二个输入引脚编号（低位，用于生成PID）
 * @param {number} i3 - 步进电机的第三个输入引脚编号
 * @param {number} i4 - 步进电机的第四个输入引脚编号
 * 
 * @example
 * // 使用GPIO D1, D2, D3, D4创建电机
 * let motor = new Stepper(D1, D2, D3, D4);
 * 
 * // 使用引脚号直接创建
 * let motor2 = new Stepper(5, 6, 7, 8);
 */
function Stepper(i1, i2, i3, i4) {
    this.in1 = i1;
    this.in2 = i2;
    this.in3 = i3;
    this.in4 = i4;
    this.pid = (i1 << 8) | i2;  // 组合两个引脚生成唯一ID
}

Stepper.prototype = {
    /**
     * 创建步进电机实例
     * 
     * 初始化电机控制器，设置转速和步距参数。
     * 如果同引脚组合的实例已存在，会先删除旧实例再创建新的。
     * 
     * @param {number} sp - 步进电机的速度参数（RPM，每分钟转速），取值范围通常为0-100
     * @param {number} sr - 步进电机的步数分辨率参数，电机转一圈所需的步数（如4096步/圈）
     * @returns {StepperResult} 返回操作结果对象，code为0表示创建成功
     * 
     * @example
     * // 创建电机，转速60RPM，步距4096步/圈
     * motor.create(60, 4096);
     */
    create: function (sp, sr) {
        return jm.s({ "_fn": stepdefId, op: 1, p1: this.in1, p2: this.in2, p3: this.in3, p4: this.in4, sp: sp, sr: sr });
    },

    /**
     * 删除步进电机实例
     * 
     * 释放电机资源，停止所有正在执行的动作。
     * 删除后需要重新调用 create() 才能再次使用。
     * 
     * @returns {StepperResult} 返回操作结果对象，code为0表示删除成功
     * 
     * @example
     * // 删除电机实例
     * motor.delete();
     */
    delete: function () {
        return jm.s({ "_fn": stepdefId, op: 2, p: this.pid });
    },

    /**
     * 更新步进电机的速度
     * 
     * 动态改变电机的转动速度，影响后续所有移动操作。
     * 
     * @param {number} val - 要设置的新速度值（RPM，每分钟转速），取值范围通常为0-100，不能为0
     * @returns {StepperResult} 返回操作结果对象，code为0表示更新成功
     * 
     * @example
     * // 将电机速度调整为30RPM
     * motor.updateSpeed(30);
     */
    updateSpeed: function (val) {
        return jm.s({ "_fn": stepdefId, op: 3, p: this.pid, v: val });
    },

    /**
     * 顺时针转动指定步数（同步执行）
     * 
     * 电机顺时针方向转动指定步数，该方法会阻塞直到转动完成。
     * 
     * @param {number} val - 要转动的步数，必须大于0
     * @returns {StepperResult} 返回操作结果对象，code为0表示转动成功
     * 
     * @example
     * // 顺时针转动500步
     * motor.moveClockwise(500);
     */
    moveClockwise: function (val) {
        return jm.s({ "_fn": stepdefId, op: 4, p: this.pid, v: val });
    },

    /**
     * 逆时针转动指定步数（同步执行）
     * 
     * 电机逆时针方向转动指定步数，该方法会阻塞直到转动完成。
     * 
     * @param {number} val - 要转动的步数，必须大于0
     * @returns {StepperResult} 返回操作结果对象，code为0表示转动成功
     * 
     * @example
     * // 逆时针转动300步
     * motor.moveReverseClock(300);
     */
    moveReverseClock: function (val) {
        return jm.s({ "_fn": stepdefId, op: 5, p: this.pid, v: val });
    },

    /**
     * 顺时针转动到指定步数位置（同步执行）
     * 
     * 电机顺时针方向转动到指定的绝对步数位置。
     * 位置从0开始计算，一圈的总步数由 sr 参数决定。
     * 
     * @param {number} val - 目标步数位置（绝对位置），必须大于0
     * @returns {StepperResult} 返回操作结果对象，code为0表示转动成功
     * 
     * @example
     * // 顺时针转到2000步位置
     * motor.moveToClockwise(2000);
     */
    moveToClockwise: function (val) {
        return jm.s({ "_fn": stepdefId, op: 6, p: this.pid, v: val });
    },

    /**
     * 逆时针转动到指定步数位置（同步执行）
     * 
     * 电机逆时针方向转动到指定的绝对步数位置。
     * 位置从0开始计算，一圈的总步数由 sr 参数决定。
     * 
     * @param {number} val - 目标步数位置（绝对位置），必须大于0
     * @returns {StepperResult} 返回操作结果对象，code为0表示转动成功
     * 
     * @example
     * // 逆时针转到1000步位置
     * motor.moveToReverseClock(1000);
     */
    moveToReverseClock: function (val) {
        return jm.s({ "_fn": stepdefId, op: 7, p: this.pid, v: val });
    },

    /**
     * 顺时针转动指定度数（同步执行）
     * 
     * 电机顺时针方向转动指定角度，一圈为360度。
     * 系统会自动根据步距（sr）将角度转换为步数。
     * 
     * @param {number} val - 要转动的度数，一圈为360度，必须大于0
     * @returns {StepperResult} 返回操作结果对象，code为0表示转动成功
     * 
     * @example
     * // 顺时针转动90度
     * motor.moveDegreesClockwise(90);
     * 
     * // 顺时针转动一圈
     * motor.moveDegreesClockwise(360);
     */
    moveDegreesClockwise: function (val) {
        return jm.s({ "_fn": stepdefId, op: 8, p: this.pid, v: val });
    },

    /**
     * 逆时针转动指定度数（同步执行）
     * 
     * 电机逆时针方向转动指定角度，一圈为360度。
     * 系统会自动根据步距（sr）将角度转换为步数。
     * 
     * @param {number} val - 要转动的度数，一圈为360度，必须大于0
     * @returns {StepperResult} 返回操作结果对象，code为0表示转动成功
     * 
     * @example
     * // 逆时针转动180度
     * motor.moveReverseDegreesClock(180);
     */
    moveReverseDegreesClock: function (val) {
        return jm.s({ "_fn": stepdefId, op: 9, p: this.pid, v: val });
    },

    /**
     * 顺时针转动到指定度数位置（同步执行）
     * 
     * 电机顺时针方向转动到指定的绝对角度位置。
     * 角度范围通常为0-360度，超过一圈会被归一化。
     * 
     * @param {number} val - 目标度数位置（绝对位置），一圈为360度
     * @returns {StepperResult} 返回操作结果对象，code为0表示转动成功
     * 
     * @example
     * // 顺时针转到90度位置
     * motor.moveToDegreesClockwise(90);
     */
    moveToDegreesClockwise: function (val) {
        return jm.s({ "_fn": stepdefId, op: 10, p: this.pid, v: val });
    },

    /**
     * 逆时针转动到指定度数位置（同步执行）
     * 
     * 电机逆时针方向转动到指定的绝对角度位置。
     * 角度范围通常为0-360度，超过一圈会被归一化。
     * 
     * @param {number} val - 目标度数位置（绝对位置），一圈为360度
     * @returns {StepperResult} 返回操作结果对象，code为0表示转动成功
     * 
     * @example
     * // 逆时针转到270度位置
     * motor.moveToReverseDegreesClock(270);
     */
    moveToReverseDegreesClock: function (val) {
        return jm.s({ "_fn": stepdefId, op: 11, p: this.pid, v: val });
    },

    /**
     * 异步顺时针转动指定步数
     * 
     * 电机顺时针方向转动指定步数，该方法立即返回，
     * 电机在后台继续运行，可通过 asyncStop() 停止。
     * 
     * @param {number} val - 要转动的步数，必须大于0
     * @returns {StepperResult} 返回操作结果对象，code为0表示指令发送成功
     * 
     * @example
     * // 异步顺时针转动500步（不阻塞）
     * motor.asyncMoveClockwise(500);
     * // 后续代码会立即执行
     */
    asyncMoveClockwise: function (val) {
        return jm.s({ "_fn": stepdefId, op: 12, p: this.pid, v: val });
    },

    /**
     * 异步逆时针转动指定步数
     * 
     * 电机逆时针方向转动指定步数，该方法立即返回，
     * 电机在后台继续运行，可通过 asyncStop() 停止。
     * 
     * @param {number} val - 要转动的步数，必须大于0
     * @returns {StepperResult} 返回操作结果对象，code为0表示指令发送成功
     * 
     * @example
     * // 异步逆时针转动300步
     * motor.asyncMoveReverseClock(300);
     */
    asyncMoveReverseClock: function (val) {
        return jm.s({ "_fn": stepdefId, op: 13, p: this.pid, v: val });
    },

    /**
     * 异步顺时针转动到指定步数位置
     * 
     * 电机顺时针方向转动到指定的绝对步数位置，该方法立即返回，
     * 电机在后台继续运行，可通过 asyncStop() 停止。
     * 
     * @param {number} val - 目标步数位置（绝对位置），必须大于0
     * @returns {StepperResult} 返回操作结果对象，code为0表示指令发送成功
     * 
     * @example
     * // 异步顺时针转到2000步位置
     * motor.asyncMoveToClockwise(2000);
     */
    asyncMoveToClockwise: function (val) {
        return jm.s({ "_fn": stepdefId, op: 14, p: this.pid, v: val });
    },

    /**
     * 异步逆时针转动到指定步数位置
     * 
     * 电机逆时针方向转动到指定的绝对步数位置，该方法立即返回，
     * 电机在后台继续运行，可通过 asyncStop() 停止。
     * 
     * @param {number} val - 目标步数位置（绝对位置），必须大于0
     * @returns {StepperResult} 返回操作结果对象，code为0表示指令发送成功
     * 
     * @example
     * // 异步逆时针转到1000步位置
     * motor.asyncMoveToReverseClock(1000);
     */
    asyncMoveToReverseClock: function (val) {
        return jm.s({ "_fn": stepdefId, op: 15, p: this.pid, v: val });
    },

    /**
     * 异步顺时针转动指定度数
     * 
     * 电机顺时针方向转动指定角度，该方法立即返回，
     * 电机在后台继续运行，可通过 asyncStop() 停止。
     * 系统会自动根据步距（sr）将角度转换为步数。
     * 
     * @param {number} val - 要转动的度数，一圈为360度，必须大于0
     * @returns {StepperResult} 返回操作结果对象，code为0表示指令发送成功
     * 
     * @example
     * // 异步顺时针转动90度
     * motor.asyncMoveDegreesClockwise(90);
     */
    asyncMoveDegreesClockwise: function (val) {
        return jm.s({ "_fn": stepdefId, op: 16, p: this.pid, v: val });
    },

    /**
     * 异步逆时针转动指定度数
     * 
     * 电机逆时针方向转动指定角度，该方法立即返回，
     * 电机在后台继续运行，可通过 asyncStop() 停止。
     * 系统会自动根据步距（sr）将角度转换为步数。
     * 
     * @param {number} val - 要转动的度数，一圈为360度，必须大于0
     * @returns {StepperResult} 返回操作结果对象，code为0表示指令发送成功
     * 
     * @example
     * // 异步逆时针转动45度
     * motor.asyncMoveReverseDegreesClock(45);
     */
    asyncMoveReverseDegreesClock: function (val) {
        return jm.s({ "_fn": stepdefId, op: 17, p: this.pid, v: val });
    },

    /**
     * 异步顺时针转动到指定度数位置
     * 
     * 电机顺时针方向转动到指定的绝对角度位置，该方法立即返回，
     * 电机在后台继续运行，可通过 asyncStop() 停止。
     * 
     * @param {number} val - 目标度数位置（绝对位置），一圈为360度
     * @returns {StepperResult} 返回操作结果对象，code为0表示指令发送成功
     * 
     * @example
     * // 异步顺时针转到180度位置
     * motor.asyncMoveToDegreesClockwise(180);
     */
    asyncMoveToDegreesClockwise: function (val) {
        return jm.s({ "_fn": stepdefId, op: 18, p: this.pid, v: val });
    },

    /**
     * 异步逆时针转动到指定度数位置
     * 
     * 电机逆时针方向转动到指定的绝对角度位置，该方法立即返回，
     * 电机在后台继续运行，可通过 asyncStop() 停止。
     * 
     * @param {number} val - 目标度数位置（绝对位置），一圈为360度
     * @returns {StepperResult} 返回操作结果对象，code为0表示指令发送成功
     * 
     * @example
     * // 异步逆时针转到0度位置（归零）
     * motor.asyncMoveToReverseDegreesClock(0);
     */
    asyncMoveToReverseDegreesClock: function (val) {
        return jm.s({ "_fn": stepdefId, op: 19, p: this.pid, v: val });
    },

    /**
     * 停止当前异步执行且未结束的动作
     * 
     * 立即停止电机所有正在执行的后台转动动作。
     * 电机将停在当前位置，不会回零。
     * 
     * @returns {StepperResult} 返回操作结果对象，code为0表示停止成功
     * 
     * @example
     * // 启动异步转动
     * motor.asyncMoveClockwise(5000);
     * 
     * // 稍后停止（如按键触发）
     * setTimeout(function() {
     *     motor.asyncStop();
     * }, 1000);
     */
    asyncStop: function () {
        return jm.s({ "_fn": stepdefId, op: 20, p: this.pid, v: 0 });
    }
};

//exports = Stepper