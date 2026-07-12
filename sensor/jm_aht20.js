/**
 * 本模块是参考 Arduino 库 AHT20 实现的 JavaScript 接口，用于与 AHT20 温湿度传感器进行交互。
 * 通过该模块提供的方法，开发者可以创建传感器实例并读取传感器采集的温湿度数据。
 * 使用时方法名称前一定要带上ah20.前缀
 * AHT20 温湿度传感器 API 返回值说明：
 * 
 * read() 方法返回的对象结构如下：
 * @typedef {Object} AHT20ReadResult
 * @property {number} code - 状态码，0 表示成功，非 0 表示错误
 *   - 0: 操作成功
 *   - 2: I2C 引脚（sda/scl）未正确设置
 *   - 3: 传感器未检测到（硬件连接问题）
 *   - 4: 传感器数据不可用（读取超时）
 * @property {number} [t] - 温度值，单位为千分之一摄氏度（即实际温度 = t / 1000），仅 code 为 0 时返回
 * @property {number} [h] - 湿度值，单位为千分之一相对湿度（即实际湿度 = h / 1000），仅 code 为 0 时返回
 * 
 * create() 方法返回 boolean 类型：
 * @typedef {boolean} AHT20CreateResult
 *   - true: 创建成功，传感器已初始化
 *   - false: 创建失败（I2C 引脚无效或传感器未检测到）
 * 
 * @module AHT20温湿度传感器模块
 * @var ah20
 * @category sensor
 * @keywords AHT20,温湿度,温度,湿度,I2C,传感器,Arduino库
 * @capabilities read,create
 * @depends 无
 */

let ahid = 20;
let type = 65530;

var ah20 = {
    /**
     * 从 AHT20 温湿度传感器读取温湿度数据。
     * 
     * 该方法会向传感器发送读取数据的请求，并返回读取结果。
     * 注意：调用 read() 之前必须先调用 create() 创建传感器实例。
     * 
     * 使用示例：
     * ```javascript
     * // 先创建实例
     * let success = ah20.create(4, 5);
     * if (success) {
     *     // 读取温湿度
     *     let result = ah20.read();
     *     if (result.code === 0) {
     *         let temperature = result.t / 1000;  // 实际温度（摄氏度）
     *         let humidity = result.h / 1000;     // 实际湿度（%RH）
     *         console.log("温度: " + temperature + "°C, 湿度: " + humidity + "%");
     *     }
     * }
     * ```
     * 
     * @returns {AHT20ReadResult} 返回包含状态码和温湿度数据的对象。
     *   - code: 状态码，0 表示读取成功
     *   - t: 温度值（千分之一摄氏度），实际温度需除以 1000
     *   - h: 湿度值（千分之一相对湿度），实际湿度需除以 1000
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    read: function() {
        return jm.s({ "_fn": ahid, ty: type, op: 2 });
    },

    /**
     * 创建 AHT20 温湿度传感器实例并初始化 I2C 总线。
     * 
     * 该方法用于初始化传感器，需要指定 I2C 数据线（sda）和 I2C 时钟线（scl）。
     * 创建成功后，才能调用 read() 方法读取温湿度数据。
     * 如果已存在传感器实例，会先释放原有实例再重新创建。
     * 
     * 使用示例：
     * ```javascript
     * // 使用 GPIO4 作为 SDA，GPIO5 作为 SCL
     * let success = ah20.create(4, 5);
     * if (success) {
     *     console.log("AHT20 初始化成功");
     * } else {
     *     console.log("AHT20 初始化失败，请检查硬件连接");
     * }
     * ```
     * 
     * @param {number} sda - I2C 数据线的 GPIO 编号，用于在 I2C 通信中传输数据。
     *                       必须为有效的 GPIO 引脚编号（如 4、21 等）。
     * @param {number} scl - I2C 时钟线的 GPIO 编号，用于在 I2C 通信中提供时钟信号。
     *                       必须为有效的 GPIO 引脚编号（如 5、22 等）。
     * @returns {boolean} 返回创建结果：
     *   - true: 创建成功，传感器已初始化并可用
     *   - false: 创建失败，可能原因包括：
     *     - sda 或 scl 参数无效（0 或未提供）
     *     - 传感器硬件未连接或连接错误
     *     - I2C 总线初始化失败
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    create: function(sda, scl) {
        let rst = jm.s({ "_fn": ahid, ty: type, op: 1, sda: sda, scl: scl });
        // rst.code === 0 表示创建成功，否则失败
        return rst && typeof rst.code !== 'undefined' ? rst.code === 0 : false;
    }
};

//exports = ah20
