
/**
 * BL0937 电流电压监测
 * 
 * 该模块用于与ESP8266/ESP32上的BL0937交流电参数监控芯片通信，
 * 提供电压、电流、功率、电能等实时数据采集和校准功能。
 * 
 * 重要说明：
 * 1. 所有传输值都需要乘以1000，如220V传输值为220000
 * 2. 电流单位固定为 mA，10A = 10000mA
 * 3. 频率单位固定为 Hz，传输值 = 实际频率 * 1000
 * 4. 能量单位固定为 kWh，传输值 = 实际能量 * 100000
 * 
 * 使用时方法名称前一定要带上bl0937.前缀
 * 
 * @module BL0937交流电参数监控模块
 * @var bl0937
 * @category sensor
 * @keywords BL0937,电压,电流,功率,电能,校准,过压保护,过流保护,交流电,ESP8266,ESP32,Arduino库
 * @capabilities readSensorData,isSensorInitialized,updateConfiguration,getCurrentConfiguration,restoreDefaultCalibration,resetEnergy,calibrateVoltage,calibrateCurrent,calibratePower,setProtection,setOledDisplay,toTransmitValue,toActualValue,energyToActual,energyToTransmit
 * @depends 无
 */

// 设备端常量定义
const BL0937_FUNCTION_ID = 20;      // _fn 值 - 远程调用功能ID
const BL0937_SENSOR_TYPE = 65523;   // ty 值 - 传感器类型标识

// 状态码定义
const BL0937_CODE = {
    SUCCESS: 0,                     // 成功
    INVALID_OP: 201,                // 无效的操作码
    NOT_INITIALIZED: 241,           // 传感器未初始化
    INVALID_VRATE: 242,             // 无效的电压校准系数
    INVALID_CRATE: 243,             // 无效的电流校准系数
    INVALID_PRATE: 244,             // 无效的功率校准系数
    INVALID_ENERGY: 245,            // 无效的能量值
    FREQ_TOO_LOW: 246,              // 频率太低无法校准
    INVALID_OVERVOLTAGE: 247,       // 无效的过压阈值
    INVALID_OVERCURRENT: 248,       // 无效的过流阈值
    INVALID_RESET_TYPE: 249         // 无效的重置类型
};

var bl0937 = {
    
    // ==================== 基础数据读取 ====================
    
    /**
     * 读取传感器当前数据
     * 获取实时的电压、电流、功率、能量等参数
     * 
     * @returns {Object} 返回原始数据对象:
     *   - code: 状态码，0表示成功
     *   - v: 电压值 * 1000 (单位: V)
     *   - c: 电流值 (单位: mA)
     *   - p: 功率值 * 1000 (单位: W)
     *   - ek: 已存储的历史电能 * 100000 (单位: kWh) [注意：乘以100000]
     *   - tp: 总脉冲计数 (原始累计脉冲数)
     *   - ep: 当前运行总电能 * 100000 (单位: kWh) [注意：乘以100000]
     *   - vr: 电压校准系数 * 1000
     *   - cr: 电流校准系数 * 1000
     *   - pr: 功率校准系数 * 1000
     *   - pf: 功率频率 * 1000 (单位: Hz)
     *   - vf: 电压频率 * 1000 (单位: Hz)
     *   - cf: 电流频率 * 1000 (单位: Hz)
     *   - mode: 当前测量模式，0=电压模式，1=电流模式
     *   - ov: 过压保护阈值 * 1000 (单位: V)
     *   - oc: 过流保护阈值 (单位: mA)
     *   - pe: 保护功能是否启用 (布尔值)
     * 
     * @example
     * // 读取数据并转换为实际值
     * var data = bl0937.readSensorData();
     * if (data.code === 0) {
     *   var voltage = data.v / 1000;          // 转换为V
     *   var current = data.c;                  // 已经是mA
     *   var power = data.p / 1000;             // 转换为W
     *   var energy = data.ek / 100000;         // 转换为kWh
     *   console.info("当前电压: " + voltage + "V");
     * }
     */
    readSensorData: function() {
        return jm.s({
            "_fn": BL0937_FUNCTION_ID,
            "ty": BL0937_SENSOR_TYPE,
            "op": 1
        });
    },
    
    /**
     * 检查传感器是否已初始化
     * 
     * @returns {boolean} true表示传感器已初始化并可用
     * 
     * @example
     * if (bl0937.isSensorInitialized()) {
     *   console.info("BL0937传感器已就绪");
     * } else {
     *   console.warn("BL0937传感器未初始化");
     * }
     */
    isSensorInitialized: function() {
        var result = jm.s({
            "_fn": BL0937_FUNCTION_ID,
            "ty": BL0937_SENSOR_TYPE,
            "op": 2
        });
        return result && result.code === 0 && result.v === true;
    },
    
    // ==================== 配置管理 ====================
    
    /**
     * 更新传感器配置参数
     * 可单独更新任意参数，未提供的参数保持原值
     * 
     * @param {Object} config 配置对象，所有参数可选
     * @param {number} [config.voltageRatio] - 电压校准系数 * 1000，范围1-10000 (0.001-10.0)
     * @param {number} [config.currentRatio] - 电流校准系数 * 1000，范围1-10000 (0.001-10.0)
     * @param {number} [config.powerRatio] - 功率校准系数 * 1000，范围1-10000 (0.001-10.0)
     * @param {number} [config.storedEnergy] - 已存储电能 * 1000 (单位: kWh)
     * @param {number} [config.overvoltage] - 过压保护阈值 * 1000，范围1-400000 (0.001V-400V)
     * @param {number} [config.overcurrent] - 过流保护阈值 (单位: mA)，范围1-15000 (1mA-15A)
     * @param {boolean} [config.protectionEnabled] - 是否启用保护功能
     * @returns {Object} 返回更新后的完整配置
     *   - code: 状态码，0表示成功
     *   - vr: 更新后的电压校准系数
     *   - cr: 更新后的电流校准系数
     *   - pr: 更新后的功率校准系数
     *   - ek: 更新后的存储电能
     *   - ov: 更新后的过压阈值
     *   - oc: 更新后的过流阈值
     *   - pe: 更新后的保护使能状态
     * 
     * @example
     * // 只更新电压校准系数
     * var result = bl0937.updateConfiguration({
     *   voltageRatio: 800,        // 设置为0.800
     *   protectionEnabled: true   // 启用保护
     * });
     * if (result.code === 0) {
     *   console.info("配置更新成功");
     * }
     */
    updateConfiguration: function(config) {
        var params = {
            "_fn": BL0937_FUNCTION_ID,
            "ty": BL0937_SENSOR_TYPE,
            "op": 3
        };
        
        /* if (config.voltageRatio !== undefined) params["vr"] = config.voltageRatio;
        if (config.currentRatio !== undefined) params["cr"] = config.currentRatio;
        if (config.powerRatio !== undefined) params["pr"] = config.powerRatio; 
		if (config.storedEnergy !== undefined) params["ek"] = config.storedEnergy;
		*/
        
        if (config.overvoltage !== undefined) params["ov"] = config.overvoltage;
        if (config.overcurrent !== undefined) params["oc"] = config.overcurrent;
        if (config.protectionEnabled !== undefined) params["pe"] = config.protectionEnabled;
        
        return jm.s(params);
    },
    
    /**
     * 获取当前传感器完整配置
     * 
     * @returns {Object} 返回当前所有配置参数:
     *   - code: 状态码
     *   - vr: 电压校准系数 * 1000
     *   - cr: 电流校准系数 * 1000
     *   - pr: 功率校准系数 * 1000
     *   - ek: 已存储电能 * 1000 (单位: kWh)
     *   - ov: 过压保护阈值 * 1000 (单位: V)
     *   - oc: 过流保护阈值 (单位: mA)
     *   - pe: 保护功能是否启用 (boolean)
     * 
     * @example
     * var config = bl0937.getCurrentConfiguration();
     * console.info("当前校准参数:");
     * console.info("  电压系数: " + (config.vr / 1000).toFixed(3));
     * console.info("  电流系数: " + (config.cr / 1000).toFixed(3));
     * console.info("  功率系数: " + (config.pr / 1000).toFixed(3));
     */
    getCurrentConfiguration: function() {
        return jm.s({
            "_fn": BL0937_FUNCTION_ID,
            "ty": BL0937_SENSOR_TYPE,
            "op": 5
        });
    },
    
    /**
     * 恢复默认校准参数
     * 恢复为出厂校准值：电压0.770，电流0.830，功率0.750
     * 不影响其他配置（存储电能、保护设置等）
     * 
     * @returns {Object} 返回恢复后的校准参数:
     *   - code: 状态码
     *   - vr: 默认电压校准系数 * 1000 (770)
     *   - cr: 默认电流校准系数 * 1000 (830)
     *   - pr: 默认功率校准系数 * 1000 (750)
     * 
     * @example
     * var result = bl0937.restoreDefaultCalibration();
     * if (result.code === 0) {
     *   console.info("已恢复默认校准参数");
     * }
     */
    restoreDefaultCalibration: function() {
        return jm.s({
            "_fn": BL0937_FUNCTION_ID,
            "ty": BL0937_SENSOR_TYPE,
            "op": 11
        });
    },
    
    // ==================== 电能管理 ====================
    
    /**
     * 重置电能累计值
     * 提供两种重置方式
     * 
     * @param {number} [resetType=0] 重置类型:
     *   0 - 重置总能量（历史存储电能和当前运行电能都清零）
     *   1 - 仅重置当前电能，将当前累计电能合并到历史总电能中
     * @returns {Object} 返回操作结果:
     *   - code: 状态码，0表示成功
     * 
     * @example
     * // 完全重置电能
     * bl0937.resetEnergy(0);
     * 
     * // 仅重置当前电能，保留历史记录
     * bl0937.resetEnergy(1);
     */
    resetEnergy: function(resetType) {
        resetType = resetType || 0;
        var result = jm.s({
            "_fn": BL0937_FUNCTION_ID,
            "ty": BL0937_SENSOR_TYPE,
            "op": 4,
            "rt": resetType
        });
        return result || { code: -1 };
    },
    
    // ==================== 校准功能 ====================
    
    /**
     * 校准电压测量
     * 需要输入实际电压值进行校准
     * 
     * @param {number} actualVoltage 实际电压值 * 1000 (单位: V)
     * @returns {Object} 返回校准结果:
     *   - code: 状态码，0表示成功，246表示频率太低无法校准
     *   - vr: 新的电压校准系数 * 1000
     *   - old_vr: 旧的电压校准系数 * 1000
     *   - K: 校准常数 * 10000
     *   - freq: 测量到的频率 * 1000 (单位: Hz)
     *   - mode: 当前测量模式
     *   - prev_mode: 之前的测量模式
     * 
     * @example
     * // 假设万用表测得实际电压为220V
     * var result = bl0937.calibrateVoltage(bl0937.toTransmitValue(220));
     * if (result.code === 0) {
     *   console.info("电压校准成功，新系数: " + result.vr);
     * }
     */
    calibrateVoltage: function(actualVoltage) {
        return jm.s({
            "_fn": BL0937_FUNCTION_ID,
            "ty": BL0937_SENSOR_TYPE,
            "op": 7,
            "value": actualVoltage
        });
    },
    
    /**
     * 校准电流测量
     * 需要输入实际电流值进行校准
     * 
     * @param {number} actualCurrent 实际电流值 * 1000 (单位: A)
     * @returns {Object} 返回校准结果:
     *   - code: 状态码，0表示成功，246表示频率太低无法校准
     *   - cr: 新的电流校准系数 * 1000
     *   - old_cr: 旧的电流校准系数 * 1000
     *   - K: 校准常数 * 10000
     *   - freq: 测量到的频率 * 1000 (单位: Hz)
     *   - mode: 当前测量模式
     *   - prev_mode: 之前的测量模式
     * 
     * @example
     * // 假设钳形表测得实际电流为5A
     * var result = bl0937.calibrateCurrent(bl0937.toTransmitValue(5));
     * if (result.code === 0) {
     *   console.info("电流校准成功，新系数: " + result.cr);
     * }
     */
    calibrateCurrent: function(actualCurrent) {
        return jm.s({
            "_fn": BL0937_FUNCTION_ID,
            "ty": BL0937_SENSOR_TYPE,
            "op": 8,
            "value": actualCurrent
        });
    },
    
    /**
     * 校准功率测量
     * 需要输入实际功率值进行校准
     * 
     * @param {number} actualPower 实际功率值 * 1000 (单位: W)
     * @returns {Object} 返回校准结果:
     *   - code: 状态码，0表示成功，246表示频率太低无法校准
     *   - pr: 新的功率校准系数 * 1000
     *   - old_pr: 旧的功率校准系数 * 1000
     *   - K: 校准常数 * 10000
     *   - freq: 测量到的频率 * 1000 (单位: Hz)
     * 
     * @example
     * // 假设功率计测得实际功率为1100W
     * var result = bl0937.calibratePower(bl0937.toTransmitValue(1100));
     * if (result.code === 0) {
     *   console.info("功率校准成功，新系数: " + result.pr);
     * }
     */
    calibratePower: function(actualPower) {
        return jm.s({
            "_fn": BL0937_FUNCTION_ID,
            "ty": BL0937_SENSOR_TYPE,
            "op": 9,
            "value": actualPower
        });
    },
    
    // ==================== 保护功能 ====================
    
    /**
     * 设置过流过压保护功能
     * 
     * @param {boolean} enable true启用保护，false禁用保护
     * @returns {Object} 返回操作结果:
     *   - code: 状态码，0表示成功
     *   - pe: 更新后的保护状态
     * 
     * @example
     * // 启用保护
     * bl0937.setProtection(true);
     * 
     * // 禁用保护
     * bl0937.setProtection(false);
     */
    setProtection: function(enable) {
        var result = jm.s({
            "_fn": BL0937_FUNCTION_ID,
            "ty": BL0937_SENSOR_TYPE,
            "op": 10,
            "value": enable ? 1 : 0
        });
        return result || { code: -1 };
    },
    
    // ==================== OLED控制 ====================
    
    /**
     * 控制OLED显示
     * 仅当设备配置了OLED显示屏时有效
     * 
     * @param {boolean} enable true启用OLED显示，false禁用
     * @returns {Object} 返回操作结果
     * 
     * @example
     * // 关闭OLED显示（省电）
     * bl0937.setOledDisplay(false);
     */
    setOledDisplay: function(enable) {
        return jm.s({
            "_fn": BL0937_FUNCTION_ID,
            "ty": BL0937_SENSOR_TYPE,
            "op": 12,
            "e": enable
        });
    },
    
    // ==================== 工具函数 ====================
    
    /**
     * 将实际值转换为传输值（乘以1000）
     * 适用于电压、电流、功率、校准系数等
     * 
     * @param {number} actualValue 实际值
     * @returns {number} 传输值（实际值 * 1000）
     * 
     * @example
     * var transmit = bl0937.toTransmitValue(220.5); // 返回220500
     */
    toTransmitValue: function(actualValue) {
        return Math.round(actualValue * 1000);
    },
    
    /**
     * 将传输值转换为实际值（除以1000）
     * 适用于电压、电流、功率、校准系数等
     * 
     * @param {number} transmitValue 传输值
     * @returns {number} 实际值（传输值 / 1000）
     * 
     * @example
     * var actual = bl0937.toActualValue(220500); // 返回220.5
     */
    toActualValue: function(transmitValue) {
        return transmitValue / 1000;
    },
    
    /**
     * 将能量传输值转换为实际值（除以100000）
     * 能量值使用特殊的倍率（乘以100000）
     * 
     * @param {number} energyTransmit 能量传输值（来自ek或ep字段）
     * @returns {number} 实际能量值 (kWh)
     * 
     * @example
     * var data = bl0937.readSensorData();
     * var energy = bl0937.energyToActual(data.ek); // 转换为kWh
     */
    energyToActual: function(energyTransmit) {
        return energyTransmit / 100000;
    },
    
    /**
     * 将实际能量值转换为传输值（乘以100000）
     * 
     * @param {number} actualEnergy 实际能量值 (kWh)
     * @returns {number} 能量传输值
     */
    energyToTransmit: function(actualEnergy) {
        return Math.round(actualEnergy * 100000);
    },

};

// 创建别名以便快速访问
var BL0937 = bl0937;

// 导出模块（如果环境支持）
//if (typeof module !== 'undefined' && module.exports) {
 //   module.exports = bl0937;
//}