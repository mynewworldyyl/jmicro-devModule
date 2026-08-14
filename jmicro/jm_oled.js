/**
 * OLED 显示屏控制模块
 * 该模块提供 OLED 显示屏的初始化、清屏、显示字符串/字符、填充屏幕、画图形、滚动等功能。
 * 底层通过 defId=101 注册的控制命令实现，与 jm_stm32_oled_ctrl.c 对应。
 *
 * 使用时方法名称前一定要带上 oled.前缀
 *
 * OLED API 返回值说明：
 *
 * 大多数方法返回的对象结构如下：
 * @typedef {Object} OLEDDisplayResult
 * @property {number} code - 状态码，0 表示成功，非 0 表示错误
 *   - 0: 操作成功
 *   - 1: 无效的操作码
 *   - 2: 缺少参数
 * @property {number} [status] - 操作状态（部分方法返回）
 * @property {string} [msg] - 错误消息（仅在 code != 0 时返回）
 *
 * @module OLED显示屏控制模块
 * @var oled
 * @category oled
 * @keywords OLED,SSD1306,显示屏,字符串,清屏,填充,画线,画圆,画矩形,滚动
 * @capabilities init,showText,showChar,clear,fill,update,scrollRight,scrollLeft,scrollDiagRight,scrollDiagLeft,stopScroll,drawPixel,drawLine,drawRectangle,drawFilledRectangle,drawTriangle,drawFilledTriangle,drawCircle,drawFilledCircle,invertDisplay,toggleInvert,on,off
 * @depends 无
 */

let od = 101;

var oled = {

    /**
     * 初始化 OLED 显示屏。
     *
     * 该方法初始化 SSD1306 控制器，包括 I2C 通信、显示参数配置等。
     * 在调用其他显示方法前，必须先调用本方法。
     *
     * @function init
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
      * @cfg {return:false,name:"初始化OLED"}
      * @example
     * // 初始化 OLED
     * oled.init();
     *
     * // 初始化后延时 100ms 再显示
     * setTimeout(function() {
     *     oled.showText("Hello", 0, 0, oled.FONT_7X10);
     *     oled.update();
     * }, 100);
     */
    init: function () {
        return jm.s({ "_fn": od, "op": 0 });
    },

    /**
     * 字体常量定义。
     * @constant {number} FONT_7X10
     * @constant {number} FONT_11X18
     * @constant {number} FONT_16X26
     */
    FONT_7X10: 0,
    FONT_11X18: 1,
    FONT_16X26: 2,

    /**
     * 显示字符串。
     *
     * 该方法将字符串写入 OLED 显示缓冲区，并立即刷新屏幕。
     * 调用前请确保 OLED 已初始化。
     *
     * @function showText
     * @param {string} text - 需要显示的字符串内容
     * @param {number} x - 起始 X 坐标（0 到 SSD1306_WIDTH-1）
     * @param {number} y - 起始 Y 坐标（0 到 SSD1306_HEIGHT-1）
     * @param {number} [font] - 字体类型，默认为 FONT_7X10
     *   - oled.FONT_7X10: 7x10 像素字体
     *   - oled.FONT_11X18: 11x18 像素字体
     *   - oled.FONT_16X26: 16x26 像素字体
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"显示字符串",textType:"text",font:"字体",fontOptions:"7x10字体=0,11x18字体=1,16x26字体=2",x:"坐标",y:"纵坐标"}
     * @example
     * // 在坐标 (0, 0) 显示字符串，使用默认字体
     * oled.showText("Hello World", 0, 0);
     *
     * // 在坐标 (10, 20) 显示字符串，使用 16x26 字体
     * oled.showText("JMicro", 10, 20, oled.FONT_16X26);
     */
    showText: function (text, x, y, font) {
        return jm.s({ "_fn": od, "op": 1, "text": text, "x": x, "y": y, "font": (font !== undefined ? font : 0) });
    },

    /**
     * 显示单个字符。
     *
     * 该方法将一个字符写入 OLED 显示缓冲区，并立即刷新屏幕。
     *
     * @function showChar
     * @param {number} ch - 字符的 ASCII 码值
     * @param {number} x - 起始 X 坐标（0 到 SSD1306_WIDTH-1）
     * @param {number} y - 起始 Y 坐标（0 到 SSD1306_HEIGHT-1）
     * @param {number} [font] - 字体类型，默认为 FONT_7X10
     *   - oled.FONT_7X10: 7x10 像素字体
     *   - oled.FONT_11X18: 11x18 像素字体
     *   - oled.FONT_16X26: 16x26 像素字体
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"显示字符",ch:"字符",font:"字体",fontOptions:"7x10字体=0,11x18字体=1,16x26字体=2",x:"横坐标",y:"纵坐标"}
     * @example
     * // 在坐标 (0, 0) 显示字符 'A'
     * oled.showChar(65, 0, 0);
     *
     * // 在坐标 (20, 30) 显示字符 'Z'，使用 11x18 字体
     * oled.showChar(90, 20, 30, oled.FONT_11X18);
     */
    showChar: function (ch, x, y, font) {
        return jm.s({ "_fn": od, "op": 2, "ch": ch, "x": x, "y": y, "font": (font !== undefined ? font : 0) });
    },

    /**
     * 清除 OLED 显示缓冲区。
     *
     * 该方法清除当前显示内容，屏幕将被清空（所有像素熄灭）。
     * 清屏后需要调用 update() 刷新屏幕才能生效。
     *
     * @function clear
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"清屏"}
     * @example
     * // 清屏
     * oled.clear();
     */
    clear: function () {
        return jm.s({ "_fn": od, "op": 3 });
    },

    /**
     * 填充整个 OLED 屏幕。
     *
     * 该方法用指定颜色填充整个屏幕，填充后会自动刷新。
     *
     * @function fill
     * @param {number} v - 填充颜色
     *   - 0: 黑色（全部熄灭）
     *   - 1: 白色（全部点亮）
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"填充屏幕",vType:"bool",vOptions:"黑色=0,白色=1"}
     * @example
     * // 填充白屏
     * oled.fill(1);
     *
     * // 填充黑屏
     * oled.fill(0);
     */
    fill: function (v) {
        return jm.s({ "_fn": od, "op": 4, "v": v });
    },

    /**
     * 刷新 OLED 显示缓冲区到屏幕。
     *
     * 该方法将内部 RAM 中的缓冲区内容刷到 LCD 屏幕上显示。
     * 当使用 clear、fill、drawPixel 等不自动刷新的方法后，
     * 必须调用本方法才能看到效果。
     *
     * @function update
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"刷新屏幕"}
     * @example
     * // 画点后刷新
     * oled.drawPixel(64, 32, 1);
     * oled.update();
     */
    update: function () {
        return jm.s({ "_fn": od, "op": 5 });
    },

    /**
     * 设置 OLED 显示是否反色。
     *
     * @function invertDisplay
     * @param {number} i - 是否反色
     *   - 0: 正常显示
     *   - 1: 反色显示
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"反色显示",iType:"bool",iOptions:"正常=0,反色=1"}
     * @example
     * // 开启反色显示
     * oled.invertDisplay(1);
     *
     * // 恢复正常显示
     * oled.invertDisplay(0);
     */
    invertDisplay: function (i) {
        return jm.s({ "_fn": od, "op": 6, "i": i });
    },

    /**
     * 切换 OLED 显示反色状态。
     *
     * 该方法切换当前的反色/正常显示模式。
     *
     * @function toggleInvert
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"切换反色"}
     * @example
     * // 切换反色模式
     * oled.toggleInvert();
     */
    toggleInvert: function () {
        return jm.s({ "_fn": od, "op": 7 });
    },

    /**
     * 在指定坐标画一个点。
     *
     * @function drawPixel
     * @param {number} x - X 坐标（0 到 SSD1306_WIDTH-1）
     * @param {number} y - Y 坐标（0 到 SSD1306_HEIGHT-1）
     * @param {number} color - 点的颜色
     *   - 0: 黑色
     *   - 1: 白色
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"画点",x:"横坐标",y:"纵坐标",color:"颜色",colorOptions:"黑色=0,白色=1"}
     * @example
     * // 在 (64, 32) 画一个白点
     * oled.drawPixel(64, 32, 1);
     * oled.update();
     */
    drawPixel: function (x, y, color) {
        return jm.s({ "_fn": od, "op": 8, "x": x, "y": y, "color": color });
    },

    /**
     * 绘制一条直线。
     *
     * @function drawLine
     * @param {number} x0 - 起始点 X 坐标
     * @param {number} y0 - 起始点 Y 坐标
     * @param {number} x1 - 结束点 X 坐标
     * @param {number} y1 - 结束点 Y 坐标
     * @param {number} color - 线的颜色
     *   - 0: 黑色
     *   - 1: 白色
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"画线",x0:"起始横坐标",y0:"起始纵坐标",x1:"结束横坐标",y1:"结束纵坐标",color:"颜色",colorOptions:"黑色=0,白色=1"}
     * @example
     * // 从 (0, 0) 到 (127, 63) 画一条对角线
     * oled.drawLine(0, 0, 127, 63, 1);
     * oled.update();
     */
    drawLine: function (x0, y0, x1, y1, color) {
        return jm.s({ "_fn": od, "op": 9, "x0": x0, "y0": y0, "x1": x1, "y1": y1, "color": color });
    },

    /**
     * 绘制一个矩形（空心）。
     *
     * @function drawRectangle
     * @param {number} x - 左上角 X 坐标
     * @param {number} y - 左上角 Y 坐标
     * @param {number} w - 矩形宽度（像素）
     * @param {number} h - 矩形高度（像素）
     * @param {number} color - 线的颜色
     *   - 0: 黑色
     *   - 1: 白色
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"画矩形",x:"横坐标",y:"纵坐标",w:"宽度",h:"高度",color:"颜色",colorOptions:"黑色=0,白色=1"}
     * @example
     * // 在 (10, 10) 处画一个 50x30 的空心矩形
     * oled.drawRectangle(10, 10, 50, 30, 1);
     * oled.update();
     */
    drawRectangle: function (x, y, w, h, color) {
        return jm.s({ "_fn": od, "op": 10, "x": x, "y": y, "w": w, "h": h, "color": color });
    },

    /**
     * 绘制一个填充矩形。
     *
     * @function drawFilledRectangle
     * @param {number} x - 左上角 X 坐标
     * @param {number} y - 左上角 Y 坐标
     * @param {number} w - 矩形宽度（像素）
     * @param {number} h - 矩形高度（像素）
     * @param {number} color - 填充颜色
     *   - 0: 黑色
     *   - 1: 白色
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"画填充矩形",x:"横坐标",y:"纵坐标",w:"宽度",h:"高度",color:"颜色",colorOptions:"黑色=0,白色=1"}
     * @example
     * // 在 (10, 10) 处画一个 50x30 的填充矩形
     * oled.drawFilledRectangle(10, 10, 50, 30, 1);
     * oled.update();
     */
    drawFilledRectangle: function (x, y, w, h, color) {
        return jm.s({ "_fn": od, "op": 11, "x": x, "y": y, "w": w, "h": h, "color": color });
    },

    /**
     * 绘制一个三角形（空心）。
     *
     * @function drawTriangle
     * @param {number} x1 - 第一个顶点 X 坐标
     * @param {number} y1 - 第一个顶点 Y 坐标
     * @param {number} x2 - 第二个顶点 X 坐标
     * @param {number} y2 - 第二个顶点 Y 坐标
     * @param {number} x3 - 第三个顶点 X 坐标
     * @param {number} y3 - 第三个顶点 Y 坐标
     * @param {number} color - 线的颜色
     *   - 0: 黑色
     *   - 1: 白色
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"画三角形",x1:"第一点横坐标",y1:"第一点纵坐标",x2:"第二点横坐标",y2:"第二点纵坐标",x3:"第三点横坐标",y3:"第三点纵坐标",color:"颜色",colorOptions:"黑色=0,白色=1"}
     * @example
     * // 绘制一个三角形
     * oled.drawTriangle(10, 10, 60, 30, 30, 60, 1);
     * oled.update();
     */
    drawTriangle: function (x1, y1, x2, y2, x3, y3, color) {
        return jm.s({ "_fn": od, "op": 12, "x1": x1, "y1": y1, "x2": x2, "y2": y2, "x3": x3, "y3": y3, "color": color });
    },

    /**
     * 绘制一个填充三角形。
     *
     * @function drawFilledTriangle
     * @param {number} x1 - 第一个顶点 X 坐标
     * @param {number} y1 - 第一个顶点 Y 坐标
     * @param {number} x2 - 第二个顶点 X 坐标
     * @param {number} y2 - 第二个顶点 Y 坐标
     * @param {number} x3 - 第三个顶点 X 坐标
     * @param {number} y3 - 第三个顶点 Y 坐标
     * @param {number} color - 填充颜色
     *   - 0: 黑色
     *   - 1: 白色
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"画填充三角形",x1:"第一点横坐标",y1:"第一点纵坐标",x2:"第二点横坐标",y2:"第二点纵坐标",x3:"第三点横坐标",y3:"第三点纵坐标",color:"颜色",colorOptions:"黑色=0,白色=1"}
     * @example
     * // 绘制一个填充三角形
     * oled.drawFilledTriangle(10, 10, 60, 30, 30, 60, 1);
     * oled.update();
     */
    drawFilledTriangle: function (x1, y1, x2, y2, x3, y3, color) {
        return jm.s({ "_fn": od, "op": 13, "x1": x1, "y1": y1, "x2": x2, "y2": y2, "x3": x3, "y3": y3, "color": color });
    },

    /**
     * 绘制一个圆形（空心）。
     *
     * @function drawCircle
     * @param {number} x - 圆心 X 坐标
     * @param {number} y - 圆心 Y 坐标
     * @param {number} r - 圆半径（像素）
     * @param {number} color - 线的颜色
     *   - 0: 黑色
     *   - 1: 白色
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"画圆",x:"圆心横坐标",y:"圆心纵坐标",r:"半径",color:"颜色",colorOptions:"黑色=0,白色=1"}
     * @example
     * // 在 (64, 32) 处画一个半径为 20 的圆
     * oled.drawCircle(64, 32, 20, 1);
     * oled.update();
     */
    drawCircle: function (x, y, r, color) {
        return jm.s({ "_fn": od, "op": 14, "x": x, "y": y, "r": r, "color": color });
    },

    /**
     * 绘制一个填充圆。
     *
     * @function drawFilledCircle
     * @param {number} x - 圆心 X 坐标
     * @param {number} y - 圆心 Y 坐标
     * @param {number} r - 圆半径（像素）
     * @param {number} color - 填充颜色
     *   - 0: 黑色
     *   - 1: 白色
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"画填充圆",x:"圆心横坐标",y:"圆心纵坐标",r:"半径",color:"颜色",colorOptions:"黑色=0,白色=1"}
     * @example
     * // 在 (64, 32) 处画一个半径为 20 的填充圆
     * oled.drawFilledCircle(64, 32, 20, 1);
     * oled.update();
     */
    drawFilledCircle: function (x, y, r, color) {
        return jm.s({ "_fn": od, "op": 15, "x": x, "y": y, "r": r, "color": color });
    },

    /**
     * 启动屏幕向右滚动效果。
     *
     * @function scrollRight
     * @param {number} start_row - 起始行（0-7）
     * @param {number} end_row - 结束行（0-7）
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"向右滚动",start_row:"起始行",end_row:"结束行"}
     * @example
     * // 从第 0 行到第 7 行向右滚动
     * oled.scrollRight(0, 7);
     */
    scrollRight: function (start_row, end_row) {
        return jm.s({ "_fn": od, "op": 16, "start_row": start_row, "end_row": end_row });
    },

    /**
     * 启动屏幕向左滚动效果。
     *
     * @function scrollLeft
     * @param {number} start_row - 起始行（0-7）
     * @param {number} end_row - 结束行（0-7）
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"向左滚动",start_row:"起始行",end_row:"结束行"}
     * @example
     * // 从第 0 行到第 7 行向左滚动
     * oled.scrollLeft(0, 7);
     */
    scrollLeft: function (start_row, end_row) {
        return jm.s({ "_fn": od, "op": 17, "start_row": start_row, "end_row": end_row });
    },

    /**
     * 启动屏幕对角向右滚动效果。
     *
     * @function scrollDiagRight
     * @param {number} start_row - 起始行（0-7）
     * @param {number} end_row - 结束行（0-7）
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"对角右滚",start_row:"起始行",end_row:"结束行"}
     * @example
     * // 对角向右滚动
     * oled.scrollDiagRight(0, 7);
     */
    scrollDiagRight: function (start_row, end_row) {
        return jm.s({ "_fn": od, "op": 18, "start_row": start_row, "end_row": end_row });
    },

    /**
     * 启动屏幕对角向左滚动效果。
     *
     * @function scrollDiagLeft
     * @param {number} start_row - 起始行（0-7）
     * @param {number} end_row - 结束行（0-7）
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"对角左滚",start_row:"起始行",end_row:"结束行"}
     * @example
     * // 对角向左滚动
     * oled.scrollDiagLeft(0, 7);
     */
    scrollDiagLeft: function (start_row, end_row) {
        return jm.s({ "_fn": od, "op": 19, "start_row": start_row, "end_row": end_row });
    },

    /**
     * 停止屏幕滚动效果。
     *
     * 该方法停止当前正在进行的滚动动画。
     *
     * @function stopScroll
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"停止滚动"}
     * @example
     * // 停止滚动
     * oled.stopScroll();
     */
    stopScroll: function () {
        return jm.s({ "_fn": od, "op": 20 });
    },

    /**
     * 开启或关闭 OLED 电源。
     *
     * @function setPower
     * @param {number} v - 电源状态
     *   - 1: 开启显示
     *   - 0: 关闭显示
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"电源控制",vType:"bool",vOptions:"关闭=0,开启=1"}
     * @example
     * // 开启 OLED 显示
     * oled.setPower(1);
     *
     * // 关闭 OLED 显示
     * oled.setPower(0);
     */
    setPower: function (v) {
        return jm.s({ "_fn": od, "op": 21, "v": v });
    },

    /**
     * 开启 OLED 显示。
     *
     * 该方法等同于 setPower(1)。
     *
     * @function on
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"开启显示"}
     * @example
     * oled.on();
     */
    on: function () {
        return jm.s({ "_fn": od, "op": 21, "v": 1 });
    },

    /**
     * 关闭 OLED 显示。
     *
     * 该方法等同于 setPower(0)。
     *
     * @function off
     * @returns {OLEDDisplayResult} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"关闭显示"}
     * @example
     * oled.off();
     */
    off: function () {
        return jm.s({ "_fn": od, "op": 21, "v": 0 });
    }
};

