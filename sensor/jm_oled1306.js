
/**
 * 本模块提供了与显示屏交互的功能，可用于控制显示屏的各种操作，如绘制图形、显示文本、设置显示参数等。
 * 它定义了一系列方法，涵盖了基本图形绘制（如线条、矩形、圆形等）、文本显示（打印字符、字符串等）、屏幕设置（如清屏、反转显示等）以及位图绘制等功能。
 * 使用时方法名称前一定要带上display.前缀
 * createOled方法会同步被始化i2c。
 * 操作完显存后，最后要调用display.display()方法才能将内容刷新到屏幕
 * 
 * 常量说明：
 * - display.BLACK   (0) : 黑色，用于绘制“关闭”状态的像素
 * - display.WHITE   (1) : 白色，用于绘制“打开”状态的像素
 * - display.INVERSE (2) : 反转，用于反转像素的显示状态
 * 
 * @module SSD1306 OLED显示屏模块
 * @var display
 * @category display
 * @keywords SSD1306,OLED,显示屏,图形绘制,文本显示,位图,I2C,Arduino库
 * @capabilities drawLine,display,clearDisplay,invertDisplay,dim,drawPixel,drawFastHLine,drawFastVLine,getPixel,writeFillRect,startWrite,endWrite,writeLine,setRotation,fillScreen,fillRect,drawChar,drawChar1,setTextSize,setTextSize1,setFont,setCursor,setTextColor,setTextColor1,setTextWrap,width,height,getRotation,getCursorX,getCursorY,getTextBounds,drawRGBBitmap,drawRGBBitmapMask,drawGrayscaleBitmap,drawGrayscaleBitmapMask,drawCircle,fillCircle,println,print,drawRect,drawRoundRect,fillRoundRect,startscrollright,stopscroll,startscrollleft,startscrolldiagright,startscrolldiagleft,drawBitmap,drawBitmap1,drawXBitmap,createOled,drawTriangle,fillTriangle,cp437,printChar,getFontCacheStatus,clearFontCache,setFontType,startScroll
 * @depends 无
 */

let odefId = 2;

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

var display = {
    /**
     * 颜色常量：黑色，用于绘制“关闭”状态的像素。
     */
    BLACK: 0,
    /**
     * 颜色常量：白色，用于绘制“打开”状态的像素。
     */
    WHITE: 1,
    /**
     * 颜色常量：反转，用于反转像素的显示状态。
     */
    INVERSE: 2,

    /**
     * 在显示屏上绘制一条直线。
     * 
     * @param {number} x - 直线起点的 x 坐标。
     * @param {number} y - 直线起点的 y 坐标。
     * @param {number} x1 - 直线终点的 x 坐标。
     * @param {number} y1 - 直线终点的 y 坐标。
     * @param {number} color - 直线的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    drawLine: function (x, y, x1, y1, color, flush) {
        return jm.s({ "_fn": odefId, op: 1, x: x, y: y, x1: x1, y1: y1, c: color, f: f(flush) });
    },

    /**
     * 刷新显示屏，将之前的绘制操作显示出来，画完数据后，一定要调用此方法才能将内容刷新到屏幕。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    display: function () {
        return jm.s({ "_fn": odefId, op: 2 });
    },

    /**
     * 清除显示屏上的内容。
     * 
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `false`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    clearDisplay: function (flush) {
        return jm.s({ "_fn": odefId, op: 3, f: fd(flush, false) });
    },

    /**
     * 反转显示屏的显示模式。
     * 
     * @param {number} mode - 反转模式，具体含义取决于显示屏的实现。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    invertDisplay: function (mode) {
        return jm.s({ "_fn": odefId, op: 4, m: mode });
    },

    /**
     * 设置显示屏的亮度。
     * 
     * @param {number} dim - 亮度值，具体范围取决于显示屏的实现。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    dim: function (dim) {
        return jm.s({ op: 5, d: dim });
    },

    /**
     * 在显示屏上绘制一个像素点。
     * 
     * @param {number} x - 像素点的 x 坐标。
     * @param {number} y - 像素点的 y 坐标。
     * @param {number} color - 像素点的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    drawPixel: function (x, y, color, flush) {
        return jm.s({ "_fn": odefId, op: 6, x: x, y: y, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一条水平直线。
     * 
     * @param {number} x - 直线起点的 x 坐标。
     * @param {number} y - 直线起点的 y 坐标。
     * @param {number} width - 直线的宽度（即长度）。
     * @param {number} color - 直线的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    drawFastHLine: function (x, y, width, color, flush) {
        return jm.s({ "_fn": odefId, op: 7, x: x, y: y, w: width, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一条垂直直线。
     * 
     * @param {number} x - 直线起点的 x 坐标。
     * @param {number} y - 直线起点的 y 坐标。
     * @param {number} heigh - 直线的高度（即长度）。
     * @param {number} color - 直线的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    drawFastVLine: function (x, y, heigh, color, flush) {
        return jm.s({ "_fn": odefId, op: 8, x: x, y: y, h: heigh, c: color, f: f(flush) });
    },

    /**
     * 获取显示屏上指定位置的像素颜色。
     * 
     * @param {number} x - 像素点的 x 坐标。
     * @param {number} y - 像素点的 y 坐标。
     * @returns {number} - 像素点的颜色值。
     */
    getPixel: function (x, y) {
        var rst = jm.s({ "_fn": odefId, op: 9, x: x, y: y });
        return rst.v;
    },

    /**
     * 在显示屏上绘制一个填充矩形。
     * 
     * @param {number} x - 矩形左上角的 x 坐标。
     * @param {number} y - 矩形左上角的 y 坐标。
     * @param {number} width - 矩形的宽度。
     * @param {number} heigh - 矩形的高度。
     * @param {number} color - 矩形的填充颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    writeFillRect: function (x, y, width, heigh, color, flush) {
        return jm.s({ "_fn": odefId, op: 10, x: x, y: y, w: width, h: heigh, c: color, f: f(flush) });
    },

    /**
     * 开始写入操作，可能用于批量绘制操作前的准备。
     * 
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    startWrite: function () {
        return jm.s({ "_fn": odefId, op: 11 });
    },

    /**
     * 结束写入操作，可能用于批量绘制操作后的收尾。
     * 
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    endWrite: function () {
        return jm.s({ "_fn": odefId, op: 12 });
    },

    /**
     * 在显示屏上绘制一条直线（另一种写入方式）。
     * 
     * @param {number} x - 直线起点的 x 坐标。
     * @param {number} y - 直线起点的 y 坐标。
     * @param {number} x1 - 直线终点的 x 坐标。
     * @param {number} y1 - 直线终点的 y 坐标。
     * @param {number} color - 直线的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    writeLine: function (x, y, x1, y1, color, flush) {
        return jm.s({ "_fn": odefId, op: 13, x: x, y: y, x1: x1, y1: y1, c: color, f: f(flush) });
    },

    /**
     * 设置显示屏的旋转角度。
     * 
     * @param {number} r - 旋转角度值，具体含义取决于显示屏的实现。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    setRotation: function (r) {
        return jm.s({ "_fn": odefId, op: 14, r: r });
    },

    /**
     * 用指定颜色填充整个显示屏。
     * 
     * @param {number} color - 填充颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    fillScreen: function (color) {
        return jm.s({ "_fn": odefId, op: 15, c: color });
    },

    /**
     * 在显示屏上绘制一个矩形（可选择是否填充）。
     * 
     * @param {number} x - 矩形左上角的 x 坐标。
     * @param {number} y - 矩形左上角的 y 坐标。
     * @param {number} width - 矩形的宽度。
     * @param {number} heigh - 矩形的高度。
     * @param {number} color - 矩形的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    fillRect: function (x, y, width, heigh, color, flush) {
        return jm.s({ "_fn": odefId, op: 16, x: x, y: y, w: width, h: heigh, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个字符。
     * 
     * @param {number} x - 字符左上角的 x 坐标。
     * @param {number} y - 字符左上角的 y 坐标。
     * @param {string} ch - 要绘制的字符。
     * @param {number} s - 字符的大小，具体含义取决于显示屏的实现。
     * @param {number} bg - 字符的背景颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {number} color - 字符的前景颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    drawChar: function (x, y, ch, s, bg, color, flush) {
        return jm.s({ "_fn": odefId, op: 17, x: x, y: y, ch: ch, s: s, bg: bg, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个字符（另一种绘制方式）。
     * 
     * @param {number} x - 字符左上角的 x 坐标。
     * @param {number} y - 字符左上角的 y 坐标。
     * @param {string} ch - 要绘制的字符。
     * @param {number} sw - 字符的水平缩放比例，具体含义取决于显示屏的实现。
     * @param {number} sh - 字符的垂直缩放比例，具体含义取决于显示屏的实现。
     * @param {number} bg - 字符的背景颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {number} color - 字符的前景颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    drawChar1: function (x, y, ch, sw, sh, bg, color, flush) {
        return jm.s({ "_fn": odefId, op: 18, x: x, y: y, ch: ch, sw: sw, sh: sh, bg: bg, c: color, f: f(flush) });
    },

    /**
     * 设置文本的大小。如显示中文，务必设置为2或大于2的值，设置为1时，字体超小形状怪异体验极差
     * 
     * @param {number} x - 文本大小值，1:8*8大小(只支持英文字母显示,中文不可用)， 2：16*16大小， 3：24*24， 4：32*32。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    setTextSize: function (x) {
        return jm.s({ "_fn": odefId, op: 19, x: x });
    },

    /**
     * 设置文本的大小（水平和垂直方向分别设置）。
     * 
     * @param {number} x - 与setTextSize完全相同
     * @param {number} y - 文本的垂直大小值，具体含义取决于显示屏的实现。较少秀，一般使用setTextSize即可
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    setTextSize1: function (x, y) {
        return jm.s({ "_fn": odefId, op: 20, x: x, y: y });
    },

    /**
     * 设置显示屏使用的字体。
     * 
     * @param {any} font - 字体对象或字体标识，具体格式取决于显示屏的实现。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    setFont: function (font) {
        //return jm.s({ "_fn": odefId, op: 21, f: font });
    },


    /**
     * 设置文本的光标位置。
     * 
     * 该方法用于指定后续文本绘制操作的起始位置，通过设置 `x` 和 `y` 坐标，确定光标在显示屏上的位置。
     * 
     * @param {number} x - 光标位置的 x 坐标，代表水平方向的位置。
     * @param {number} y - 光标位置的 y 坐标，代表垂直方向的位置。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 函数的实现，通常包含操作结果信息。
     */
    setCursor: function (x, y) {
        return jm.s({ "_fn": odefId, op: 22, x: x, y: y });
    },

    /**
     * 设置文本的颜色。
     * 
     * 此方法用于指定后续文本绘制时所使用的颜色，颜色值可使用 `display` 对象中定义的 `BLACK`、`WHITE` 或 `INVERSE` 常量。
     * 
     * @param {number} color - 文本的颜色值，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 函数的实现，通常包含操作结果信息。
     */
    setTextColor: function (color) {
        return jm.s({ "_fn": odefId, op: 23, c: color });
    },

    /**
     * 设置文本的颜色和背景颜色。
     * 
     * 该方法不仅可以设置文本的前景颜色，还能设置文本的背景颜色，颜色值均可使用 `display` 对象中定义的 `BLACK`、`WHITE` 或 `INVERSE` 常量。
     * 
     * @param {number} x - 可能是预留参数，具体用途取决于显示屏的实现。
     * @param {number} color - 文本的前景颜色值，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {number} bg - 文本的背景颜色值，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 函数的实现，通常包含操作结果信息。
     */
    setTextColor1: function (color, bg) {
        return jm.s({ "_fn": odefId, op: 24, c: color, bg: bg });
    },

    /**
     * 设置文本的换行模式。
     * 
     * 此方法用于控制文本在绘制时是否自动换行，通过传入布尔值 `txtWrap` 来决定换行行为。
     * 
     * @param {boolean} txtWrap - 布尔值，`true` 表示开启自动换行，`false` 表示关闭自动换行。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 函数的实现，通常包含操作结果信息。
     */
    setTextWrap: function (txtWrap) {
        return jm.s({ "_fn": odefId, op: 25, w: txtWrap });
    },

    /**
     * 获取显示屏的宽度。
     * 
     * 该方法会向显示屏查询其宽度信息，并返回查询结果。如果查询成功且返回结果有效，将返回显示屏的宽度值；否则返回 0。
     * 
     * @returns {number} - 若操作成功且返回结果有效，返回显示屏的宽度值；若操作失败，返回 0。
     */
    width: function () {
        var rst = jm.s({ "_fn": odefId, op: 26 });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取显示屏的高度。
     * 
     * 此方法用于查询显示屏的高度信息，若查询成功且返回结果有效，将返回显示屏的高度值；若操作失败，返回 0。
     * 
     * @returns {number} - 若操作成功且返回结果有效，返回显示屏的高度值；若操作失败，返回 0。
     */
    height: function () {
        var rst = jm.s({ "_fn": odefId, op: 27 });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取显示屏的旋转角度。
     * 
     * 该方法会查询显示屏当前的旋转角度，并返回查询结果。若查询成功且返回结果有效，返回旋转角度值；若操作失败，返回 0。
     * 
     * @returns {number} - 若操作成功且返回结果有效，返回显示屏的旋转角度值；若操作失败，返回 0。
     */
    getRotation: function () {
        var rst = jm.s({ "_fn": odefId, op: 28 });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取文本光标的 x 坐标。
     * 
     * 此方法用于查询当前文本光标的 x 坐标位置，若查询成功且返回结果有效，返回光标的 x 坐标值；若操作失败，返回 0。
     * @returns {number} - 若操作成功且返回结果有效，返回文本光标的 x 坐标值；若操作失败，返回 0。
     */
    getCursorX: function () {
        var rst = jm.s({ "_fn": odefId, op: 29 });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取文本光标的 y 坐标。
     * 
     * 该方法用于查询当前文本光标的 y 坐标位置，若查询成功且返回结果有效，返回光标的 y 坐标值；若操作失败，返回 0。
     * 
     * @returns {number} - 若操作成功且返回结果有效，返回文本光标的 y 坐标值；若操作失败，返回 0。
     */
    getCursorY: function () {
        var rst = jm.s({ "_fn": odefId, op: 30 });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取文本的边界信息。
     * 
     * 此方法用于查询指定字符串在显示屏上绘制时的边界信息，返回的结果包含字符串的位置、大小等相关信息。
     * 
     * @param {string} str - 要查询边界信息的字符串。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 函数的实现，通常包含文本的边界信息。
     */
    getTextBounds: function (str) {
        return jm.s({ "_fn": odefId, op: 31, str: str });
    },

    /**
     * 在显示屏上绘制 RGB 位图。
     * 
     * 该方法用于将指定的 RGB 位图数据绘制到显示屏上指定的位置，通过指定 `x`、`y` 坐标确定绘制的起始位置，`width` 和 `heigh` 确定位图的大小，`bm` 为位图数据。
     * 
     * @param {number} x - 位图绘制起始位置的 x 坐标。
     * @param {number} y - 位图绘制起始位置的 y 坐标。
     * @param {number} width - 位图的宽度。
     * @param {number} heigh - 位图的高度。
     * @param {any} bm - 位图数据，具体格式取决于显示屏的实现。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 函数的实现，通常包含绘制操作的结果信息。
     */
    drawRGBBitmap: function (x, y, width, heigh, bm) {
        return jm.s({ "_fn": odefId, op: 32, x: x, y: y, w: width, h: heigh, bm: bm, "_jt_": 1 });
    },

    /**
     * 在显示屏上绘制带掩码的 RGB 位图。
     * 
     * 此方法用于绘制带有掩码的 RGB 位图，通过掩码可以控制位图的显示部分，`x`、`y` 确定绘制起始位置，`width` 和 `heigh` 确定位图大小，`bm` 为位图数据，`mask` 为掩码数据。
     * 
     * @param {number} x - 位图绘制起始位置的 x 坐标。
     * @param {number} y - 位图绘制起始位置的 y 坐标。
     * @param {number} width - 位图的宽度。
     * @param {number} heigh - 位图的高度。
     * @param {any} bm - 位图数据，具体格式取决于显示屏的实现。
     * @param {any} mask - 掩码数据，用于控制位图的显示部分。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 函数的实现，通常包含绘制操作的结果信息。
     */
    drawRGBBitmapMask: function (x, y, width, heigh, bm, mask) {
        return jm.s({ "_fn": odefId, op: 33, x: x, y: y, w: width, h: heigh, bm: bm, m: mask, "_jt_": 1 });
    },

    /**
     * 在显示屏上绘制灰度位图。
     * 
     * 该方法用于将指定的灰度位图数据绘制到显示屏上指定的位置，`x`、`y` 确定绘制起始位置，`width` 和 `heigh` 确定位图大小，`bm` 为灰度位图数据。
     * 
     * @param {number} x - 位图绘制起始位置的 x 坐标。
     * @param {number} y - 位图绘制起始位置的 y 坐标。
     * @param {number} width - 位图的宽度。
     * @param {number} heigh - 位图的高度。
     * @param {any} bm - 灰度位图数据，具体格式取决于显示屏的实现。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 函数的实现，通常包含绘制操作的结果信息。
     */
    drawGrayscaleBitmap: function (x, y, width, heigh, bm) {
        return jm.s({ "_fn": odefId, op: 34, x: x, y: y, w: width, h: heigh, bm: bm , "_jt_": 1});
    },

    /**
     * 在显示屏上绘制带掩码的灰度位图。
     * 
     * 此方法用于绘制带有掩码的灰度位图，通过掩码控制位图的显示部分，`x`、`y` 确定绘制起始位置，`width` 和 `heigh` 确定位图大小，`bm` 为灰度位图数据，`mask` 为掩码数据。
     * 
     * @param {number} x - 位图绘制起始位置的 x 坐标。
     * @param {number} y - 位图绘制起始位置的 y 坐标。
     * @param {number} width - 位图的宽度。
     * @param {number} heigh - 位图的高度。
     * @param {any} bm - 灰度位图数据，具体格式取决于显示屏的实现。
     * @param {any} mask - 掩码数据，用于控制位图的显示部分。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 函数的实现，通常包含绘制操作的结果信息。
     */
    drawGrayscaleBitmapMask: function (x, y, width, heigh, bm, mask) {
        return jm.s({ "_fn": odefId, op: 35, x: x, y: y, w: width, h: heigh, bm: bm, m: mask, "_jt_": 1});
    },

    /**
     * 在显示屏上绘制一个圆形。
     * 
     * 该方法用于在显示屏上指定位置绘制一个圆形，`x`、`y` 确定圆心位置，`r` 确定圆的半径，`color` 确定圆的颜色，`flush` 控制是否立即刷新显示屏。
     * 
     * @param {number} x - 圆心的 x 坐标。
     * @param {number} y - 圆心的 y 坐标。
     * @param {number} r - 圆的半径。
     * @param {number} color - 圆的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 函数的实现，通常包含绘制操作的结果信息。
     */
    drawCircle: function (x, y, r, color, flush) {
        return jm.s({ "_fn": odefId, op: 36, x: x, y: y, r: r, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个填充圆形。
     * 
     * 此方法用于在显示屏上指定位置绘制一个填充的圆形，`x`、`y` 确定圆心位置，`r` 确定圆的半径，`color` 确定圆的填充颜色，`flush` 控制是否立即刷新显示屏。
     * 
     * @param {number} x - 圆心的 x 坐标。
     * @param {number} y - 圆心的 y 坐标。
     * @param {number} r - 圆的半径。
     * @param {number} color - 圆的填充颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 函数的实现，通常包含绘制操作的结果信息。
     */
    fillCircle: function (x, y, r, color, flush) {
        return jm.s({ "_fn": odefId, op: 37, x: x, y: y, r: r, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上打印一行文本并换行。
     * 
     * 该方法用于在显示屏上打印指定的字符串，并在打印完成后换行，`s` 为要打印的字符串，`flush` 控制是否立即刷新显示屏。
     * 
     * @param {string} s - 要打印的字符串。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 函数的实现，通常包含打印操作的结果信息。
     */
    println: function (s, flush) {
        return jm.s({ "_fn": odefId, op: 38, s: s, f: f(flush) });
    },

    /**
     * 在显示屏上打印文本。
     * 
     * 此方法用于在显示屏上打印指定的字符串，`s` 为要打印的字符串，`flush` 控制是否立即刷新显示屏。
     * 
     * @param {string} s - 要打印的字符串。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 函数的实现，通常包含打印操作的结果信息。
     */
    print: function (s, flush) {
        return jm.s({ "_fn": odefId, op: 39, s: s, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个矩形边框。
     * 
     * @param {number} x - 矩形左上角的 x 坐标。
     * @param {number} y - 矩形左上角的 y 坐标。
     * @param {number} width - 矩形的宽度。
     * @param {number} heigh - 矩形的高度。
     * @param {number} color - 矩形边框的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    drawRect: function (x, y, width, heigh, color, flush) {
        return jm.s({ "_fn": odefId, op: 40, x: x, y: y, w: width, h: heigh, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个圆角矩形边框。
     * 
     * @param {number} x - 圆角矩形左上角的 x 坐标。
     * @param {number} y - 圆角矩形左上角的 y 坐标。
     * @param {number} width - 圆角矩形的宽度。
     * @param {number} heigh - 圆角矩形的高度。
     * @param {number} r - 圆角的半径。
     * @param {number} color - 圆角矩形边框的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    drawRoundRect: function (x, y, width, heigh, r, color, flush) {
        return jm.s({ "_fn": odefId, op: 41, x: x, y: y, w: width, h: heigh, r: r, c: color, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个填充的圆角矩形。
     * 
     * @param {number} x - 填充圆角矩形左上角的 x 坐标。
     * @param {number} y - 填充圆角矩形左上角的 y 坐标。
     * @param {number} width - 填充圆角矩形的宽度。
     * @param {number} heigh - 填充圆角矩形的高度。
     * @param {number} r - 圆角的半径。
     * @param {number} color - 填充圆角矩形的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    fillRoundRect: function (x, y, width, heigh, r, color, flush) {
        return jm.s({ "_fn": odefId, op: 42, x: x, y: y, w: width, h: heigh, r: r, c: color, f: f(flush) });
    },

    /**
     * 开始向右滚动显示内容。
     * 
     * @param {number} s - 起始行。
     * @param {number} e - 结束行。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    startscrollright: function (s, e, flush) {
        return jm.s({ "_fn": odefId, op: 43, s: s, e: e, f: f(flush) });
    },

    /**
     * 停止滚动显示内容。
     * 
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    stopscroll: function () {
        return jm.s({ "_fn": odefId, op: 44 });
    },

    /**
     * 开始向左滚动显示内容。
     * 
     * @param {number} s - 起始行。
     * @param {number} e - 结束行。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    startscrollleft: function (s, e, flush) {
        return jm.s({ "_fn": odefId, op: 45, s: s, e: e, f: f(flush) });
    },

    /**
     * 开始向右下对角线滚动显示内容。
     * 
     * @param {number} s - 起始行。
     * @param {number} e - 结束行。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    startscrolldiagright: function (s, e, flush) {
        return jm.s({ "_fn": odefId, op: 46, s: s, e: e, f: f(flush) });
    },

    /**
     * 开始向左下对角线滚动显示内容。
     * 
     * @param {number} s - 起始行。
     * @param {number} e - 结束行。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    startscrolldiagleft: function (s, e, flush) {
        return jm.s({ "_fn": odefId, op: 47, s: s, e: e, f: f(flush) });
    },

    /**
     * 在显示屏上绘制一个位图。
     * 
     * @param {number} x - 位图左上角的 x 坐标。
     * @param {number} y - 位图左上角的 y 坐标。
     * @param {number} width - 位图的宽度。
     * @param {number} heigh - 位图的高度。
     * @param {any} bm - 位图数据。
     * @param {number} color - 位图的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    drawBitmap: function (x, y, width, heigh, bm, color, flush) {
        return jm.s({ "_fn": odefId, op: 48, x: x, y: y, w: width, h: heigh, bm: bm, c: color, f: f(flush), "_jt_": 1 });
    },

    /**
     * 在显示屏上绘制一个带有背景颜色的位图。
     * 
     * @param {number} x - 位图左上角的 x 坐标。
     * @param {number} y - 位图左上角的 y 坐标。
     * @param {number} width - 位图的宽度。
     * @param {number} heigh - 位图的高度。
     * @param {number} color - 位图的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {any} bm - 位图数据。
     * @param {number} bg - 位图的背景颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    drawBitmap1: function (x, y, width, heigh, color, bm, bg, flush) {
        return jm.s({ "_fn": odefId, op: 49, x: x, y: y, w: width, h: heigh, bm: bm, c: color, bg: bg, f: f(flush), "_jt_": 1});
    },

    /**
     * 在显示屏上绘制一个 X 格式的位图。
     * 
     * @param {number} x - 位图左上角的 x 坐标。
     * @param {number} y - 位图左上角的 y 坐标。
     * @param {number} width - 位图的宽度。
     * @param {number} heigh - 位图的高度。
     * @param {number} color - 位图的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @param {any} bm - 位图数据。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    drawXBitmap: function (x, y, width, heigh, color, bm, flush) {
        //"_jt_": 1 指示bm是字节数组
        return jm.s({ "_fn": odefId, op: 50, x: x, y: y, w: width, h: heigh, bm: bm, c: color, f: f(flush), "_jt_": 1});
    },

    /**
     * 创建一个 OLED 显示屏实例。
     * 此方法会同时初始化i2c，所以应用不用手动初始化i2c
     * @param {number} w - 显示屏的宽度。
     * @param {number} h - 显示屏的高度。
     * @param {number} sda - I2C 数据线引脚。
     * @param {number} scl - I2C 时钟线引脚。
     * @param {number} addr - I2C 设备地址。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    createOled: function (w, h, sda, scl, addr) {
        return jm.s({ "_fn": odefId, op: 51, w: w, h: h, "sda": sda, "scl": scl, "addr": addr });
    },

    /**
     * 在显示屏上绘制一个三角形边框。
     * 
     * @param {number} x - 三角形第一个顶点的 x 坐标。
     * @param {number} y - 三角形第一个顶点的 y 坐标。
     * @param {number} x1 - 三角形第二个顶点的 x 坐标。
     * @param {number} y1 - 三角形第二个顶点的 y 坐标。
     * @param {number} x2 - 三角形第三个顶点的 x 坐标。
     * @param {number} y2 - 三角形第三个顶点的 y 坐标。
     * @param {number} color - 三角形边框的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    drawTriangle: function (x, y, x1, y1, x2, y2, color) {
        return jm.s({ "_fn": odefId, op: 53, x: x, y: y, x1: x1, y1: y1, x2: x2, y2: y2, c: color });
    },

    /**
     * 在显示屏上绘制一个填充的三角形。
     * 
     * @param {number} x - 填充三角形第一个顶点的 x 坐标。
     * @param {number} y - 填充三角形第一个顶点的 y 坐标。
     * @param {number} x1 - 填充三角形第二个顶点的 x 坐标。
     * @param {number} y1 - 填充三角形第二个顶点的 y 坐标。
     * @param {number} x2 - 填充三角形第三个顶点的 x 坐标。
     * @param {number} y2 - 填充三角形第三个顶点的 y 坐标。
     * @param {number} color - 填充三角形的颜色，可使用 `BLACK`、`WHITE` 或 `INVERSE`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    fillTriangle: function (x, y, x1, y1, x2, y2, color) {
        return jm.s({ "_fn": odefId, op: 54, x: x, y: y, x1: x1, y1: y1, x2: x2, y2: y2, c: color });
    },

    /**
     * 启用或禁用 Code Page 437 兼容字符集。
     * 
     * 由于 glcdfont.c 曾经存在错误，字符 #176 缺失，导致后续字符索引偏移。
     * 库默认使用原始的“错误”行为，旧的草图仍然可以正常工作。
     * 调用此函数并传入 `true` 可使用正确的 CP437 字符值。
     * 
     * @param {boolean} val - `true` 启用（新行为），`false` 禁用（旧行为）。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    cp437: function (val) {
        return jm.s({ "_fn": odefId, op: 55, v: val });
    },

    /**
     * 在显示屏上打印一个字符。
     * 
     * @param {string} ch - 要打印的字符。
     * @param {boolean|undefined} flush - 是否立即刷新显示屏，默认值为 `true`。
     * @returns {any} - `jm.s` 函数的返回值，具体内容取决于 `jm.s` 的实现。
     */
    printChar: function (ch, flush) {
        return jm.s({ "_fn": odefId, op: 56, s: ch, f: f(flush) });
    },

   /**
     * 设置字体放大模式
     * 
     * 该方法用于控制非ASCII字符（如中文）的放大方式，支持两种模式：
     * 
     * **模式1（前端放大）**：
     * - 设备始终向后端请求 8px 的基础字体数据
     * - 在设备端通过像素复制（放大）的方式实现大字体显示
     * - 优点：后端只需存储一份 8px 字体，节省存储空间
     * - 缺点：放大后字体边缘可能有锯齿，适合小尺寸放大（如 16px）
     * 
     * **模式2（后端放大）**：
     * - 设备直接向后端请求对应大小的字体数据（如 16px、24px、32px）
     * - 设备端直接绘制，无需额外放大处理
     * - 优点：字体显示清晰，无锯齿
     * - 缺点：后端需要存储多份不同尺寸的字体数据
     * 
     * 切换模式时会自动清空字体缓存，确保新旧模式数据不混用。
     * 
     * @param {number} mode - 放大模式：
     *                        - 1: 前端放大（默认）
     *                        - 2: 后端放大
     * @returns {any} - `jm.s` 函数的返回值
     * 
     * @example
     * // 设置为前端放大模式（默认）
     * display.setFontScaleMode(1);
     * 
     * // 设置为后端放大模式
     * display.setFontScaleMode(2);
     * 
     * // 通常与 setTextSize 配合使用
     * display.setFontScaleMode(2);  // 使用后端放大
     * display.setTextSize(2);        // 显示 16px 字体
     * display.print("你好世界");
     */
    setFontScaleMode: function (mode) {
        return jm.s({ "_fn": odefId, op: 58, x: mode });
    },

    /**
     * 开始文字滚动显示
     * 
     * 该方法用于在 OLED 屏幕上实现**超长文本的滚动显示**，适用于显示超过一屏宽度的文本内容。
     * 
     * **与硬件滚动的区别**：
     * - 硬件滚动（startscrollright/left）：仅支持屏幕范围内的内容滚动，超出屏幕的字符无法显示
     * - 本方法（软件滚动）：支持任意长度文本，通过不断重绘实现无限滚动效果
     * 
     * **工作原理**：
     * 1. 在内存中保存完整的文本内容
     * 2. 通过定时器不断改变文本的绘制起始位置
     * 3. 每次只绘制当前可见的部分到屏幕上
     * 4. 实现类似 LED 跑马灯的效果
     * 
     * **滚动方向说明**：
     * - 水平方向（dir=1 或 -1）：文本左右滚动，pos 参数表示垂直位置（y坐标）
     * - 垂直方向（dir=2 或 -2）：文本上下滚动，pos 参数表示水平位置（x坐标）
     * 
     * @param {string} text - 要滚动的文本内容（支持中英文混合）
     * @param {number} pos - 滚动位置参数：
     *                        - 水平滚动时：表示垂直位置（y坐标，像素值）
     *                        - 垂直滚动时：表示水平位置（x坐标，像素值）
     * @param {number} dir - 滚动方向：
     *                        - 1: 向左滚动（水平）
     *                        - -1: 向右滚动（水平）
     *                        - 2: 向上滚动（垂直）
     *                        - -2: 向下滚动（垂直）
     * @param {number} speed - 滚动速度（像素/帧），默认值为 2。
     *                          值越大滚动越快，建议范围 1-8。
     * @param {boolean} loop - 是否循环滚动：
     *                          - true: 循环滚动（文本从一侧消失后从另一侧重新出现）
     *                          - false: 滚动到尽头后停止
     * @returns {any} - `jm.s` 函数的返回值
     * 
     * @example
     * // ===== 水平滚动示例 =====
     * 
     * // 向左滚动（从右向左），垂直位置 y=20
     * display.startScroll("这是一个很长的文本，需要滚动显示...", 20, 1, 3, true);
     * 
     * // 向右滚动（从左向右），垂直位置 y=20
     * display.startScroll("这是一个很长的文本，需要滚动显示...", 20, -1, 3, true);
     * 
     * // 不循环，滚动到尽头停止
     * display.startScroll("一次性显示完就停止", 20, 1, 2, false);
     * 
     * // ===== 垂直滚动示例 =====
     * 
     * // 向上滚动（从底部进入，顶部移出），水平位置 x=10
     * display.startScroll("垂直滚动的文本", 10, 2, 2, true);
     * 
     * // 向下滚动（从顶部进入，底部移出），水平位置 x=10
     * display.startScroll("垂直滚动的文本", 10, -2, 2, true);
     * 
     * // ===== 完整使用示例 =====
     * 
     * // 1. 初始化屏幕
     * display.createOled(128, 64, 3, 2, 0x3C);
     * display.clearDisplay();
     * 
     * // 2. 设置字体模式和后端放大
     * display.setFontScaleMode(2);
     * display.setTextSize(2);
     * 
     * // 3. 启动滚动
     * display.startScroll("天气预报：今天天气晴朗，气温25-30度", 20, 1, 3, true);
     * 
     * // 4. 停止滚动（使用原有的 stopscroll 方法）
     * // display.stopscroll();
     */
    startScroll: function(text, pos, dir, speed, loop) {
        return jm.s({ 
            "_fn": odefId, 
            "op": 59, 
            "t": text, 
            "p": pos, 
            "d": dir || 1, 
            "s": speed || 2, 
            "l": loop !== undefined ? loop : true 
        });
    },

    /**
     * 重新设置字体缓存大小
     * 
     * 该方法用于动态调整设备端字体缓存的大小，以适配不同长度的文本显示需求。
     * 
     * **缓存机制说明**：
     * - 设备端会将从后端获取的字体数据缓存到内存中
     * - 缓存满时，会淘汰最久未使用的字体数据（LRU算法）
     * - 缓存大小直接影响显示性能和内存占用
     * 
     * **使用场景**：
     * - 显示较短的文本：缓存大小可以设置小一些（如 10），节省内存
     * - 显示较长的文本：缓存大小需要设置大一些（如 30），避免频繁淘汰
     * - 显示包含大量不重复字符的文本：需要更大缓存
     * 
     * **注意事项**：
     * - 缓存大小至少为 1
     * - 修改缓存大小会清空已有缓存数据
     * - 缓存大小过小会导致频繁请求后端，影响性能
     * - 缓存大小过大会占用过多内存，建议根据实际需求设置
     * 
     * @param {number} size - 新的缓存大小（至少为 1）
     *                        建议值：10-50，默认值为 20
     * @returns {any} - `jm.s` 函数的返回值
     * 
     * @example
     * // ===== 基础使用 =====
     * 
     * // 设置缓存大小为 30（适合显示长文本）
     * display.setFontCacheSize(30);
     * 
     * // 设置缓存大小为 10（适合显示短文本，节省内存）
     * display.setFontCacheSize(10);
     * 
     * // ===== 完整使用示例 =====
     * 
     * // 1. 初始化屏幕
     * display.createOled(128, 64, 3, 2, 0x3C);
     * display.clearDisplay();
     * 
     * // 2. 设置字体模式
     * display.setFontScaleMode(2);
     * display.setTextSize(2);
     * 
     * // 3. 根据文本长度调整缓存大小
     * var longText = "这是一个非常长的文本，包含很多不同的中文字符...";
     * 
     * // 计算非ASCII字符数量（简单估算）
     * var nonAsciiCount = 0;
     * for (var i = 0; i < longText.length; i++) {
     *     if (longText.charCodeAt(i) > 127) nonAsciiCount++;
     * }
     * 
     * // 设置缓存大小为 非ASCII字符数 + 5（预留空间）
     * display.setFontCacheSize(nonAsciiCount + 5);
     * 
     * // 4. 显示或滚动文本
     * display.startScroll(longText, 20, 1, 3, true);
     * 
     * // ===== 注意事项 =====
     * 
     * // 如果缓存设置过小，会在日志中看到类似警告：
     * // "Cache insufficient: need 15, have 10"
     * // 此时需要增加缓存大小
     */
    setFontCacheSize: function(size) {
        return jm.s({ "_fn": odefId, op: 60, x: size });
    },

    /**
     * 设置字体类型
     * 
     * 该方法用于设置设备请求后端字体数据时使用的字体类型标识。
     * 字体类型对应后端字体数据库中的 fontType 字段。
     * 
     * @param {number} type - 字体类型标识,字符串类型，实际是一个数字 1 鸿蒙黑体, 2 小赖字体, 3 辰宇落雁體, 4 思源柔黑)
     * @returns {any} - `jm.s` 函数的返回值
     * 
     * @example
     * // 设置字体类型为 "鸿蒙黑体"，
     * display.setFontType(1);
     * 
     * // 设置字体类型为 "小赖字体"
     * display.setFontType(2); 
     * 
     * // 完整使用示例
     * display.createOled(128, 64, 3, 2, 0x3C);
     * display.setFontType(1);        // 设置字体类型
     * display.setFontScaleMode(2);     // 原生字休，服务器返回什么就显示什么，不放大缩小
     * display.setTextSize(2);          // 设置字体大小
     * display.print("你好世界");       // 显示文本 
     */
    setFontType: function(type) {
        return jm.s({ "_fn": odefId, "op": 61, "t": type });
    },

    /**
     * 清空Flash字体缓存
     * 
     * 该方法用于删除设备Flash中存储的所有字体缓存数据，包括：
     * - 字体数据文件（/font_data.bin）
     * - 字体索引文件（/font_index.bin）
     * 
     * 使用场景：
     * - 字体数据损坏时，需要重新从服务器获取
     * - 切换字体类型时，希望完全清除旧数据重新缓存
     * - 设备存储空间不足时，释放Flash空间
     * - 调试时强制重新加载字体数据
     * 
     * 注意：
     * - 清空后，下次显示中文时会重新从服务器请求字体数据
     * - 内存缓存也会被同步清空
     * - 此操作不可逆，请谨慎使用
     * 
     * @returns {Object} 返回操作结果
     * @returns {number} returns.code - 0表示成功，1表示失败
     * 
     * @example
     * // 基础使用：清空所有字体缓存
     * var result = display.clearFontCache();
     * if (result.code === 0) {
     *     console.log("字体缓存已清空");
     * } else {
     *     console.log("清空失败");
     * }
     * 
     * @example
     * // 完整示例：切换字体前清空缓存
     * display.createOled(128, 64, 3, 2, 0x3C);
     * display.clearDisplay();
     * 
     * // 先清空旧缓存
     * display.clearFontCache();
     * 
     * // 切换字体类型
     * display.setFontType(2);
     * display.setFontScaleMode(2);
     * display.setTextSize(2);
     * 
     * // 重新加载新字体
     * display.print("你好世界", false);
     * display.display(); 
     */
    clearFontCache: function() {
        return jm.s({ "_fn": odefId, op: 62 });
    },

    /**
     * 获取Flash字体缓存状态信息
     * 
     * 该方法用于查询设备Flash中字体缓存的详细状态，包括：
     * - 已缓存的字体数量
     * - 缓存容量（最大支持数量）
     * - 字体数据文件大小
     * - 索引文件大小
     * 
     * 使用场景：
     * - 监控缓存使用情况，了解存储占用
     * - 判断是否需要清理缓存释放空间
     * - 调试字体加载问题，确认缓存是否正常工作
     * - 评估缓存使用率，优化缓存大小设置
     * 
     * @returns {Object} 返回缓存状态信息
     * @returns {number} returns.code - 0表示成功，1表示失败
     * @returns {number} returns.count - 已缓存的字体数量
     * @returns {number} returns.capacity - 缓存最大容量
     * @returns {number} returns.dataSize - 字体数据文件大小（字节）
     * @returns {number} returns.indexSize - 索引文件大小（字节）
     * 
     * @example
     * // 基础使用：获取缓存状态
     * var status = display.getFontCacheStatus();
     * if (status.code === 0) {
     *     console.log("缓存字体数: " + status.count);
     *     console.log("最大容量: " + status.capacity);
     *     console.log("数据文件大小: " + status.dataSize + " 字节");
     *     console.log("索引文件大小: " + status.indexSize + " 字节");
     * }
     * 
     * @example
     * // 完整示例：监控缓存使用率
     * function checkCacheUsage() {
     *     var status = display.getFontCacheStatus();
     *     if (status.code === 0) {
     *         var usageRate = (status.count / status.capacity * 100).toFixed(1);
     *         console.log("缓存使用率: " + usageRate + "%");
     *         
     *         // 如果缓存使用率超过80%，提示用户
     *         if (usageRate > 80) {
     *             console.log("警告：字体缓存即将满，建议清理");
     *         }
     *         
     *         // 如果数据文件过大，提示
     *         if (status.dataSize > 1024 * 50) { // 50KB
     *             console.log("字体数据文件较大: " + (status.dataSize / 1024).toFixed(1) + "KB");
     *         }
     *     }
     *     return status;
     * }
     * 
     * // 定期检查缓存状态
     * setInterval(checkCacheUsage, 60000); // 每分钟检查一次
     * 
     * @example
     * // 完整使用流程
     * display.createOled(128, 64, 3, 2, 0x3C);
     * display.clearDisplay();
     * 
     * // 显示当前缓存状态
     * var status = display.getFontCacheStatus();
     * console.log("当前缓存: " + status.count + "/" + status.capacity);
     * 
     * // 如果缓存已满，清空并重新加载
     * if (status.count >= status.capacity) {
     *     console.log("缓存已满，清空后重新加载...");
     *     display.clearFontCache();
     * }
     * 
     * // 设置字体并显示
     * display.setFontType(1);
     * display.setFontScaleMode(2);
     * display.setTextSize(2);
     * display.print("这是一个测试", false);
     * display.display();
     */
    getFontCacheStatus: function() {
        return jm.s({ "_fn": odefId, op: 63 });
    },

         /**
     * 获取指定字符串在当前字体下的总宽度
     * 
     * 该方法返回指定字符串在当前 `textSize` 设置下的总宽度（像素）。
     * 会遍历字符串中的每个字符，累加每个字符的宽度。
     * 
     * **字符宽度规则**：
     * - **ASCII字符**（字母、数字、符号）：宽度 = textSize × 6
     *   - textSize=1: 6px, textSize=2: 12px, textSize=3: 18px, textSize=4: 24px
     * 
     * - **非ASCII字符**（中文、日文、韩文等）：宽度 = max(textSize × 8, 16)
     *   - textSize=1: 16px（最小尺寸）
     *   - textSize=2: 16px
     *   - textSize=3: 24px
     *   - textSize=4: 32px
     * 
     * @param {string} str - 要计算宽度的字符串（支持ASCII、中文等任意字符）
     * @returns {number} - 字符串总宽度（像素），失败返回 0
     * 
     * @example
     * // 基础使用
     * display.setTextSize(2);
     * var width1 = display.getTextWidth('Hello');        // 返回 60 (5个字符 × 12px)
     * var width2 = display.getTextWidth('你好');         // 返回 32 (2个字符 × 16px)
     * var width3 = display.getTextWidth('你好民办');     // 返回 64 (4个字符 × 16px)
     * var width4 = display.getTextWidth('Hello世界');    // 返回 12×5 + 16×2 = 92px
     */
    getTextWidth: function(str) {
        if (!str || str.length === 0) {
            return 0;
        }
        var rst = jm.s({ "_fn": odefId, op: 64, str: str });
        return rst && rst.code === 0 ? rst.w : 0;
    },

    /**
     * 获取指定字符串在当前字体下的高度（取最大字符高度）
     * 
     * 该方法返回指定字符串在当前 `textSize` 设置下的高度（像素）。
     * 对于混合字符串（ASCII + 中文），会返回所有字符中的最大高度。
     * 
     * **字符高度规则**：
     * - **ASCII字符**（字母、数字、符号）：高度 = textSize × 8
     *   - textSize=1: 8px, textSize=2: 16px, textSize=3: 24px, textSize=4: 32px
     * 
     * - **非ASCII字符**（中文、日文、韩文等）：高度 = max(textSize × 8, 16)
     *   - textSize=1: 16px（最小尺寸）
     *   - textSize=2: 16px
     *   - textSize=3: 24px
     *   - textSize=4: 32px
     * 
     * @param {string} str - 要计算高度的字符串（支持ASCII、中文等任意字符）
     * @returns {number} - 字符串中最大字符高度（像素），失败返回 0
     * 
     * @example
     * // 基础使用
     * display.setTextSize(2);
     * var height1 = display.getTextHeight('Hello');      // 返回 16
     * var height2 = display.getTextHeight('你好');       // 返回 16
     * var height3 = display.getTextHeight('你好民办');   // 返回 16
     */
    getTextHeight: function(str) {
        if (!str || str.length === 0) {
            return 0;
        }
        var rst = jm.s({ "_fn": odefId, op: 65, str: str });
        return rst && rst.code === 0 ? rst.h : 0;
    },


};

//exports = oled
