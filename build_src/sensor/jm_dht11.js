/**
 * 本模块是参考 Arduino 库 DHT11 实现的 JavaScript 接口，用于读取 DHT11 温湿度传感器的数据。
 * 通过该模块提供的方法，开发者可以方便地从指定引脚连接的 DHT11 传感器获取温湿度信息。
 * 
 *  使用时方法名称前一定要带上dht11.前缀
 * 
  * DHT11 温湿度传感器 API 返回值说明：
 * 
 * read() 方法返回的对象结构如下：
 * @typedef {Object} DHT11ReadResult
 * @property {number} code - 状态码，0 表示成功，非 0 表示错误
 *   - 0: 操作成功
 *   - 1: 无效的操作码（内部错误）
 * @property {number} t - 温度值，单位为摄氏度（℃）
 *   - 返回整数温度值，如 25 表示 25℃
 *   - 注意：DHT11 温度精度为 ±2℃，分辨率为 1℃
 * @property {number} h - 湿度值，单位为相对湿度百分比（%RH）
 *   - 返回整数湿度值，如 60 表示 60%RH
 *   - 注意：DHT11 湿度精度为 ±5%RH，分辨率为 1%RH
 * 
 * 使用示例：
 * ```javascript
 * // 读取连接到 GPIO 2 的 DHT11 传感器数据
 * let result = dht11.read(2);
 * if (result.code === 0) {
 *     console.log("温度: " + result.t + "°C");
 *     console.log("湿度: " + result.h + "%");
 * } else {
 *     console.log("读取失败，请检查传感器连接");
 * }
 * ```
 * 
 * @note DHT11 读取间隔建议不小于 1 秒，过于频繁的读取可能导致数据不稳定
 * 
 * @module DHT11温湿度传感器模块
 * @var dht11
 * @category sensor
 * @keywords DHT11,温湿度,温度,湿度,传感器,单总线,Arduino库
 * @capabilities read
 * @depends 无
 */


var dht11 = {
    /**
     * 从指定引脚连接的 DHT11 温湿度传感器读取数据。
     * 
     * 该方法会向指定引脚的 DHT11 传感器发送读取请求，并返回读取到的温湿度数据。
     * 读取操作会占用一定时间（通常约 20-40 毫秒），请避免在中断服务程序或高频循环中调用。
     * 
     * 使用注意事项：
     * - 传感器连接线不宜过长，建议不超过 20 米
     * - 建议在传感器电源和地之间加一个 100nF 的去耦电容
     * - 读取间隔建议 >= 1 秒
     * - 如果连续读取失败，请检查电源电压是否稳定（建议 3.3V-5V）
     * 
     * @param {number} pin - DHT11 传感器所连接的 GPIO 引脚编号，用于指定要读取数据的传感器连接位置。
     *                       必须是有效的 GPIO 引脚编号（如 2、4、5、16 等）。
     *                       该引脚会自动切换为输入输出模式，无需额外初始化。
     * @returns {DHT11ReadResult} 返回包含状态码、温度和湿度数据的对象。
     *   - code: 状态码，0 表示读取成功
     *   - t: 温度值（摄氏度），整数类型
     *   - h: 湿度值（相对湿度百分比），整数类型
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * // 基本用法
     * var result = dht11.read(4);
     * if (result.code === 0) {
     *     console.log("温度: " + result.t + "°C, 湿度: " + result.h + "%");
     * }
     * 
     * @example
     * // 带错误处理的完整示例
     * function readDHT11() {
     *     var result = dht11.read(2);
     *     if (result.code !== 0) {
     *         console.log("读取失败，错误码: " + result.code);
     *         return null;
     *     }
     *     return { temperature: result.t, humidity: result.h };
     * }
     */
    read: function(pin) {
        return jm.s({ "_fn": 20, ty: 65532, op: 1, p: pin });
    }
};

//exports = dht11

module.exports = dht11;
