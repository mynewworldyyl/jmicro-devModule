/**
 * 控制模块
 * 提供注册和取消注册服务方法的功能，用于在设备运行时动态绑定或解绑回调函数。
 * 常用于实现事件监听、远程服务调用、设备能力扩展等场景。
 * 所有方法通过 `jm.e` 与底层运行时交互。
 * 使用时方法名称前一定要带上 ctrl. 前缀
 * 
 * 返回值说明：
 * - regist(): 如果回调函数为空，返回错误对象 `{code: 100, msg: 'callback null'}`，否则无返回值（void）
 * - unregist(): 无返回值（void）
 *
 * @module 注册和反注册服务接口
 * @var ctrl
 * @category system
 * @keywords 服务注册,回调注册,事件绑定,动态扩展,运行时控制,Arduino扩展
 * @capabilities regist,unregist
 * @depends 无
 */

var ctrl = {
    /**
     * 注册服务方法
     * 
     * 该方法用于将指定的回调函数绑定到对应的服务标识符（defId）上。
     * 当设备接收到对应服务的调用请求时，注册的回调函数会被触发执行，
     * 回调函数会接收到一个参数对象，该对象的字段由调用方约定。
     * 
     * 注意事项：
     * - defId 必须是正整数，不能为 0
     * - 同一个 defId 只能注册一个回调函数，重复注册会覆盖之前的注册
     * - 回调函数的参数结构需要与调用方约定一致
     * 
     * 返回值说明：
     * - 如果回调函数为空，返回错误对象 `{code: 100, msg: 'callback null'}`
     * - 如果注册成功，无返回值（void）
     * 
     * @param {number} defId - 服务方法的唯一标识符，必须为正整数，不能为 0
     * @param {Function} func - 要注册的回调函数，该函数接收一个对象参数
     * @param {Object} func.params - 回调函数接收的参数对象，字段由通信双方约定
     * @returns {Object|void} - 回调函数为空时返回错误对象，否则无返回值
     * 
     * @example
     * // 注册开关控制服务
     * ctrl.regist(1001, function(params) {
     *     // params 对象由调用方传入，约定包含 action 字段
     *     if (params.action === 'on') {
     *         gpio.writeDigit(13, gpio.HIGH);
     *         console.log("灯已打开");
     *     } else if (params.action === 'off') {
     *         gpio.writeDigit(13, gpio.LOW);
     *         console.log("灯已关闭");
     *     }
     *     return { status: "ok" };
     * });
     * 
     * // 注册温度读取服务
     * ctrl.regist(1002, function(params) {
     *     // params 约定包含 unit 字段（'c' 或 'f'）
     *     let temp = readTemperature();
     *     if (params.unit === 'f') {
     *         temp = temp * 9 / 5 + 32;
     *     }
     *     return { temperature: temp };
     * });
     * 
     * // 注册电机控制服务
     * ctrl.regist(1003, function(params) {
     *     // params 约定包含 speed（0-100）和 direction（'cw'/'ccw'）字段
     *     console.log("设置电机速度: " + params.speed + "%, 方向: " + params.direction);
     *     setMotorSpeed(params.speed);
     *     setMotorDirection(params.direction);
     *     return { success: true };
     * });
     * 
     * // 错误示例：defId 不能为 0
     * // ctrl.regist(0, function(params) { ... }); // 无效
     * 
     * // 检查注册是否出错
     * let result = ctrl.regist(1004, null);
     * if (result && result.code === 100) {
     *     console.log("回调函数不能为空");
     * }
     */
    regist: function(defId, func) {
        // 检查 defId 是否为有效的正整数
        if (defId === 0 || defId < 0) {
            return { code: 101, msg: 'invalid defId, must be positive integer' };
        }
        // 检查回调函数是否为空
        if (!func) {
            return { code: 100, msg: 'callback null' };
        }
        
        // 调用底层方法注册服务
        return jm.e(4, defId, func);
    },

    /**
     * 取消注册服务方法
     * 
     * 该方法用于解除之前通过 regist 注册的服务回调函数。
     * 取消注册后，该服务将不再响应对应的调用请求。
     * 
     * 使用场景：
     * - 动态替换服务实现
     * - 释放不再需要的服务
     * - 临时禁用某个功能
     * 
     * 返回值说明：该方法无返回值（void）
     * 
     * @param {number} defId - 要取消注册的服务方法的唯一标识符，必须为正整数，不能为 0
     * @returns {void} 无返回值
     * 
     * @example
     * // 取消注册服务
     * ctrl.unregist(1001);
     * 
     * // 动态替换服务实现
     * ctrl.unregist(1002);
     * ctrl.regist(1002, function(params) {
     *     // 新的实现逻辑
     *     console.log("新版本温度服务，单位: " + params.unit);
     *     let temp = readTemperature();
     *     return { temperature: temp, timestamp: Date.now() };
     * });
     * 
     * // 批量清理服务
     * function clearAllServices(serviceIds) {
     *     for (let i = 0; i < serviceIds.length; i++) {
     *         ctrl.unregist(serviceIds[i]);
     *     }
     * }
     * clearAllServices([1001, 1002, 1003]);
     */
    unregist: function(defId) {
        // 调用底层方法取消注册服务
        return jm.e(5, defId, null);
    }
};

//exports = ctrl

module.exports = ctrl;
