/**
 * EEPROM (AT24CXX) 模块
 * 用于通过 I2C 接口读写 AT24C 系列 EEPROM 存储器，
 * 支持单字节与多字节读写、连续地址访问及 I2C 设备扫描。
 * 常用于设备参数保存、配置持久化、掉电记忆等场景。
 * 所有操作通过 `jm.s` 下发指令并由设备端执行。
 * 使用时方法名称前一定要带上 eeprom. 前缀
 * EEPROM API 返回值说明：
 * 
 * 所有方法返回的对象结构如下：
 * @typedef {Object} EEPROMResult
 * @property {number} code - 状态码，0 表示成功，非 0 表示错误
 *   - 0: 操作成功
 *   - 1: 操作失败（I2C初始化失败、写入失败、参数错误等）
 *   - 2: 内存分配失败（读取多字节时）
 *   - 3: 读取多字节失败
 *   - 100: 无效的操作码
 * @property {number} [v] - 返回值（仅特定操作返回）
 *   - read(): 读取到的字节值（0-255）
 *   - readBytes(): 读取到的字节数组
 *   - writeBytes(): 写入成功标志（布尔值）
 * 
 * 使用示例：
 * ```javascript
 * // 初始化I2C总线
 * eeprom.begin(5, 4);
 * 
 * // 写入单个字节
 * eeprom.write(0x0010, 0xAB);
 * 
 * // 读取单个字节
 * let result = eeprom.read(0x0010);
 * console.log("读取值: " + result.v);
 * 
 * // 写入多个字节
 * let data = [0xDE, 0xAD, 0xBE, 0xEF];
 * eeprom.writeBytes(0x0010, data);
 * 
 * // 读取多个字节
 * let readResult = eeprom.readBytes(0x0010, 4);
 * console.log("读取数据: " + readResult.v);
 * ```
 * 
 * @module EEPROM(AT24CXX)接口
 * @var eeprom
 * @category storage
 * @keywords EEPROM,AT24CXX,I2C,非易失存储,参数保存,配置存储,掉电记忆
 * @capabilities begin,read,write,readBytes,writeBytes,scannDevs
 * @depends 无
 */

var eeprom = {

    /**
     * 初始化EEPROM的I2C连接
     * 
     * 在使用其他读写操作前必须先调用此方法初始化 I2C 总线。
     * 该方法会设置 I2C 时钟频率为 100kHz（标准模式）。
     * 
     * @method begin
     * @param {number} scl - 时钟线(SCL)的GPIO引脚号
     * @param {number} sda - 数据线(SDA)的GPIO引脚号
     * @returns {EEPROMResult} 返回操作结果对象，code为0表示初始化成功
     * 
     * @example
     * // 初始化I2C连接，使用GPIO 5作为SCL，GPIO 4作为SDA
     * let result = eeprom.begin(5, 4);
     * if (result.code === 0) {
     *     console.log("EEPROM初始化成功");
     * }
     */
    begin: function (scl, sda) {
        return jm.s({ op: 54, d: sda, c: scl });
    },

    /**
     * 从指定地址读取一个字节的数据
     * 
     * 该方法从 EEPROM 指定地址读取一个字节的数据。
     * 地址范围取决于芯片型号：
     * - AT24C01: 0x00-0x7F (128字节)
     * - AT24C02: 0x00-0xFF (256字节)
     * - AT24C04: 0x00-0x1FF (512字节)
     * - AT24C08: 0x00-0x3FF (1024字节)
     * - AT24C16: 0x00-0x7FF (2048字节)
     * 
     * @method read
     * @param {number} addr - 要读取的EEPROM地址（0-65535，实际范围取决于芯片型号）
     * @returns {EEPROMResult} 返回包含读取值的对象
     *   - code: 状态码，0表示成功
     *   - v: 读取到的字节值（0-255）
     * 
     * @example
     * // 从地址0x0010读取一个字节
     * let result = eeprom.read(0x0010);
     * if (result.code === 0) {
     *     console.log("读取到的值: 0x" + result.v.toString(16));
     * }
     */
    read: function (addr) {
        return jm.s({ op: 55, a: addr});
    },

    /**
     * 向指定地址写入一个字节的数据
     * 
     * 该方法向 EEPROM 指定地址写入一个字节的数据。
     * 写入操作需要等待内部写入周期完成（通常为5-10ms），
     * 在此期间不建议进行其他 I2C 操作。
     * 
     * @method write
     * @param {number} addr - 要写入的EEPROM地址（0-65535，实际范围取决于芯片型号）
     * @param {number} v - 要写入的字节数据（0-255）
     * @returns {EEPROMResult} 返回操作结果对象，code为0表示写入成功
     * 
     * @example
     * // 向地址0x0010写入数据0xAB
     * let result = eeprom.write(0x0010, 0xAB);
     * if (result.code === 0) {
     *     console.log("写入成功");
     * }
     */
    write: function (addr,v) {
        return jm.s({ op: 56, a: addr, d: v });
    },

    /**
     * 从指定地址开始读取多个字节的数据
     * 
     * 该方法从 EEPROM 指定地址开始连续读取多个字节的数据。
     * 
     * 注意事项：
     * - 读取长度不应超过芯片页大小（AT24C08为16字节）
     * - 读取操作不会跨越芯片页边界，如果地址+长度超过页边界，
     *   需要分多次读取
     * - 读取完成后返回的 v 字段是字节数组
     * 
     * @method readBytes
     * @param {number} addr - 起始读取地址
     * @param {number} len - 要读取的字节数（建议不超过16）
     * @returns {EEPROMResult} 返回包含读取字节数组的对象
     *   - code: 状态码，0表示成功
     *   - v: 读取到的字节数组（Uint8Array格式）
     * 
     * @example
     * // 从地址0x0010开始读取4个字节
     * let result = eeprom.readBytes(0x0010, 4);
     * if (result.code === 0) {
     *     console.log("读取到4个字节: " + Array.from(result.v));
     * }
     * 
     * @example
     * // 读取16字节（一整页）
     * let pageData = eeprom.readBytes(0x0000, 16);
     */
    readBytes: function (addr, len) {
        return jm.s({ op: 57, a: addr, s: len });
    },

    /**
     * 从指定地址开始写入多个字节的数据
     * 
     * 该方法向 EEPROM 指定地址开始连续写入多个字节的数据。
     * 
     * 注意事项：
     * - 写入长度不应超过芯片页大小（AT24C08为16字节）
     * - 写入操作会一次性写入整个数据块（利用页写入特性）
     * - 写入后需要等待内部写入周期完成（通常为5-10ms）
     * - 如果地址+长度跨越页边界，建议分多次写入
     * 
     * @method writeBytes
     * @param {number} addr - 起始写入地址
     * @param {Array<number>|Uint8Array} bytes - 要写入的字节数组
     * @returns {EEPROMResult} 返回包含写入状态的对象
     *   - code: 状态码，0表示成功
     *   - v: 布尔值，true表示写入成功，false表示写入失败
     * 
     * @example
     * // 写入4个字节
     * let data = [0xDE, 0xAD, 0xBE, 0xEF];
     * let result = eeprom.writeBytes(0x0010, data);
     * if (result.code === 0 && result.v) {
     *     console.log("批量写入成功");
     * }
     * 
     * @example
     * // 保存配置参数（最多16字节）
     * let config = [0x01, 0x02, 0x03, 0x04];
     * eeprom.writeBytes(0x0000, config);
     */
    writeBytes: function (addr, bytes) {
        return jm.s({ op: 58, a: addr, b: bytes });
    },

    /**
     * 扫描I2C总线上的所有设备
     * 
     * 该方法扫描 I2C 总线上的所有设备地址（8-119），
     * 检测哪些 I2C 设备已连接，包括 EEPROM。
     * 扫描结果将通过调试日志输出，不返回设备列表。
     * 
     * 使用场景：
     * - 调试 I2C 设备连接问题
     * - 确认 EEPROM 地址是否正确（AT24CXX 默认地址为 0x50）
     * - 发现总线上其他 I2C 设备
     * 
     * @method scannDevs
     * @returns {EEPROMResult} 返回操作结果对象，code为0表示扫描完成
     * 
     * @example
     * // 扫描I2C总线上的所有设备
     * eeprom.scannDevs();
     * // 控制台会输出类似：
     * // F at 0x50
     * // F at 0x51
     * // Fo Devs=2
     */
    scannDevs: function () {
        return jm.s({ op: 59 });
    },

};

// 导出模块
//exports = eeprom;

module.exports = eeprom;
