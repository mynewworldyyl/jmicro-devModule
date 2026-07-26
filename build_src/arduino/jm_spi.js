/**
 * SPI 通信模块
 * 该模块提供了类似 Arduino 的 SPI 通信功能，支持 SPI 初始化、时钟设置、数据传输等操作。
 * 所有操作通过 `jm.s` 方法发送指令，指令中包含操作类型、地址、数据等参数。
 * 
 * 使用时方法名称前一定要带上spi.前缀
 * 
 * * SPI API 返回值说明：
 * 
 * 所有方法返回的对象结构如下：
 * @typedef {Object} SPIResult
 * @property {number} code - 状态码，0 表示成功，非 0 表示错误
 *   - 0: 操作成功
 *   - 1: 操作失败（参数错误、超时等）
 * @property {number} [v] - 返回值（仅特定方法返回）
 *   - available(): 返回可读取的字节数
 *   - read(): 返回读取到的字节值（0-255）
 *   - requestFrom(): 返回实际读取的字节数
 * 
 * 使用示例：
 * ```javascript
 * // 初始化 SPI
 * spi.begin(0x3F);
 * 
 * // 设置时钟频率为 1MHz
 * spi.setClock(1000000);
 * 
 * // 向设备写入数据
 * spi.beginTransmission(0x3F);
 * spi.writeByte(0x55);
 * spi.endTransmission(true);
 * 
 * // 从设备读取数据
 * spi.requestFrom(0x3F, 2, true);
 * let available = spi.available();
 * if (available.v > 0) {
 *     let data = spi.read();
 *     console.log("读取到: 0x" + data.v.toString(16));
 * }
 * ```
 * 
 * @module SPI通信模块
 * @var spi
 * @category communication
 * @keywords SPI,通信,串行外设接口,时钟,数据传输,读写,地址,主从,Arduino
 * @capabilities begin,begin0,setClock,beginTransmission,endTransmission,requestFrom,writeByte,writeArray,available,read
 * @depends 无
 */

var spi = {

    /**
     * 初始化 SPI 通信，使用默认引脚和指定地址。
     * 
     * 该方法使用系统默认的 SPI 引脚初始化 SPI 总线。
     * 
     * 默认引脚配置（取决于硬件平台）：
     * - ESP8266: MOSI=13, MISO=12, SCK=14, SS=15
     * - ESP32: 使用 VSPI 默认引脚（MOSI=23, MISO=19, SCK=18, SS=5）
     *
     * @function begin
     * @param {number} addr - SPI 设备从机选择（SS/CS）引脚号，用于片选信号
     * @returns {SPIResult} 返回操作结果对象，code为0表示初始化成功
     * 
     * @example
     * // 初始化 SPI，使用 GPIO5 作为片选引脚
     * spi.begin(5);
     */
    begin: function (addr) {
        return jm.s({ op: 42, a: addr });
    },

    /**
     * 初始化 SPI 通信，使用指定引脚和地址。
     * 
     * 该方法允许用户自定义 SPI 总线的 MOSI、MISO、SCK 和 SS 引脚，
     * 适用于多 SPI 设备或非常规引脚连接的情况。
     *
     * @function begin0
     * @param {number} mosi - 主输出从输入引脚号（Master Out Slave In）
     * @param {number} miso - 主输入从输出引脚号（Master In Slave Out）
     * @param {number} sck - 串行时钟引脚号（Serial Clock）
     * @param {number} ss - 从机选择引脚号（Slave Select，片选信号）
     * @returns {SPIResult} 返回操作结果对象，code为0表示初始化成功
     * 
     * @example
     * // 自定义 SPI 引脚初始化
     * // MOSI=GPIO13, MISO=GPIO12, SCK=GPIO14, SS=GPIO15
     * spi.begin0(13, 12, 14, 15);
     */
    begin0: function (mosi, miso, sck, ss) {
        return jm.s({ op: 2, d: mosi, c: miso, e: sck, a: ss });
    },

    /**
     * 设置 SPI 时钟频率。
     * 
     * 该方法设置 SPI 总线的通信时钟频率。
     * 
     * 常见频率：
     * - 低速设备：1MHz (1000000)
     * - 标准设备：4MHz (4000000)
     * - 高速设备：8MHz (8000000) 或更高
     * 
     * 注意：实际最大频率取决于硬件平台和 SPI 设备的规格
     *
     * @function setClock
     * @param {number} clk - 时钟频率值（单位：Hz），范围 1000-80000000
     * @returns {SPIResult} 返回操作结果对象，code为0表示设置成功
     * 
     * @example
     * // 设置 SPI 时钟频率为 4MHz
     * spi.setClock(4000000);
     * 
     * // 设置低速 SPI 设备时钟为 1MHz
     * spi.setClock(1000000);
     */
    setClock: function (clk) {
        return jm.s({ op: 3, c: clk });
    },

    /**
     * 开始 SPI 传输，指定目标设备地址。
     * 
     * 该方法准备向指定片选引脚的 SPI 从设备发送数据。
     * 调用后需要通过 writeByte 或 writeArray 写入数据，
     * 最后调用 endTransmission 完成传输。
     *
     * @function beginTransmission
     * @param {number} addr - SPI 设备从机选择（SS/CS）引脚号
     * @returns {SPIResult} 返回操作结果对象，code为0表示开始成功
     * 
     * @example
     * // 开始向片选引脚 5 的设备传输数据
     * spi.beginTransmission(5);
     * spi.writeByte(0x01);
     * spi.endTransmission(true);
     */
    beginTransmission: function (addr) {
        return jm.s({ op: 4, a: addr });
    },

    /**
     * 结束 SPI 传输。
     * 
     * 该方法完成 SPI 数据传输，并释放片选信号。
     *
     * @function endTransmission
     * @param {boolean} relbus - 是否释放 SPI 总线（true 释放片选，false 保持片选）
     * @returns {SPIResult} 返回操作结果对象，code为0表示结束成功
     * 
     * @example
     * // 结束传输并释放片选
     * spi.endTransmission(true);
     * 
     * // 结束传输但不释放片选（用于连续传输）
     * spi.endTransmission(false);
     */
    endTransmission: function (relbus) {
        return jm.s({ op: 5, r: relbus });
    },

    /**
     * 从指定设备请求数据。
     * 
     * 该方法向 SPI 从设备发送读取请求，准备接收数据。
     * 调用后需要使用 available 和 read 来获取数据。
     * 
     * 注意：SPI 是同步通信协议，读取数据时需要同时发送数据，
     * 通常发送 0xFF 作为占位符来读取从设备数据。
     *
     * @function requestFrom
     * @param {number} addr - SPI 设备从机选择（SS/CS）引脚号
     * @param {number} size - 请求的字节数（1-255）
     * @param {boolean} sendStop - 是否在请求后发送停止条件（true 发送停止信号，false 不发送）
     * @returns {SPIResult} 返回包含实际读取字节数的对象
     *   - code: 状态码，0表示成功
     *   - v: 实际读取到的字节数
     * 
     * @example
     * // 请求 4 字节数据，传输完成后释放片选
     * let result = spi.requestFrom(5, 4, true);
     * if (result.v === 4) {
     *     let data1 = spi.read().v;
     *     let data2 = spi.read().v;
     *     let data3 = spi.read().v;
     *     let data4 = spi.read().v;
     *     console.log("数据: " + data1 + "," + data2 + "," + data3 + "," + data4);
     * }
     * 
     * // 读取 MFRC522 RFID 模块数据
     * spi.beginTransmission(5);
     * spi.writeByte(0x26); // 读命令
     * spi.endTransmission(false);
     * spi.requestFrom(5, 16, true);
     * let uid = [];
     * for (let i = 0; i < 16; i++) {
     *     uid.push(spi.read().v);
     * }
     */
    requestFrom: function (addr, size, sendStop) {
        return jm.s({ op: 6, a: addr, s: size, p: sendStop });
    },

    /**
     * 向 SPI 设备写入一个字节数据。
     * 
     * 该方法在 beginTransmission 和 endTransmission 之间调用，
     * 用于向 SPI 从设备写入单个字节数据。
     * SPI 是同步通信，写入时会同时读取一个字节（通常丢弃）。
     *
     * @function writeByte
     * @param {number} byteData - 需要写入的字节数据（0-255）
     * @returns {SPIResult} 返回操作结果对象，code为0表示写入成功
     * 
     * @example
     * // 写入配置字节
     * spi.beginTransmission(5);
     * spi.writeByte(0x10); // 寄存器地址
     * spi.writeByte(0x55); // 写入数据
     * spi.endTransmission(true);
     */
    writeByte: function (byteData) {
        return jm.s({ op: 7, d: byteData });
    },

    /**
     * 向 SPI 设备写入一个字节数组。
     * 
     * 该方法在 beginTransmission 和 endTransmission 之间调用，
     * 用于向 SPI 从设备批量写入多个字节数据。
     *
     * @function writeArray
     * @param {Array<number>|Uint8Array} array - 需要写入的字节数组
     * @param {number} size - 字节数组的长度
     * @returns {SPIResult} 返回操作结果对象，code为0表示写入成功
     * 
     * @example
     * // 批量写入数据
     * let data = [0x01, 0x02, 0x03, 0x04];
     * spi.beginTransmission(5);
     * spi.writeArray(data, data.length);
     * spi.endTransmission(true);
     * 
     * // 写入 LCD 显示数据
     * let lcdData = [0xFE, 0x01, 0xFE, 0x02]; // 清屏命令
     * spi.writeArray(lcdData, lcdData.length);
     */
    writeArray: function (array, size) {
        return jm.s({ op: 8, d: array, s: size });
    },

    /**
     * 检查是否有可读取的数据。
     * 
     * 该方法在 requestFrom 之后调用，用于查询接收缓冲区的可用字节数。
     *
     * @function available
     * @returns {SPIResult} 返回包含可用字节数的对象
     *   - code: 状态码，0表示成功
     *   - v: 可读取的字节数
     * 
     * @example
     * spi.requestFrom(5, 10, true);
     * let available = spi.available();
     * if (available.v > 0) {
     *     console.log("有 " + available.v + " 字节可读取");
     *     let data = spi.read();
     * }
     */
    available: function () {
        return jm.s({ op: 9 });
    },

    /**
     * 从 SPI 设备读取一个字节数据。
     * 
     * 该方法在 requestFrom 之后调用，用于从接收缓冲区读取一个字节。
     * 读取前建议先调用 available 确认缓冲区有数据。
     *
     * @function read
     * @returns {SPIResult} 返回包含读取数据的对象
     *   - code: 状态码，0表示成功
     *   - v: 读取到的字节值（0-255）
     * 
     * @example
     * // 读取单个字节
     * spi.requestFrom(5, 1, true);
     * let result = spi.read();
     * if (result.code === 0) {
     *     console.log("读取到: 0x" + result.v.toString(16));
     * }
     * 
     * // 读取多个字节
     * spi.requestFrom(5, 4, true);
     * let buffer = [];
     * while (spi.available().v > 0) {
     *     buffer.push(spi.read().v);
     * }
     * console.log("数据: " + buffer);
     * 
     * // 读取传感器数据（如 MAX6675 热电偶）
     * spi.beginTransmission(5);
     * spi.writeByte(0x00);
     * spi.endTransmission(false);
     * spi.requestFrom(5, 2, true);
     * let high = spi.read().v;
     * let low = spi.read().v;
     * let temperature = ((high << 8) | low) >> 3;
     * if ((temperature & 0x8000) === 0) {
     *     console.log("温度: " + (temperature * 0.25) + "°C");
     * }
     */
    read: function () {
        return jm.s({ op: 10 });
    }
};

// 导出模块
// exports = spi;

module.exports = spi;
