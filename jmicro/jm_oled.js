/**
 * OLED 显示屏控制模块
 * 提供 OLED 初始化、清屏、显示字符、字符串、数字、图形、滚动等功能，
 * 支持十进制、十六进制、二进制数字显示。
 * 使用时方法名称前一定要带上 oled. 前缀
 *
 * @module OLED显示屏控制接口
 * @var oled
 * @category display
 * @keywords OLED,显示屏,SSD1306,I2C,字符显示,数字显示,清屏,初始化,图形,滚动
 * @capabilities init,clear,showChar,showString,showNum,showSignedNum,showHexNum,showBinNum,updateScreen,toggleInvert,fill,drawPixel,gotoXY,putc,drawLine,drawRectangle,drawFilledRectangle,drawTriangle,drawFilledTriangle,drawCircle,drawFilledCircle,drawBitmap,scrollRight,scrollLeft,scrolldiagright,scrolldiagleft,stopscroll,invertDisplay,on,off
 * @depends 无
 */

let oleddefId = 101;

var oled = {
    /**
     * 初始化 OLED 显示屏。
     * 配置 OLED 模块并清屏，准备好显示内容。
     *
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"初始化OLED" }
     *
     * @example
     * // 初始化 OLED
     * oled.init();
     */
    init: function () {
        return jm.s({ "_fn": oleddefId, op: 1 });
    },

    /**
     * 清空 OLED 显示屏。
     * 将整个屏幕内容清除为空白（全黑）。
     *
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"清空屏幕" }
     *
     * @example
     * // 清屏
     * oled.clear();
     */
    clear: function () {
        return jm.s({ "_fn": oleddefId, op: 2 });
    },

    /**
     * 在指定位置显示单个字符。
     *
     * @param {number} line - 行位置，范围：1~4
     * @param {number} col - 列位置，范围：1~16
     * @param {string} ch - 要显示的字符（ASCII可见字符）
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"显示字符", ch:'A', line:"行", col:"列", chType:"text"}
     *
     * @example
     * // 在第1行第1列显示字符 'A'
     * oled.showChar(1, 1, 'A');
     */
    showChar: function (line, col, ch) {
        return jm.s({ "_fn": oleddefId, op: 3, l: line, c: col, ch: ch.charCodeAt(0) });
    },

    /**
     * 在指定位置显示字符串。
     *
     * @param {number} line - 起始行位置，范围：1~4
     * @param {number} col - 起始列位置，范围：1~16
     * @param {string} s - 要显示的字符串（ASCII可见字符）
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"显示字符串", s:'字符串内容', line:"行", col:"列", sType:"text"}
     *
     * @example
     * // 在第1行第1列显示字符串 "Hello"
     * oled.showString(1, 1, "Hello");
     */
    showString: function (line, col, s) {
        return jm.s({ "_fn": oleddefId, op: 4, l: line, c: col, s: s });
    },

    /**
     * 在指定位置显示十进制无符号数字。
     *
     * @param {number} line - 起始行位置，范围：1~4
     * @param {number} col - 起始列位置，范围：1~16
     * @param {number} n - 要显示的数字，范围：0~4294967295
     * @param {number} len - 要显示数字的长度，范围：1~10
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"显示无符号数", n:"无符号数字", len:"显示长度", line:"行", col:"列"}
     *
     * @example
     * // 在第1行第1列显示数字 12345，长度为5
     * oled.showNum(1, 1, 12345, 5);
     */
    showNum: function (line, col, n, len) {
        return jm.s({ "_fn": oleddefId, op: 5, l: line, c: col, n: n, len: len });
    },

    /**
     * 在指定位置显示十进制有符号数字。
     *
     * @param {number} line - 起始行位置，范围：1~4
     * @param {number} col - 起始列位置，范围：1~16
     * @param {number} n - 要显示的数字，范围：-2147483648~2147483647
     * @param {number} len - 要显示数字的长度，范围：1~10
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"显示有符号数" ,n:"有符号数字", len:"显示长度", line:"行", col:"列"}
     *
     * @example
     * // 在第1行第1列显示有符号数字 -123，长度为4
     * oled.showSignedNum(1, 1, -123, 4);
     */
    showSignedNum: function (line, col, n, len) {
        return jm.s({ "_fn": oleddefId, op: 6, l: line, c: col, n: n, len: len });
    },

    /**
     * 在指定位置显示十六进制数字。
     *
     * @param {number} line - 起始行位置，范围：1~4
     * @param {number} col - 起始列位置，范围：1~16
     * @param {number} n - 要显示的数字，范围：0~0xFFFFFFFF
     * @param {number} len - 要显示数字的长度，范围：1~8
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"显示十六进制数", n:"十六进制数", len:"显示长度", line:"行", col:"列"}
     *
     * @example
     * // 在第1行第1列显示十六进制数 0xFF，长度为2
     * oled.showHexNum(1, 1, 0xFF, 2);
     */
    showHexNum: function (line, col, n, len) {
        return jm.s({ "_fn": oleddefId, op: 7, l: line, c: col, n: n, len: len });
    },

    /**
     * 在指定位置显示二进制数字。
     *
     * @param {number} line - 起始行位置，范围：1~4
     * @param {number} col - 起始列位置，范围：1~16
     * @param {number} n - 要显示的数字，范围：0~1111111111111111
     * @param {number} len - 要显示数字的长度，范围：1~16
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"显示二进制数", n:"二进制数", len:"显示长度", line:"行", col:"列"}
     *
     * @example
     * // 在第1行第1列显示二进制数 10101010，长度为8
     * oled.showBinNum(1, 1, 0b10101010, 8);
     */
    showBinNum: function (line, col, n, len) {
        return jm.s({ "_fn": oleddefId, op: 8, l: line, c: col, n: n, len: len });
    },

    /**
     * 刷新屏幕，将缓冲区内容更新到OLED面板。
     * 通常在修改显存后调用以显示最新内容。
     *
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"刷新屏幕" }
     *
     * @example
     * // 刷新屏幕
     * oled.updateScreen();
     */
    updateScreen: function () {
        return jm.s({ "_fn": oleddefId, op: 9 });
    },

    /**
     * 切换屏幕反显状态。
     * 在正常显示和反色显示之间切换。
     *
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"反显切换" }
     *
     * @example
     * // 切换反显
     * oled.toggleInvert();
     */
    toggleInvert: function () {
        return jm.s({ "_fn": oleddefId, op: 10 });
    },

    /**
     * 填充整个屏幕为指定颜色。
     *
     * @param {number} color - 填充颜色，0=黑色，1=白色
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"填充屏幕", color:"填充颜色"}
     *
     * @example
     * // 填充白色
     * oled.fill(1);
     */
    fill: function (color) {
        return jm.s({ "_fn": oleddefId, op: 11, color: color });
    },

    /**
     * 在指定坐标绘制单个像素点。
     *
     * @param {number} x - X坐标，范围：0~127
     * @param {number} y - Y坐标，范围：0~63
     * @param {number} color - 像素颜色，0=黑色，1=白色
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"绘制像素", x:"X坐标", y:"Y坐标", color:"像素颜色"}
     *
     * @example
     * // 在(10,10)绘制白色像素
     * oled.drawPixel(10, 10, 1);
     */
    drawPixel: function (x, y, color) {
        return jm.s({ "_fn": oleddefId, op: 12, x: x, y: y, color: color });
    },

    /**
     * 设置光标位置，用于后续字符绘制。
     *
     * @param {number} x - X坐标，范围：0~127
     * @param {number} y - Y坐标，范围：0~63
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"设置光标", x:"X坐标", y:"Y坐标"}
     *
     * @example
     * // 设置光标到(10,10)
     * oled.gotoXY(10, 10);
     */
    gotoXY: function (x, y) {
        return jm.s({ "_fn": oleddefId, op: 13, x: x, y: y });
    },

    /**
     * 在指定位置绘制单个字符（使用指定字体）。
     *
     * @param {number} x - X坐标，范围：0~127
     * @param {number} y - Y坐标，范围：0~63
     * @param {string} ch - 要显示的字符
     * @param {number} font - 字体编号，0=7x10，1=11x18，2=16x26
     * @param {number} color - 字符颜色，0=黑色，1=白色
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"绘制字符", ch:'A', x:"X坐标", y:"Y坐标", font:"字体编号", color:"字符颜色", chType:"text"}
     *
     * @example
     * // 在(10,10)用7x10字体显示字符'A'，白色
     * oled.putc(10, 10, 'A', 0, 1);
     */
    putc: function (x, y, ch, font, color) {
        return jm.s({ "_fn": oleddefId, op: 14, x: x, y: y, ch: ch.charCodeAt(0), font: font, color: color });
    },

    /**
     * 在两点之间绘制直线。
     *
     * @param {number} x0 - 起点X坐标，范围：0~127
     * @param {number} y0 - 起点Y坐标，范围：0~63
     * @param {number} x1 - 终点X坐标，范围：0~127
     * @param {number} y1 - 终点Y坐标，范围：0~63
     * @param {number} color - 线条颜色，0=黑色，1=白色
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"绘制直线", x0:"起点X", y0:"起点Y", x1:"终点X", y1:"终点Y", color:"线条颜色"}
     *
     * @example
     * // 从(0,0)到(127,63)画白线
     * oled.drawLine(0, 0, 127, 63, 1);
     */
    drawLine: function (x0, y0, x1, y1, color) {
        return jm.s({ "_fn": oleddefId, op: 15, x0: x0, y0: y0, x1: x1, y1: y1, color: color });
    },

    /**
     * 在指定位置绘制空心矩形。
     *
     * @param {number} x - 左上角X坐标，范围：0~127
     * @param {number} y - 左上角Y坐标，范围：0~63
     * @param {number} w - 矩形宽度，范围：1~128
     * @param {number} h - 矩形高度，范围：1~64
     * @param {number} color - 矩形颜色，0=黑色，1=白色
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"绘制矩形", x:"左上角X", y:"左上角Y", w:"矩形宽度", h:"矩形高度", color:"矩形颜色"}
     *
     * @example
     * // 在(10,10)绘制10x10白色空心矩形
     * oled.drawRectangle(10, 10, 10, 10, 1);
     */
    drawRectangle: function (x, y, w, h, color) {
        return jm.s({ "_fn": oleddefId, op: 16, x: x, y: y, w: w, h: h, color: color });
    },

    /**
     * 在指定位置绘制实心矩形。
     *
     * @param {number} x - 左上角X坐标，范围：0~127
     * @param {number} y - 左上角Y坐标，范围：0~63
     * @param {number} w - 矩形宽度，范围：1~128
     * @param {number} h - 矩形高度，范围：1~64
     * @param {number} color - 矩形颜色，0=黑色，1=白色
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"填充矩形", x:"左上角X", y:"左上角Y", w:"矩形宽度", h:"矩形高度", color:"填充颜色"}
     *
     * @example
     * // 在(10,10)绘制10x10白色实心矩形
     * oled.drawFilledRectangle(10, 10, 10, 10, 1);
     */
    drawFilledRectangle: function (x, y, w, h, color) {
        return jm.s({ "_fn": oleddefId, op: 17, x: x, y: y, w: w, h: h, color: color });
    },

    /**
     * 绘制三角形（三条边均为空心线条）。
     *
     * @param {number} x1 - 顶点1 X坐标
     * @param {number} y1 - 顶点1 Y坐标
     * @param {number} x2 - 顶点2 X坐标
     * @param {number} y2 - 顶点2 Y坐标
     * @param {number} x3 - 顶点3 X坐标
     * @param {number} y3 - 顶点3 Y坐标
     * @param {number} color - 线条颜色，0=黑色，1=白色
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"绘制三角形", x1:"顶点1 X", y1:"顶点1 Y", x2:"顶点2 X", y2:"顶点2 Y", x3:"顶点3 X", y3:"顶点3 Y", color:"线条颜色"}
     *
     * @example
     * // 绘制空心三角形
     * oled.drawTriangle(0, 0, 20, 20, 40, 0, 1);
     */
    drawTriangle: function (x1, y1, x2, y2, x3, y3, color) {
        return jm.s({ "_fn": oleddefId, op: 18, x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3, color: color });
    },

    /**
     * 绘制实心三角形。
     *
     * @param {number} x1 - 顶点1 X坐标
     * @param {number} y1 - 顶点1 Y坐标
     * @param {number} x2 - 顶点2 X坐标
     * @param {number} y2 - 顶点2 Y坐标
     * @param {number} x3 - 顶点3 X坐标
     * @param {number} y3 - 顶点3 Y坐标
     * @param {number} color - 填充颜色，0=黑色，1=白色
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"填充三角形", x1:"顶点1 X", y1:"顶点1 Y", x2:"顶点2 X", y2:"顶点2 Y", x3:"顶点3 X", y3:"顶点3 Y", color:"填充颜色"}
     *
     * @example
     * // 绘制实心三角形
     * oled.drawFilledTriangle(0, 0, 20, 20, 40, 0, 1);
     */
    drawFilledTriangle: function (x1, y1, x2, y2, x3, y3, color) {
        return jm.s({ "_fn": oleddefId, op: 19, x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3, color: color });
    },

    /**
     * 绘制圆形（空心）。
     *
     * @param {number} x - 圆心X坐标，范围：0~127
     * @param {number} y - 圆心Y坐标，范围：0~63
     * @param {number} r - 半径，范围：0~63
     * @param {number} color - 线条颜色，0=黑色，1=白色
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"绘制圆形", x:"圆心X", y:"圆心Y", r:"半径", color:"线条颜色"}
     *
     * @example
     * // 在屏幕中心绘制半径10的白色空心圆
     * oled.drawCircle(64, 32, 10, 1);
     */
    drawCircle: function (x, y, r, color) {
        return jm.s({ "_fn": oleddefId, op: 20, x: x, y: y, r: r, color: color });
    },

    /**
     * 绘制实心圆形。
     *
     * @param {number} x - 圆心X坐标，范围：0~127
     * @param {number} y - 圆心Y坐标，范围：0~63
     * @param {number} r - 半径，范围：0~63
     * @param {number} color - 填充颜色，0=黑色，1=白色
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"填充圆形", x:"圆心X", y:"圆心Y", r:"半径", color:"填充颜色"}
     *
     * @example
     * // 在屏幕中心绘制半径10的白色实心圆
     * oled.drawFilledCircle(64, 32, 10, 1);
     */
    drawFilledCircle: function (x, y, r, color) {
        return jm.s({ "_fn": oleddefId, op: 21, x: x, y: y, r: r, color: color });
    },

    /**
     * 在指定位置绘制位图。
     *
     * @param {number} x - 左上角X坐标，范围：0~127
     * @param {number} y - 左上角Y坐标，范围：0~63
     * @param {number} w - 位图宽度（像素），范围：1~128
     * @param {number} h - 位图高度（像素），范围：1~64
     * @param {number} color - 位图颜色，0=黑色，1=白色
     * @param {string} s - 位图数据的十六进制字符串
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"绘制位图", x:"左上角X", y:"左上角Y", w:"位图宽度", h:"位图高度", color:"位图颜色", s:'hex字符串', sType:"text"}
     *
     * @example
     * // 在(0,0)绘制64x64白色位图
     * oled.drawBitmap(0, 0, 64, 64, 1, '00FF...');
     */
    drawBitmap: function (x, y, w, h, color, s) {
        return jm.s({ "_fn": oleddefId, op: 22, x: x, y: y, w: w, h: h, color: color, s: s });
    },

    /**
     * 向右水平滚动屏幕。
     *
     * @param {number} start - 起始页（行），范围：0~7
     * @param {number} end - 结束页（行），范围：0~7
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"向右滚动", start:"起始页", end:"结束页"}
     *
     * @example
     * // 第0页到第7页向右滚动
     * oled.scrollRight(0, 7);
     */
    scrollRight: function (start, end) {
        return jm.s({ "_fn": oleddefId, op: 23, start: start, end: end });
    },

    /**
     * 向左水平滚动屏幕。
     *
     * @param {number} start - 起始页（行），范围：0~7
     * @param {number} end - 结束页（行），范围：0~7
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"向左滚动", start:"起始页", end:"结束页"}
     *
     * @example
     * // 第0页到第7页向左滚动
     * oled.scrollLeft(0, 7);
     */
    scrollLeft: function (start, end) {
        return jm.s({ "_fn": oleddefId, op: 24, start: start, end: end });
    },

    /**
     * 向右上对角线滚动屏幕。
     *
     * @param {number} start - 起始页（行），范围：0~7
     * @param {number} end - 结束页（行），范围：0~7
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"斜向右上滚动", start:"起始页", end:"结束页"}
     *
     * @example
     * // 第0页到第7页斜向右上滚动
     * oled.scrolldiagright(0, 7);
     */
    scrolldiagright: function (start, end) {
        return jm.s({ "_fn": oleddefId, op: 25, start: start, end: end });
    },

    /**
     * 向左上对角线滚动屏幕。
     *
     * @param {number} start - 起始页（行），范围：0~7
     * @param {number} end - 结束页（行），范围：0~7
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"斜向左上滚动", start:"起始页", end:"结束页"}
     *
     * @example
     * // 第0页到第7页斜向左上滚动
     * oled.scrolldiagleft(0, 7);
     */
    scrolldiagleft: function (start, end) {
        return jm.s({ "_fn": oleddefId, op: 26, start: start, end: end });
    },

    /**
     * 停止当前屏幕滚动。
     *
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"停止滚动" }
     *
     * @example
     * // 停止滚动
     * oled.stopscroll();
     */
    stopscroll: function () {
        return jm.s({ "_fn": oleddefId, op: 27 });
    },

    /**
     * 切换屏幕反显模式。
     *
     * @param {boolean} i - 反显开关，true=反色显示，false=正常显示
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"反显模式", i:"反显开关", iType:"bool"}
     *
     * @example
     * // 开启反显
     * oled.invertDisplay(true);
     */
    invertDisplay: function (i) {
        return jm.s({ "_fn": oleddefId, op: 28, i: i });
    },

    /**
     * 打开OLED显示（唤醒）。
     *
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"打开显示" }
     *
     * @example
     * // 打开OLED
     * oled.on();
     */
    on: function () {
        return jm.s({ "_fn": oleddefId, op: 29 });
    },

    /**
     * 关闭OLED显示（休眠）。
     *
     * @returns {Object} 返回操作结果对象，code为0表示成功
     *
     * @cfg {return:false,name:"关闭显示" }
     *
     * @example
     * // 关闭OLED
     * oled.off();
     */
    off: function () {
        return jm.s({ "_fn": oleddefId, op: 30 });
    }
};

//exports = oled;
