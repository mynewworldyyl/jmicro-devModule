/**
 * 对库 https://github.com/Bodmer/TFT_eSPI 的JS API封装
 * 本模块提供了与TFT_eSPI显示屏交互的功能，可用于控制TFT彩屏的各种操作，如绘制图形、显示文本、设置显示参数等。
 * 它定义了一系列方法，涵盖了基本图形绘制（如线条、矩形、圆形、三角形、椭圆等）、文本显示（打印字符、字符串、数字、浮点数等）、
 * 屏幕设置（如清屏、旋转、视口等）以及位图绘制等功能。
 * 使用时方法名称前一定要带上tft.前缀
 * createTft方法会同步初始化TFT_eSPI实例
 * 
 
 * 
 * @module TFT_eSPI显示屏模块
 * @var tft
 * @category display
 * @keywords TFT,彩屏,图形绘制,文本显示,位图,SPI,Arduino库
 * @capabilities drawPixel,drawLine,drawFastVLine,drawFastHLine,fillRect,drawRect,fillScreen,drawCircle,fillCircle,drawRoundRect,fillRoundRect,drawEllipse,fillEllipse,drawTriangle,fillTriangle,drawChar,drawString,drawNumber,drawFloat,setCursor,setTextColor,setTextSize,setTextDatum,setTextWrap,setRotation,setOrigin,invertDisplay,setViewport,resetViewport,frameViewport,pushImage,readPixel,readRect,pushRect,setSwapBytes,color565,alphaBlend,startWrite,endWrite,width,height,getRotation,getCursorX,getCursorY,getOriginX,getOriginY,getViewportX,getViewportY,getViewportWidth,getViewportHeight,getTextDatum,getTextPadding,getSwapBytes,initDMA,dmaBusy,dmaWait,createTft,drawSmoothCircle,drawWideLine
 * @depends 无
 */

let tftDefId = 3;  // 功能ID，与C++端注册的ID对应

/**
 * 辅助函数，用于判断参数 `flush` 是否为 `undefined`。
 * 如果 `flush` 为 `undefined`，则返回 `true`；否则返回 `flush` 本身。
 * 
 * @param {boolean|undefined} flush - 用于判断的布尔值参数。
 * @returns {boolean} - 根据 `flush` 是否为 `undefined` 返回相应结果。
 */
function f(flush) {
    return typeof flush === 'undefined' ? false : flush;
}

/**
 * 辅助函数，用于判断参数 `flush` 是否为 `undefined`。
 * 如果 `flush` 为 `undefined`，则返回默认值 `def`；否则返回 `flush` 本身。
 * 
 * @param {any|undefined} flush - 用于判断的参数。
 * @param {any} def - 默认值。
 * @returns {any} - 根据 `flush` 是否为 `undefined` 返回相应结果。
 */
function fd(flush, def) {
    return typeof flush === 'undefined' ? def : flush;
}

var tft = {
    // ==================== 颜色常量 ====================
    BLACK: 0x0000,
    NAVY: 0x000F,
    DARKGREEN: 0x03E0,
    DARKCYAN: 0x03EF,
    MAROON: 0x7800,
    PURPLE: 0x780F,
    OLIVE: 0x7BE0,
    LIGHTGREY: 0xD69A,
    DARKGREY: 0x7BEF,
    BLUE: 0x001F,
    GREEN: 0x07E0,
    CYAN: 0x07FF,
    RED: 0xF800,
    MAGENTA: 0xF81F,
    YELLOW: 0xFFE0,
    WHITE: 0xFFFF,
    ORANGE: 0xFDA0,
    GREENYELLOW: 0xB7E0,
    PINK: 0xFE19,
    BROWN: 0x9A60,
    GOLD: 0xFEA0,
    SILVER: 0xC618,
    SKYBLUE: 0x867D,
    VIOLET: 0x915C,
    
    // ==================== 文本对齐常量 ====================
    TL_DATUM: 0,  // 左上对齐
    TC_DATUM: 1,  // 顶部居中对齐
    TR_DATUM: 2,  // 右上对齐
    ML_DATUM: 3,  // 左中对齐
    CL_DATUM: 3,  // 左中对齐（同ML_DATUM）
    MC_DATUM: 4,  // 中心对齐
    CC_DATUM: 4,  // 中心对齐（同MC_DATUM）
    MR_DATUM: 5,  // 右中对齐
    CR_DATUM: 5,  // 右中对齐（同MR_DATUM）
    BL_DATUM: 6,  // 左下对齐
    BC_DATUM: 7,  // 底部居中对齐
    BR_DATUM: 8,  // 右下对齐
    L_BASELINE: 9,   // 左基线对齐
    C_BASELINE: 10,  // 中心基线对齐
    R_BASELINE: 11,  // 右基线对齐

    // ==================== 基础图形绘制 ====================

    /**
     * 在显示屏上绘制一个像素点。
     * 预定义颜色常量（16位RGB565格式）：
     * 以下常量在的有API均可用
     * @param {number} x - 像素点的 x 坐标。
     * @param {number} y - 像素点的 y 坐标。
     * @param {number} color - 像素点的颜色，可使用预定义的颜色常量。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    drawPixel: function (x, y, color, flush) {
        return jm.s({ "_fn": tftDefId, op: 1, x: x, y: y, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一条直线。
     * - tft.BLACK       (0x0000) : 黑色
    * - tft.NAVY        (0x000F) : 深蓝色
    * - tft.DARKGREEN   (0x03E0) : 深绿色
    * - tft.DARKCYAN    (0x03EF) : 深青色
    * - tft.MAROON      (0x7800) : 栗色
    * - tft.PURPLE      (0x780F) : 紫色
    * - tft.OLIVE       (0x7BE0) : 橄榄绿
    * - tft.LIGHTGREY   (0xD69A) : 浅灰色
    * - tft.DARKGREY    (0x7BEF) : 深灰色
    * - tft.BLUE        (0x001F) : 蓝色
    * - tft.GREEN       (0x07E0) : 绿色
    * - tft.CYAN        (0x07FF) : 青色
    * - tft.RED         (0xF800) : 红色
    * - tft.MAGENTA     (0xF81F) : 品红色
    * - tft.YELLOW      (0xFFE0) : 黄色
    * - tft.WHITE       (0xFFFF) : 白色
    * - tft.ORANGE      (0xFDA0) : 橙色
    * - tft.GREENYELLOW (0xB7E0) : 黄绿色
    * - tft.PINK        (0xFE19) : 粉色
    * - tft.BROWN       (0x9A60) : 棕色
    * - tft.GOLD        (0xFEA0) : 金色
    * - tft.SILVER      (0xC618) : 银色
    * - tft.SKYBLUE     (0x867D) : 天蓝色
    * - tft.VIOLET      (0x915C) : 紫罗兰色
    * 
    * 文本对齐常量：
    * - tft.TL_DATUM (0) : 左上对齐（默认）
    * - tft.TC_DATUM (1) : 顶部居中对齐
    * - tft.TR_DATUM (2) : 右上对齐
    * - tft.ML_DATUM (3) : 左中对齐
    * - tft.MC_DATUM (4) : 中心对齐
    * - tft.MR_DATUM (5) : 右中对齐
    * - tft.BL_DATUM (6) : 左下对齐
    * - tft.BC_DATUM (7) : 底部居中对齐
    * - tft.BR_DATUM (8) : 右下对齐
     * @param {number} x - 直线起点的 x 坐标。
     * @param {number} y - 直线起点的 y 坐标。
     * @param {number} x1 - 直线终点的 x 坐标。
     * @param {number} y1 - 直线终点的 y 坐标。
     * @param {number} color - 直线的颜色，可使用预定义的颜色常量。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    drawLine: function (x, y, x1, y1, color, flush) {
        return jm.s({ "_fn": tftDefId, op: 2, x: x, y: y, x1: x1, y1: y1, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一条垂直直线。
     * 
     * @param {number} x - 直线起点的 x 坐标。
     * @param {number} y - 直线起点的 y 坐标。
     * @param {number} h - 直线的高度（长度）。
     * @param {number} color - 直线的颜色，可使用预定义的颜色常量。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    drawFastVLine: function (x, y, h, color, flush) {
        return jm.s({ "_fn": tftDefId, op: 3, x: x, y: y, h: h, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一条水平直线。
     * 
     * @param {number} x - 直线起点的 x 坐标。
     * @param {number} y - 直线起点的 y 坐标。
     * @param {number} w - 直线的宽度（长度）。
     * @param {number} color - 直线的颜色，可使用预定义的颜色常量。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    drawFastHLine: function (x, y, w, color, flush) {
        return jm.s({ "_fn": tftDefId, op: 4, x: x, y: y, w: w, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个填充矩形。
     * 
     * @param {number} x - 矩形左上角的 x 坐标。
     * @param {number} y - 矩形左上角的 y 坐标。
     * @param {number} w - 矩形的宽度。
     * @param {number} h - 矩形的高度。
     * @param {number} color - 矩形的填充颜色，可使用预定义的颜色常量。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    fillRect: function (x, y, w, h, color, flush) {
        return jm.s({ "_fn": tftDefId, op: 5, x: x, y: y, w: w, h: h, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个矩形边框。
     * 
     * @param {number} x - 矩形左上角的 x 坐标。
     * @param {number} y - 矩形左上角的 y 坐标。
     * @param {number} w - 矩形的宽度。
     * @param {number} h - 矩形的高度。
     * @param {number} color - 矩形边框的颜色，可使用预定义的颜色常量。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    drawRect: function (x, y, w, h, color, flush) {
        return jm.s({ "_fn": tftDefId, op: 6, x: x, y: y, w: w, h: h, c: color, f: f(flush) });
    },

    /**
     * 用指定颜色填充整个显示屏。
     * 
     * @param {number} color - 填充颜色，可使用预定义的颜色常量。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    fillScreen: function (color) {
        return jm.s({ "_fn": tftDefId, op: 7, c: color });
    },

    // ==================== 圆形绘制 ====================

    /**
     * 在显示屏上绘制一个圆形边框。
     * 
     * @param {number} x - 圆心的 x 坐标。
     * @param {number} y - 圆心的 y 坐标。
     * @param {number} r - 圆的半径。
     * @param {number} color - 圆形边框的颜色，可使用预定义的颜色常量。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    drawCircle: function (x, y, r, color, flush) {
        return jm.s({ "_fn": tftDefId, op: 8, x: x, y: y, r: r, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个填充圆形。
     * 
     * @param {number} x - 圆心的 x 坐标。
     * @param {number} y - 圆心的 y 坐标。
     * @param {number} r - 圆的半径。
     * @param {number} color - 圆形的填充颜色，可使用预定义的颜色常量。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    fillCircle: function (x, y, r, color, flush) {
        return jm.s({ "_fn": tftDefId, op: 9, x: x, y: y, r: r, c: color, f: f(flush) });
    },

    // ==================== 圆角矩形绘制 ====================

    /**
     * 在显示屏上绘制一个圆角矩形边框。
     * 
     * @param {number} x - 圆角矩形左上角的 x 坐标。
     * @param {number} y - 圆角矩形左上角的 y 坐标。
     * @param {number} w - 圆角矩形的宽度。
     * @param {number} h - 圆角矩形的高度。
     * @param {number} radius - 圆角的半径。
     * @param {number} color - 圆角矩形边框的颜色，可使用预定义的颜色常量。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    drawRoundRect: function (x, y, w, h, radius, color, flush) {
        return jm.s({ "_fn": tftDefId, op: 10, x: x, y: y, w: w, h: h, rad: radius, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个填充的圆角矩形。
     * 
     * @param {number} x - 填充圆角矩形左上角的 x 坐标。
     * @param {number} y - 填充圆角矩形左上角的 y 坐标。
     * @param {number} w - 填充圆角矩形的宽度。
     * @param {number} h - 填充圆角矩形的高度。
     * @param {number} radius - 圆角的半径。
     * @param {number} color - 填充圆角矩形的颜色，可使用预定义的颜色常量。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    fillRoundRect: function (x, y, w, h, radius, color, flush) {
        return jm.s({ "_fn": tftDefId, op: 11, x: x, y: y, w: w, h: h, rad: radius, c: color, f: f(flush) });
    },

    // ==================== 三角形绘制 ====================

    /**
     * 在显示屏上绘制一个三角形边框。
     * 
     * @param {number} x0 - 三角形第一个顶点的 x 坐标。
     * @param {number} y0 - 三角形第一个顶点的 y 坐标。
     * @param {number} x1 - 三角形第二个顶点的 x 坐标。
     * @param {number} y1 - 三角形第二个顶点的 y 坐标。
     * @param {number} x2 - 三角形第三个顶点的 x 坐标。
     * @param {number} y2 - 三角形第三个顶点的 y 坐标。
     * @param {number} color - 三角形边框的颜色，可使用预定义的颜色常量。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    drawTriangle: function (x0, y0, x1, y1, x2, y2, color, flush) {
        return jm.s({ "_fn": tftDefId, op: 12, x: x0, y: y0, x1: x1, y1: y1, x2: x2, y2: y2, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个填充的三角形。
     * 
     * @param {number} x0 - 填充三角形第一个顶点的 x 坐标。
     * @param {number} y0 - 填充三角形第一个顶点的 y 坐标。
     * @param {number} x1 - 填充三角形第二个顶点的 x 坐标。
     * @param {number} y1 - 填充三角形第二个顶点的 y 坐标。
     * @param {number} x2 - 填充三角形第三个顶点的 x 坐标。
     * @param {number} y2 - 填充三角形第三个顶点的 y 坐标。
     * @param {number} color - 填充三角形的颜色，可使用预定义的颜色常量。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    fillTriangle: function (x0, y0, x1, y1, x2, y2, color, flush) {
        return jm.s({ "_fn": tftDefId, op: 13, x: x0, y: y0, x1: x1, y1: y1, x2: x2, y2: y2, c: color, f: f(flush) });
    },

    // ==================== 椭圆绘制 ====================

    /**
     * 在显示屏上绘制一个椭圆边框。
     * 
     * @param {number} x - 椭圆中心的 x 坐标。
     * @param {number} y - 椭圆中心的 y 坐标。
     * @param {number} rx - 椭圆的 x 轴半径。
     * @param {number} ry - 椭圆的 y 轴半径。
     * @param {number} color - 椭圆边框的颜色，可使用预定义的颜色常量。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    drawEllipse: function (x, y, rx, ry, color, flush) {
        return jm.s({ "_fn": tftDefId, op: 14, x: x, y: y, rx: rx, ry: ry, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个填充椭圆。
     * 
     * @param {number} x - 椭圆中心的 x 坐标。
     * @param {number} y - 椭圆中心的 y 坐标。
     * @param {number} rx - 椭圆的 x 轴半径。
     * @param {number} ry - 椭圆的 y 轴半径。
     * @param {number} color - 椭圆的填充颜色，可使用预定义的颜色常量。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    fillEllipse: function (x, y, rx, ry, color, flush) {
        return jm.s({ "_fn": tftDefId, op: 15, x: x, y: y, rx: rx, ry: ry, c: color, f: f(flush) });
    },

    // ==================== 文本相关 ====================

    /**
     * 在显示屏上绘制一个字符。
     * 
     * @param {number} x - 字符左上角的 x 坐标。
     * @param {number} y - 字符左上角的 y 坐标。
     * @param {string} ch - 要绘制的字符。
     * @param {number} color - 字符的前景颜色。
     * @param {number} bg - 字符的背景颜色。
     * @param {number} size - 字符的大小倍数。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    drawChar: function (x, y, ch, color, bg, size, flush) {
        return jm.s({ "_fn": tftDefId, op: 16, x: x, y: y, ch: ch, c: color, bg: bg, s: size, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个字符串。
     * 
     * @param {string} str - 要绘制的字符串。
     * @param {number} x - 字符串的 x 坐标。
     * @param {number} y - 字符串的 y 坐标。
     * @param {number} font - 字体编号（可选，1-8）。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    drawString: function (str, x, y, font, flush) {
        return jm.s({ "_fn": tftDefId, op: 17, str: str, x: x, y: y, fnt: fd(font, 0), f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个数字。
     * 
     * @param {number} num - 要绘制的数字。
     * @param {number} x - 数字的 x 坐标。
     * @param {number} y - 数字的 y 坐标。
     * @param {number} font - 字体编号（可选，1-8）。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    drawNumber: function (num, x, y, font, flush) {
        return jm.s({ "_fn": tftDefId, op: 18, num: num, x: x, y: y, fnt: fd(font, 0), f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个浮点数。
     * 
     * @param {number} val - 要绘制的浮点数。
     * @param {number} decimal - 小数点后的位数。
     * @param {number} x - 浮点数的 x 坐标。
     * @param {number} y - 浮点数的 y 坐标。
     * @param {number} font - 字体编号（可选，1-8）。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 false。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    drawFloat: function (val, decimal, x, y, font, flush) {
        return jm.s({ "_fn": tftDefId, op: 19, val: val, dec: decimal, x: x, y: y, fnt: fd(font, 0), f: f(flush) });
    },

    /**
     * 设置文本的光标位置。
     * 
     * @param {number} x - 光标位置的 x 坐标。
     * @param {number} y - 光标位置的 y 坐标。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    setCursor: function (x, y) {
        return jm.s({ "_fn": tftDefId, op: 20, x: x, y: y });
    },

    /**
     * 设置文本的光标位置和字体。
     * 
     * @param {number} x - 光标位置的 x 坐标。
     * @param {number} y - 光标位置的 y 坐标。
     * @param {number} font - 字体编号。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    setCursorWithFont: function (x, y, font) {
        return jm.s({ "_fn": tftDefId, op: 21, x: x, y: y, fnt: font });
    },

    /**
     * 设置文本颜色（无背景填充）。
     * 
     * @param {number} color - 文本颜色。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    setTextColor: function (color) {
        return jm.s({ "_fn": tftDefId, op: 22, c: color });
    },

    /**
     * 设置文本颜色和背景颜色。
     * 
     * @param {number} color - 文本前景颜色。
     * @param {number} bg - 文本背景颜色。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    setTextColorBg: function (color, bg) {
        return jm.s({ "_fn": tftDefId, op: 23, c: color, bg: bg });
    },

    /**
     * 设置文本大小倍数。
     * 
     * @param {number} size - 文本大小倍数（1为原始大小）。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    setTextSize: function (size) {
        return jm.s({ "_fn": tftDefId, op: 24, s: size });
    },

    /**
     * 设置文本对齐方式。
     * 
     * @param {number} datum - 对齐方式常量（如 tft.TL_DATUM, tft.MC_DATUM 等）。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    setTextDatum: function (datum) {
        return jm.s({ "_fn": tftDefId, op: 25, d: datum });
    },

    /**
     * 设置文本自动换行。
     * 
     * @param {boolean} wrapX - 是否水平方向自动换行。
     * @param {boolean} wrapY - 是否垂直方向自动换行（可选）。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    setTextWrap: function (wrapX, wrapY) {
        return jm.s({ "_fn": tftDefId, op: 26, wx: wrapX, wy: fd(wrapY, false) });
    },

    /**
     * 设置文本内边距（用于清除旧文本）。
     * 
     * @param {number} pad - 内边距宽度（像素）。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    setTextPadding: function (pad) {
        return jm.s({ "_fn": tftDefId, op: 27, pad: pad });
    },

    /**
     * 设置文本字体编号。
     * 
     * @param {number} font - 字体编号（1-8）。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    setTextFont: function (font) {
        return jm.s({ "_fn": tftDefId, op: 28, fnt: font });
    },

    // ==================== 旋转和变换 ====================

    /**
     * 设置显示屏的旋转角度。
     * 
     * @param {number} rot - 旋转角度（0-3，0=0°,1=90°,2=180°,3=270°）。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    setRotation: function (rot) {
        return jm.s({ "_fn": tftDefId, op: 29, rot: rot });
    },

    /**
     * 设置原点偏移。
     * 
     * @param {number} ox - X轴偏移量。
     * @param {number} oy - Y轴偏移量。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    setOrigin: function (ox, oy) {
        return jm.s({ "_fn": tftDefId, op: 30, ox: ox, oy: oy });
    },

    /**
     * 反转显示屏颜色。
     * 
     * @param {boolean} invert - 是否反转显示颜色。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    invertDisplay: function (invert) {
        return jm.s({ "_fn": tftDefId, op: 31, inv: invert });
    },

    // ==================== 视口操作 ====================

    /**
     * 设置显示视口。
     * 
     * @param {number} x - 视口左上角 x 坐标。
     * @param {number} y - 视口左上角 y 坐标。
     * @param {number} w - 视口宽度。
     * @param {number} h - 视口高度。
     * @param {boolean} vpDatum - 是否使用视口坐标作为新原点。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    setViewport: function (x, y, w, h, vpDatum) {
        return jm.s({ "_fn": tftDefId, op: 32, x: x, y: y, w: w, h: h, vpd: fd(vpDatum, true) });
    },

    /**
     * 重置视口到全屏。
     * 
     * @returns {any} - `jm.s` 函数的返回值。
     */
    resetViewport: function () {
        return jm.s({ "_fn": tftDefId, op: 33 });
    },

    /**
     * 绘制视口边框。
     * 
     * @param {number} color - 边框颜色。
     * @param {number} w - 边框宽度。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    frameViewport: function (color, w) {
        return jm.s({ "_fn": tftDefId, op: 34, c: color, fw: w });
    },

    // ==================== 图像推送 ====================

    /**
     * 推送16位RGB565图像到显示屏。
     * 
     * @param {number} x - 图像左上角 x 坐标。
     * @param {number} y - 图像左上角 y 坐标。
     * @param {number} w - 图像宽度。
     * @param {number} h - 图像高度。
     * @param {ArrayBuffer} img - 图像数据（16位RGB565格式）。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    pushImage: function (x, y, w, h, img) {
        return jm.s({ "_fn": tftDefId, op: 35, x: x, y: y, w: w, h: h, img: img });
    },

    /**
     * 推送带透明色的图像。
     * 
     * @param {number} x - 图像左上角 x 坐标。
     * @param {number} y - 图像左上角 y 坐标。
     * @param {number} w - 图像宽度。
     * @param {number} h - 图像高度。
     * @param {ArrayBuffer} img - 图像数据。
     * @param {number} transparent - 透明色值。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    pushImageTransparent: function (x, y, w, h, img, transparent) {
        return jm.s({ "_fn": tftDefId, op: 36, x: x, y: y, w: w, h: h, img: img, trans: transparent });
    },

    /**
     * 推送8位索引色图像。
     * 
     * @param {number} x - 图像左上角 x 坐标。
     * @param {number} y - 图像左上角 y 坐标。
     * @param {number} w - 图像宽度。
     * @param {number} h - 图像高度。
     * @param {ArrayBuffer} img - 图像数据（8位索引色）。
     * @param {boolean} bpp8 - 是否为8位色深（默认true）。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    pushImage8bit: function (x, y, w, h, img, bpp8) {
        return jm.s({ "_fn": tftDefId, op: 37, x: x, y: y, w: w, h: h, img: img, bpp8: fd(bpp8, true) });
    },

    /**
     * 设置图像字节交换模式（用于处理端序问题）。
     * 
     * @param {boolean} swap - 是否交换字节。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    setSwapBytes: function (swap) {
        return jm.s({ "_fn": tftDefId, op: 38, swap: swap });
    },

    // ==================== 像素读取 ====================

    /**
     * 读取指定位置的像素颜色值。
     * 
     * @param {number} x - 像素的 x 坐标。
     * @param {number} y - 像素的 y 坐标。
     * @returns {number} - 像素的16位RGB565颜色值。
     */
    readPixel: function (x, y) {
        var rst = jm.s({ "_fn": tftDefId, op: 39, x: x, y: y });
        return rst && rst.code === 0 ? rst.pixel : 0;
    },

    /**
     * 读取一块矩形区域的像素数据。
     * 
     * @param {number} x - 矩形区域左上角 x 坐标。
     * @param {number} y - 矩形区域左上角 y 坐标。
     * @param {number} w - 矩形区域宽度。
     * @param {number} h - 矩形区域高度。
     * @param {ArrayBuffer} buf - 存储像素数据的缓冲区。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    readRect: function (x, y, w, h, buf) {
        return jm.s({ "_fn": tftDefId, op: 40, x: x, y: y, w: w, h: h, buf: buf });
    },

    /**
     * 推送一块像素数据到矩形区域。
     * 
     * @param {number} x - 目标矩形区域左上角 x 坐标。
     * @param {number} y - 目标矩形区域左上角 y 坐标。
     * @param {number} w - 矩形区域宽度。
     * @param {number} h - 矩形区域高度。
     * @param {ArrayBuffer} buf - 像素数据缓冲区。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    pushRect: function (x, y, w, h, buf) {
        return jm.s({ "_fn": tftDefId, op: 41, x: x, y: y, w: w, h: h, buf: buf });
    },

    // ==================== 信息获取 ====================

    /**
     * 获取显示屏宽度。
     * 
     * @returns {number} - 显示屏宽度（像素）。
     */
    width: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 42 });
        return rst && rst.code === 0 ? rst.val : 0;
    },

    /**
     * 获取显示屏高度。
     * 
     * @returns {number} - 显示屏高度（像素）。
     */
    height: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 43 });
        return rst && rst.code === 0 ? rst.val : 0;
    },

    /**
     * 获取当前旋转角度。
     * 
     * @returns {number} - 旋转角度值（0-3）。
     */
    getRotation: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 44 });
        return rst && rst.code === 0 ? rst.val : 0;
    },

    /**
     * 获取光标X坐标。
     * 
     * @returns {number} - 光标X坐标。
     */
    getCursorX: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 45 });
        return rst && rst.code === 0 ? rst.val : 0;
    },

    /**
     * 获取光标Y坐标。
     * 
     * @returns {number} - 光标Y坐标。
     */
    getCursorY: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 46 });
        return rst && rst.code === 0 ? rst.val : 0;
    },

    /**
     * 获取原点X偏移。
     * 
     * @returns {number} - 原点X偏移值。
     */
    getOriginX: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 47 });
        return rst && rst.code === 0 ? rst.val : 0;
    },

    /**
     * 获取原点Y偏移。
     * 
     * @returns {number} - 原点Y偏移值。
     */
    getOriginY: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 48 });
        return rst && rst.code === 0 ? rst.val : 0;
    },

    /**
     * 获取视口X坐标。
     * 
     * @returns {number} - 视口左上角X坐标。
     */
    getViewportX: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 49 });
        return rst && rst.code === 0 ? rst.val : 0;
    },

    /**
     * 获取视口Y坐标。
     * 
     * @returns {number} - 视口左上角Y坐标。
     */
    getViewportY: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 50 });
        return rst && rst.code === 0 ? rst.val : 0;
    },

    /**
     * 获取视口宽度。
     * 
     * @returns {number} - 视口宽度。
     */
    getViewportWidth: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 51 });
        return rst && rst.code === 0 ? rst.val : 0;
    },

    /**
     * 获取视口高度。
     * 
     * @returns {number} - 视口高度。
     */
    getViewportHeight: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 52 });
        return rst && rst.code === 0 ? rst.val : 0;
    },

    /**
     * 获取文本对齐方式。
     * 
     * @returns {number} - 文本对齐常量值。
     */
    getTextDatum: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 53 });
        return rst && rst.code === 0 ? rst.val : 0;
    },

    /**
     * 获取文本内边距。
     * 
     * @returns {number} - 文本内边距（像素）。
     */
    getTextPadding: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 54 });
        return rst && rst.code === 0 ? rst.val : 0;
    },

    /**
     * 获取字节交换模式状态。
     * 
     * @returns {boolean} - 是否启用字节交换。
     */
    getSwapBytes: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 55 });
        return rst && rst.code === 0 ? rst.val : false;
    },

    // ==================== 颜色转换 ====================

    /**
     * 将RGB888颜色转换为RGB565格式。
     * 
     * @param {number} r - 红色分量（0-255）。
     * @param {number} g - 绿色分量（0-255）。
     * @param {number} b - 蓝色分量（0-255）。
     * @returns {number} - RGB565格式颜色值。
     */
    color565: function (r, g, b) {
        var rst = jm.s({ "_fn": tftDefId, op: 56, r: r, g: g, b: b });
        return rst && rst.code === 0 ? rst.rgb : 0;
    },

    /**
     * 对两个颜色进行Alpha混合。
     * 
     * @param {number} alpha - Alpha值（0-255，0=完全背景，255=完全前景）。
     * @param {number} fgc - 前景颜色（RGB565格式）。
     * @param {number} bgc - 背景颜色（RGB565格式）。
     * @returns {number} - 混合后的RGB565颜色值。
     */
    alphaBlend: function (alpha, fgc, bgc) {
        var rst = jm.s({ "_fn": tftDefId, op: 57, alpha: alpha, fgc: fgc, bgc: bgc });
        return rst && rst.code === 0 ? rst.blend : 0;
    },

    // ==================== DMA相关 ====================

    /**
     * 初始化DMA引擎。
     * 
     * @param {boolean} ctrl_cs - 是否让DMA控制片选信号。
     * @returns {boolean} - 初始化是否成功。
     */
    initDMA: function (ctrl_cs) {
        var rst = jm.s({ "_fn": tftDefId, op: 58, ctrl_cs: fd(ctrl_cs, false) });
        return rst && rst.code === 0 ? rst.success : false;
    },

    /**
     * 检查DMA是否正忙。
     * 
     * @returns {boolean} - DMA是否正忙。
     */
    dmaBusy: function () {
        var rst = jm.s({ "_fn": tftDefId, op: 59 });
        return rst && rst.code === 0 ? rst.busy : false;
    },

    /**
     * 等待DMA传输完成。
     * 
     * @returns {any} - `jm.s` 函数的返回值。
     */
    dmaWait: function () {
        return jm.s({ "_fn": tftDefId, op: 60 });
    },

    // ==================== 事务控制 ====================

    /**
     * 开始SPI写事务。
     * 
     * @returns {any} - `jm.s` 函数的返回值。
     */
    startWrite: function () {
        return jm.s({ "_fn": tftDefId, op: 61 });
    },

    /**
     * 结束SPI写事务。
     * 
     * @returns {any} - `jm.s` 函数的返回值。
     */
    endWrite: function () {
        return jm.s({ "_fn": tftDefId, op: 62 });
    },

    // ==================== 清理操作 ====================

    /**
     * 清除显示屏（填充黑色）。
     * 
     * @returns {any} - `jm.s` 函数的返回值。
     */
    clear: function () {
        return jm.s({ "_fn": tftDefId, op: 63 });
    },

    /**
     * 销毁TFT实例并释放资源。
     * 
     * @returns {any} - `jm.s` 函数的返回值。
     */
    destroy: function () {
        return jm.s({ "_fn": tftDefId, op: 64 });
    },

    // ==================== 平滑图形 ====================

    /**
     * 绘制抗锯齿填充圆形。
     * 
     * @param {number} x - 圆心 x 坐标。
     * @param {number} y - 圆心 y 坐标。
     * @param {number} r - 圆的半径。
     * @param {number} color - 圆的填充颜色。
     * @param {number} bg - 背景颜色（可选）。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    fillSmoothCircle: function (x, y, r, color, bg) {
        return jm.s({ "_fn": tftDefId, op: 65, x: x, y: y, r: r, c: color, bg: fd(bg, 0) });
    },

    /**
     * 绘制抗锯齿宽线条。
     * 
     * @param {number} ax - 起点 x 坐标。
     * @param {number} ay - 起点 y 坐标。
     * @param {number} bx - 终点 x 坐标。
     * @param {number} by - 终点 y 坐标。
     * @param {number} wd - 线条宽度。
     * @param {number} color - 线条颜色。
     * @param {number} bg - 背景颜色（可选）。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    drawWideLine: function (ax, ay, bx, by, wd, color, bg) {
        return jm.s({ "_fn": tftDefId, op: 66, x: ax, y: ay, x2: bx, y2: by, wd: wd, c: color, bg: fd(bg, 0) });
    },

    // ==================== 创建/初始化 ====================

    /**
     * 创建并初始化TFT_eSPI实例。
     * 此方法会同步初始化显示屏，应用不用手动初始化。
     * 
     * @param {number} sda - SPI数据引脚（可选，使用User_Setup.h中的配置）。
     * @param {number} scl - SPI时钟引脚（可选，使用User_Setup.h中的配置）。
     * @param {number} rotation - 初始旋转角度（可选，0-3）。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    createTft: function (sda, scl, rotation) {
        return jm.s({ "_fn": tftDefId, op: 51, sda: fd(sda, 0), scl: fd(scl, 0), rot: fd(rotation, 0) });
    }
};

// 导出模块
// exports = tft;
