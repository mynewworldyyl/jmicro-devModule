/**
 * 本模块是用于与 MQ 气体传感器进行交互的 JavaScript 接口，参考了 Arduino 相关库的实现。
 * MQ 气体传感器可用于检测不同类型的气体浓度，该模块提供了一系列方法，用于读取传感器数据、检查传感器是否存在、创建传感器实例、停止传感器工作以及启用或禁用传感器监控功能。
 * 
 * 返回值说明：
 * - code: 状态码，0表示成功，其他值表示错误
 *   - 0: 成功
 *   - 200: 缺少mqType参数
 *   - 201: 缺少op参数
 *   - 210: 缺少v参数
 *   - 211: 未知的操作码
 *   - 213: 缺少必要参数(ca/rl/a/b)
 *   - 230: 传感器未找到
 *   - 231: mqList为空
 *   - 232: ESP8266默认创建MQ2失败
 *   - 253: OLED未启用
 * - v: 返回值，可能是布尔值、数值或对象
 * - ppm: 气体浓度值(仅在事件中返回)
 * 使用时方法名称前一定要带上mq.前缀
 * 
 * 常量说明：
 * - mq.GAS_TYPE.GAS      (0) : 燃气类型
 * - mq.GAS_TYPE.ALCOHOL  (1) : 酒精类型
 * - mq.GAS_TYPE.BENZENE  (2) : 苯类型
 * - mq.GAS_TYPE.METHANE  (3) : 甲烷类型
 * - mq.GAS_TYPE.LPG      (4) : LPG类型
 * - mq.GAS_TYPE.NATURAL  (5) : 天然气类型
 * - mq.GAS_TYPE.BUTANE   (6) : 丁烷类型
 * - mq.GAS_TYPE.CO       (7) : 一氧化碳类型
 * - mq.GAS_TYPE.HYDROGEN (8) : 氢气类型
 * - mq.GAS_TYPE.CO2      (9) : 二氧化碳类型
 * 
 * - mq.CODE.SUCCESS              (0)  : 成功
 * - mq.CODE.MISSING_MQ_TYPE      (200): 缺少mqType参数
 * - mq.CODE.MISSING_OP           (201): 缺少op参数
 * - mq.CODE.MISSING_PARAM        (210): 缺少v参数
 * - mq.CODE.UNKNOWN_OP           (211): 未知的操作码
 * - mq.CODE.MISSING_REQUIRED     (213): 缺少必要参数(ca/rl/a/b)
 * - mq.CODE.SENSOR_NOT_FOUND     (230): 传感器未找到
 * - mq.CODE.LIST_EMPTY           (231): mqList为空
 * - mq.CODE.ESP8266_CREATE_FAIL  (232): ESP8266默认创建MQ2失败
 * - mq.CODE.OLED_NOT_ENABLED     (253): OLED未启用
 * 
 * @module MQ系列气体传感器模块
 * @var mq
 * @category sensor
 * @keywords MQ,气体传感器,MQ2,MQ3,MQ4,MQ5,MQ6,MQ7,MQ8,MQ9,MQ135,燃气,酒精,甲烷,一氧化碳,氢气,二氧化碳,浓度,报警,Arduino库
 * @capabilities readMqData,isExistMq,createMq,stopMq,chloop,setAlertConfig,getAlertConfig,setOledEnable
 * @depends 无
 */


let mqid = 20;
let mtype = 5;

var mq = {
    /**
     * 从指定类型的 MQ 气体传感器读取数据。
     * 
     * 该方法会向指定类型的 MQ 气体传感器发送读取请求，并返回读取结果。
     * 
     * @param {number} mqType - MQ 气体传感器的类型编号，用于指定要读取数据的传感器类型。
     * @returns {Object} 返回包含传感器数据的对象
     * @returns {number} returns.code - 状态码，0表示成功
     * @returns {number} returns.v - 气体浓度值(ppm * 1000)
     * @returns {number} returns.vol - 电压值(mV)
     * @returns {number} returns.rv - 参考电压(mV)
     * @returns {number} returns.res - ADC分辨率
     * @returns {number} returns.mt - MQ传感器类型
     * @returns {number} returns.a - 系数a值
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * // 读取MQ-2传感器的数据
     * let data = mq.readMqData(2);
     * if (data.code === 0) {
     *   console.log(`气体浓度: ${data.v/1000} ppm`);
     *   console.log(`电压: ${data.vol/1000} V`);
     * }
     */
    readMqData: function (mqType) {
        let rst = jm.s({ "_fn": mqid, ty: mtype, op: 1, mqType: mqType });
        return rst;
    },

    /**
     * 检查指定类型的 MQ 气体传感器是否存在。
     * 
     * 该方法会向系统查询指定类型的 MQ 气体传感器是否已被识别和连接。
     * 
     * @param {number} mqType - MQ 气体传感器的类型编号，用于指定要检查的传感器类型。
     * @returns {boolean} - 如果传感器存在，返回 true；否则返回 false。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * if (mq.isExistMq(2)) {
     *   console.log("MQ-2传感器已连接");
     * }
     */
    isExistMq: function (mqType) {
        let rst = jm.s({ "_fn": mqid, ty: mtype, op: 2, mqType: mqType });
        return rst ? rst.v : false;
    },

    /**
     * 创建指定类型的 MQ 气体传感器实例。
     * 
     * 该方法会初始化指定类型的 MQ 气体传感器，并将其连接到指定的引脚。
     * 
     * @param {number} mqType - MQ 气体传感器的类型编号，用于指定要创建的传感器类型。
     * @param {number} pin - 传感器所连接的引脚编号，用于指定传感器与硬件的连接位置。
     * @param {number} ratioCleanAir - 洁净空气中的校准值 (单位: 千分之一，例如 9830 表示 9.83)
     * @param {number} a - 传感器的系数a (单位: 千分之一，例如 44771000 表示 44771)
     * @param {number} b - 传感器的系数b (单位: 千分之一，例如 -3245 表示 -3.245)
     * @param {number} rl - 负载电阻值 (单位: 千分之一，例如 1000 表示 1.0)
     * @param {Object} options - 可选配置参数
     * @param {number} options.warning - 警告阈值 (ppm * 1000)
     * @param {number} options.danger - 危险阈值 (ppm * 1000)
     * @param {boolean} options.enable - 是否启用报警
     * @param {number} options.gasType - 气体类型 (0=燃气,1=酒精,2=苯,3=甲烷,4=LPG,5=天然气,6=丁烷,7=一氧化碳,8=氢气,9=二氧化碳)
     * @returns {number} - 返回状态码，0表示成功
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * // 创建MQ-2传感器，用于检测燃气
     * let code = mq.createMq(2, A0, 9830, 44771000, -3245, 1000, {
     *   warning: 5000,   // 5ppm警告
     *   danger: 10000,   // 10ppm危险
     *   enable: true,
     *   gasType: 0       // 燃气
     * });
     */
    createMq: function (mqType, pin, ratioCleanAir, a, b, rl, options) {
        let params = { 
            "_fn": mqid, 
            ty: mtype, 
            op: 3, 
            mqType: mqType, 
            p: pin, 
            "ca": ratioCleanAir, 
            "a": a, 
            "b": b, 
            "rl": rl 
        };
        
        // 添加可选参数
        if (options) {
            if (options.warning) params.n = options.warning;
            if (options.danger) params.w = options.danger;
            if (options.enable ) params.e = options.enable;
            if (options.gasType) params.t = options.gasType;
        }
        
        let rst = jm.s(params);
        return rst ? rst.code : null;
    },

    /**
     * 停止指定类型的 MQ 气体传感器的工作。
     * 
     * 该方法会向指定类型的 MQ 气体传感器发送停止工作的指令。
     * 
     * @param {number} mqType - MQ 气体传感器的类型编号，用于指定要停止工作的传感器类型。
     * @returns {number} - 返回状态码，0表示成功
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * mq.stopMq(2); // 停止MQ-2传感器
     */
    stopMq: function (mqType) {
        let rst = jm.s({ "_fn": mqid, ty: mtype, op: 4, mqType: mqType });
        return rst ? rst.code : null;
    },

    /**
     * 启用或禁用 MQ 气体传感器的监控功能。
     * 
     * 当需要在 JavaScript 端进行监控时，建议禁用底层的监控功能，以避免数据冲突。
     * 
     * @param {boolean} enable - true 表示启用监控功能，false 表示禁用监控功能。
     * @returns {number} - 返回状态码，0表示成功
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * mq.chloop(false); // 禁用底层监控
     */
    chloop: function (enable) {
        let rst = jm.s({ "_fn": mqid, ty: mtype, op: 5, v: enable });
        return rst ? rst.code : null;
    },

    /**
     * 设置 MQ 气体传感器的报警配置。
     * 
     * 配置传感器的警告阈值、危险阈值和报警开关状态。
     * 
     * @param {number} mqType - MQ 气体传感器的类型编号。
     * @param {Object} config - 报警配置对象
     * @param {number} config.warning - 警告阈值 (ppm * 1000)
     * @param {number} config.danger - 危险阈值 (ppm * 1000)
     * @param {boolean} config.enable - 是否启用报警功能
     * @param {number} config.gasType - 气体类型 (0-9)
     * @returns {number} - 返回状态码，0表示成功
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * // 设置MQ-2传感器的报警阈值
     * mq.setAlertConfig(2, {
     *   warning: 8000,   // 8ppm警告
     *   danger: 15000,   // 15ppm危险
     *   enable: true,
     *   gasType: 0       // 燃气
     * });
     */
    setAlertConfig: function (mqType, config) {
        let params = { 
            "_fn": mqid, 
            ty: mtype, 
            op: 6, 
            mqType: mqType 
        };
        
        if (config) {
            if (config.warning) params.n = config.warning;
            if (config.danger) params.w = config.danger;
            if (config.enable) params.e = config.enable;
            if (config.gasType) params.t = config.gasType;
        }
        
        let rst = jm.s(params);
        return rst ? rst.code : null;
    },

    /**
     * 获取 MQ 气体传感器的报警配置。
     * 
     * 返回当前的警告阈值、危险阈值和报警开关状态。
     * 
     * @param {number} mqType - MQ 气体传感器的类型编号。
     * @returns {Object} - 返回报警配置对象
     * @returns {number} returns.n - 警告阈值 (ppm * 1000)
     * @returns {number} returns.w - 危险阈值 (ppm * 1000)
     * @returns {boolean} returns.e - 是否启用报警功能
     * @returns {number} returns.t - 气体类型
     * @returns {number} returns.code - 状态码，0表示成功
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * let config = mq.getAlertConfig(2);
     * if (config.code === 0) {
     *   console.log(`警告阈值: ${config.n/1000} ppm`);
     *   console.log(`危险阈值: ${config.w/1000} ppm`);
     *   console.log(`报警功能: ${config.e ? '已启用' : '已禁用'}`);
     *   console.log(`气体类型: ${config.t}`);
     * }
     */
    getAlertConfig: function (mqType) {
        let rst = jm.s({ "_fn": mqid, ty: mtype, op: 7, mqType: mqType });
        return rst;
    },

    /**
     * 启用或禁用 MQ 传感器的 OLED 显示。
     * 
     * @param {boolean} enable - true 表示启用OLED显示，false 表示禁用。
     * @returns {number} - 返回状态码，0表示成功，253表示OLED未启用
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * mq.setOledEnable(true); // 启用OLED显示
     */
    setOledEnable: function (enable) {
        let rst = jm.s({ "_fn": mqid, ty: mtype, op: 8, e: enable });
        return rst ? rst.code : null;
    },

    // 气体类型常量定义
    GAS_TYPE: {
        GAS: 0,      // 燃气
        ALCOHOL: 1,  // 酒精
        BENZENE: 2,  // 苯
        METHANE: 3,  // 甲烷
        LPG: 4,      // LPG
        NATURAL: 5,  // 天然气
        BUTANE: 6,   // 丁烷
        CO: 7,       // 一氧化碳
        HYDROGEN: 8, // 氢气
        CO2: 9       // 二氧化碳
    },

    // 状态码常量定义
    CODE: {
        SUCCESS: 0,
        MISSING_MQ_TYPE: 200,
        MISSING_OP: 201,
        MISSING_PARAM: 210,
        UNKNOWN_OP: 211,
        MISSING_REQUIRED: 213,
        SENSOR_NOT_FOUND: 230,
        LIST_EMPTY: 231,
        ESP8266_CREATE_FAIL: 232,
        OLED_NOT_ENABLED: 253
    }
};

// 气体类型名称映射
mq.GAS_TYPE_NAME = {
    [mq.GAS_TYPE.GAS]: "燃气",
    [mq.GAS_TYPE.ALCOHOL]: "酒精",
    [mq.GAS_TYPE.BENZENE]: "苯",
    [mq.GAS_TYPE.METHANE]: "甲烷",
    [mq.GAS_TYPE.LPG]: "LPG",
    [mq.GAS_TYPE.NATURAL]: "天然气",
    [mq.GAS_TYPE.BUTANE]: "丁烷",
    [mq.GAS_TYPE.CO]: "一氧化碳",
    [mq.GAS_TYPE.HYDROGEN]: "氢气",
    [mq.GAS_TYPE.CO2]: "二氧化碳"
};

//exports = mq
