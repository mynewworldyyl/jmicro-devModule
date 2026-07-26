/**
 * I2C 通信模块
 * 该模块提供了类似 Arduino 的 I2C 通信功能，支持 I2C 初始化、时钟设置、数据传输等操作。
 * 所有操作通过 `jm.s` 方法发送指令，指令中包含操作类型、地址、数据等参数。
 * 
 * 使用时方法名称前一定要带上i2c.前缀
 * 
 * I2C API 返回值说明：
 * - begin(): 返回 0 表示成功，非 0 表示错误
 * - setClock(): 返回 0 表示成功，非 0 表示错误
 * - beginTransmission(): 返回 0 表示成功，非 0 表示错误
 * - endTransmission(): 返回传输状态（0=成功，1=数据过长，2=地址NACK，3=数据NACK，4=其他错误）
 * - requestFrom(): 返回实际读取的字节数
 * - writeByte(): 返回写入的字节数（通常为1），-1 表示错误
 * - writeBuffer(): 返回写入的字节数，-1 表示错误
 * - available(): 返回可读取的字节数
 * - read(): 返回读取到的字节数组（Uint8Array），null 表示读取失败
 * 
 * 使用示例：
 * ```javascript
 * // 初始化 I2C 总线（SCL=21, SDA=5）
 * let ret = i2c.begin(21, 5);
 * if (ret !== 0) {
 *     console.log("I2C 初始化失败");
 * }
 * 
 * // 设置时钟频率为 100kHz
 * i2c.setClock(21, 5, 100000);
 * 
 * // 向地址 0x3F 的设备写入数据
 * i2c.beginTransmission(21, 5, 0x3F);
 * i2c.writeByte(21, 5, 0x55);
 * let status = i2c.endTransmission(21, 5, true);
 * if (status === 0) {
 *     console.log("写入成功");
 * }
 * 
 * // 从设备读取数据
 * let bytesRead = i2c.requestFrom(21, 5, 0x3F, 2, true);
 * if (bytesRead > 0) {
 *     let data = i2c.read(21, 5, 2);
 *     if (data) {
 *         console.log("读取到: " + Array.from(data));
 *     }
 * }
 * ```
 * 
 * @module I2C通信模块
 * @var i2c
 * @category communication
 * @keywords I2C,通信,SCL,SDA,时钟,数据传输,读写,地址,Arduino
 * @capabilities begin,setClock,beginTransmission,endTransmission,requestFrom,writeByte,writeBuffer,available,read
 * @depends 无
 */

/**
 * 计算 wireId
 * @private
 * @param {number} scl - SCL 引脚号。
 * @param {number} sda - SDA 引脚号。
 * @returns {number} wireId - 由 SCL 和 SDA 引脚组合生成的唯一标识符。
 */
function getWireId(scl, sda) {
    return (scl << 8) | sda;
}

var i2c = {

    /**
     * 初始化 I2C 通信，使用指定引脚和可选地址。
     * 
     * 该方法初始化 I2C 总线并设置 SCL 和 SDA 引脚。
     * 如果不指定设备地址，则初始化为 I2C 主设备模式；
     * 如果指定地址，则初始化为从设备模式（仅 ESP32 支持）。
     *
     * @function begin
     * @param {number} scl - SCL 时钟引脚号（GPIO编号）
     * @param {number} sda - SDA 数据引脚号（GPIO编号）
     * @param {number} [addr] - 可选，I2C 设备地址（0-127），用于从设备模式
     * @returns {number} 0 表示成功，非 0 表示错误
     * 
     * @example
     * // 主设备模式初始化
     * let ret = i2c.begin(21, 5);
     * if (ret === 0) {
     *     console.log("I2C 初始化成功");
     * }
     * 
     * // 从设备模式初始化（ESP32）
     * i2c.begin(21, 5, 0x3F);
     */
    begin: function (scl, sda, addr) {
        const wireId = getWireId(scl, sda);
        return jm.s({ op: 45, "i": wireId, "a": addr });
    },

    /**
     * 设置 I2C 时钟频率。
     * 
     * 该方法设置 I2C 总线的通信时钟频率。
     * 常见频率：
     * - 标准模式: 100kHz (100000)
     * - 快速模式: 400kHz (400000)
     * - 高速模式: 1MHz (1000000)（取决于硬件支持）
     *
     * @function setClock
     * @param {number} scl - SCL 时钟引脚号（GPIO编号）
     * @param {number} sda - SDA 数据引脚号（GPIO编号）
     * @param {number} clock - 时钟频率值（单位：Hz），范围 10000-4000000
     * @returns {number} 0 表示成功，非 0 表示错误
     * 
     * @example
     * // 设置时钟频率为 100kHz
     * i2c.setClock(21, 5, 100000);
     * 
     * // 设置时钟频率为 400kHz（快速模式）
     * i2c.setClock(21, 5, 400000);
     */
    setClock: function (scl, sda, clock) {
        const wireId = getWireId(scl, sda);
        return jm.s({ op: 46, "i": wireId, "c": clock });
    },

    /**
     * 开始 I2C 传输，指定目标设备地址。
     * 
     * 该方法准备向指定地址的 I2C 从设备发送数据。
     * 调用后需要通过 writeByte 或 writeBuffer 写入数据，
     * 最后调用 endTransmission 完成传输。
     *
     * @function beginTransmission
     * @param {number} scl - SCL 时钟引脚号（GPIO编号）
     * @param {number} sda - SDA 数据引脚号（GPIO编号）
     * @param {number} addr - I2C 设备地址（0-127，7位地址）
     * @returns {number} 0 表示成功，非 0 表示错误
     * 
     * @example
     * // 向地址 0x3F 的设备发送数据
     * i2c.beginTransmission(21, 5, 0x3F);
     * i2c.writeByte(21, 5, 0x01);
     * i2c.writeByte(21, 5, 0x02);
     * i2c.endTransmission(21, 5, true);
     */
    beginTransmission: function (scl, sda, addr) {
        const wireId = getWireId(scl, sda);
        return jm.s({ op: 47, "i": wireId, "a": addr });
    },

    /**
     * 结束 I2C 传输。
     * 
     * 该方法完成 I2C 数据传输，并可以选择是否释放总线。
     * 
     * 返回值说明：
     * - 0: 成功
     * - 1: 数据过长（超出总线缓冲）
     * - 2: 地址传输时收到 NACK
     * - 3: 数据传输时收到 NACK
     * - 4: 其他错误
     *
     * @function endTransmission
     * @param {number} scl - SCL 时钟引脚号（GPIO编号）
     * @param {number} sda - SDA 数据引脚号（GPIO编号）
     * @param {boolean} releaseBus - 是否释放 I2C 总线（true 释放，false 不释放）
     * @returns {number} 传输状态（0=成功，1-4=错误码）
     * 
     * @example
     * // 结束传输并释放总线
     * let status = i2c.endTransmission(21, 5, true);
     * if (status === 0) {
     *     console.log("传输成功");
     * } else {
     *     console.log("传输错误: " + status);
     * }
     * 
     * // 结束传输但不释放总线（用于连续传输）
     * i2c.endTransmission(21, 5, false);
     */
    endTransmission: function (scl, sda, releaseBus) {
        const wireId = getWireId(scl, sda);
        return jm.s({ op: 48, "i": wireId, "r": releaseBus });
    },

    /**
     * 从指定设备请求数据。
     * 
     * 该方法向 I2C 从设备发送读取请求，准备接收数据。
     * 调用后需要使用 available 和 read 来获取数据。
     *
     * @function requestFrom
     * @param {number} scl - SCL 时钟引脚号（GPIO编号）
     * @param {number} sda - SDA 数据引脚号（GPIO编号）
     * @param {number} addr - I2C 设备地址（0-127，7位地址）
     * @param {number} size - 请求的字节数（1-32，取决于硬件缓冲）
     * @param {boolean} stop - 是否在请求后发送停止条件（true 发送，false 不发送）
     * @returns {number} 实际读取到的字节数
     * 
     * @example
     * // 请求 2 字节数据，发送停止条件
     * let bytesRead = i2c.requestFrom(21, 5, 0x3F, 2, true);
     * if (bytesRead === 2) {
     *     let data = i2c.read(21, 5, 2);
     *     console.log("接收到: " + Array.from(data));
     * }
     */
    requestFrom: function (scl, sda, addr, size, stop) {
        const wireId = getWireId(scl, sda);
        return jm.s({ op: 49, "i": wireId, "a": addr, "s": size, "p": stop });
    },

    /**
     * 向 I2C 设备写入一个字节数据。
     * 
     * 该方法在 beginTransmission 和 endTransmission 之间调用，
     * 用于向 I2C 从设备写入单个字节数据。
     *
     * @function writeByte
     * @param {number} scl - SCL 时钟引脚号（GPIO编号）
     * @param {number} sda - SDA 数据引脚号（GPIO编号）
     * @param {number} data - 需要写入的字节数据（0-255）
     * @returns {number} 写入的字节数（通常为1），-1 表示错误
     * 
     * @example
     * // 向设备写入配置字节
     * i2c.beginTransmission(21, 5, 0x3F);
     * i2c.writeByte(21, 5, 0x01);  // 写入寄存器地址
     * i2c.writeByte(21, 5, 0x55);  // 写入数据
     * let status = i2c.endTransmission(21, 5, true);
     */
    writeByte: function (scl, sda, data) {
        const wireId = getWireId(scl, sda);
        return jm.s({ op: 50, "i": wireId, "d": data });
    },

    /**
     * 向 I2C 设备写入一个字节数组。
     * 
     * 该方法在 beginTransmission 和 endTransmission 之间调用，
     * 用于向 I2C 从设备批量写入多个字节数据。
     *
     * @function writeBuffer
     * @param {number} scl - SCL 时钟引脚号（GPIO编号）
     * @param {number} sda - SDA 数据引脚号（GPIO编号）
     * @param {Array<number>|Uint8Array} buffer - 需要写入的字节数组（0-255）
     * @returns {number} 写入的字节数，-1 表示错误
     * 
     * @example
     * // 批量写入数据
     * let data = [0x01, 0x02, 0x03, 0x04];
     * i2c.beginTransmission(21, 5, 0x3F);
     * let written = i2c.writeBuffer(21, 5, data);
     * i2c.endTransmission(21, 5, true);
     * console.log("写入 " + written + " 字节");
     * 
     * // 写入 I2C LCD 显示屏命令
     * let lcdCmd = [0xFE, 0x01]; // 清屏命令
     * i2c.writeBuffer(21, 5, lcdCmd);
     */
    writeBuffer: function (scl, sda, buffer) {
        const wireId = getWireId(scl, sda);
        return jm.s({ op: 51, "i": wireId, "d": buffer });
    },

    /**
     * 检查是否有可读取的数据。
     * 
     * 该方法在 requestFrom 之后调用，用于查询接收缓冲区的可用字节数。
     *
     * @function available
     * @param {number} scl - SCL 时钟引脚号（GPIO编号）
     * @param {number} sda - SDA 数据引脚号（GPIO编号）
     * @returns {number} 可读取的字节数
     * 
     * @example
     * i2c.requestFrom(21, 5, 0x3F, 10, true);
     * let available = i2c.available(21, 5);
     * console.log("可读取 " + available + " 字节");
     */
    available: function (scl, sda) {
        const wireId = getWireId(scl, sda);
        return jm.s({ op: 52, "i": wireId });
    },

    /**
     * 从 I2C 设备读取数据。
     * 
     * 该方法在 requestFrom 之后调用，用于从接收缓冲区读取指定数量的字节。
     * 读取前建议先调用 available 确认缓冲区有足够数据。
     *
     * @function read
     * @param {number} scl - SCL 时钟引脚号（GPIO编号）
     * @param {number} sda - SDA 数据引脚号（GPIO编号）
     * @param {number} size - 要读取的字节数
     * @returns {Uint8Array|null} 读取到的字节数组，null 表示读取失败
     * 
     * @example
     * // 读取 2 字节数据
     * i2c.requestFrom(21, 5, 0x3F, 2, true);
     * let data = i2c.read(21, 5, 2);
     * if (data) {
     *     console.log("读到: " + Array.from(data));
     *     console.log("第一个字节: " + data[0]);
     * }
     * 
     * // 读取传感器数据（MPU6050）
     * i2c.beginTransmission(21, 5, 0x68);
     * i2c.writeByte(21, 5, 0x3B); // 加速度寄存器地址
     * i2c.endTransmission(21, 5, false);
     * i2c.requestFrom(21, 5, 0x68, 6, true);
     * let data = i2c.read(21, 5, 6);
     * if (data) {
     *     let accelX = (data[0] << 8) | data[1];
     *     console.log("加速度 X: " + accelX);
     * }
     */
    read: function (scl, sda, size) {
        const wireId = getWireId(scl, sda);
        return jm.s({ op: 53, "i": wireId, "s": size });
    }
};

// 导出模块
//exports = i2c;

module.exports = i2c;
