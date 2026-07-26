/**
 * BLE Gamepad 蓝牙游戏柄模块
 * 
 * 本模块提供了蓝牙游戏柄功能的 JS API，基于 BleGamepad 底层 C 接口实现。
 * 支持创建多实例、按钮、摇杆、扳机、方向键(Hat)、陀螺仪、加速度计、
 * 电源管理、配对管理等完整功能。
 * 
 * 所有方法返回值说明（统一字段）：
 * 返回值是一个对象，包含以下字段：
 * - code (number): 操作结果码，0 表示成功，非 0 表示失败。
 *   常见错误码：
 *   1: 缺少操作码(op)参数
 *   2: 创建实例时缺少设备索引(idx)参数
 *   3: 指定索引的蓝牙游戏柄实例不存在
 *   6: 不支持的操作码
 * - v (any): 查询类操作的返回值，仅在查询方法中有效。
 *   对于设置类操作，通常不包含 v 字段。
 * - c (bool): 蓝牙游戏柄当前是否已连接 (isConnected 状态)。
 *   注：对于 create/end/kill 操作，会返回操作后的连接状态；
 *      对于其他操作，会返回操作时的连接状态。
 * 
 * @module BLE Gamepad 蓝牙游戏柄模块
 * @var bleGamepad
 * @category bluetooth
 * @keywords BLE,蓝牙,游戏柄,蓝牙游戏柄,无线游戏柄,HID,手柄,joypad,摇杆,扳机
 * @capabilities create,end,kill,press,release,isPressed,pressSpecialButton,releaseSpecialButton,setLeftThumb,setRightThumb,setTriggers,setAxes,setHats,setHat1,setHat2,setHat3,setHat4,setX,setY,setZ,setRX,setRY,setRZ,setSlider1,setSlider2,setSliders,setRudder,setThrottle,setAccelerator,setBrake,setSteering,setSimulationControls,setGyroscope,setAccelerometer,setMotionControls,sendReport,resetButtons,isConnected,setBatteryLevel,setTXPowerLevel,deleteBond,deleteAllBonds,enterPairingMode,isOutputReceived,getDeviceName,getDeviceManufacturer,setPowerStateAll,setBatteryPowerInformation,setDischargingState,setChargingState,setPowerLevel,configure
 * @depends 无
 */

let bleGamepadType = 65517;
let bleGamepadDefId = 20;

var bleGamepad = {
    // ================================================================
    //  按钮常量 (Buttons)
    // ================================================================
    /** 全部常量能过bleGamepad.访问，按钮 1 (通常 A/Cross) */
    BUTTON_1: 1,
    /** 按钮 2 (通常 B/Circle) */
    BUTTON_2: 2,
    /** 按钮 3 (通常 X/Square) */
    BUTTON_3: 3,
    /** 按钮 4 (通常 Y/Triangle) */
    BUTTON_4: 4,
    /** 按钮 5 (通常 LB / L1) */
    BUTTON_5: 5,
    /** 按钮 6 (通常 RB / R1) */
    BUTTON_6: 6,
    /** 按钮 7 (通常 LT / L2) */
    BUTTON_7: 7,
    /** 按钮 8 (通常 RT / R2) */
    BUTTON_8: 8,
    /** 按钮 9 (通常 Back / Select) */
    BUTTON_9: 9,
    /** 按钮 10 (通常 Start) */
    BUTTON_10: 10,
    /** 按钮 11 (通常 L3 / 左摇杆按下) */
    BUTTON_11: 11,
    /** 按钮 12 (通常 R3 / 右摇杆按下) */
    BUTTON_12: 12,
    /** 按钮 13 (通常 D-pad Up) */
    BUTTON_13: 13,
    /** 按钮 14 (通常 D-pad Down) */
    BUTTON_14: 14,
    /** 按钮 15 (通常 D-pad Left) */
    BUTTON_15: 15,
    /** 按钮 16 (通常 D-pad Right) */
    BUTTON_16: 16,
    /** 按钮 17 (通常 Home / Guide) */
    BUTTON_17: 17,

    // ================================================================
    //  特殊按钮常量 (Special Buttons)
    //  用于 pressSpecialButton() / releaseSpecialButton() 的 sb 参数
    // ================================================================
    /** Start 按钮 */
    SPECIAL_START: 0,
    /** Select 按钮 */
    SPECIAL_SELECT: 1,
    /** Menu 按钮 */
    SPECIAL_MENU: 2,
    /** Home 按钮 */
    SPECIAL_HOME: 3,
    /** Back 按钮 */
    SPECIAL_BACK: 4,
    /** Volume Inc 音量增加按钮 */
    SPECIAL_VOL_INC: 5,
    /** Volume Dec 音量减少按钮 */
    SPECIAL_VOL_DEC: 6,
    /** Volume Mute 静音按钮 */
    SPECIAL_VOL_MUTE: 7,

    // ================================================================
    //  方向键/ Hat Switch 常量 (Hat Switch)
    //  用于 setHats() / setHat1() ~ setHat4() 的 h 参数
    // ================================================================
    /** Hat 释放/中位 */
    HAT_NULL: -1,
    /** Hat 上 */
    HAT_UP: 0,
    /** Hat 右上 */
    HAT_UP_RIGHT: 1,
    /** Hat 右 */
    HAT_RIGHT: 2,
    /** Hat 右下 */
    HAT_DOWN_RIGHT: 3,
    /** Hat 下 */
    HAT_DOWN: 4,
    /** Hat 左下 */
    HAT_DOWN_LEFT: 5,
    /** Hat 左 */
    HAT_LEFT: 6,
    /** Hat 左上 */
    HAT_UP_LEFT: 7,

    // ================================================================
    //  控制器类型常量 (Controller Types)
    //  用于 create() / configure() 的 ctype 参数
    // ================================================================
    /** 默认控制器类型 */
    CTYPE_DEFAULT: 0,
    /** PlayStation 控制器类型 */
    CTYPE_PS: 1,
    /** Xbox 控制器类型 */
    CTYPE_XBOX: 2,
    /** Nintendo Switch 控制器类型 */
    CTYPE_SWITCH: 3,
    /** Android 控制器类型 */
    CTYPE_ANDROID: 4,

    // ================================================================
    //  日志级别常量 (Log Levels)
    // ================================================================
    /** 关闭日志输出 */
    LOG_OFF: 0,
    /** 正常日志 - 连接、配对事件 */
    LOG_NORMAL: 1,
    /** 详细日志 - 包含所有HID报告 */
    LOG_VERBOSE: 2,

    // ================================================================
    //  API 方法
    // ================================================================

    /**
     * 创建蓝牙游戏柄实例并开始广播。
     * 创建成功后设备会进入可配对状态，等待主机连接。
     * 
     * 可选的配置参数可在创建时通过额外参数传入。配置字段说明见下方：
     * 
     * @param {number} idx - 设备索引，必传。用于区分多个游戏柄实例（0-255）。
     * @param {string} [name] - 设备名称，默认为 "JMicro Gamepad"，最大29字符。
     * @param {string} [mfr] - 制造商名称，默认为 "JMicro"，最大512字符。
     * @param {number} [level] - 初始电池电量百分比，默认为 100，范围 1-100。
     * @param {Object} [cfg] - 额外配置对象（可选，第5个参数），所有字段均为可选：
     *   - {number} [cfg.btn] - 按钮数量，默认 16，范围 1-128。
     *   - {number} [cfg.hat] - Hat Switch 数量，默认 1，范围 0-4。
     *   - {number} [cfg.ctype] - 控制器类型，见 CTYPE_* 常量。
     *   - {boolean} [cfg.auto] - 是否自动发送报告，默认 true。
     *   - {number} [cfg.vid] - 厂商 ID (VID)。
     *   - {number} [cfg.pid] - 产品 ID (PID)。
     *   - {number} [cfg.gv] - GUID 版本。
     *   - {number} [cfg.axmin] - 轴最小值 (int16)，默认 -32768。
     *   - {number} [cfg.axmax] - 轴最大值 (int16)，默认 32767。
     *   - {number} [cfg.tx] - BLE 发射功率 (dBm)，默认 9，范围 -27 ~ 9。
     *   - {boolean} [cfg.outrpt] - 是否启用输出报告 (Output Report)。
     *   - {number} [cfg.outlen] - 输出报告长度。
     *   - {number} [cfg.sp] - 特殊按钮位掩码，按位组合 SPECIAL_* 常量：
     *     bit0=Start, bit1=Select, bit2=Menu, bit3=Home,
     *     bit4=Back, bit5=VolInc, bit6=VolDec, bit7=VolMute
     *   - {number} [cfg.ax] - 轴位掩码，按位启用轴：
     *     bit0=X, bit1=Y, bit2=Z, bit3=RX, bit4=RY, bit5=RZ, bit6=Slider1, bit7=Slider2
     *   - {number} [cfg.sim] - 模拟控制位掩码，按位启用：
     *     bit0=Rudder, bit1=Throttle, bit2=Accelerator, bit3=Brake, bit4=Steering
     *   - {boolean} [cfg.gyro] - 是否包含陀螺仪，默认 false。
     *   - {boolean} [cfg.acc] - 是否包含加速度计，默认 false。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数。
     *                   - c: true 已连接，false 未连接
     * @example
     * let rst = bleGamepad.create(0, "MyGamepad", "MyCo", 80);
     * if (rst.code === 0) {
     *     console.log("创建成功，已连接:", rst.c);
     * }
     * 
     * // 带配置创建
     * bleGamepad.create(0, "MyGamepad", "MyCo", 80, {
     *     btn: 16,
     *     hat: 1,
     *     ctype: bleGamepad.CTYPE_XBOX,
     *     ax: 0x3F,
     *     sim: 0x1F
     * });
     */
    create: function (idx, name, mfr, level, cfg) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 1, 'idx': idx };
        if (typeof name !== 'undefined') args['name'] = name;
        if (typeof mfr !== 'undefined') args['mfr'] = mfr;
        if (typeof level !== 'undefined') args['l'] = level;
        if (cfg) {
            if (typeof cfg.btn !== 'undefined') args['btn'] = cfg.btn;
            if (typeof cfg.hat !== 'undefined') args['hat'] = cfg.hat;
            if (typeof cfg.ctype !== 'undefined') args['ctype'] = cfg.ctype;
            if (typeof cfg.auto !== 'undefined') args['auto'] = cfg.auto ? 1 : 0;
            if (typeof cfg.vid !== 'undefined') args['vid'] = cfg.vid;
            if (typeof cfg.pid !== 'undefined') args['pid'] = cfg.pid;
            if (typeof cfg.gv !== 'undefined') args['gv'] = cfg.gv;
            if (typeof cfg.axmin !== 'undefined') args['axmin'] = cfg.axmin;
            if (typeof cfg.axmax !== 'undefined') args['axmax'] = cfg.axmax;
            if (typeof cfg.tx !== 'undefined') args['tx'] = cfg.tx;
            if (typeof cfg.outrpt !== 'undefined') args['outrpt'] = cfg.outrpt ? 1 : 0;
            if (typeof cfg.outlen !== 'undefined') args['outlen'] = cfg.outlen;
            if (typeof cfg.sp !== 'undefined') args['sp'] = cfg.sp;
            if (typeof cfg.ax !== 'undefined') args['ax'] = cfg.ax;
            if (typeof cfg.sim !== 'undefined') args['sim'] = cfg.sim;
            if (typeof cfg.gyro !== 'undefined') args['gyro'] = cfg.gyro ? 1 : 0;
            if (typeof cfg.acc !== 'undefined') args['acc'] = cfg.acc ? 1 : 0;
        }
        return jm.s(args);
    },

    /**
     * 结束蓝牙游戏柄实例（暂停）。
     * 停止广播并断开连接，但保留资源以便快速重启。
     * 调用 create() 可重新开始广播。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接 (操作后状态)
     * @example
     * let rst = bleGamepad.end(0);
     * console.log("结束后的连接状态:", rst.c);
     */
    end: function (idx) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 2, 'idx': idx });
    },

    /**
     * 永久销毁蓝牙游戏柄实例。
     * 断开连接、释放所有资源，无法再次启动。
     * 如需暂停/恢复请使用 end()。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: false (实例已销毁，未连接)
     * @example
     * bleGamepad.kill(0);
     */
    kill: function (idx) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 3, 'idx': idx });
    },

    /**
     * 按下游戏柄按钮。
     * 按键会保持按下状态，直到调用 release() 或 resetButtons()。
     * 
     * 按钮常量 (Buttons) - 用于 b 参数：
     * BUTTON_1(1)~BUTTON_17(17) 为标准映射按钮，BUTTON_18~BUTTON_128 为扩展按钮。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} b - 按钮 ID，必传。使用 BUTTON_* 常量。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     * @example
     * // 按下按钮 1 (通常 A/Cross)
     * bleGamepad.press(0, bleGamepad.BUTTON_1);
     * 
     * // 按下 LB (L1)
     * bleGamepad.press(0, bleGamepad.BUTTON_5);
     */
    press: function (idx, b) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 4, 'idx': idx, 'b': b };
        return jm.s(args);
    },

    /**
     * 释放游戏柄按钮。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} b - 按钮 ID，必传。使用 BUTTON_* 常量。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     * @example
     * // 释放按钮 1 (通常 A/Cross)
     * bleGamepad.release(0, bleGamepad.BUTTON_1);
     */
    release: function (idx, b) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 5, 'idx': idx, 'b': b });
    },

    /**
     * 查询按钮是否处于按下状态。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} b - 按钮 ID，必传。使用 BUTTON_* 常量。
     * @returns {Promise<boolean>} true 已按下，false 未按下。
     * @example
     * if ( bleGamepad.isPressed(0, bleGamepad.BUTTON_1)) {
     *     console.log("按钮 1 已按下");
     * }
     * 
     * @async
     */
    isPressed: async function (idx, b) {
        var rst = await jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 6, 'idx': idx, 'b': b });
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 按下特殊按钮。
     * 特殊按钮常量 (Special Buttons) - 用于 sb 参数：
     * SPECIAL_START(0), SPECIAL_SELECT(1), SPECIAL_MENU(2), SPECIAL_HOME(3),
     * SPECIAL_BACK(4), SPECIAL_VOL_INC(5), SPECIAL_VOL_DEC(6), SPECIAL_VOL_MUTE(7)
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} sb - 特殊按钮 ID，必传。使用 SPECIAL_* 常量。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     * @example
     * bleGamepad.pressSpecialButton(0, bleGamepad.SPECIAL_START);
     * bleGamepad.pressSpecialButton(0, bleGamepad.SPECIAL_HOME);
     */
    pressSpecialButton: function (idx, sb) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 7, 'idx': idx, 'sb': sb };
        return jm.s(args);
    },

    /**
     * 释放特殊按钮。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} sb - 特殊按钮 ID，必传。使用 SPECIAL_* 常量。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     * @example
     * bleGamepad.releaseSpecialButton(0, bleGamepad.SPECIAL_START);
     */
    releaseSpecialButton: function (idx, sb) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 8, 'idx': idx, 'sb': sb };
        return jm.s(args);
    },

    /**
     * 同时设置左摇杆 X 和 Y 轴。
     * 典型范围：-32768 ~ 32767 (int16)，0 为中心值。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} x - X 轴值，必传。0 为中心，负数向左，正数向右。
     * @param {number} y - Y 轴值，必传。0 为中心，负数向上，正数向下。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     * @example
     * bleGamepad.setLeftThumb(0, 16000, -16000);
     */
    setLeftThumb: function (idx, x, y) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 9, 'idx': idx, 'x': x, 'y': y };
        return jm.s(args);
    },

    /**
     * 同时设置右摇杆 Z 和 rZ 轴。
     * 典型范围：-32768 ~ 32767 (int16)，0 为中心值。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} z - Z 轴值，必传。0 为中心，负数向左，正数向右。
     * @param {number} rZ - rZ 轴值，必传。0 为中心，负数向上，正数向下。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     * @example
     * bleGamepad.setRightThumb(0, 16000, 16000);
     */
    setRightThumb: function (idx, z, rZ) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 10, 'idx': idx, 'z': z, 'rZ': rZ };
        return jm.s(args);
    },

    /**
     * 同时设置左右扳机 (Triggers)。
     * 典型范围：0 ~ 32767 (int16)，0 为未按下，最大值表示完全按下。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} rX - 左扳机 (LT) 值，必传。0=释放，32767=完全按下。
     * @param {number} rY - 右扳机 (RT) 值，必传。0=释放，32767=完全按下。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     * @example
     * bleGamepad.setTriggers(0, 32767, 16384);
     */
    setTriggers: function (idx, rX, rY) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 11, 'idx': idx, 'rX': rX, 'rY': rY };
        return jm.s(args);
    },

    /**
     * 同时设置所有 8 个轴。
     * 轴编号：x,y=左摇杆；z,rZ=右摇杆；rX,rY=扳机；sl1,sl2=滑条。
     * 典型范围：-32768 ~ 32767 (int16)，0 为中心值（扳机除外）。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} [x] - X 轴值，默认 0。
     * @param {number} [y] - Y 轴值，默认 0。
     * @param {number} [z] - Z 轴值，默认 0。
     * @param {number} [rX] - rX 轴值，默认 0。
     * @param {number} [rY] - rY 轴值，默认 0。
     * @param {number} [rZ] - rZ 轴值，默认 0。
     * @param {number} [sl1] - Slider1 轴值，默认 0。
     * @param {number} [sl2] - Slider2 轴值，默认 0。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     * @example
     * bleGamepad.setAxes(0, 1000, -2000, 0, 30000, 0, 0, 0, 0);
     */
    setAxes: function (idx, x, y, z, rX, rY, rZ, sl1, sl2) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 12, 'idx': idx };
        if (typeof x !== 'undefined') args['x'] = x;
        if (typeof y !== 'undefined') args['y'] = y;
        if (typeof z !== 'undefined') args['z'] = z;
        if (typeof rX !== 'undefined') args['rX'] = rX;
        if (typeof rY !== 'undefined') args['rY'] = rY;
        if (typeof rZ !== 'undefined') args['rZ'] = rZ;
        if (typeof sl1 !== 'undefined') args['sl1'] = sl1;
        if (typeof sl2 !== 'undefined') args['sl2'] = sl2;
        return jm.s(args);
    },

    /**
     * 同时设置所有 4 个 Hat Switch（方向键）。
     * Hat 方向值：HAT_NULL(-1) 中位；HAT_UP(0)~HAT_UP_LEFT(7) 八个方向。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} [h1] - Hat1 值，默认 0。
     * @param {number} [h2] - Hat2 值，默认 0。
     * @param {number} [h3] - Hat3 值，默认 0。
     * @param {number} [h4] - Hat4 值，默认 0。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     * @example
     * bleGamepad.setHats(0, bleGamepad.HAT_UP, -1, -1, -1);
     */
    setHats: function (idx, h1, h2, h3, h4) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 13, 'idx': idx };
        if (typeof h1 !== 'undefined') args['h1'] = h1;
        if (typeof h2 !== 'undefined') args['h2'] = h2;
        if (typeof h3 !== 'undefined') args['h3'] = h3;
        if (typeof h4 !== 'undefined') args['h4'] = h4;
        return jm.s(args);
    },

    /**
     * 设置 Hat Switch 1（方向键 1）。
     * @param {number} idx - 设备索引，必传。
     * @param {number} h - Hat 值，必传。使用 HAT_* 常量。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setHat1(0, bleGamepad.HAT_UP);
     */
    setHat1: function (idx, h) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 14, 'idx': idx, 'h1': h });
    },

    /**
     * 设置 Hat Switch 2（方向键 2）。
     * @param {number} idx - 设备索引，必传。
     * @param {number} h - Hat 值，必传。使用 HAT_* 常量。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setHat2(0, bleGamepad.HAT_RIGHT);
     */
    setHat2: function (idx, h) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 15, 'idx': idx, 'h2': h });
    },

    /**
     * 设置 Hat Switch 3（方向键 3）。
     * @param {number} idx - 设备索引，必传。
     * @param {number} h - Hat 值，必传。使用 HAT_* 常量。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setHat3(0, bleGamepad.HAT_DOWN);
     */
    setHat3: function (idx, h) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 16, 'idx': idx, 'h3': h });
    },

    /**
     * 设置 Hat Switch 4（方向键 4）。
     * @param {number} idx - 设备索引，必传。
     * @param {number} h - Hat 值，必传。使用 HAT_* 常量。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setHat4(0, bleGamepad.HAT_LEFT);
     */
    setHat4: function (idx, h) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 17, 'idx': idx, 'h4': h });
    },

    /**
     * 单独设置 X 轴（左摇杆水平）。典型范围：-32768 ~ 32767。
     * @param {number} idx - 设备索引，必传。
     * @param {number} x - X 轴值，必传。0 为中心。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setX(0, 16000);
     */
    setX: function (idx, x) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 18, 'idx': idx, 'x': x });
    },

    /**
     * 单独设置 Y 轴（左摇杆垂直）。典型范围：-32768 ~ 32767。
     * @param {number} idx - 设备索引，必传。
     * @param {number} y - Y 轴值，必传。0 为中心。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setY(0, -16000);
     */
    setY: function (idx, y) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 19, 'idx': idx, 'y': y });
    },

    /**
     * 单独设置 Z 轴（右摇杆水平）。典型范围：-32768 ~ 32767。
     * @param {number} idx - 设备索引，必传。
     * @param {number} z - Z 轴值，必传。0 为中心。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setZ(0, 32000);
     */
    setZ: function (idx, z) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 20, 'idx': idx, 'z': z });
    },

    /**
     * 单独设置 rX 轴（左扳机 LT）。典型范围：0 ~ 32767。
     * @param {number} idx - 设备索引，必传。
     * @param {number} rX - rX 轴值，必传。0=释放，32767=完全按下。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setRX(0, 32767);
     */
    setRX: function (idx, rX) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 21, 'idx': idx, 'rX': rX });
    },

    /**
     * 单独设置 rY 轴（右扳机 RT）。典型范围：0 ~ 32767。
     * @param {number} idx - 设备索引，必传。
     * @param {number} rY - rY 轴值，必传。0=释放，32767=完全按下。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setRY(0, 16384);
     */
    setRY: function (idx, rY) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 22, 'idx': idx, 'rY': rY });
    },

    /**
     * 单独设置 rZ 轴（右摇杆垂直）。典型范围：-32768 ~ 32767。
     * @param {number} idx - 设备索引，必传。
     * @param {number} rZ - rZ 轴值，必传。0 为中心。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setRZ(0, -16000);
     */
    setRZ: function (idx, rZ) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 23, 'idx': idx, 'rZ': rZ });
    },

    /**
     * 单独设置 Slider1 轴。典型范围：-32768 ~ 32767。
     * @param {number} idx - 设备索引，必传。
     * @param {number} sl1 - Slider1 轴值，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setSlider1(0, 20000);
     */
    setSlider1: function (idx, sl1) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 24, 'idx': idx, 'sl1': sl1 });
    },

    /**
     * 单独设置 Slider2 轴。典型范围：-32768 ~ 32767。
     * @param {number} idx - 设备索引，必传。
     * @param {number} sl2 - Slider2 轴值，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setSlider2(0, -20000);
     */
    setSlider2: function (idx, sl2) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 25, 'idx': idx, 'sl2': sl2 });
    },

    /**
     * 同时设置 Slider1 和 Slider2 轴。
     * @param {number} idx - 设备索引，必传。
     * @param {number} sl1 - Slider1 轴值，必传。
     * @param {number} sl2 - Slider2 轴值，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setSliders(0, 15000, -15000);
     */
    setSliders: function (idx, sl1, sl2) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 26, 'idx': idx, 'sl1': sl1, 'sl2': sl2 });
    },

    /**
     * 单独设置 Rudder（方向舵）轴。典型范围：-32768 ~ 32767。
     * @param {number} idx - 设备索引，必传。
     * @param {number} rud - Rudder 值，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setRudder(0, 10000);
     */
    setRudder: function (idx, rud) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 27, 'idx': idx, 'rud': rud });
    },

    /**
     * 单独设置 Throttle（油门）轴。典型范围：0 ~ 32767。
     * @param {number} idx - 设备索引，必传。
     * @param {number} thr - Throttle 值，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setThrottle(0, 20000);
     */
    setThrottle: function (idx, thr) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 28, 'idx': idx, 'thr': thr });
    },

    /**
     * 单独设置 Accelerator（油门踏板）轴。典型范围：0 ~ 32767。
     * @param {number} idx - 设备索引，必传。
     * @param {number} accv - Accelerator 值，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setAccelerator(0, 30000);
     */
    setAccelerator: function (idx, accv) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 29, 'idx': idx, 'accv': accv });
    },

    /**
     * 单独设置 Brake（刹车）轴。典型范围：0 ~ 32767。
     * @param {number} idx - 设备索引，必传。
     * @param {number} brk - Brake 值，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setBrake(0, 16384);
     */
    setBrake: function (idx, brk) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 30, 'idx': idx, 'brk': brk });
    },

    /**
     * 单独设置 Steering（方向盘）轴。典型范围：-32768 ~ 32767。
     * @param {number} idx - 设备索引，必传。
     * @param {number} ste - Steering 值，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setSteering(0, -10000);
     */
    setSteering: function (idx, ste) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 31, 'idx': idx, 'ste': ste });
    },

    /**
     * 同时设置所有模拟控制（飞行/赛车）：Rudder, Throttle, Accelerator, Brake, Steering。
     * @param {number} idx - 设备索引，必传。
     * @param {number} rud - Rudder 值，可选，默认 0。
     * @param {number} thr - Throttle 值，可选，默认 0。
     * @param {number} acc - Accelerator 值，可选，默认 0。
     * @param {number} brk - Brake 值，可选，默认 0。
     * @param {number} ste - Steering 值，可选，默认 0。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setSimulationControls(0, 5000, 10000, 20000, 15000, -5000);
     */
    setSimulationControls: function (idx, rud, thr, acc, brk, ste) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 32, 'idx': idx };
        if (typeof rud !== 'undefined') args['rud'] = rud;
        if (typeof thr !== 'undefined') args['thr'] = thr;
        if (typeof acc !== 'undefined') args['accv'] = acc;
        if (typeof brk !== 'undefined') args['brk'] = brk;
        if (typeof ste !== 'undefined') args['ste'] = ste;
        return jm.s(args);
    },

    /**
     * 设置陀螺仪 (Gyroscope) 三轴数据。
     * @param {number} idx - 设备索引，必传。
     * @param {number} gX - 陀螺仪 X 值，必传。
     * @param {number} gY - 陀螺仪 Y 值，必传。
     * @param {number} gZ - 陀螺仪 Z 值，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setGyroscope(0, 100, -50, 200);
     */
    setGyroscope: function (idx, gX, gY, gZ) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 33, 'idx': idx };
        if (typeof gX !== 'undefined') args['gX'] = gX;
        if (typeof gY !== 'undefined') args['gY'] = gY;
        if (typeof gZ !== 'undefined') args['gZ'] = gZ;
        return jm.s(args);
    },

    /**
     * 设置加速度计 (Accelerometer) 三轴数据。
     * @param {number} idx - 设备索引，必传。
     * @param {number} aX - 加速度计 X 值，必传。
     * @param {number} aY - 加速度计 Y 值，必传。
     * @param {number} aZ - 加速度计 Z 值，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setAccelerometer(0, 512, 0, -512);
     */
    setAccelerometer: function (idx, aX, aY, aZ) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 34, 'idx': idx };
        if (typeof aX !== 'undefined') args['aX'] = aX;
        if (typeof aY !== 'undefined') args['aY'] = aY;
        if (typeof aZ !== 'undefined') args['aZ'] = aZ;
        return jm.s(args);
    },

    /**
     * 同时设置陀螺仪与加速度计六轴数据。
     * @param {number} idx - 设备索引，必传。
     * @param {number} gX - 陀螺仪 X 值，可选，默认 0。
     * @param {number} gY - 陀螺仪 Y 值，可选，默认 0。
     * @param {number} gZ - 陀螺仪 Z 值，可选，默认 0。
     * @param {number} aX - 加速度计 X 值，可选，默认 0。
     * @param {number} aY - 加速度计 Y 值，可选，默认 0。
     * @param {number} aZ - 加速度计 Z 值，可选，默认 0。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setMotionControls(0, 100, 0, 0, 512, 0, 0);
     */
    setMotionControls: function (idx, gX, gY, gZ, aX, aY, aZ) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 35, 'idx': idx };
        if (typeof gX !== 'undefined') args['gX'] = gX;
        if (typeof gY !== 'undefined') args['gY'] = gY;
        if (typeof gZ !== 'undefined') args['gZ'] = gZ;
        if (typeof aX !== 'undefined') args['aX'] = aX;
        if (typeof aY !== 'undefined') args['aY'] = aY;
        if (typeof aZ !== 'undefined') args['aZ'] = aZ;
        return jm.s(args);
    },

    /**
     * 立即发送当前状态报告给主机（在关闭自动上报时手动调用）。
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.sendReport(0);
     */
    sendReport: function (idx) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 36, 'idx': idx });
    },

    /**
     * 释放所有已按下的按钮（普通按钮）。
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.resetButtons(0);
     */
    resetButtons: function (idx) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 37, 'idx': idx });
    },

    /**
     * 查询蓝牙游戏柄是否已连接到主机（GAP层）。
     * @param {number} idx - 设备索引，必传。
     * @returns {Promise<boolean>} true 已连接，false 未连接。
     * @example
     * if ( bleGamepad.isConnected(0)) {
     *     console.log("蓝牙游戏柄已连接");
     * }
     * @async
     */
    isConnected: async function (idx) {
        var rst = await jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 38, 'idx': idx });
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 设置电池电量（更新蓝牙电池服务）。
     * @param {number} idx - 设备索引，必传。
     * @param {number} l - 电池电量百分比，必传，范围 1-100。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setBatteryLevel(0, 75);
     */
    setBatteryLevel: function (idx, l) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 39, 'idx': idx, 'l': l });
    },

    /**
     * 设置 BLE 发射功率 (dBm)。
     * @param {number} idx - 设备索引，必传。
     * @param {number} tx - 功率级别，-27 ~ 9 dBm，必传。9 为最高。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setTXPowerLevel(0, 3);
     */
    setTXPowerLevel: function (idx, tx) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 40, 'idx': idx, 'tx': tx });
    },

    /**
     * 删除当前主机的配对信息（取消绑定当前设备）。
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.deleteBond(0);
     */
    deleteBond: function (idx) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 41, 'idx': idx });
    },

    /**
     * 删除所有存储的配对信息（解除全部已绑定主机）。
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.deleteAllBonds(0);
     */
    deleteAllBonds: function (idx) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 42, 'idx': idx });
    },

    /**
     * 进入配对模式（等待主机扫描并连接）。
     * @param {number} idx - 设备索引，必传。
     * @returns {Promise<boolean>} true 成功进入配对模式，false 失败。
     * @example
     * if ( bleGamepad.enterPairingMode(0)) {
     *     console.log("已进入配对模式");
     * }
     * @async
     */
    enterPairingMode: async function (idx) {
        var rst = await jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 43, 'idx': idx });
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 查询是否收到主机发来的输出报告（Output Report）。
     * @param {number} idx - 设备索引，必传。
     * @returns {Promise<boolean>} true 已收到输出，false 未收到。
     * @example
     * if ( bleGamepad.isOutputReceived(0)) {
     *     console.log("主机发来了输出报告");
     * }
     * @async
     */
    isOutputReceived: async function (idx) {
        var rst = await jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 44, 'idx': idx });
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 查询设备名称。
     * @param {number} idx - 设备索引，必传。
     * @returns {Promise<string>} 设备名称字符串。
     * @example
     * let name =  bleGamepad.getDeviceName(0);
     * console.log("名称:", name);
     * @async
     */
    getDeviceName: async function (idx) {
        var rst = await jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 45, 'idx': idx });
        return rst && rst.code === 0 ? rst.v : "";
    },

    /**
     * 查询设备制造商名称。
     * @param {number} idx - 设备索引，必传。
     * @returns {Promise<string>} 制造商名称字符串。
     * @example
     * let mfr =  bleGamepad.getDeviceManufacturer(0);
     * console.log("制造商:", mfr);
     * @async
     */
    getDeviceManufacturer: async function (idx) {
        var rst = await jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 46, 'idx': idx });
        return rst && rst.code === 0 ? rst.v : "";
    },

    /**
     * 设置电源状态（电池信息全部字段）。
     * @param {number} idx - 设备索引，必传。
     * @param {number} [bpi] - 电池电源信息 (Battery Power Information)，默认 0。
     * @param {number} [ds] - 放电状态 (Discharging State)，默认 0。
     * @param {number} [cs] - 充电状态 (Charging State)，默认 0。
     * @param {number} [pl] - 电量级别 (Power Level)，默认 0。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setPowerStateAll(0, 1, 0, 80);
     */
    setPowerStateAll: function (idx, bpi, ds, cs, pl) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 47, 'idx': idx };
        if (typeof bpi !== 'undefined') args['bpi'] = bpi;
        if (typeof ds !== 'undefined') args['ds'] = ds;
        if (typeof cs !== 'undefined') args['cs'] = cs;
        if (typeof pl !== 'undefined') args['pl'] = pl;
        return jm.s(args);
    },

    /**
     * 设置电池电源信息 (Battery Power Information)。
     * @param {number} idx - 设备索引，必传。
     * @param {number} bpi - 电池电源信息，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setBatteryPowerInformation(0, 1);
     */
    setBatteryPowerInformation: function (idx, bpi) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 48, 'idx': idx, 'bpi': bpi });
    },

    /**
     * 设置放电状态 (Discharging State)。
     * @param {number} idx - 设备索引，必传。
     * @param {number} ds - 放电状态，必传。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setDischargingState(0, 1);
     */
    setDischargingState: function (idx, ds) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 49, 'idx': idx, 'ds': ds });
    },

    /**
     * 设置充电状态 (Charging State)。
     * @param {number} idx - 设备索引，必传。
     * @param {number} cs - 充电状态，必传 (0=未充电, 1=充电中, 2=已充满)。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setChargingState(0, 1);
     */
    setChargingState: function (idx, cs) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 50, 'idx': idx, 'cs': cs });
    },

    /**
     * 设置电量级别 (Power Level)。
     * @param {number} idx - 设备索引，必传。
     * @param {number} pl - 电量级别，必传，范围 0-100。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.setPowerLevel(0, 90);
     */
    setPowerLevel: function (idx, pl) {
        return jm.s({ '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 51, 'idx': idx, 'pl': pl });
    },

    /**
     * 重新配置游戏柄参数（在 begin 之前调用，仅修改配置）。
     * 修改名称、厂商、电量及轴/按钮/Hat 等配置后，
     * 需再次调用 create() 方能生效。配置字段同 create() 的 cfg 参数。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {Object} cfg - 配置对象，必传。字段同 create() 的 cfg：
     *   - {string} [name] - 设备名称。
     *   - {string} [mfr] - 制造商名称。
     *   - {number} [l] - 电池电量百分比 1-100。
     *   - {number} [btn] - 按钮数量 1-128。
     *   - {number} [hat] - Hat 数量 0-4。
     *   - {number} [ctype] - 控制器类型。
     *   - {boolean} [auto] - 自动上报。
     *   - {number} [vid] - VID。 {number} [pid] - PID。 {number} [gv] - GUID 版本。
     *   - {number} [axmin] - 轴最小值。 {number} [axmax] - 轴最大值。
     *   - {number} [tx] - 发射功率 -27~9。
     *   - {boolean} [outrpt] - 启用输出报告。 {number} [outlen] - 输出报告长度。
     *   - {number} [sp] - 特殊按钮位掩码。 {number} [ax] - 轴位掩码。
     *   - {number} [sim] - 模拟控制位掩码。
     *   - {boolean} [gyro] - 包含陀螺仪。 {boolean} [acc] - 包含加速度计。
     * @returns {object} 返回操作结果对象：- code: 0 成功。- c: 连接状态。
     * @example
     * bleGamepad.configure(0, { name: "NewName", ax: 0x3F });
     * bleGamepad.create(0);
     */
    configure: function (idx, cfg) {
        var args = { '_fn': bleGamepadDefId, 'ty': bleGamepadType, 'op': 52, 'idx': idx };
        if (cfg) {
            if (typeof cfg.name !== 'undefined') args['name'] = cfg.name;
            if (typeof cfg.mfr !== 'undefined') args['mfr'] = cfg.mfr;
            if (typeof cfg.l !== 'undefined') args['l'] = cfg.l;
            if (typeof cfg.btn !== 'undefined') args['btn'] = cfg.btn;
            if (typeof cfg.hat !== 'undefined') args['hat'] = cfg.hat;
            if (typeof cfg.ctype !== 'undefined') args['ctype'] = cfg.ctype;
            if (typeof cfg.auto !== 'undefined') args['auto'] = cfg.auto ? 1 : 0;
            if (typeof cfg.vid !== 'undefined') args['vid'] = cfg.vid;
            if (typeof cfg.pid !== 'undefined') args['pid'] = cfg.pid;
            if (typeof cfg.gv !== 'undefined') args['gv'] = cfg.gv;
            if (typeof cfg.axmin !== 'undefined') args['axmin'] = cfg.axmin;
            if (typeof cfg.axmax !== 'undefined') args['axmax'] = cfg.axmax;
            if (typeof cfg.tx !== 'undefined') args['tx'] = cfg.tx;
            if (typeof cfg.outrpt !== 'undefined') args['outrpt'] = cfg.outrpt ? 1 : 0;
            if (typeof cfg.outlen !== 'undefined') args['outlen'] = cfg.outlen;
            if (typeof cfg.sp !== 'undefined') args['sp'] = cfg.sp;
            if (typeof cfg.ax !== 'undefined') args['ax'] = cfg.ax;
            if (typeof cfg.sim !== 'undefined') args['sim'] = cfg.sim;
            if (typeof cfg.gyro !== 'undefined') args['gyro'] = cfg.gyro ? 1 : 0;
            if (typeof cfg.acc !== 'undefined') args['acc'] = cfg.acc ? 1 : 0;
        }
        return jm.s(args);
    }
};

// exports = bleGamepad;
// module.exports = bleGamepad;

module.exports = bleGamepad;
