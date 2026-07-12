/**
 * BLE Keyboard 蓝牙键盘模块
 * 
 * 本模块提供了蓝牙键盘功能的 JS API，基于 HijelHID_BLEKeyboard 底层 C 接口实现。
 * 支持创建多实例、键盘按键、媒体键、组合键、字符串输入、LED状态查询、
 * 电源管理、安全设置等完整功能。
 * 
 * 所有方法返回值说明（统一字段）：
 * 返回值是一个对象，包含以下字段：
 * - code (number): 操作结果码，0 表示成功，非 0 表示失败。
 *   常见错误码：
 *   1: 缺少操作码(op)参数
 *   2: 创建实例时缺少设备索引(idx)参数
 *   3: 指定索引的蓝牙键盘实例不存在
 *   6: 不支持的操作码
 * - v (any): 查询类操作的返回值，仅在查询方法中有效。
 *   对于设置类操作，通常不包含 v 字段。
 * - c (bool): 蓝牙键盘当前是否已连接 (isConnected 状态)。
 *   注：对于 create/end/kill 操作，会返回操作后的连接状态；
 *      对于其他操作，会返回操作时的连接状态。
 * - p (bool): 蓝牙键盘当前是否已配对 (isPaired 状态)。
 *   注：对于 create/end/kill 操作，会返回操作后的配对状态；
 *      对于其他操作，会返回操作时的配对状态。
 * 
 * @module BLE Keyboard 蓝牙键盘模块
 * @var bleKeyboard
 * @category bluetooth
 * @keywords BLE,蓝牙,键盘,蓝牙键盘,无线键盘,HID,媒体键,多媒体键
 * @capabilities createBleKeyboard,end,kill,press,release,releaseAll,tap,write,print,println,isConnected,isPaired,getIdleTime,isBonded,clearBonds,setBatteryLevel,setTapDelay,setKeyGap,setTxPower,setSecurityMode,setRandomAddress,setLogLevel,isNumLockOn,isCapsLockOn,isScrollLockOn,beforeSleep,afterWake,setAfterWakeTimeout
 * @depends 无
 */

let bleKeyboardType = 65518;
let bleKeyboardDefId = 20;

var bleKeyboard = {
    // ================================================================
    //  键盘修饰键常量 (Modifiers)
    //  用于 press()、tap() 的 m 参数
    // ================================================================
    /** 左 Ctrl 键 */
    MOD_LCTRL: 0x01,
    /** 左 Shift 键 */
    MOD_LSHIFT: 0x02,
    /** 左 Alt 键 */
    MOD_LALT: 0x04,
    /** 左 GUI 键 (Windows/Command 键) */
    MOD_LGUI: 0x08,
    /** 右 Ctrl 键 */
    MOD_RCTRL: 0x10,
    /** 右 Shift 键 */
    MOD_RSHIFT: 0x20,
    /** 右 Alt 键 */
    MOD_RALT: 0x40,
    /** 右 GUI 键 */
    MOD_RGUI: 0x80,

    /** 组合修饰键：Ctrl+Shift */
    MOD_CS: 0x03,
    /** 组合修饰键：Ctrl+Alt */
    MOD_CA: 0x05,
    /** 组合修饰键：Ctrl+GUI */
    MOD_CG: 0x09,
    /** 组合修饰键：Shift+Alt */
    MOD_SA: 0x06,
    /** 组合修饰键：Shift+GUI */
    MOD_SG: 0x0A,
    /** 组合修饰键：Alt+GUI */
    MOD_AG: 0x0C,
    /** 组合修饰键：Ctrl+Shift+Alt */
    MOD_CSA: 0x07,
    /** 组合修饰键：Ctrl+Shift+GUI */
    MOD_CSG: 0x0B,

    // ================================================================
    //  键盘按键常量 (Keycodes)
    // ================================================================

    // ----- 字母 A-Z (0x04-0x1D) -----
    /** A 键 */
    KEY_A: 0x04,
    /** B 键 */
    KEY_B: 0x05,
    /** C 键 */
    KEY_C: 0x06,
    /** D 键 */
    KEY_D: 0x07,
    /** E 键 */
    KEY_E: 0x08,
    /** F 键 */
    KEY_F: 0x09,
    /** G 键 */
    KEY_G: 0x0A,
    /** H 键 */
    KEY_H: 0x0B,
    /** I 键 */
    KEY_I: 0x0C,
    /** J 键 */
    KEY_J: 0x0D,
    /** K 键 */
    KEY_K: 0x0E,
    /** L 键 */
    KEY_L: 0x0F,
    /** M 键 */
    KEY_M: 0x10,
    /** N 键 */
    KEY_N: 0x11,
    /** O 键 */
    KEY_O: 0x12,
    /** P 键 */
    KEY_P: 0x13,
    /** Q 键 */
    KEY_Q: 0x14,
    /** R 键 */
    KEY_R: 0x15,
    /** S 键 */
    KEY_S: 0x16,
    /** T 键 */
    KEY_T: 0x17,
    /** U 键 */
    KEY_U: 0x18,
    /** V 键 */
    KEY_V: 0x19,
    /** W 键 */
    KEY_W: 0x1A,
    /** X 键 */
    KEY_X: 0x1B,
    /** Y 键 */
    KEY_Y: 0x1C,
    /** Z 键 */
    KEY_Z: 0x1D,

    // ----- 数字 1-9,0 (0x1E-0x27) -----
    /** 数字 1 键 */
    KEY_1: 0x1E,
    /** 数字 2 键 */
    KEY_2: 0x1F,
    /** 数字 3 键 */
    KEY_3: 0x20,
    /** 数字 4 键 */
    KEY_4: 0x21,
    /** 数字 5 键 */
    KEY_5: 0x22,
    /** 数字 6 键 */
    KEY_6: 0x23,
    /** 数字 7 键 */
    KEY_7: 0x24,
    /** 数字 8 键 */
    KEY_8: 0x25,
    /** 数字 9 键 */
    KEY_9: 0x26,
    /** 数字 0 键 */
    KEY_0: 0x27,

    // ----- 特殊字符 (0x28-0x33) -----
    /** Enter/Return 键 */
    KEY_ENTER: 0x28,
    /** ESC 键 */
    KEY_ESC: 0x29,
    /** Backspace 键 */
    KEY_BACKSPACE: 0x2A,
    /** Tab 键 */
    KEY_TAB: 0x2B,
    /** 空格键 */
    KEY_SPACE: 0x2C,
    /** 减号键 (-) */
    KEY_MINUS: 0x2D,
    /** 等号键 (=) */
    KEY_EQUAL: 0x2E,
    /** 左括号键 ([) */
    KEY_LEFTBRACE: 0x2F,
    /** 右括号键 (]) */
    KEY_RIGHTBRACE: 0x30,
    /** 反斜杠键 (\) */
    KEY_BACKSLASH: 0x31,
    /** 分号键 (;) */
    KEY_SEMICOLON: 0x33,
    /** 引号键 (') */
    KEY_QUOTE: 0x34,
    /** 反引号键 (`) */
    KEY_GRAVE: 0x35,
    /** 逗号键 (,) */
    KEY_COMMA: 0x36,
    /** 句号键 (.) */
    KEY_PERIOD: 0x37,
    /** 斜杠键 (/) */
    KEY_SLASH: 0x38,

    // ----- 功能键 F1-F24 (0x3A-0x51) -----
    /** F1 键 */
    KEY_F1: 0x3A,
    /** F2 键 */
    KEY_F2: 0x3B,
    /** F3 键 */
    KEY_F3: 0x3C,
    /** F4 键 */
    KEY_F4: 0x3D,
    /** F5 键 */
    KEY_F5: 0x3E,
    /** F6 键 */
    KEY_F6: 0x3F,
    /** F7 键 */
    KEY_F7: 0x40,
    /** F8 键 */
    KEY_F8: 0x41,
    /** F9 键 */
    KEY_F9: 0x42,
    /** F10 键 */
    KEY_F10: 0x43,
    /** F11 键 */
    KEY_F11: 0x44,
    /** F12 键 */
    KEY_F12: 0x45,
    /** F13 键 */
    KEY_F13: 0x68,
    /** F14 键 */
    KEY_F14: 0x69,
    /** F15 键 */
    KEY_F15: 0x6A,
    /** F16 键 */
    KEY_F16: 0x6B,
    /** F17 键 */
    KEY_F17: 0x6C,
    /** F18 键 */
    KEY_F18: 0x6D,
    /** F19 键 */
    KEY_F19: 0x6E,
    /** F20 键 */
    KEY_F20: 0x6F,
    /** F21 键 */
    KEY_F21: 0x70,
    /** F22 键 */
    KEY_F22: 0x71,
    /** F23 键 */
    KEY_F23: 0x72,
    /** F24 键 */
    KEY_F24: 0x73,

    // ----- 控制键 (0x52-0x65) -----
    /** Caps Lock 键 */
    KEY_CAPS_LOCK: 0x39,
    /** Print Screen 键 */
    KEY_PRINTSCREEN: 0x46,
    /** Scroll Lock 键 */
    KEY_SCROLL_LOCK: 0x47,
    /** Pause 键 */
    KEY_PAUSE: 0x48,
    /** Insert 键 */
    KEY_INSERT: 0x49,
    /** Home 键 */
    KEY_HOME: 0x4A,
    /** Page Up 键 */
    KEY_PAGE_UP: 0x4B,
    /** Delete 键 */
    KEY_DELETE: 0x4C,
    /** End 键 */
    KEY_END: 0x4D,
    /** Page Down 键 */
    KEY_PAGE_DOWN: 0x4E,
    /** 右箭头键 */
    KEY_RIGHT: 0x4F,
    /** 左箭头键 */
    KEY_LEFT: 0x50,
    /** 下箭头键 */
    KEY_DOWN: 0x51,
    /** 上箭头键 */
    KEY_UP: 0x52,

    // ----- 数字键盘 (0x53-0x63) -----
    /** 数字键盘 / 键 */
    KEY_NUMLOCK: 0x53,
    /** 数字键盘 / 键 */
    KEY_KP_SLASH: 0x54,
    /** 数字键盘 * 键 */
    KEY_KP_ASTERISK: 0x55,
    /** 数字键盘 - 键 */
    KEY_KP_MINUS: 0x56,
    /** 数字键盘 + 键 */
    KEY_KP_PLUS: 0x57,
    /** 数字键盘 Enter 键 */
    KEY_KP_ENTER: 0x58,
    /** 数字键盘 1 键 */
    KEY_KP_1: 0x59,
    /** 数字键盘 2 键 */
    KEY_KP_2: 0x5A,
    /** 数字键盘 3 键 */
    KEY_KP_3: 0x5B,
    /** 数字键盘 4 键 */
    KEY_KP_4: 0x5C,
    /** 数字键盘 5 键 */
    KEY_KP_5: 0x5D,
    /** 数字键盘 6 键 */
    KEY_KP_6: 0x5E,
    /** 数字键盘 7 键 */
    KEY_KP_7: 0x5F,
    /** 数字键盘 8 键 */
    KEY_KP_8: 0x60,
    /** 数字键盘 9 键 */
    KEY_KP_9: 0x61,
    /** 数字键盘 0 键 */
    KEY_KP_0: 0x62,
    /** 数字键盘 . 键 */
    KEY_KP_PERIOD: 0x63,

    // ----- 特殊键 (0x64-0x67) -----
    /** 非美国反斜杠键 */
    KEY_NONUS_BACKSLASH: 0x64,
    /** 应用程序键 */
    KEY_APPLICATION: 0x65,
    /** 电源键 */
    KEY_POWER: 0x66,
    /** 等号键 (数字键盘) */
    KEY_KP_EQUAL: 0x67,

    // ================================================================
    //  多媒体键常量 (Media Keys) - 16-bit Usage ID
    //  用于 press()、tap() 的 u 参数
    // ================================================================
    /** 播放/暂停 */
    MEDIA_PLAY_PAUSE: 0x00CD,
    /** 停止 */
    MEDIA_STOP: 0x00B7,
    /** 下一曲 */
    MEDIA_NEXT: 0x00B6,
    /** 上一曲 */
    MEDIA_PREVIOUS: 0x00B5,
    /** 快进 */
    MEDIA_FAST_FORWARD: 0x00B3,
    /** 快退 */
    MEDIA_REWIND: 0x00B4,
    /** 随机播放 */
    MEDIA_SHUFFLE: 0x00B8,
    /** 循环播放 */
    MEDIA_LOOP: 0x00B9,

    /** 音量增大 */
    MEDIA_VOL_UP: 0x00E9,
    /** 音量减小 */
    MEDIA_VOL_DOWN: 0x00EA,
    /** 静音 */
    MEDIA_MUTE: 0x00E2,
    /** 音量 */
    MEDIA_VOLUME: 0x00E0,

    /** 浏览器首页 */
    MEDIA_BROWSER_HOME: 0x0223,
    /** 浏览器后退 */
    MEDIA_BROWSER_BACK: 0x0224,
    /** 浏览器前进 */
    MEDIA_BROWSER_FORWARD: 0x0225,
    /** 浏览器刷新 */
    MEDIA_BROWSER_REFRESH: 0x0227,
    /** 浏览器搜索 */
    MEDIA_BROWSER_SEARCH: 0x0221,
    /** 浏览器停止 */
    MEDIA_BROWSER_STOP: 0x0226,
    /** 浏览器收藏夹 */
    MEDIA_BROWSER_FAVORITES: 0x022A,
    /** 浏览器书签 */
    MEDIA_BROWSER_BOOKMARKS: 0x022A,

    /** 计算器 */
    MEDIA_CALCULATOR: 0x0192,
    /** 电子邮件 */
    MEDIA_EMAIL: 0x018A,
    /** 我的电脑 */
    MEDIA_MY_COMPUTER: 0x0194,
    /** 搜索 */
    MEDIA_SEARCH: 0x0221,
    /** 主页 */
    MEDIA_HOME: 0x0223,
    /** 返回 */
    MEDIA_BACK: 0x0224,
    /** 前进 */
    MEDIA_FORWARD: 0x0225,
    /** 停止 */
    MEDIA_STOP_CD: 0x0226,
    /** 刷新 */
    MEDIA_REFRESH: 0x0227,

    /** 睡眠 */
    MEDIA_SLEEP: 0x0198,
    /** 唤醒 */
    MEDIA_WAKE_UP: 0x0197,
    /** 电源 */
    MEDIA_POWER: 0x0199,
    /** 锁定 */
    MEDIA_LOCK: 0x019A,

    // ================================================================
    //  安全模式常量 (Security Modes)
    // ================================================================
    /** JustWorks 模式 - 自动配对，无密码 (默认) */
    SEC_JUSTWORKS: 0,
    /** Passkey 模式 - 数字比较，显示6位代码 */
    SEC_PASSKEY: 1,

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
     * 创建蓝牙键盘实例并开始广播。
     * 创建成功后设备会进入可配对状态，等待主机连接。
     * 
     * @param {number} idx - 设备索引，必传。用于区分多个键盘实例（0-255）。
     * @param {string} [name] - 设备名称，默认为 "JMicro KB"，最大29字符。
     * @param {string} [mfr] - 制造商名称，默认为 "JMicro"，最大512字符。
     * @param {number} [level] - 初始电池电量百分比，默认为 100，范围 1-100。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * 
     * @example
     * let rst = bleKeyboard.create(0, "MyKB", "MyCo", 80);
     * if (rst.code === 0) {
     *     console.log("创建成功，已连接:", rst.c);
     * }
     */
    create: function (idx, name, mfr, level) {
        var args = { '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 1, 'idx': idx };
        if (typeof name !== 'undefined') args['name'] = name;
        if (typeof mfr !== 'undefined') args['mfr'] = mfr;
        if (typeof level !== 'undefined') args['l'] = level;
        return jm.s(args);
    },

    /**
     * 结束蓝牙键盘实例（暂停）。
     * 停止广播并断开连接，但保留资源以便快速重启。
     * 调用 create() 可重新开始广播。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接 (操作后状态)
     *                   - p: true 已配对，false 未配对 (操作后状态)
     * @example
     * let rst = bleKeyboard.end(0);
     * console.log("结束后的连接状态:", rst.c);
     */
    end: function (idx) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 2, 'idx': idx });
    },

    /**
     * 永久销毁蓝牙键盘实例。
     * 断开连接、释放所有资源，无法再次启动。
     * 如需暂停/恢复请使用 end()。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: false (实例已销毁，未连接)
     *                   - p: false (实例已销毁，未配对)
     * @example
     * bleKeyboard.kill(0);
     */
    kill: function (idx) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 3, 'idx': idx });
    },

    /**
     * 按下键盘按键（支持修饰键组合）。
     * 按键会保持按下状态，直到调用 release() 或 releaseAll()。
     * 
     * ================================================================
     * 键盘修饰键常量 (Modifiers) - 用于 m 参数
     * ================================================================
     * MOD_LCTRL: 0x01     左 Ctrl 键
     * MOD_LSHIFT: 0x02    左 Shift 键
     * MOD_LALT: 0x04      左 Alt 键
     * MOD_LGUI: 0x08      左 GUI 键 (Windows/Command)
     * MOD_RCTRL: 0x10     右 Ctrl 键
     * MOD_RSHIFT: 0x20    右 Shift 键
     * MOD_RALT: 0x40      右 Alt 键
     * MOD_RGUI: 0x80      右 GUI 键
     * MOD_CS: 0x03        Ctrl+Shift
     * MOD_CA: 0x05        Ctrl+Alt
     * MOD_CG: 0x09        Ctrl+GUI
     * MOD_SA: 0x06        Shift+Alt
     * MOD_SG: 0x0A        Shift+GUI
     * MOD_AG: 0x0C        Alt+GUI
     * MOD_CSA: 0x07       Ctrl+Shift+Alt
     * MOD_CSG: 0x0B       Ctrl+Shift+GUI
     * 
     * ================================================================
     * 键盘按键常量 (Keycodes) - 用于 k 参数
     * ================================================================
     * 字母: KEY_A(0x04) ~ KEY_Z(0x1D)
     * 数字: KEY_0(0x27), KEY_1(0x1E) ~ KEY_9(0x26)
     * 功能键: KEY_F1(0x3A) ~ KEY_F24(0x73)
     * 控制键: KEY_ENTER(0x28), KEY_ESC(0x29), KEY_BACKSPACE(0x2A), KEY_TAB(0x2B),
     *         KEY_SPACE(0x2C), KEY_MINUS(0x2D), KEY_EQUAL(0x2E), KEY_LEFTBRACE(0x2F),
     *         KEY_RIGHTBRACE(0x30), KEY_BACKSLASH(0x31), KEY_SEMICOLON(0x33),
     *         KEY_QUOTE(0x34), KEY_GRAVE(0x35), KEY_COMMA(0x36), KEY_PERIOD(0x37),
     *         KEY_SLASH(0x38), KEY_CAPS_LOCK(0x39), KEY_PRINTSCREEN(0x46),
     *         KEY_SCROLL_LOCK(0x47), KEY_PAUSE(0x48), KEY_INSERT(0x49), KEY_HOME(0x4A),
     *         KEY_PAGE_UP(0x4B), KEY_DELETE(0x4C), KEY_END(0x4D), KEY_PAGE_DOWN(0x4E),
     *         KEY_RIGHT(0x4F), KEY_LEFT(0x50), KEY_DOWN(0x51), KEY_UP(0x52),
     *         KEY_NUMLOCK(0x53), KEY_APPLICATION(0x65), KEY_POWER(0x66)
     * 数字键盘: KEY_KP_SLASH(0x54), KEY_KP_ASTERISK(0x55), KEY_KP_MINUS(0x56),
     *          KEY_KP_PLUS(0x57), KEY_KP_ENTER(0x58), KEY_KP_1(0x59) ~ KEY_KP_0(0x62),
     *          KEY_KP_PERIOD(0x63), KEY_KP_EQUAL(0x67), KEY_NONUS_BACKSLASH(0x64)
     * 
     * ================================================================
     * 多媒体键常量 (Media Keys) - 用于 pressMedia()/tapMedia()
     * ================================================================
     * MEDIA_PLAY_PAUSE(0x00CD), MEDIA_STOP(0x00B7), MEDIA_NEXT(0x00B6),
     * MEDIA_PREVIOUS(0x00B5), MEDIA_FAST_FORWARD(0x00B3), MEDIA_REWIND(0x00B4),
     * MEDIA_SHUFFLE(0x00B8), MEDIA_LOOP(0x00B9), MEDIA_VOL_UP(0x00E9),
     * MEDIA_VOL_DOWN(0x00EA), MEDIA_MUTE(0x00E2), MEDIA_VOLUME(0x00E0),
     * MEDIA_BROWSER_HOME(0x0223), MEDIA_BROWSER_BACK(0x0224), MEDIA_BROWSER_FORWARD(0x0225),
     * MEDIA_BROWSER_REFRESH(0x0227), MEDIA_BROWSER_SEARCH(0x0221), MEDIA_BROWSER_STOP(0x0226),
     * MEDIA_BROWSER_FAVORITES(0x022A), MEDIA_BROWSER_BOOKMARKS(0x022A),
     * MEDIA_CALCULATOR(0x0192), MEDIA_EMAIL(0x018A), MEDIA_MY_COMPUTER(0x0194),
     * MEDIA_SEARCH(0x0221), MEDIA_HOME(0x0223), MEDIA_BACK(0x0224),
     * MEDIA_FORWARD(0x0225), MEDIA_STOP_CD(0x0226), MEDIA_REFRESH(0x0227),
     * MEDIA_SLEEP(0x0198), MEDIA_WAKE_UP(0x0197), MEDIA_POWER(0x0199), MEDIA_LOCK(0x019A)
     * 
     * ================================================================
     * 安全模式常量 - 用于 setSecurity()
     * ================================================================
     * SEC_JUSTWORKS: 0     JustWorks 模式（默认）
     * SEC_PASSKEY: 1       Passkey 数字比较模式
     * 
     * ================================================================
     * 日志级别常量 - 用于 setLogLevel()
     * ================================================================
     * LOG_OFF: 0           关闭日志
     * LOG_NORMAL: 1        正常日志（连接/配对事件）
     * LOG_VERBOSE: 2       详细日志（含HID报告）
     * 
     * 注意：以上所有常量同样适用于 tap()、release()、pressMedia()、tapMedia()、releaseMedia() 
     * 及其他所有键盘/媒体按键相关方法。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} k - 按键代码，必传。使用 KEY_* 常量或 ASCII 码。
     * @param {number} [m] - 修饰键位掩码，可选。使用 MOD_* 常量组合。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * // 按下 A 键
     * bleKeyboard.press(0, bleKeyboard.KEY_A);
     * 
     * // Ctrl+C 组合
     * bleKeyboard.press(0, bleKeyboard.KEY_C, bleKeyboard.MOD_LCTRL);
     * 
     * // Ctrl+Shift+Esc
     * bleKeyboard.press(0, bleKeyboard.KEY_ESC, bleKeyboard.MOD_CS);
     */
    press: function (idx, k, m) {
        var args = { '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 4, 'idx': idx, 'k': k };
        if (typeof m !== 'undefined') args['m'] = m;
        return jm.s(args);
    },

    /**
     * 按下媒体键（多媒体控制）。
     * 按键会保持按下状态，直到调用 release() 或 releaseAll()。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} u - 媒体键使用ID，必传。使用 MEDIA_* 常量。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * // 播放/暂停
     * bleKeyboard.pressMedia(0, bleKeyboard.MEDIA_PLAY_PAUSE);
     * 
     * // 音量增大
     * bleKeyboard.pressMedia(0, bleKeyboard.MEDIA_VOL_UP);
     */
    pressMedia: function (idx, u) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 5, 'idx': idx, 'u': u });
    },

    /**
     * 释放键盘按键。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} k - 按键代码，必传。使用 KEY_* 常量或 ASCII 码。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * bleKeyboard.release(0, bleKeyboard.KEY_A);
     */
    release: function (idx, k) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 6, 'idx': idx, 'k': k });
    },

    /**
     * 释放媒体键。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} u - 媒体键使用ID，必传。使用 MEDIA_* 常量。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * bleKeyboard.releaseMedia(0, bleKeyboard.MEDIA_PLAY_PAUSE);
     */
    releaseMedia: function (idx, u) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 7, 'idx': idx, 'u': u });
    },

    /**
     * 释放所有按下的按键（键盘键 + 媒体键）。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * bleKeyboard.releaseAll(0);
     */
    releaseAll: function (idx) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 8, 'idx': idx });
    },

    /**
     * 点击键盘按键（自动按下并释放）。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} k - 按键代码，必传。使用 KEY_* 常量或 ASCII 码。
     * @param {number} [m] - 修饰键位掩码，可选。
     * @param {number} [d] - 按键保持时间(ms)，可选，0=使用全局设置。
     * @param {number} [g] - 按键间隔时间(ms)，可选，0=使用全局设置。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * // 点击 A 键
     * bleKeyboard.tap(0, bleKeyboard.KEY_A);
     * 
     * // 点击 Ctrl+C，保持50ms
     * bleKeyboard.tap(0, bleKeyboard.KEY_C, bleKeyboard.MOD_LCTRL, 50);
     */
    tap: function (idx, k, m, d, g) {
        var args = { '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 9, 'idx': idx, 'k': k };
        if (typeof m !== 'undefined') args['m'] = m;
        if (typeof d !== 'undefined') args['d'] = d;
        if (typeof g !== 'undefined') args['g'] = g;
        return jm.s(args);
    },

    /**
     * 点击媒体键（自动按下并释放）。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} u - 媒体键使用ID，必传。使用 MEDIA_* 常量。
     * @param {number} [d] - 按键保持时间(ms)，可选，0=使用全局设置。
     * @param {number} [g] - 按键间隔时间(ms)，可选，0=使用全局设置。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * // 点击播放/暂停
     * bleKeyboard.tapMedia(0, bleKeyboard.MEDIA_PLAY_PAUSE);
     * 
     * // 点击音量+，保持30ms
     * bleKeyboard.tapMedia(0, bleKeyboard.MEDIA_VOL_UP, 30);
     */
    tapMedia: function (idx, u, d, g) {
        var args = { '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 10, 'idx': idx, 'u': u };
        if (typeof d !== 'undefined') args['d'] = d;
        if (typeof g !== 'undefined') args['g'] = g;
        return jm.s(args);
    },

    /**
     * 发送单个字符（自动按下并释放）。
     * 支持 ASCII 可打印字符和控制字符。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} k - 字符的 ASCII 码，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * bleKeyboard.write(0, 65);  // 发送 'A'
     * bleKeyboard.write(0, 13);  // 发送回车
     */
    write: function (idx, k) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 11, 'idx': idx, 'k': k });
    },

    /**
     * 打印字符串（自动转换并发送每个字符）。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {string} txt - 要打印的字符串，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * bleKeyboard.print(0, "Hello World!");
     */
    print: function (idx, txt) {
        var args = { '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 12, 'idx': idx };
        if (typeof txt !== 'undefined') args['txt'] = txt;
        return jm.s(args);
    },

    /**
     * 打印字符串并换行（自动添加回车换行）。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {string} [txt] - 要打印的字符串，可选。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * bleKeyboard.println(0, "Hello");
     * bleKeyboard.println(0);  // 仅换行
     */
    println: function (idx, txt) {
        var args = { '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 13, 'idx': idx };
        if (typeof txt !== 'undefined') args['txt'] = txt;
        return jm.s(args);
    },

    /**
     * 查询蓝牙键盘是否已连接到主机（GAP层）。
     * 注意：连接后可能尚未完成认证，建议使用 isPaired() 判断可发送状态。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {Promise<boolean>} true 已连接，false 未连接。
     * @example
     * if (await bleKeyboard.isConnected(0)) {
     *     console.log("蓝牙键盘已连接");
     * }
     * 
     * @async
     */
    isConnected: function (idx) {
        var rst = jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 14, 'idx': idx });
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 查询蓝牙键盘是否已完全认证（可发送状态）。
     * 比 isConnected() 更可靠，确保 LTK 加密完成。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {Promise<boolean>} true 已配对认证，false 未认证。
     * @example
     * if (await bleKeyboard.isPaired(0)) {
     *     bleKeyboard.print(0, "Ready!");
     * }
     * @async 
     */
    isPaired: function (idx) {
        var rst = jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 15, 'idx': idx });
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 查询距离上次发送 HID 报告的毫秒数。
     * 可用于判断何时进入休眠状态。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {Promise<number>} 空闲时间（毫秒）。
     * @example
     * let idle = await bleKeyboard.getIdleTime(0);
     * if (idle > 60000) {
     *     console.log("键盘空闲超过1分钟");
     * }
     * 
     * @async
     */
    getIdleTime: function (idx) {
        var rst = jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 16, 'idx': idx });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 查询是否已存储配对信息（绑定状态）。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {Promise<boolean>} true 已绑定，false 未绑定。
     * @example
     * if (await bleKeyboard.isBonded(0)) {
     *     console.log("已配对，可快速重连");
     * }
     * 
     * @async
     */
    isBonded: function (idx) {
        var rst = jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 17, 'idx': idx });
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 清除所有存储的配对信息。
     * 下次连接将强制重新配对。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * bleKeyboard.clearBonds(0);
     */
    clearBonds: function (idx) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 18, 'idx': idx });
    },

    /**
     * 设置电池电量（更新蓝牙电池服务）。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} l - 电池电量百分比，必传，范围 1-100。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * bleKeyboard.setBattery(0, 75);
     */
    setBattery: function (idx, l) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 19, 'idx': idx, 'l': l });
    },

    /**
     * 设置全局按键保持时间（按下到释放的时长）。
     * 默认 25ms，主机丢失按键时适当增加。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} d - 保持时间(ms)，必传，建议 15-100。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * // iOS 设备建议 40-50ms
     * bleKeyboard.setTapDelay(0, 50);
     */
    setTapDelay: function (idx, d) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 20, 'idx': idx, 'd': d });
    },

    /**
     * 设置全局按键间隔时间（释放到下次按下的间隔）。
     * 默认 25ms，连续按键丢失时适当增加。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} g - 间隔时间(ms)，必传，建议 15-100。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * bleKeyboard.setKeyGap(0, 30);
     */
    setKeyGap: function (idx, g) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 21, 'idx': idx, 'g': g });
    },

    /**
     * 设置 BLE 发射功率。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} p - 功率级别 1-8，必传。
     *                      1=-12dBm(最低)，8=+9dBm(最高，默认)。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * // 降低功耗，短距离使用
     * bleKeyboard.setTxPower(0, 3);
     */
    setTxPower: function (idx, p) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 22, 'idx': idx, 'p': p });
    },

    /**
     * 设置配对安全模式。必须在 create() 之前调用。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} m - 安全模式，必传。
     *                      SEC_JUSTWORKS(0): 自动配对(默认)
     *                      SEC_PASSKEY(1): 数字比较，显示6位代码
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * bleKeyboard.setSecurity(0, bleKeyboard.SEC_PASSKEY);
     * bleKeyboard.create(0);
     */
    setSecurity: function (idx, m) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 23, 'idx': idx, 'm': m });
    },

    /**
     * 启用/禁用随机静态 BLE 地址。
     * 必须在 create() 之前调用。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {boolean} v - true 启用随机地址，false 使用固定MAC(默认)。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * // 解决 Android 配对缓存问题
     * bleKeyboard.setRandomAddr(0, true);
     * bleKeyboard.create(0);
     */
    setRandomAddr: function (idx, v) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 24, 'idx': idx, 'v': v ? 1 : 0 });
    },

    /**
     * 设置日志输出级别。必须在 create() 之前调用。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} l - 日志级别，必传。
     *                      LOG_OFF(0): 关闭(默认)
     *                      LOG_NORMAL(1): 连接/配对事件
     *                      LOG_VERBOSE(2): 包含所有HID报告
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * bleKeyboard.setLogLevel(0, bleKeyboard.LOG_NORMAL);
     */
    setLogLevel: function (idx, l) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 25, 'idx': idx, 'l': l });
    },

    /**
     * 查询 Num Lock 状态。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {Promise<boolean>} true 已开启，false 已关闭。
     * @example
     * if (await bleKeyboard.isNumLock(0)) {
     *     console.log("Num Lock 已开启");
     * }
     * 
     * @async
     */
    isNumLock: function (idx) {
        var rst = jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 26, 'idx': idx });
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 查询 Caps Lock 状态。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {Promise<boolean>} true 已开启，false 已关闭。
     * @example
     * if (await bleKeyboard.isCapsLock(0)) {
     *     console.log("Caps Lock 已开启");
     * }
     * 
     * @async
     */
    isCapsLock: function (idx) {
        var rst = jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 27, 'idx': idx });
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 查询 Scroll Lock 状态。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {Promise<boolean>} true 已开启，false 已关闭。
     * @example
     * if (await bleKeyboard.isScrollLock(0)) {
     *     console.log("Scroll Lock 已开启");
     * }
     * 
     * @async
     */
    isScrollLock: function (idx) {
        var rst = jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 28, 'idx': idx });
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 在轻度睡眠前调用。
     * 释放所有按键、停止空闲定时器、设置唤醒标记。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * bleKeyboard.beforeSleep(0);
     * esp_light_sleep_start();
     */
    beforeSleep: function (idx) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 29, 'idx': idx });
    },

    /**
     * 在轻度睡眠后调用。
     * 处理重新连接、LTK 重新加密、稳定等待等完整序列。
     * 
     * @param {number} idx - 设备索引，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * esp_light_sleep_start();
     * bleKeyboard.afterWake(0);
     */
    afterWake: function (idx) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 30, 'idx': idx });
    },

    /**
     * 设置 afterWake() 的总超时时间。
     * 默认 15000ms，必须大于 0。
     * 
     * @param {number} idx - 设备索引，必传。
     * @param {number} to - 超时时间(ms)，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少idx参数，3 实例不存在。
     *                   - c: true 已连接，false 未连接
     *                   - p: true 已配对，false 未配对
     * @example
     * bleKeyboard.setWakeTimeout(0, 10000);
     */
    setWakeTimeout: function (idx, to) {
        return jm.s({ '_fn': bleKeyboardDefId, 'ty': bleKeyboardType, 'op': 31, 'idx': idx, 'to': to });
    },

    // ================================================================
    //  便捷组合方法 (兼容旧版命名)
    // ================================================================

    /**
     * 创建键盘实例 (create 的别名，兼容旧版)
     * @deprecated 推荐使用 create()
     */
    createBleKeyboard: function (idx, name, manufacturer, level) {
        return this.create(idx, name, manufacturer, level);
    },

    /**
     * 设置延迟 (setTapDelay 的别名，兼容旧版)
     * @deprecated 推荐使用 setTapDelay()
     */
    setDelay: function (idx, delay) {
        return this.setTapDelay(idx, delay);
    },

    /**
     * 设置电池 (setBattery 的别名，兼容旧版)
     * @deprecated 推荐使用 setBattery()
     */
    setBatteryLevel: function (idx, level) {
        return this.setBattery(idx, level);
    }
};

// exports = bleKeyboard;
// module.exports = bleKeyboard;