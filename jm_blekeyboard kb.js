/**
 * BLE Keyboard 蓝牙键盘模块
 * 
 * 本模块提供了蓝牙键盘功能的 JS API，基于底层 C 接口实现。
 * 支持创建多实例、按键按下、释放、发送字符、媒体按键等功能。
 * 
 * 所有方法返回值说明：
 * 返回值是一个对象，包含以下字段：
 * - code (number): 操作结果码，0 表示成功，非 0 表示失败。
 *   常见错误码：
 *   1: 缺少操作码(op)参数
 *   2: 创建实例时缺少设备索引(idx)参数
 *   3: 指定索引的蓝牙键盘实例不存在
 *   6: 不支持的操作码
 * - v (any): 查询类操作的返回值，仅在查询方法中有效。
 *   对于设置类操作，通常不包含 v 字段。
 * 
 * @module BLE Keyboard 蓝牙键盘模块
 * @var bleKeyboard
 * @category bluetooth
 * @keywords BLE,蓝牙,键盘,蓝牙键盘,无线键盘,HID,媒体键
 * @capabilities createBleKeyboard,end,press,release,write,isConnected,setBatteryLevel,releaseAll,setDelay
 * @depends 无
 */

let bleKeyboardType = 65518;
let bleKeyboardDefId = 20;

var bleKeyboard = {
    // ========== 键盘修饰键常量 ==========
    /** 左 Ctrl 键 */
    KEY_LEFT_CTRL: 0x80,
    /** 左 Shift 键 */
    KEY_LEFT_SHIFT: 0x81,
    /** 左 Alt 键 */
    KEY_LEFT_ALT: 0x82,
    /** 左 GUI 键 (Windows/Command 键) */
    KEY_LEFT_GUI: 0x83,
    /** 右 Ctrl 键 */
    KEY_RIGHT_CTRL: 0x84,
    /** 右 Shift 键 */
    KEY_RIGHT_SHIFT: 0x85,
    /** 右 Alt 键 */
    KEY_RIGHT_ALT: 0x86,
    /** 右 GUI 键 */
    KEY_RIGHT_GUI: 0x87,

    // ========== 箭头键常量 ==========
    /** 上箭头键 */
    KEY_UP_ARROW: 0xDA,
    /** 下箭头键 */
    KEY_DOWN_ARROW: 0xD9,
    /** 左箭头键 */
    KEY_LEFT_ARROW: 0xD8,
    /** 右箭头键 */
    KEY_RIGHT_ARROW: 0xD7,

    // ========== 功能键常量 ==========
    /** 回退键 (Backspace) */
    KEY_BACKSPACE: 0xB2,
    /** Tab 键 */
    KEY_TAB: 0xB3,
    /** 回车键 (Enter) */
    KEY_RETURN: 0xB0,
    /** ESC 键 */
    KEY_ESC: 0xB1,
    /** 插入键 */
    KEY_INSERT: 0xD1,
    /** 截屏键 */
    KEY_PRTSC: 0xCE,
    /** 删除键 */
    KEY_DELETE: 0xD4,
    /** 页面向上键 */
    KEY_PAGE_UP: 0xD3,
    /** 页面向下键 */
    KEY_PAGE_DOWN: 0xD6,
    /** Home 键 */
    KEY_HOME: 0xD2,
    /** End 键 */
    KEY_END: 0xD5,
    /** 大写锁定键 */
    KEY_CAPS_LOCK: 0xC1,

    // ========== F1-F12 功能键常量 ==========
    /** F1 键 */
    KEY_F1: 0xC2,
    /** F2 键 */
    KEY_F2: 0xC3,
    /** F3 键 */
    KEY_F3: 0xC4,
    /** F4 键 */
    KEY_F4: 0xC5,
    /** F5 键 */
    KEY_F5: 0xC6,
    /** F6 键 */
    KEY_F6: 0xC7,
    /** F7 键 */
    KEY_F7: 0xC8,
    /** F8 键 */
    KEY_F8: 0xC9,
    /** F9 键 */
    KEY_F9: 0xCA,
    /** F10 键 */
    KEY_F10: 0xCB,
    /** F11 键 */
    KEY_F11: 0xCC,
    /** F12 键 */
    KEY_F12: 0xCD,
    /** F13 键 */
    KEY_F13: 0xF0,
    /** F14 键 */
    KEY_F14: 0xF1,
    /** F15 键 */
    KEY_F15: 0xF2,
    /** F16 键 */
    KEY_F16: 0xF3,
    /** F17 键 */
    KEY_F17: 0xF4,
    /** F18 键 */
    KEY_F18: 0xF5,
    /** F19 键 */
    KEY_F19: 0xF6,
    /** F20 键 */
    KEY_F20: 0xF7,
    /** F21 键 */
    KEY_F21: 0xF8,
    /** F22 键 */
    KEY_F22: 0xF9,
    /** F23 键 */
    KEY_F23: 0xFA,
    /** F24 键 */
    KEY_F24: 0xFB,

    // ========== 数字键常量 ==========
    /** 数字 0 键 */
    KEY_NUM_0: 0xEA,
    /** 数字 1 键 */
    KEY_NUM_1: 0xE1,
    /** 数字 2 键 */
    KEY_NUM_2: 0xE2,
    /** 数字 3 键 */
    KEY_NUM_3: 0xE3,
    /** 数字 4 键 */
    KEY_NUM_4: 0xE4,
    /** 数字 5 键 */
    KEY_NUM_5: 0xE5,
    /** 数字 6 键 */
    KEY_NUM_6: 0xE6,
    /** 数字 7 键 */
    KEY_NUM_7: 0xE7,
    /** 数字 8 键 */
    KEY_NUM_8: 0xE8,
    /** 数字 9 键 */
    KEY_NUM_9: 0xE9,
    /** 数字键盘除号键 */
    KEY_NUM_SLASH: 0xDC,
    /** 数字键盘乘号键 */
    KEY_NUM_ASTERISK: 0xDD,
    /** 数字键盘减号键 */
    KEY_NUM_MINUS: 0xDE,
    /** 数字键盘加号键 */
    KEY_NUM_PLUS: 0xDF,
    /** 数字键盘回车键 */
    KEY_NUM_ENTER: 0xE0,
    /** 数字键盘小数点键 */
    KEY_NUM_PERIOD: 0xEB,

    // ========== 媒体键常量 ==========
    /** 下一曲目媒体键 */
    KEY_MEDIA_NEXT_TRACK: [1, 0],
    /** 上一曲目媒体键 */
    KEY_MEDIA_PREVIOUS_TRACK: [2, 0],
    /** 停止媒体键 */
    KEY_MEDIA_STOP: [4, 0],
    /** 播放/暂停媒体键 */
    KEY_MEDIA_PLAY_PAUSE: [8, 0],
    /** 静音媒体键 */
    KEY_MEDIA_MUTE: [16, 0],
    /** 音量增加媒体键 */
    KEY_MEDIA_VOLUME_UP: [32, 0],
    /** 音量减小媒体键 */
    KEY_MEDIA_VOLUME_DOWN: [64, 0],
    /** WWW Home 媒体键 */
    KEY_MEDIA_WWW_HOME: [128, 0],
    /** 计算器媒体键 */
    KEY_MEDIA_CALCULATOR: [0, 2],

    /**
     * 创建一个蓝牙键盘实例并开始广播。
     * 创建成功后设备会进入可配对状态，等待主机连接。
     * 
     * @param {number} idx - 设备索引，必传。用于区分多个键盘实例（0-255）。
     * @param {string|undefined} name - 设备名称，必传，默认为 "ESP32 Keyboard"。
     * @param {string|undefined} manufacturer - 制造商名称，必传，默认为 "Espressif"。
     * @param {number|undefined} level - 初始电池电量百分比，可选，默认为 100，范围 0-100。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数。
     *                   - isc: 0:未连接， 1：已经连接
     * 
     * @example
     * // 自定义设备名称和电池电量
     * let rst = bleKeyboard.createBleKeyboard(0, "JMicroKeyboard", "JMicro", 80);
     * if(rst.code == 0) console.log("创建成功")
     * else  console.log("创建失败")
     * if(rst.isc) console.log("已连接")
     * else  console.log("未连接")
     * 
     */
    createBleKeyboard: function (idx, name, manufacturer, level) {
        var args = { '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 1, 'idx': idx };
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
     * 结束蓝牙键盘实例并释放资源。
     * 调用后设备将停止广播并断开连接。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     * 
     * @example
     * bleKeyboard.end(0);
     * 
     */
    end: function (idx) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 2, 'idx': idx });
    },

    /**
     * 按下键盘按键。
     * 通常与 release() 配合使用实现长按，或与 write() 配合实现组合键。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} k - 按键代码，必传。
     *                     可使用 KEY_LEFT_CTRL、KEY_F1 等常量，或 ASCII 码值（0-127）。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     * 
     * @example
     * // 按下 Ctrl 键
     * bleKeyboard.press(0, bleKeyboard.KEY_LEFT_CTRL);
     * 
     * @example
     * // 按下 A 键 (ASCII 码)
     * bleKeyboard.press(0, 65);
     * 
     */
    press: function (idx, k) {
        var args = { '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 3, 'idx': idx };
        if (typeof k !== 'undefined') {
            args['k'] = k;
        }
        return jm.s(args);
    },

    /**
     * 释放按下的键盘按键。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} k - 按键代码，可选，默认为 0。
     *                     可使用键盘常量或 ASCII 码值。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     * 
     * @example
     * // 释放 Ctrl 键
     * bleKeyboard.release(0, bleKeyboard.KEY_LEFT_CTRL);
     * 
     */
    release: function (idx, k) {
        var args = { '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 4, 'idx': idx };
        if (typeof k !== 'undefined') {
            args['k'] = k;
        }
        return jm.s(args);
    },

    /**
     * 发送一个字符（按下并释放）。
     * 可用于发送ASCII字符或特殊字符。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} c - 字符的ASCII码值，必传，范围 0-255。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     * 
     * @example
     * // 发送字符 'H' (ASCII 72)
     * bleKeyboard.write(0, 72);
     * 
     * @example
     * // 发送回车键
     * bleKeyboard.write(0, bleKeyboard.KEY_RETURN);
     *
     */
    write: function (idx, c) {
        var args = { '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 5, 'idx': idx };
        if (typeof c !== 'undefined') {
            args['c'] = c;
        }
        return jm.s(args);
    },

    /**
     * 释放所有按下的键盘按键。
     * 包括常规按键和媒体按键。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     * 
     * @example
     * // 释放所有按键
     * bleKeyboard.releaseAll(0);
     * 
     */
    releaseAll: function (idx) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 6, 'idx': idx });
    },

/**
      * 查询蓝牙键盘是否已连接到主机。
      * 
      * @param {number} idx - 设备索引，必传。
      * @returns {Boolean} true 已经连接， false:未连接
      * 
      * @example
      * if (bleKeyboard.isConnected(0)) {
      *     console.log("蓝牙键盘已连接");
      * } else {
      *     console.log("等待主机连接...");
      * }
      * 
      * @async
      */
    isConnected: async function (idx) {
        var rst = await jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 7, 'idx': idx });
        return rst && rst.code === 0 ? rst.v : false;
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
     * bleKeyboard.setBatteryLevel(0, 75);
     * 
     */
    setBatteryLevel: function (idx, level) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 8, 'idx': idx, 'level': level });
    },

    /**
     * 设置按键之间的延迟时间。
     * 用于调整按键发送的间隔时间，单位为毫秒。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} delay - 延迟时间，必传，单位毫秒，默认为 7。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     * 
     * @example
     * // 设置延迟为 10ms
     * bleKeyboard.setDelay(0, 10);
     * 
     */
    setDelay: function (idx, delay) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 9, 'idx': idx, 'delay': delay });
    }
};

// exports = bleKeyboard;
//module.exports = bleKeyboard;