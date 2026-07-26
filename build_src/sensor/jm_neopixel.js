/**
 * 本模块提供了与 NeoPixel LED 灯带交互的相关功能。NeoPixel 是一种智能 RGB 或 RGBW LED 灯带，可通过单个数据线控制每个灯珠的颜色和亮度。
 * 该模块定义了多种颜色传输模式常量，以及一系列用于控制灯带的方法，如初始化、设置颜色、显示效果等。
 * 使用时方法名称前一定要带上neo.前缀
 * 
 * 颜色传输模式常量说明（RGB/RGBW灯带）：
 * - neo.NEO_RGB     : RGB顺序传输
 * - neo.NEO_RBG     : RBG顺序传输
 * - neo.NEO_GRB     : GRB顺序传输
 * - neo.NEO_GBR     : GBR顺序传输
 * - neo.NEO_BRG     : BRG顺序传输
 * - neo.NEO_BGR     : BGR顺序传输
 * - neo.NEO_WRGB    : WRGB顺序传输（RGBW灯带）
 * - neo.NEO_WRBG    : WRBG顺序传输（RGBW灯带）
 * - neo.NEO_WGRB    : WGRB顺序传输（RGBW灯带）
 * - neo.NEO_WGBR    : WGBR顺序传输（RGBW灯带）
 * - neo.NEO_WBRG    : WBRG顺序传输（RGBW灯带）
 * - neo.NEO_WBGR    : WBGR顺序传输（RGBW灯带）
 * - neo.NEO_RWGB    : RWGB顺序传输（RGBW灯带）
 * - neo.NEO_RWBG    : RWBG顺序传输（RGBW灯带）
 * - neo.NEO_RGWB    : RGWB顺序传输（RGBW灯带）
 * - neo.NEO_RGBW    : RGBW顺序传输（RGBW灯带）
 * - neo.NEO_RBWG    : RBWG顺序传输（RGBW灯带）
 * - neo.NEO_RBGW    : RBGW顺序传输（RGBW灯带）
 * - neo.NEO_GWRB    : GWRB顺序传输（RGBW灯带）
 * - neo.NEO_GWBR    : GWBR顺序传输（RGBW灯带）
 * - neo.NEO_GRWB    : GRWB顺序传输（RGBW灯带）
 * - neo.NEO_GRBW    : GRBW顺序传输（RGBW灯带）
 * - neo.NEO_GBWR    : GBWR顺序传输（RGBW灯带）
 * - neo.NEO_GBRW    : GBRW顺序传输（RGBW灯带）
 * - neo.NEO_BWRG    : BWRG顺序传输（RGBW灯带）
 * - neo.NEO_BWGR    : BWGR顺序传输（RGBW灯带）
 * - neo.NEO_BRWG    : BRWG顺序传输（RGBW灯带）
 * - neo.NEO_BRGW    : BRGW顺序传输（RGBW灯带）
 * - neo.NEO_BGWR    : BGWR顺序传输（RGBW灯带）
 * - neo.NEO_BGRW    : BGRW顺序传输（RGBW灯带）
 * NeoPixel API 返回值说明：
 * 
 * 大多数方法返回的对象结构如下：
 * @typedef {Object} NeoPixelResult
 * @property {number} code - 状态码，0 表示成功，非 0 表示错误
 *   - 0: 操作成功
 *   - 1: 缺少 op（操作码）参数
 *   - 2: 缺少 pin（引脚）参数
 *   - 3: 缺少 n（灯珠数量）参数
 *   - 4: 灯珠数量为 0（无效）
 *   - 6: 无效的操作码
 * @property {number|boolean} [v] - 返回值（仅查询操作返回）
 *   - canShow(): 返回 boolean，表示是否可以显示
 *   - getBrightness(): 返回 number，亮度值 0-255
 *   - numPixels(): 返回 number，灯珠数量
 *   - getPixelColor(): 返回 number，32位颜色值
 *   - gamma32(): 返回 number，伽马校正后的值
 *   - ColorHSV(): 返回 number，32位颜色值
 *   - gamma8(): 返回 number，伽马校正后的值
 * 
 * 使用方法示例：
 * ```javascript
 * // 初始化 30 颗灯珠，连接在 GPIO 12，使用 GRB 颜色模式
 * neo.begin(12, 30, neo.NEO_GRB);
 * 
 * // 设置第 0 颗灯珠为红色
 * neo.setPixelColor(12, 0, 255, 0, 0);
 * 
 * // 显示颜色
 * neo.show(12);
 * ```
 * @module NeoPixel RGB/RGBW灯带控制模块
 * @var neo
 * @category display
 * @keywords NeoPixel,RGB,RGBW,LED,灯带,彩色LED,WS2812,SK6812,彩虹效果,亮度,颜色,Arduino库
 * @capabilities begin,clear,show,setPixelColor,setPixelColorw,setPixelColorU32,fill,setBrightness,updateLength,updateType,canShow,getBrightness,numPixels,getPixelColor,gamma32,rainbow,ColorHSV,Color,gamma8
 * @depends 无
 */

let neodefId = 20;
let neotype = 65531;

let neo = {
    /**
     * 颜色传输模式常量：RGB 顺序传输
     */
    NEO_RGB: ((0 << 6) | (0 << 4) | (1 << 2) | (2)),
    /**
     * 颜色传输模式常量：RBG 顺序传输
     */
    NEO_RBG: ((0 << 6) | (0 << 4) | (2 << 2) | (1)),
    /**
     * 颜色传输模式常量：GRB 顺序传输
     */
    NEO_GRB: ((1 << 6) | (1 << 4) | (0 << 2) | (2)),
    /**
     * 颜色传输模式常量：GBR 顺序传输
     */
    NEO_GBR: ((2 << 6) | (2 << 4) | (0 << 2) | (1)),
    /**
     * 颜色传输模式常量：BRG 顺序传输
     */
    NEO_BRG: ((1 << 6) | (1 << 4) | (2 << 2) | (0)),
    /**
     * 颜色传输模式常量：BGR 顺序传输
     */
    NEO_BGR: ((2 << 6) | (2 << 4) | (1 << 2) | (0)),
    /**
     * 颜色传输模式常量：WRGB 顺序传输（适用于 RGBW 灯带）
     */
    NEO_WRGB: ((0 << 6) | (1 << 4) | (2 << 2) | (3)),
    /**
     * 颜色传输模式常量：WRBG 顺序传输（适用于 RGBW 灯带）
     */
    NEO_WRBG: ((0 << 6) | (1 << 4) | (3 << 2) | (2)),
    /**
     * 颜色传输模式常量：WGRB 顺序传输（适用于 RGBW 灯带）
     */
    NEO_WGRB: ((0 << 6) | (2 << 4) | (1 << 2) | (3)),
    /**
     * 颜色传输模式常量：WGBR 顺序传输（适用于 RGBW 灯带）
     */
    NEO_WGBR: ((0 << 6) | (3 << 4) | (1 << 2) | (2)),
    /**
     * 颜色传输模式常量：WBRG 顺序传输（适用于 RGBW 灯带）
     */
    NEO_WBRG: ((0 << 6) | (2 << 4) | (3 << 2) | (1)),
    /**
     * 颜色传输模式常量：WBGR 顺序传输（适用于 RGBW 灯带）
     */
    NEO_WBGR: ((0 << 6) | (3 << 4) | (2 << 2) | (1)),
    /**
     * 颜色传输模式常量：RWGB 顺序传输（适用于 RGBW 灯带）
     */
    NEO_RWGB: ((1 << 6) | (0 << 4) | (2 << 2) | (3)),
    /**
     * 颜色传输模式常量：RWBG 顺序传输（适用于 RGBW 灯带）
     */
    NEO_RWBG: ((1 << 6) | (0 << 4) | (3 << 2) | (2)),
    /**
     * 颜色传输模式常量：RGWB 顺序传输（适用于 RGBW 灯带）
     */
    NEO_RGWB: ((2 << 6) | (0 << 4) | (1 << 2) | (3)),
    /**
     * 颜色传输模式常量：RGBW 顺序传输（适用于 RGBW 灯带）
     */
    NEO_RGBW: ((3 << 6) | (0 << 4) | (1 << 2) | (2)),
    /**
     * 颜色传输模式常量：RBWG 顺序传输（适用于 RGBW 灯带）
     */
    NEO_RBWG: ((2 << 6) | (0 << 4) | (3 << 2) | (1)),
    /**
     * 颜色传输模式常量：RBGW 顺序传输（适用于 RGBW 灯带）
     */
    NEO_RBGW: ((3 << 6) | (0 << 4) | (2 << 2) | (1)),
    /**
     * 颜色传输模式常量：GWRB 顺序传输（适用于 RGBW 灯带）
     */
    NEO_GWRB: ((1 << 6) | (2 << 4) | (0 << 2) | (3)),
    /**
     * 颜色传输模式常量：GWBR 顺序传输（适用于 RGBW 灯带）
     */
    NEO_GWBR: ((1 << 6) | (3 << 4) | (0 << 2) | (2)),
    /**
     * 颜色传输模式常量：GRWB 顺序传输（适用于 RGBW 灯带）
     */
    NEO_GRWB: ((2 << 6) | (1 << 4) | (0 << 2) | (3)),
    /**
     * 颜色传输模式常量：GRBW 顺序传输（适用于 RGBW 灯带）
     */
    NEO_GRBW: ((3 << 6) | (1 << 4) | (0 << 2) | (2)),
    /**
     * 颜色传输模式常量：GBWR 顺序传输（适用于 RGBW 灯带）
     */
    NEO_GBWR: ((2 << 6) | (3 << 4) | (0 << 2) | (1)),
    /**
     * 颜色传输模式常量：GBRW 顺序传输（适用于 RGBW 灯带）
     */
    NEO_GBRW: ((3 << 6) | (2 << 4) | (0 << 2) | (1)),
    /**
     * 颜色传输模式常量：BWRG 顺序传输（适用于 RGBW 灯带）
     */
    NEO_BWRG: ((1 << 6) | (2 << 4) | (3 << 2) | (0)),
    /**
     * 颜色传输模式常量：BWGR 顺序传输（适用于 RGBW 灯带）
     */
    NEO_BWGR: ((1 << 6) | (3 << 4) | (2 << 2) | (0)),
    /**
     * 颜色传输模式常量：BRWG 顺序传输（适用于 RGBW 灯带）
     */
    NEO_BRWG: ((2 << 6) | (1 << 4) | (3 << 2) | (0)),
    /**
     * 颜色传输模式常量：BRGW 顺序传输（适用于 RGBW 灯带）
     */
    NEO_BRGW: ((3 << 6) | (1 << 4) | (2 << 2) | (0)),
    /**
     * 颜色传输模式常量：BGWR 顺序传输（适用于 RGBW 灯带）
     */
    NEO_BGWR: ((2 << 6) | (3 << 4) | (1 << 2) | (0)),
    /**
     * 颜色传输模式常量：BGRW 顺序传输（适用于 RGBW 灯带）
     */
    NEO_BGRW: ((3 << 6) | (2 << 4) | (1 << 2) | (0)),

    /**
     * 初始化 NeoPixel 灯带。
     * 
     * 该方法会创建灯带实例，设置引脚、灯珠数量和颜色传输模式。
     * 如果指定的引脚已经存在实例，会更新该实例的灯珠数量和颜色模式。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @param {number} count - 灯带的灯珠数量（必须大于 0）。
     * @param {number} ty - 颜色传输模式，可使用上面定义的常量（如 neo.NEO_GRB）。
     * @returns {NeoPixelResult} 返回操作结果对象，code 为 0 表示初始化成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * // 初始化 30 颗 WS2812 灯珠，使用 GPIO 12，GRB 颜色模式
     * neo.begin(12, 30, neo.NEO_GRB);
     */
    begin: function (pin, count, ty) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 1, pin: pin, n: count, t: ty });
        return rst;
    },

    /**
     * 清除灯带所有灯珠的颜色。
     * 
     * 该方法会将所有灯珠的颜色设置为关闭（全黑）。
     * 注意：调用 clear() 后需要调用 show() 才能生效。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @returns {NeoPixelResult} 返回操作结果对象，code 为 0 表示清除成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * neo.clear(12);
     * neo.show(12);  // 使清除生效
     */
    clear: function (pin) {
        return jm.s({ "_fn": neodefId, ty: neotype, op: 2, pin: pin });
    },

    /**
     * 显示当前设置的灯带颜色。
     * 
     * 该方法将之前通过 setPixelColor()、fill() 等方法设置的
     * 颜色数据实际输出到灯带上，使颜色变化可见。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @returns {NeoPixelResult} 返回操作结果对象，code 为 0 表示显示成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * neo.setPixelColor(12, 0, 255, 0, 0);
     * neo.show(12);  // 显示红色
     */
    show: function (pin) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 3, pin: pin });
        return rst;
    },

    /**
     * 设置指定灯珠的 RGB 颜色。
     * 
     * 该方法设置单个灯珠的 RGB 颜色值。
     * 注意：设置后需要调用 show() 才能实际显示颜色。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @param {number} n - 灯珠的索引，从 0 开始，范围 0 到 (灯珠数量-1)。
     * @param {number} red - 红色通道值，范围 0 - 255。
     * @param {number} green - 绿色通道值，范围 0 - 255。
     * @param {number} blue - 蓝色通道值，范围 0 - 255。
     * @returns {NeoPixelResult} 返回操作结果对象，code 为 0 表示设置成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * // 设置第 0 颗灯珠为红色
     * neo.setPixelColor(12, 0, 255, 0, 0);
     * neo.show(12);
     */
    setPixelColor: function (pin, n, red, green, blue) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 4, pin: pin, n: n, r: red, g: green, b: blue });
        return rst;
    },

    /**
     * 设置指定灯珠的 RGBW 颜色（适用于 RGBW 灯带）。
     * 
     * 该方法设置单个灯珠的 RGBW 颜色值，包含独立的白色通道。
     * 注意：设置后需要调用 show() 才能实际显示颜色。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @param {number} n - 灯珠的索引，从 0 开始，范围 0 到 (灯珠数量-1)。
     * @param {number} red - 红色通道值，范围 0 - 255。
     * @param {number} green - 绿色通道值，范围 0 - 255。
     * @param {number} blue - 蓝色通道值，范围 0 - 255。
     * @param {number} w - 白色通道值，范围 0 - 255。
     * @returns {NeoPixelResult} 返回操作结果对象，code 为 0 表示设置成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * // 设置第 0 颗灯珠为暖白色
     * neo.setPixelColorw(12, 0, 255, 200, 150, 128);
     * neo.show(12);
     */
    setPixelColorw: function (pin, n, red, green, blue, w) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 5, pin: pin, n: n, r: red, g: green, b: blue, w: w });
        return rst;
    },

    /**
     * 使用 32 位无符号整数设置指定灯珠的颜色。
     * 
     * 该方法使用组合好的 32 位颜色值设置单个灯珠的颜色。
     * 颜色值格式通常为：0x00RRGGBB（RGB）或 0xWWRRGGBB（RGBW）。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @param {number} n - 灯珠的索引，从 0 开始，范围 0 到 (灯珠数量-1)。
     * @param {number} color - 32 位无符号整数表示的颜色值。
     * @returns {NeoPixelResult} 返回操作结果对象，code 为 0 表示设置成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * // 使用 Color() 方法生成颜色值
     * let color = neo.Color(12, 255, 0, 0);
     * neo.setPixelColorU32(12, 0, color);
     * neo.show(12);
     */
    setPixelColorU32: function (pin, n, color) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 6, pin: pin, n: n, c: color });
        return rst;
    },

    /**
     * 用指定颜色填充灯带的部分或全部灯珠。
     * 
     * 该方法从指定起始位置开始，填充指定数量的灯珠为同一颜色。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @param {number} color - 32 位无符号整数表示的颜色值。
     * @param {number} first - 起始灯珠的索引，从 0 开始。
     * @param {number} count - 要填充的灯珠数量。
     * @returns {NeoPixelResult} 返回操作结果对象，code 为 0 表示填充成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * // 用蓝色填充前 10 颗灯珠
     * let color = neo.Color(12, 0, 0, 255);
     * neo.fill(12, color, 0, 10);
     * neo.show(12);
     */
    fill: function (pin, color, first, count) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 7, pin: pin, n: count, f: first, c: color });
        return rst;
    },

    /**
     * 设置灯带的整体亮度。
     * 
     * 该方法会缩放所有灯珠的颜色值，实现整体亮度调节。
     * 亮度值 255 表示最亮，0 表示完全熄灭。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @param {number} b - 亮度值，范围 0 - 255。
     * @returns {NeoPixelResult} 返回操作结果对象，code 为 0 表示设置成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * neo.setBrightness(12, 128);  // 设置 50% 亮度
     * neo.show(12);
     */
    setBrightness: function (pin, b) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 8, pin: pin, b: b });
        return rst;
    },

    /**
     * 更新灯带的灯珠数量。
     * 
     * 该方法动态调整灯带实例的灯珠数量。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @param {number} count - 新的灯珠数量。
     * @returns {NeoPixelResult} 返回操作结果对象，code 为 0 表示更新成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    updateLength: function (pin, count) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 9, pin: pin, n: count });
        return rst;
    },

    /**
     * 更新灯带的颜色传输模式。
     * 
     * 该方法动态调整灯带实例的颜色数据格式。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @param {number} type - 新的颜色传输模式，可使用上面定义的常量。
     * @returns {NeoPixelResult} 返回操作结果对象，code 为 0 表示更新成功。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    updateType: function (pin, type) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 10, pin: pin, n: type });
        return rst;
    },

    /**
     * 检查灯带是否可以显示颜色。
     * 
     * 该方法用于检查灯带硬件是否准备好显示数据。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @returns {boolean} - 如果可以显示，返回 true；否则返回 false。
     * 
     * @example
     * if (neo.canShow(12)) {
     *     neo.show(12);
     * }
     */
    canShow: function (pin) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 11, pin: pin });
        return rst && rst.code == 0 ? rst.v : false;
    },

    /**
     * 获取灯带的当前亮度。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @returns {number} - 当前亮度值，范围 0 - 255；如果操作失败，返回 0。
     * 
     * @example
     * let brightness = neo.getBrightness(12);
     * console.log("当前亮度: " + brightness);
     */
    getBrightness: function (pin) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 13, pin: pin });
        return rst && rst.code == 0 ? rst.v : 0;
    },

    /**
     * 获取灯带的灯珠数量。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @returns {number} - 灯带的灯珠数量；如果操作失败，返回 0。
     * 
     * @example
     * let count = neo.numPixels(12);
     * console.log("灯珠数量: " + count);
     */
    numPixels: function (pin) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 14, pin: pin });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 获取指定灯珠的颜色值。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @param {number} n - 灯珠的索引，从 0 开始。
     * @returns {number} - 该灯珠的颜色值（32 位无符号整数）；若操作失败，返回 0。
     * 
     * @example
     * let color = neo.getPixelColor(12, 0);
     * let red = (color >> 16) & 0xFF;
     * let green = (color >> 8) & 0xFF;
     * let blue = color & 0xFF;
     * console.log("红色: " + red + ", 绿色: " + green + ", 蓝色: " + blue);
     */
    getPixelColor: function (pin, n) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 15, pin: pin, n: n });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 进行 32 位伽马校正。
     * 
     * 伽马校正用于调整颜色的亮度曲线，以改善视觉效果。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @param {number} x - 输入的 32 位颜色值。
     * @returns {number} - 经过伽马校正后的颜色值；若操作失败，返回 0。
     */
    gamma32: function (pin, x) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 16, pin: pin, n: x });
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 在灯带中实现彩虹效果。
     * 
     * 该方法可以在指定引脚连接的灯带中创建彩虹颜色渐变效果。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @param {number} first_hue - 起始色调，取值范围 0 - 65535，用于确定彩虹效果的起始颜色。
     * @param {number} reps - 重复次数，指定彩虹效果在灯带中重复显示的次数。
     * @param {number} saturation - 饱和度，取值范围 0 - 255，用于控制颜色的鲜艳程度。
     * @param {number} brightness - 亮度，取值范围 0 - 255，用于控制灯带的整体亮度。
     * @param {boolean} gammify - 是否进行伽马校正的标志，true 表示进行伽马校正，false 表示不进行。
     * @returns {NeoPixelResult} 返回操作结果对象，code 为 0 表示设置成功。
     * 
     * @example
     * // 在 30 颗灯珠上显示彩虹效果
     * neo.rainbow(12, 0, 1, 255, 255, true);
     * neo.show(12);
     */
    rainbow: function (pin, first_hue, reps, saturation, brightness, gammify) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 17, pin: pin, f: first_hue, r: reps, s: saturation, b: brightness, g: gammify });
        return rst;
    },

    /**
     * 根据 HSV（色相、饱和度、明度）值获取颜色值。
     * 
     * 该方法将指定的 HSV 颜色模型参数转换为适合 NeoPixel 灯带使用的颜色值。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @param {number} hue - 色相，取值范围 0 - 65535，用于确定颜色的基本色调。
     * @param {number} [sat] - 饱和度，取值范围 0 - 255，可选，默认 255。
     * @param {number} [val] - 明度，取值范围 0 - 255，可选，默认 255。
     * @returns {number} - 转换后的 32 位颜色值；若操作失败，返回 0。
     * 
     * @example
     * // 生成红色（色相 0）
     * let red = neo.ColorHSV(12, 0);
     * neo.setPixelColorU32(12, 0, red);
     * neo.show(12);
     */
    ColorHSV: function (pin, hue, sat, val) {
        let ps = { "_fn": neodefId, ty: neotype, op: 18, pin: pin, h: hue };
        if (typeof sat !== 'undefined') ps.s = sat;
        if (typeof val !== 'undefined') ps.v = val;
        let rst = jm.s(ps);
        return rst && rst.code === 0 ? rst.v : 0;
    },

    /**
     * 根据 RGB 或 RGBW 值生成颜色值。
     * 
     * 该方法根据传入的红、绿、蓝通道值，以及可选的白色通道值，生成适合 NeoPixel 灯带使用的颜色值。
     * 注意：此方法在 JS 端直接计算，不涉及设备端调用。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号（此参数保留用于 API 一致性，实际未使用）。
     * @param {number} red - 红色通道值，取值范围 0 - 255。
     * @param {number} green - 绿色通道值，取值范围 0 - 255。
     * @param {number} blue - 蓝色通道值，取值范围 0 - 255。
     * @param {number} [white] - 白色通道值，取值范围 0 - 255，可选。
     * @returns {number} - 生成的 32 位颜色值。
     * 
     * @example
     * // RGB 颜色
     * let red = neo.Color(12, 255, 0, 0);
     * 
     * // RGBW 颜色
     * let warmWhite = neo.Color(12, 255, 200, 150, 128);
     */
    Color: function (pin, red, green, blue, white) {
        if (typeof white !== 'undefined') {
            return (white << 24) | (red << 16) | (green << 8) | blue;
        }
        return (red << 16) | (green << 8) | blue;
    },

    /**
     * 进行 8 位伽马校正。
     * 
     * 该方法对单个 8 位颜色分量进行伽马校正。
     * 
     * @param {number} pin - 连接灯带的 GPIO 引脚编号。
     * @param {number} x - 输入的数值，范围 0 - 255。
     * @returns {number} - 经过伽马校正后的数值；若操作失败，返回 0。
     * 
     * @example
     * let gammaValue = neo.gamma8(12, 128);
     */
    gamma8: function (pin, x) {
        let rst = jm.s({ "_fn": neodefId, ty: neotype, op: 20, pin: pin, n: x });
        return rst && rst.code === 0 ? rst.v : 0;
    }
};