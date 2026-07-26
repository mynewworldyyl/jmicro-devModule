/**
 * BLE Mouse 蓝牙鼠标模块
 * 
 * 本模块提供了蓝牙鼠标功能的 JS API，基于底层 C 接口实现。
 * 支持创建多实例、鼠标点击、移动、拖拽、按键状态查询等功能。
 * 
 * 所有方法返回值说明：
 * 返回值是一个对象，包含以下字段：
 * - code (number): 操作结果码，0 表示成功，非 0 表示失败。
 *   常见错误码：
 *   1: 缺少操作码(op)参数
 *   2: 创建实例时缺少设备索引(idx)参数
 *   3: 指定索引的蓝牙鼠标实例不存在
 *   6: 不支持的操作码
 * - v (any): 查询类操作的返回值，仅在查询方法中有效，具体类型见各方法说明。
 *   对于设置类操作，通常不包含 v 字段。
 * 
 * @module BLE Mouse 蓝牙鼠标模块
 * @var bleMouse
 * @category bluetooth
 * @keywords BLE,蓝牙,鼠标,蓝牙鼠标,无线鼠标,HID
 * @capabilities createBleMouse,end,click,move,press,release,isPressed,isConnected,setBatteryLevel,releaseAll
 * @depends 无
 */

let bleType = 65520;
let bleMouseDefId = 20;

var bleMouse = {
    // ========== 鼠标按键常量 ==========
    /** 鼠标左键 */
    MOUSE_LEFT: 0x01,
    /** 鼠标右键 */
    MOUSE_RIGHT: 0x02,
    /** 鼠标中键 */
    MOUSE_MIDDLE: 0x04,
    /** 鼠标后退键 */
    MOUSE_BACK: 0x08,
    /** 鼠标前进键 */
    MOUSE_FORWARD: 0x10,
    /** 所有按键 */
    MOUSE_ALL: 0xFF,

    /**
     * 创建一个蓝牙鼠标实例并开始广播。
     * 创建成功后设备会进入可配对状态，等待主机连接。
     * 
     * @param {number} idx - 设备索引，必传。用于区分多个鼠标实例（0-255）。
     * @param {string|undefined} name - 设备名称，必传，默认为 "JMicro Bluetooth Mouse"。
     * @param {string|undefined} manufacturer - 制造商名称，必传，默认为 "JMicro"。
     * @param {number|undefined} level - 初始电池电量百分比，可选，默认为 100，范围 0-100。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数。
     *                   - isc: 0:未连接， 1：已经连接
     * 
     * @example
     * // 自定义设备名称和电池电量
     * let rst = bleMouse.createBleMouse(0, "JMicroMouse", "JMicro", 80);
     * if(rst.code == 0) console.log("创建成功")
     * else  console.log("创建失败")
     * if(rst.isc) console.log("已连接")
     * else  console.log("未连接")
     * 
     */
    createBleMouse: function (idx, name, manufacturer, level) {
        var args = { '_fn': bleMouseDefId, 'ty': bleType, 'op': 1, 'idx': idx };
        if (typeof name !== 'undefined') {
            args['name'] = name;
        }
        if (typeof manufacturer !== 'undefined') {
            args['manufacturer'] = manufacturer;
        }
        if (typeof level !== 'undefined') {
            args['level'] = level;
        }
        return jm.s(args);
    },

    /**
     * 结束蓝牙鼠标实例并释放资源。
     * 调用后设备将停止广播并断开连接。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     * 
     * @example
     * bleMouse.end(0);
     * 
     */
    end: function (idx) {
        return jm.s({ '_fn': bleMouseDefId, 'ty': bleType, 'op': 2, 'idx': idx });
    },

    /**
     * 模拟鼠标单击。
     * 单击操作包含按下和释放两个动作。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number|undefined} b - 按键类型，可选，默认为 MOUSE_LEFT。
     *                               可使用 MOUSE_LEFT、MOUSE_RIGHT、MOUSE_MIDDLE 等常量。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     * 
     * @example
     * // 左键单击
     * bleMouse.click(0);
     * 
     * @example
     * // 右键单击
     * bleMouse.click(0, bleMouse.MOUSE_RIGHT);
     * 
     */
    click: function (idx, b) {
        var args = { '_fn': bleMouseDefId, 'ty': bleType, 'op': 3, 'idx': idx };
        if (b) {
            args['b'] = b;
        }
        return jm.s(args);
    },

    /**
     * 移动鼠标光标。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} x - X轴移动量，必传，范围 -127 到 127，正数向右，负数向左。
     * @param {number} y - Y轴移动量，必传，范围 -127 到 127，正数向下，负数向上。
     * @param {number|undefined} wheel - 垂直滚轮移动量，可选，范围 -127 到 127，正数向下滚动。
     * @param {number|undefined} hWheel - 水平滚轮移动量，可选，范围 -127 到 127，正数向右滚动。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     * 
     * @example
     * // 向右上移动
     * bleMouse.move(0, 10, -5);
     * 
     * @example
     * // 移动并滚动滚轮
     * bleMouse.move(0, 20, 0, 3);
     * 
     */
    move: function (idx, x, y, wheel, hWheel) {
        var args = { '_fn': bleMouseDefId, 'ty': bleType, 'op': 4, 'idx': idx, 'x': x, 'y': y };
        if (typeof wheel !== 'undefined') {
            args['wheel'] = wheel;
        }
        if (typeof hWheel !== 'undefined') {
            args['hWheel'] = hWheel;
        }
        return jm.s(args);
    },

    /**
     * 按下鼠标按键（不释放）。
     * 通常与 move() 配合使用实现拖拽操作，或与 release() 配合实现长按。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number|undefined} b - 按键类型，可选，默认为 MOUSE_LEFT。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     * 
     * @example
     * // 按下左键
     * bleMouse.press(0);
     * 
     * @example
     * // 按下中键
     * bleMouse.press(0, bleMouse.MOUSE_MIDDLE);
     */
    press: function (idx, b) {
        var args = { '_fn': bleMouseDefId, 'ty': bleType, 'op': 5, 'idx': idx };
        if (b) {
            args['b'] = b;
        }
        return jm.s(args);
    },

    /**
     * 释放鼠标按键。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number|undefined} b - 按键类型，可选，默认为 MOUSE_LEFT。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     * 
     * @example
     * // 释放左键
     * bleMouse.release(0);
     */
    release: function (idx, b) {
        var args = { '_fn': bleMouseDefId, 'ty': bleType, 'op': 6, 'idx': idx };
        if (b) {
            args['b'] = b;
        }
        return jm.s(args);
    },

    /**
     * 释放所有按下的鼠标按键。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     * 
     * @example
     * bleMouse.releaseAll(0);
     */
    releaseAll: function (idx) {
        return jm.s({ '_fn': bleMouseDefId, 'ty': bleType, 'op': 11, 'idx': idx });
    },

    /**
     * 移动鼠标并同时按下按键（用于拖拽操作）。
     * 此操作相当于 press() + move() 的组合，适用于拖拽场景。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} x - X轴移动量，必传，范围 -127 到 127。
     * @param {number} y - Y轴移动量，必传，范围 -127 到 127。
     * @param {number|undefined} b - 按键类型，可选，默认为 MOUSE_LEFT。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     * 
     * @example
     * // 拖拽文件：按下左键并移动
     * bleMouse.movePress(0, 30, 20);
     * 
     */
    movePress: function (idx, x, y, b) {
        var args = { '_fn': bleMouseDefId, 'ty': bleType, 'op': 10, 'idx': idx, 'x': x, 'y': y };
        if (b) {
            args['b'] = b;
        }
        return jm.s(args);
    },

    /**
     * 设置电池电量（更新蓝牙电池服务）。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} level - 电池电量百分比，必传，范围 0-100。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     * 
     * @example
     * bleMouse.setBatteryLevel(0, 75);
     *
     */
    setBatteryLevel: function (idx, level) {
        return jm.s({ '_fn': bleMouseDefId, 'ty': bleType, 'op': 9, 'idx': idx, 'level': level });
    },

    /**
     * 查询指定鼠标按键是否处于按下状态。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number|undefined} b - 按键类型，可选，默认为 MOUSE_LEFT。
    * @returns {Boolean} true 按下 false:未按下
     * 
     * @example
     * var rst = bleMouse.isPressed(0, bleMouse.MOUSE_LEFT);
     * if (rst.v) {
     *     console.log("左键已按下");
     * }
     * 
     *  @
     *   
     */
    isPressed: function (idx, b) {
        var args = { '_fn': bleMouseDefId, 'ty': bleType, 'op': 7, 'idx': idx };
        if (b) {
            args['b'] = b;
        }
        var rst = jm.s(args);
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 查询蓝牙鼠标是否已连接到主机。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {Boolean} true 已经连接， false:未连接
     * 
     * @example
     * if (bleMouse.isConnected(0)) {
     *     console.log("蓝牙鼠标已连接");
     * } else {
     *     console.log("等待主机连接...");
     * }
     * 
     * @async
     */
    isConnected: async function (idx) {
        var rst = await jm.s({ '_fn': bleMouseDefId, 'ty': bleType, 'op': 8, 'idx': idx });
        return rst && rst.code === 0 ? rst.v : false;
    }
};

// exports = bleMouse;
//module.exports = bleMouse;

module.exports = bleMouse;
