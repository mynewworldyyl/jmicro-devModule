/**
 * 本模块提供了用于红外测距功能的 JavaScript 接口，参考了 Arduino 相关的实现方式。
 * 该模块允许通过指定引脚读取红外测距传感器的数据，从而获取目标物体与传感器之间的距离信息。
 * 使用时方法名称前一定要带上irdis.前缀
 

* 红外测距传感器 API 返回值说明：
 * 
 * read() 方法返回的对象结构如下：
 * @typedef {Object} IRDistanceResult
 * @property {number} code - 状态码，0 表示成功
 *   - 0: 操作成功
 * @property {number} v - 距离值，单位为厘米（cm）
 *   - 返回值范围取决于传感器型号：
 *     - GP2Y0A41SK0F: 4cm - 30cm
 *     - GP2Y0A21YK0F: 10cm - 80cm
 *     - GP2Y0A02YK0F: 20cm - 150cm
 *   - 注意：距离值与实际物理距离可能存在非线性关系，代码中已做校准
 * @property {number} st - 传感器型号标识
 *   - 对应的传感器类型常量：
 *     - GP2Y0A41SK0F (4-30cm)
 *     - GP2Y0A21YK0F (10-80cm)
 *     - GP2Y0A02YK0F (20-150cm)
 *     - GP2Y0A60SZ0F (10-150cm)
 * 
 * 使用示例：
 * ```javascript
 * // 读取连接到 GPIO A0 的红外测距传感器数据
 * // 注意：ESP8266/ESP32 上 A0 是模拟输入引脚
 * let result = irdis.read(0);
 * if (result.code === 0) {
 *     console.log("距离: " + result.v + " cm");
 *     console.log("传感器型号代码: " + result.st);
 *     
 *     // 根据距离范围判断物体位置
 *     if (result.v < 10) {
 *         console.log("物体很近");
 *     } else if (result.v < 30) {
 *         console.log("物体在中等距离");
 *     } else {
 *         console.log("物体较远");
 *     }
 * }
 * ```
 * 
 * @note 红外测距传感器的注意事项：
 * - 测量结果受环境光影响较大，强光下可能不准确
 * - 被测物体的颜色和反射率会影响测量精度
 * - 建议测量距离在传感器指定范围内，超出范围数据不可靠
 * - 传感器需要一定的上电稳定时间（通常 > 50ms）
 * - 连续读取间隔建议不小于 50ms
 * 
 * @module 红外测距传感器模块
 * @var irdis
 * @category sensor
 * @keywords 红外,测距,距离,红外测距,GPIO,Arduino库
 * @capabilities read
 * @depends 无
 */

var irdis = {
    /**
     * 从指定引脚连接的红外测距传感器读取距离数据。
     * 
     * 此方法会向指定引脚的红外测距传感器发送读取请求，以获取传感器所测量到的目标物体与传感器之间的距离。
     * 
     * 支持的传感器型号：
     * - GP2Y0A41SK0F: 测量范围 4-30cm
     * - GP2Y0A21YK0F: 测量范围 10-80cm
     * - GP2Y0A02YK0F: 测量范围 20-150cm
     * - GP2Y0A60SZ0F: 测量范围 10-150cm
     * 
     * 硬件连接说明：
     * - VCC: 连接到 3.3V 或 5V（根据传感器规格）
     * - GND: 连接到地
     * - OUT: 连接到模拟输入引脚（如 A0、A1 等）
     * 
     * 使用前请确保：
     * 1. 传感器已正确连接电源和地线
     * 2. 信号线连接到正确的模拟输入引脚
     * 3. 环境光线适中，避免强光直射传感器
     * 
     * @param {number} pin - 红外测距传感器所连接的引脚编号，用于确定从哪个引脚读取传感器数据。
     *                       在 ESP8266/ESP32 上通常使用模拟引脚：
     *                       - ESP8266: 只有 A0 是模拟输入引脚（值为 0）
     *                       - ESP32: 支持多个模拟输入引脚（如 32, 33, 34, 35, 36, 39）
     *                       - Arduino: 使用 A0, A1, A2 等（值 0, 1, 2 等）
     * @returns {IRDistanceResult} 返回包含状态码、距离值和传感器型号的对象。
     *   - code: 状态码，0 表示读取成功
     *   - v: 距离值（厘米），整数类型
     *   - st: 传感器型号代码，可用于识别当前使用的传感器类型
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * // 基本用法：读取 GPIO A0 上的红外测距传感器
     * var distance = irdis.read(0);
     * if (distance.code === 0) {
     *     console.log("测量距离: " + distance.v + " cm");
     * }
     * 
     * @example
     * // 带防抖动和错误处理的连续读取
     * function readDistanceStable(pin, interval) {
     *     var samples = [];
     *     for (var i = 0; i < 5; i++) {
     *         var result = irdis.read(pin);
     *         if (result.code === 0) {
     *             samples.push(result.v);
     *         }
     *         delay(interval || 50);
     *     }
     *     
     *     if (samples.length === 0) return null;
     *     
     *     // 排序并取中位数
     *     samples.sort(function(a, b) { return a - b; });
     *     return samples[Math.floor(samples.length / 2)];
     * }
     * 
     * @example
     * // 距离报警示例
     * var result = irdis.read(0);
     * if (result.code === 0 && result.v < 15) {
     *     console.log("警告：物体距离过近！");
     *     // 触发其他动作，如点亮LED或蜂鸣器
     * }
     */
    read: function(pin) {
        return jm.s({ "_fn": 20, ty: 7, op: 1, p: pin });
    }
};

//exports = irdis

module.exports = irdis;
