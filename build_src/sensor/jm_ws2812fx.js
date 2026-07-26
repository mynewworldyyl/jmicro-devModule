/**
 * 对库的JS 1:1封装 https://github.com/kitesurfer1404/WS2812FX/tree/v1.4.6
 * 
 * 本模块提供了与WS2812FX LED灯带交互的功能，可用于控制灯带的各种特效、颜色、亮度等操作。
 * 它定义了一系列方法，涵盖了灯带实例创建、特效模式控制、颜色设置、亮度调节、分段管理等功能。
 * 使用时方法名称前一定要带上ws2812fx.前缀
 * createWs2812fx方法会同步初始化灯带实例并启动特效运行
 * 高频输出日志可能影响灯光效果
 * 底层默认为STATIC_MODE，其自动刷新显示并实现WS2812FX支持的各种效果
 * 在自定义灯珠颜色效果时，需要通过stop方法停掉底层的自动刷新显示功能，并调用execShow实现刷新显示
 * 
 * @module WS2812FX LED灯带模块
 * @var ws2812fx
 * @category led
 * @keywords WS2812FX,WS2812,LED,灯带,特效,RGB,NeoPixel,Arduino库
 * @capabilities createWs2812fx,start,stop,pause,resume,stripOff,fadeOut,setMode,setOptions,setSpeed,setColor,setBrightness,setSegment,resetSegments,addActiveSegment,removeActiveSegment,trigger,setCycle,getMode,getSpeed,getColor,getLength,isRunning
 * @depends 无
 */

let wsType = 65521;
let ws2812fxDefId = 20;

var ws2812fx = {
    // 颜色常量
    BLACK:   0x000000,
    RED:     0xFF0000,
    GREEN:   0x00FF00,
    BLUE:    0x0000FF,
    WHITE:   0xFFFFFF,
    YELLOW:  0xFFFF00,
    CYAN:    0x00FFFF,
    MAGENTA: 0xFF00FF,
    PURPLE:  0x400080,
    ORANGE:  0xFF3000,
    PINK:    0xFF1493,
    GRAY:    0x101010,

 // 特效模式常量 (根据官方 v1.4.6 modes_arduino.h 完整定义)
    // 基础模式 (0-12)
    MODE_STATIC:                0, // 静态 Static
    MODE_BLINK:                 1, // 闪烁 Blink
    MODE_BREATH:                2, // 呼吸 Breath
    MODE_COLOR_WIPE:            3, // 颜色擦除 Color Wipe
    MODE_COLOR_WIPE_INV:        4, // 反向颜色擦除 Color Wipe Inverse
    MODE_COLOR_WIPE_REV:        5, // 反转颜色擦除 Color Wipe Reverse
    MODE_COLOR_WIPE_REV_INV:    6, // 反向反转颜色擦除 Color Wipe Reverse Inverse
    MODE_COLOR_WIPE_RANDOM:     7, // 随机颜色擦除 Color Wipe Random
    MODE_RANDOM_COLOR:          8, // 随机颜色 Random Color
    MODE_SINGLE_DYNAMIC:        9, // 单动态 Single Dynamic
    MODE_MULTI_DYNAMIC:         10, // 多动态 Multi Dynamic
    MODE_RAINBOW:               11, // 彩虹 Rainbow
    MODE_RAINBOW_CYCLE:         12, // 彩虹循环 Rainbow Cycle

    // 扫描和渐变模式 (13-17)
    MODE_SCAN:                  13, // 扫描 Scan
    MODE_DUAL_SCAN:             14, // 双扫描 Dual Scan
    MODE_FADE:                  15, // 渐变 Fade
    MODE_THEATER_CHASE:         16, // 剧院追逐 Theater Chase
    MODE_THEATER_CHASE_RAINBOW: 17, // 彩虹剧院追逐 Theater Chase Rainbow

    // 流水和闪烁模式 (18-29)
    MODE_RUNNING_LIGHTS:        18, // 流水灯 Running Lights
    MODE_TWINKLE:               19, // 闪烁 Twinkle
    MODE_TWINKLE_RANDOM:        20, // 随机闪烁 Twinkle Random
    MODE_TWINKLE_FADE:          21, // 渐隐闪烁 Twinkle Fade
    MODE_TWINKLE_FADE_RANDOM:   22, // 随机渐隐闪烁 Twinkle Fade Random
    MODE_SPARKLE:               23, // 火花 Sparkle
    MODE_FLASH_SPARKLE:         24, // 闪光火花 Flash Sparkle
    MODE_HYPER_SPARKLE:         25, // 超级火花 Hyper Sparkle
    MODE_STROBE:                26, // 频闪 Strobe
    MODE_STROBE_RAINBOW:        27, // 彩虹频闪 Strobe Rainbow
    MODE_MULTI_STROBE:          28, // 多重频闪 Multi Strobe
    MODE_BLINK_RAINBOW:         29, // 彩虹闪烁 Blink Rainbow

    // 追逐模式 (30-38)
    MODE_CHASE_WHITE:           30, // 白色追逐 Chase White
    MODE_CHASE_COLOR:           31, // 彩色追逐 Chase Color
    MODE_CHASE_RANDOM:          32, // 随机追逐 Chase Random
    MODE_CHASE_RAINBOW:         33, // 彩虹追逐 Chase Rainbow
    MODE_CHASE_FLASH:           34, // 闪光追逐 Chase Flash
    MODE_CHASE_FLASH_RANDOM:    35, // 随机闪光追逐 Chase Flash Random
    MODE_CHASE_RAINBOW_WHITE:   36, // 彩虹白色追逐 Chase Rainbow White
    MODE_CHASE_BLACKOUT:        37, // 熄灭追逐 Chase Blackout
    MODE_CHASE_BLACKOUT_RAINBOW:38, // 彩虹熄灭追逐 Chase Blackout Rainbow

    // 高级特效模式 (39-56)
    MODE_COLOR_SWEEP_RANDOM:    39, // 随机颜色扫描 Color Sweep Random
    MODE_RUNNING_COLOR:         40, // 彩色流水 Running Color
    MODE_RUNNING_RED_BLUE:      41, // 红蓝流水 Running Red Blue
    MODE_RUNNING_RANDOM:        42, // 随机流水 Running Random
    MODE_LARSON_SCANNER:        43, // 拉森扫描 Larson Scanner
    MODE_COMET:                 44, // 彗星 Comet
    MODE_FIREWORKS:             45, // 烟花 Fireworks
    MODE_FIREWORKS_RANDOM:      46, // 随机烟花 Fireworks Random
    MODE_MERRY_CHRISTMAS:       47, // 圣诞快乐 Merry Christmas
    MODE_FIRE_FLICKER:          48, // 火焰闪烁 Fire Flicker
    MODE_FIRE_FLICKER_SOFT:     49, // 柔和火焰 Fire Flicker (soft)
    MODE_FIRE_FLICKER_INTENSE:  50, // 剧烈火焰 Fire Flicker (intense)
    MODE_CIRCUS_COMBUSTUS:      51, // 马戏团燃烧 Circus Combustus
    MODE_HALLOWEEN:             52, // 万圣节 Halloween
    MODE_BICOLOR_CHASE:         53, // 双色追逐 Bicolor Chase
    MODE_TRICOLOR_CHASE:        54, // 三色追逐 Tricolor Chase
    MODE_TWINKLEFOX:            55, // TwinkleFOX
    MODE_RAIN:                  56, // 雨 Rain

    // 更多特效模式 (57-71)
    MODE_BLOCK_DISSOLVE:        57, // 方块溶解 Block Dissolve
    MODE_ICU:                   58, // ICU
    MODE_DUAL_LARSON:           59, // 双拉森 Dual Larson
    MODE_RUNNING_RANDOM2:       60, // 随机流水2 Running Random 2
    MODE_FILLER_UP:             61, // 填充 Filler Up
    MODE_RAINBOW_LARSON:        62, // 彩虹拉森 Rainbow Larson
    MODE_RAINBOW_FIREWORKS:     63, // 彩虹烟花 Rainbow Fireworks
    MODE_TRIFADE:               64, // 三重渐变 Trifade
    MODE_VU_METER:              65, // VU表 VU Meter
    MODE_HEARTBEAT:             66, // 心跳 Heartbeat
    MODE_BITS:                  67, // 比特 Bits
    MODE_MULTI_COMET:           68, // 多重彗星 Multi Comet
    MODE_FLIPBOOK:              69, // 翻页书 Flipbook
    MODE_POPCORN:               70, // 爆米花 Popcorn
    MODE_OSCILLATOR:            71, // 振荡器 Oscillator

    // 自定义模式 (72-79)
    MODE_CUSTOM:                72, // 自定义 Custom (向后兼容)
    MODE_CUSTOM_0:              72, // 自定义0 Custom 0
    MODE_CUSTOM_1:              73, // 自定义1 Custom 1
    MODE_CUSTOM_2:              74, // 自定义2 Custom 2
    MODE_CUSTOM_3:              75, // 自定义3 Custom 3
    MODE_CUSTOM_4:              76, // 自定义4 Custom 4
    MODE_CUSTOM_5:              77, // 自定义5 Custom 5
    MODE_CUSTOM_6:              78, // 自定义6 Custom 6
    MODE_CUSTOM_7:              79, // 自定义7 Custom 7



    // 分段选项常量
    NO_OPTIONS:   0b00000000,
    REVERSE:      0b10000000,
    FADE_XFAST:   0b00010000,
    FADE_FAST:    0b00100000,
    FADE_MEDIUM:  0b00110000,
    FADE_SLOW:    0b01000000,
    FADE_XSLOW:   0b01010000,
    FADE_XXSLOW:  0b01100000,
    FADE_GLACIAL: 0b01110000,
    GAMMA:        0b00001000,
    SIZE_SMALL:   0b00000000,
    SIZE_MEDIUM:  0b00000010,
    SIZE_LARGE:   0b00000100,
    SIZE_XLARGE:  0b00000110,

    /**
     * 创建一个WS2812FX灯带实例并初始化。
     * 此方法会同步初始化灯带实例并启动特效运行。所以如果没有调用过stop方法，不需要调用start方法
     * 
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} n - 灯珠数量，必传。
     * @param {number|undefined} t - LED类型，可选，默认为 NEO_GRB + NEO_KHZ800 (0x0052)。
     *                              常用类型：
     *                              0x0052: NEO_GRB + NEO_KHZ800
     *                              0x0006: NEO_RGB + NEO_KHZ800
     *                              0x0152: NEO_GRBW + NEO_KHZ800
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 缺少pin参数，3 缺少n参数。
     */
    createWs2812fx: function (pin, n, t) {
        var args = { "_fn": ws2812fxDefId, ty: wsType, op: 1, pin: pin, n: n };
        if (typeof t !== 'undefined') {
            args.t = t;
        }
        return jm.s(args);
    },

    /**
     * 重新初始化灯带实例。
     *  以下常量在所有API均可用
     * 特效模式常量（用于 setMode 和 setSegment）：
     * 基础模式 (0-12)
     * - ws2812fx.MODE_STATIC              (0)  : 静态 Static
     * - ws2812fx.MODE_BLINK               (1)  : 闪烁 Blink
     * - ws2812fx.MODE_BREATH              (2)  : 呼吸 Breath
     * - ws2812fx.MODE_COLOR_WIPE          (3)  : 颜色擦除 Color Wipe
     * - ws2812fx.MODE_COLOR_WIPE_INV      (4)  : 反向颜色擦除 Color Wipe Inverse
     * - ws2812fx.MODE_COLOR_WIPE_REV      (5)  : 反转颜色擦除 Color Wipe Reverse
     * - ws2812fx.MODE_COLOR_WIPE_REV_INV  (6)  : 反向反转颜色擦除 Color Wipe Reverse Inverse
     * - ws2812fx.MODE_COLOR_WIPE_RANDOM   (7)  : 随机颜色擦除 Color Wipe Random
     * - ws2812fx.MODE_RANDOM_COLOR        (8)  : 随机颜色 Random Color
     * - ws2812fx.MODE_SINGLE_DYNAMIC      (9)  : 单动态 Single Dynamic
     * - ws2812fx.MODE_MULTI_DYNAMIC       (10) : 多动态 Multi Dynamic
     * - ws2812fx.MODE_RAINBOW             (11) : 彩虹 Rainbow
     * - ws2812fx.MODE_RAINBOW_CYCLE       (12) : 彩虹循环 Rainbow Cycle
     * 
     * 扫描和渐变模式 (13-17)
     * - ws2812fx.MODE_SCAN                (13) : 扫描 Scan
     * - ws2812fx.MODE_DUAL_SCAN           (14) : 双扫描 Dual Scan
     * - ws2812fx.MODE_FADE                (15) : 渐变 Fade
     * - ws2812fx.MODE_THEATER_CHASE       (16) : 剧院追逐 Theater Chase
     * - ws2812fx.MODE_THEATER_CHASE_RAINBOW (17) : 彩虹剧院追逐 Theater Chase Rainbow
     * 
     * 流水和闪烁模式 (18-29)
     * - ws2812fx.MODE_RUNNING_LIGHTS      (18) : 流水灯 Running Lights
     * - ws2812fx.MODE_TWINKLE             (19) : 闪烁 Twinkle
     * - ws2812fx.MODE_TWINKLE_RANDOM      (20) : 随机闪烁 Twinkle Random
     * - ws2812fx.MODE_TWINKLE_FADE        (21) : 渐隐闪烁 Twinkle Fade
     * - ws2812fx.MODE_TWINKLE_FADE_RANDOM (22) : 随机渐隐闪烁 Twinkle Fade Random
     * - ws2812fx.MODE_SPARKLE             (23) : 火花 Sparkle
     * - ws2812fx.MODE_FLASH_SPARKLE       (24) : 闪光火花 Flash Sparkle
     * - ws2812fx.MODE_HYPER_SPARKLE       (25) : 超级火花 Hyper Sparkle
     * - ws2812fx.MODE_STROBE              (26) : 频闪 Strobe
     * - ws2812fx.MODE_STROBE_RAINBOW      (27) : 彩虹频闪 Strobe Rainbow
     * - ws2812fx.MODE_MULTI_STROBE        (28) : 多重频闪 Multi Strobe
     * - ws2812fx.MODE_BLINK_RAINBOW       (29) : 彩虹闪烁 Blink Rainbow
     * 
     * 追逐模式 (30-38)
     * - ws2812fx.MODE_CHASE_WHITE         (30) : 白色追逐 Chase White
     * - ws2812fx.MODE_CHASE_COLOR         (31) : 彩色追逐 Chase Color
     * - ws2812fx.MODE_CHASE_RANDOM        (32) : 随机追逐 Chase Random
     * - ws2812fx.MODE_CHASE_RAINBOW       (33) : 彩虹追逐 Chase Rainbow
     * - ws2812fx.MODE_CHASE_FLASH         (34) : 闪光追逐 Chase Flash
     * - ws2812fx.MODE_CHASE_FLASH_RANDOM  (35) : 随机闪光追逐 Chase Flash Random
     * - ws2812fx.MODE_CHASE_RAINBOW_WHITE (36) : 彩虹白色追逐 Chase Rainbow White
     * - ws2812fx.MODE_CHASE_BLACKOUT      (37) : 熄灭追逐 Chase Blackout
     * - ws2812fx.MODE_CHASE_BLACKOUT_RAINBOW (38) : 彩虹熄灭追逐 Chase Blackout Rainbow
     * 
     * 高级特效模式 (39-56)
     * - ws2812fx.MODE_COLOR_SWEEP_RANDOM  (39) : 随机颜色扫描 Color Sweep Random
     * - ws2812fx.MODE_RUNNING_COLOR       (40) : 彩色流水 Running Color
     * - ws2812fx.MODE_RUNNING_RED_BLUE    (41) : 红蓝流水 Running Red Blue
     * - ws2812fx.MODE_RUNNING_RANDOM      (42) : 随机流水 Running Random
     * - ws2812fx.MODE_LARSON_SCANNER      (43) : 拉森扫描 Larson Scanner
     * - ws2812fx.MODE_COMET               (44) : 彗星 Comet
     * - ws2812fx.MODE_FIREWORKS           (45) : 烟花 Fireworks
     * - ws2812fx.MODE_FIREWORKS_RANDOM    (46) : 随机烟花 Fireworks Random
     * - ws2812fx.MODE_MERRY_CHRISTMAS     (47) : 圣诞快乐 Merry Christmas
     * - ws2812fx.MODE_FIRE_FLICKER        (48) : 火焰闪烁 Fire Flicker
     * - ws2812fx.MODE_FIRE_FLICKER_SOFT   (49) : 柔和火焰 Fire Flicker (soft)
     * - ws2812fx.MODE_FIRE_FLICKER_INTENSE (50) : 剧烈火焰 Fire Flicker (intense)
     * - ws2812fx.MODE_CIRCUS_COMBUSTUS    (51) : 马戏团燃烧 Circus Combustus
     * - ws2812fx.MODE_HALLOWEEN           (52) : 万圣节 Halloween
     * - ws2812fx.MODE_BICOLOR_CHASE       (53) : 双色追逐 Bicolor Chase
     * - ws2812fx.MODE_TRICOLOR_CHASE      (54) : 三色追逐 Tricolor Chase
     * - ws2812fx.MODE_TWINKLEFOX          (55) : TwinkleFOX
     * - ws2812fx.MODE_RAIN                (56) : 雨 Rain
     * 
     * 更多特效模式 (57-71)
     * - ws2812fx.MODE_BLOCK_DISSOLVE      (57) : 方块溶解 Block Dissolve
     * - ws2812fx.MODE_ICU                 (58) : ICU
     * - ws2812fx.MODE_DUAL_LARSON         (59) : 双拉森 Dual Larson
     * - ws2812fx.MODE_RUNNING_RANDOM2     (60) : 随机流水2 Running Random 2
     * - ws2812fx.MODE_FILLER_UP           (61) : 填充 Filler Up
     * - ws2812fx.MODE_RAINBOW_LARSON      (62) : 彩虹拉森 Rainbow Larson
     * - ws2812fx.MODE_RAINBOW_FIREWORKS   (63) : 彩虹烟花 Rainbow Fireworks
     * - ws2812fx.MODE_TRIFADE             (64) : 三重渐变 Trifade
     * - ws2812fx.MODE_VU_METER            (65) : VU表 VU Meter
     * - ws2812fx.MODE_HEARTBEAT           (66) : 心跳 Heartbeat
     * - ws2812fx.MODE_BITS                (67) : 比特 Bits
     * - ws2812fx.MODE_MULTI_COMET         (68) : 多重彗星 Multi Comet
     * - ws2812fx.MODE_FLIPBOOK            (69) : 翻页书 Flipbook
     * - ws2812fx.MODE_POPCORN             (70) : 爆米花 Popcorn
     * - ws2812fx.MODE_OSCILLATOR          (71) : 振荡器 Oscillator
     * 
     * 自定义模式 (72-79)
     * - ws2812fx.MODE_CUSTOM              (72) : 自定义 Custom
     * - ws2812fx.MODE_CUSTOM_0            (72) : 自定义0 Custom 0
     * - ws2812fx.MODE_CUSTOM_1            (73) : 自定义1 Custom 1
     * - ws2812fx.MODE_CUSTOM_2            (74) : 自定义2 Custom 2
     * - ws2812fx.MODE_CUSTOM_3            (75) : 自定义3 Custom 3
     * - ws2812fx.MODE_CUSTOM_4            (76) : 自定义4 Custom 4
     * - ws2812fx.MODE_CUSTOM_5            (77) : 自定义5 Custom 5
     * - ws2812fx.MODE_CUSTOM_6            (78) : 自定义6 Custom 6
     * - ws2812fx.MODE_CUSTOM_7            (79) : 自定义7 Custom 7
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
       init: function (pin) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 2, 'pin': pin });
    },

    /**
     * 启动灯带特效运行。
     * createWs2812fx初始化时会自动调用start方法，一般无需再次调用此方法
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    start: function (pin) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 3, 'pin': pin });
    },

    /**
     * 停止灯带特效运行。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    stop: function (pin) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 4, 'pin': pin });
    },

    /**
     * 暂停灯带特效运行（保持当前状态）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    pause: function (pin) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 5, 'pin': pin });
    },

    /**
     * 恢复灯带特效运行（从暂停状态恢复）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    resume: function (pin) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 6, 'pin': pin });
    },

    /**
     * 关闭灯带所有灯珠（全部熄灭）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    stripOff: function (pin) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 7, 'pin': pin });
    },

    /**
     * 渐变熄灭灯带。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number|undefined} c - 渐变目标颜色值，可选，不传则使用默认行为（渐变到黑色）。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    fadeOut: function (pin, c) {
        var args = { '_fn': ws2812fxDefId, 'ty': wsType, 'op': 8, 'pin': pin };
        if (typeof c !== 'undefined') {
            args['c'] = c;
        }
        return jm.s(args);
    },

    /**
     * 设置灯带特效模式。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} m - 特效模式，必传，可使用 MODE_* 常量（如 ws2812fx.MODE_RAINBOW_CYCLE）。
     * @param {number|undefined} seg - 分段编号，可选，不传则设置当前活动分段。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    setMode: function (pin, m, seg) {
        var args = { '_fn': ws2812fxDefId, 'ty': wsType, 'op': 9, 'pin': pin, 'm': m };
        if (typeof seg !== 'undefined') {
            args['seg'] = seg;
        }
        return jm.s(args);
    },

    /**
     * 设置分段选项。
     * 选项可以通过位运算组合使用，例如：ws2812fx.REVERSE | ws2812fx.GAMMA | ws2812fx.FADE_MEDIUM
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} seg - 分段编号，必传。
     * @param {number} o - 选项值，必传，可使用 REVERSE、FADE_*、GAMMA、SIZE_* 等常量通过位运算组合。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    setOptions: function (pin, seg, o) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 10, 'pin': pin, 'seg': seg, 'o': o });
    },

    /**
     * 设置特效速度。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} s - 速度值，必传，范围 2-65535，值越大速度越慢。
     * @param {number|undefined} seg - 分段编号，可选，不传则设置当前活动分段。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    setSpeed: function (pin, s, seg) {
        var args = { '_fn': ws2812fxDefId, 'ty': wsType, 'op': 11, 'pin': pin, 's': s };
        if (typeof seg !== 'undefined') {
            args['seg'] = seg;
        }
        return jm.s(args);
    },

    /**
     * 增加特效速度（使特效变快）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} s - 速度增量值，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    increaseSpeed: function (pin, s) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 12, 'pin': pin, 's': s });
    },

    /**
     * 减少特效速度（使特效变慢）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} s - 速度减量值，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    decreaseSpeed: function (pin, s) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 13, 'pin': pin, 's': s });
    },

    /**
     * 设置颜色。
     * 支持多种调用方式：
     * - setColor(pin, c) : 设置当前分段颜色为32位颜色值
     * - setColor(pin, seg, c) : 设置指定分段颜色
     * - setColor(pin, r, g, b) : 设置当前分段颜色为RGB值（各分量0-255）
     * - setColor(pin, r, g, b, w) : 设置当前分段颜色为RGBW值（各分量0-255）
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} arg1 - 颜色值(32位) 或 分段编号 或 红色分量(0-255)。
     * @param {number|undefined} arg2 - 颜色值(32位) 或 绿色分量(0-255)。
     * @param {number|undefined} arg3 - 蓝色分量(0-255)。
     * @param {number|undefined} arg4 - 白色分量(0-255)，可选。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     * 
     * @example
     * // 使用颜色常量
     * ws2812fx.setColor(12, ws2812fx.RED);
     * // 使用RGB分量
     * ws2812fx.setColor(12, 255, 0, 0);
     * // 设置指定分段颜色
     * ws2812fx.setColor(12, 0, ws2812fx.BLUE);
     */
    setColor: function (pin, arg1, arg2, arg3, arg4) {
        var args = { '_fn': ws2812fxDefId, 'ty': wsType, 'op': 14, 'pin': pin };
        if (typeof arg3 !== 'undefined') {
            // RGB 或 RGBW 模式
            args['r'] = arg1;
            args['g'] = arg2;
            args['b'] = arg3;
            if (typeof arg4 !== 'undefined') {
                args['w'] = arg4;
            }
        } else if (typeof arg2 !== 'undefined') {
            // setColor(pin, seg, c) 模式
            args['seg'] = arg1;
            args['c'] = arg2;
        } else {
            // setColor(pin, c) 模式
            args['c'] = arg1;
        }
        return jm.s(args);
    },

    /**
     * 设置分段的多个颜色（用于多色特效）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} seg - 分段编号，必传。
     * @param {number} c1 - 第一个颜色值，必传。
     * @param {number|undefined} c2 - 第二个颜色值，可选。
     * @param {number|undefined} c3 - 第三个颜色值，可选。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    setColors: function (pin, seg, c1, c2, c3) {
        var args = { '_fn': ws2812fxDefId, 'ty': wsType, 'op': 15, 'pin': pin, 'seg': seg, 'c1': c1 };
        if (typeof c2 !== 'undefined') {
            args['c2'] = c2;
        }
        if (typeof c3 !== 'undefined') {
            args['c3'] = c3;
        }
        return jm.s(args);
    },

    /**
     * 用指定颜色填充指定范围的灯珠。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} c - 填充颜色值，必传。
     * @param {number} f - 起始灯珠索引，必传。
     * @param {number} cnt - 填充灯珠数量，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    fill: function (pin, c, f, cnt) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 16, 'pin': pin, 'c': c, 'f': f, 'cnt': cnt });
    },

    /**
     * 设置灯带亮度。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} b - 亮度值，必传，范围 0-255，0为最暗，255为最亮。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    setBrightness: function (pin, b) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 17, 'pin': pin, 'b': b });
    },

    /**
     * 增加亮度。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} s - 亮度增量值，必传，最终亮度不会超过255。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    increaseBrightness: function (pin, s) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 18, 'pin': pin, 's': s });
    },

    /**
     * 减少亮度。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} s - 亮度减量值，必传，最终亮度不会低于0。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    decreaseBrightness: function (pin, s) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 19, 'pin': pin, 's': s });
    },

    /**
     * 设置灯带长度（灯珠数量）。
     * 注意：更改长度会重新分配内存，可能影响正在运行的特效。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} n - 灯珠数量，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    setLength: function (pin, n) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 20, 'pin': pin, 'n': n });
    },

    /**
     * 增加灯带长度。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} s - 长度增量值（灯珠数量），必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    increaseLength: function (pin, s) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 21, 'pin': pin, 's': s });
    },

    /**
     * 减少灯带长度。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} s - 长度减量值（灯珠数量），必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    decreaseLength: function (pin, s) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 22, 'pin': pin, 's': s });
    },

    /**
     * 触发外部事件（用于声音同步等需要外部触发器的特效模式）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    trigger: function (pin) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 23, 'pin': pin });
    },

    /**
     * 设置循环模式。
     * 调用后当前特效将在下一个循环结束时触发 CYCLE 标志。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    setCycle: function (pin) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 24, 'pin': pin });
    },

    /**
     * 设置分段参数。
     * 分段用于将灯带划分为不同的区域，每个区域可以独立运行不同的特效。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} seg - 分段编号，必传，范围 0 到 (分段总数-1)。
     * @param {number} start - 分段起始灯珠索引，必传。
     * @param {number} stop - 分段结束灯珠索引，必传。
     * @param {number|undefined} m - 特效模式，可选，可使用 MODE_* 常量。
     * @param {number|undefined} c - 颜色值，可选，32位颜色值。
     * @param {number|undefined} s - 速度值，可选，范围 2-65535。
     * @param {number|boolean|undefined} revOrOptions - 反向(bool) 或 选项值(number)，可选。
     *                                                 传 boolean 设置反向动画，
     *                                                 传 number 设置选项值（可使用位运算组合多个选项）。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     * 
     * @example
     * // 设置分段0为彗星特效，蓝色，速度3000
     * ws2812fx.setSegment(12, 0, 0, 11, ws2812fx.MODE_COMET, ws2812fx.BLUE, 3000);
     * // 设置分段1为彩虹特效，并启用反向和伽马校正
     * ws2812fx.setSegment(12, 1, 12, 23, ws2812fx.MODE_RAINBOW, ws2812fx.RED, 5000, ws2812fx.REVERSE | ws2812fx.GAMMA);
     */
    setSegment: function (pin, seg, start, stop, m, c, s, revOrOptions) {
        var args = { '_fn': ws2812fxDefId, 'ty': wsType, 'op': 25, 'pin': pin, 'seg': seg, 'start': start, 'stop': stop };
        if (typeof m !== 'undefined') {
            args['m'] = m;
        }
        if (typeof c !== 'undefined') {
            args['c'] = c;
        }
        if (typeof s !== 'undefined') {
            args['s'] = s;
        }
        if (typeof revOrOptions === 'boolean') {
            args['rev'] = revOrOptions;
        } else if (typeof revOrOptions === 'number') {
            args['options'] = revOrOptions;
        }
        return jm.s(args);
    },

    /**
     * 重置所有分段。
     * 将分段恢复到默认状态（单个分段覆盖整个灯带）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    resetSegments: function (pin) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 26, 'pin': pin });
    },

    /**
     * 设置分段数量。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} seg - 分段数量，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    setNumSegments: function (pin, seg) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 27, 'pin': pin, 'seg': seg });
    },

    /**
     * 添加活动分段。
     * 活动分段是当前正在运行特效的分段。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} seg - 分段编号，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    addActiveSegment: function (pin, seg) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 28, 'pin': pin, 'seg': seg });
    },

    /**
     * 移除活动分段。
     * 移除后该分段将停止运行特效。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} seg - 分段编号，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    removeActiveSegment: function (pin, seg) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 29, 'pin': pin, 'seg': seg });
    },

    /**
     * 交换活动分段。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} oldSeg - 旧分段编号，必传。
     * @param {number} newSeg - 新分段编号，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    swapActiveSegment: function (pin, oldSeg, newSeg) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 30, 'pin': pin, 'oldSeg': oldSeg, 'newSeg': newSeg });
    },

    /**
     * 设置指定灯珠的颜色。
     * 支持两种调用方式：
     * - setPixelColor(pin, n, c) : 设置第n个灯珠为32位颜色值c
     * - setPixelColor(pin, n, r, g, b[, w]) : 设置第n个灯珠为RGB(W)颜色
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} n - 灯珠索引，必传，从0开始。
     * @param {number} arg2 - 颜色值(32位) 或 红色分量(0-255)。
     * @param {number|undefined} arg3 - 绿色分量(0-255)。
     * @param {number|undefined} arg4 - 蓝色分量(0-255)。
     * @param {number|undefined} arg5 - 白色分量(0-255)，可选，仅RGBW灯带有效。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     * 
     * @example
     * // 使用颜色常量设置第0个灯珠
     * ws2812fx.setPixelColor(12, 0, ws2812fx.RED);
     * // 使用RGB分量设置第5个灯珠
     * ws2812fx.setPixelColor(12, 5, 255, 0, 0);
     */
    setPixelColor: function (pin, n, arg2, arg3, arg4, arg5) {
        var args = { '_fn': ws2812fxDefId, 'ty': wsType, 'op': 31, 'pin': pin, 'n': n };
        if (typeof arg3 !== 'undefined') {
            args['r'] = arg2;
            args['g'] = arg3;
            args['b'] = arg4;
            if (typeof arg5 !== 'undefined') {
                args['w'] = arg5;
            }
        } else {
            args['c'] = arg2;
        }
        return jm.s(args);
    },

    /**
     * 设置随机种子。
     * 用于控制随机特效的可重复性。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} seed - 随机种子值，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    setRandomSeed: function (pin, seed) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 32, 'pin': pin, 'seed': seed });
    },

    /**
     * 手动触发show刷新（将像素数据输出到灯带）。
     * 某些情况下可以手动触发。
     * 调用此方法实现手动触发时，一定要通过stop方法停掉底层的自动刷新任务，否则灯光会错乱
     * 
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    execShow: function (pin) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 75, 'pin': pin });
    },

    /**
     * 复制像素数据。
     * 将一段像素数据复制到另一段位置。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} d - 目标起始索引，必传。
     * @param {number} s - 源起始索引，必传。
     * @param {number} c - 复制数量，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    copyPixels: function (pin, d, s, c) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 76, 'pin': pin, 'd': d, 's': s, 'c': c });
    },

    /**
     * 设置原始像素颜色（绕过颜色校正，直接写入像素数据）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} n - 灯珠索引，必传。
     * @param {number} c - 原始颜色值，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，2 缺少pin参数，5 实例不存在。
     */
    setRawPixelColor: function (pin, n, c) {
        return jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 77, 'pin': pin, 'n': n, 'c': c });
    },

    // ========== 查询类方法 ==========
    // 查询类方法的返回值对象中：
    // - code: 0 成功，非0失败
    // - v: 查询结果值，类型见各方法说明

    /**
     * 查询灯带是否正在运行。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {boolean} 。
     */
    isRunning: function (pin) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 50, 'pin': pin });
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 查询灯带是否被触发（用于外部触发器同步的特效）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {boolean} 
     */
    isTriggered: function (pin) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 51, 'pin': pin });
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 查询是否为帧更新时刻（当前帧是否需要刷新显示）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number|undefined} seg - 分段编号，可选，不传则查询当前活动分段。
     * @returns {boolean} 
     */
    isFrame: function (pin, seg) {
        var args = { '_fn': ws2812fxDefId, 'ty': wsType, 'op': 52, 'pin': pin };
        if (typeof seg !== 'undefined') {
            args['seg'] = seg;
        }
        var rst = jm.s(args);
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 查询是否为循环结束时刻。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number|undefined} seg - 分段编号，可选，不传则查询当前活动分段。
     * @returns {boolean} 
     */
    isCycle: function (pin, seg) {
        var args = { '_fn': ws2812fxDefId, 'ty': wsType, 'op': 53, 'pin': pin };
        if (typeof seg !== 'undefined') {
            args['seg'] = seg;
        }
        var rst = jm.s(args);
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 查询指定分段是否为活动分段。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} seg - 分段编号，必传。
     * @returns {boolean} 
     */
    isActiveSegment: function (pin, seg) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 54, 'pin': pin, 'seg': seg });
        return rst && rst.code === 0 ? rst.v : false;
    },

    /**
     * 获取当前特效模式。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number|undefined} seg - 分段编号，可选，不传则获取当前活动分段。
     * @returns {number} 特效模式
     */
    getMode: function (pin, seg) {
        var args = { '_fn': ws2812fxDefId, 'ty': wsType, 'op': 55, 'pin': pin };
        if (typeof seg !== 'undefined') {
            args['seg'] = seg;
        }
        var rst = jm.s(args);
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取可用的特效模式数量。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {number} 特效模式数量
     */
    getModeCount: function (pin) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 56, 'pin': pin });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取当前特效速度。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number|undefined} seg - 分段编号，可选，不传则获取当前活动分段。
     * @returns {number} 特效速度
     */
    getSpeed: function (pin, seg) {
        var args = { '_fn': ws2812fxDefId, 'ty': wsType, 'op': 57, 'pin': pin };
        if (typeof seg !== 'undefined') {
            args['seg'] = seg;
        }
        var rst = jm.s(args);
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取当前颜色。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number|undefined} seg - 分段编号，可选，不传则获取当前活动分段。
     * @returns {number} 当前颜色
     */
    getColor: function (pin, seg) {
        var args = { '_fn': ws2812fxDefId, 'ty': wsType, 'op': 58, 'pin': pin };
        if (typeof seg !== 'undefined') {
            args['seg'] = seg;
        }
        var rst = jm.s(args);
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取灯带长度（灯珠数量）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {number} 灯珠数量
     */
    getLength: function (pin) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 59, 'pin': pin });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取分段数量。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {number} 分段数量
     */
    getNumSegments: function (pin) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 60, 'pin': pin });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取分段选项。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} seg - 分段编号，必传。
     * @returns {number} 分段选项
     */
    getOptions: function (pin, seg) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 61, 'pin': pin, 'seg': seg });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取每个像素的字节数。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {number}
     */
    getNumBytesPerPixel: function (pin) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 62, 'pin': pin });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取像素数据总字节数。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {number} 素数据总字节数
     */
    getNumBytes: function (pin) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 63, 'pin': pin });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取当前亮度。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {number} 亮度
     */
    getBrightness: function (pin) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 64, 'pin': pin });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取灯珠数量（同 getLength）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns {number} 灯珠数量
     */
    numPixels: function (pin) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 65, 'pin': pin });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取指定灯珠的颜色。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} n - 灯珠索引，必传。
     * @returns {number} 颜色值
     */
    getPixelColor: function (pin, n) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 66, 'pin': pin, 'n': n });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取色轮颜色。
     * 色轮是一个0-255的颜色循环，用于彩虹等特效。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} pos - 色轮位置(0-255)，必传。
     * @returns {number} -  (number): 32位颜色值
     */
    colorWheel: function (pin, pos) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 67, 'pin': pin, 'pos': pos });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 颜色混合。
     * 将两个颜色按比例混合。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} c1 - 第一个颜色值，必传。
     * @param {number} c2 - 第二个颜色值，必传。
     * @param {number} ratio - 混合比例(0-255)，必传，0=完全c1，255=完全c2。
     * @returns {number} v (number): 32位颜色值
     */
    colorBlend: function (pin, c1, c2, ratio) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 68, 'pin': pin, 'c1': c1, 'c2': c2, 'ratio': ratio });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 生成随机8位值。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number|undefined} max - 最大值，可选，不传则返回 0-255。
     * @returns v (number): 8位颜色值
     */
    random8: function (pin, max) {
        var args = { '_fn': ws2812fxDefId, 'ty': wsType, 'op': 69, 'pin': pin };
        if (typeof max !== 'undefined') {
            args['max'] = max;
        }
        var rst = jm.s(args);
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 生成随机16位值。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number|undefined} max - 最大值，可选，不传则返回 0-65535。
     * @returns {number} v (number): 16位颜色值
     */
    random16: function (pin, max) {
        var args = { '_fn': ws2812fxDefId, 'ty': wsType, 'op': 70, 'pin': pin };
        if (typeof max !== 'undefined') {
            args['max'] = max;
        }
        var rst = jm.s(args);
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取原始像素颜色（绕过颜色校正，直接读取像素数据）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @param {number} n - 灯珠索引，必传。
     * @returns {number} 颜色
     */
    getRawPixelColor: function (pin, n) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 71, 'pin': pin, 'n': n });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取亮度总和（所有像素亮度值的总和）。
     * 
     * @param {number} pin - 灯带数据引脚编号，必传。
     * @returns  {number} 
     */
    intensitySum: function (pin) {
        var rst = jm.s({ '_fn': ws2812fxDefId, 'ty': wsType, 'op': 72, 'pin': pin });
        return rst && rst.code === 0 ? rst.v : 0;
    }
};

//exports = ws2812fx;

module.exports = ws2812fx;
