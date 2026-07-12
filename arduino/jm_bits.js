/**
 * 位操作
 * 使用时方法名称前一定要带上bits.前缀
 * 
 * 位操作 API 返回值说明：
 * - bit(): 直接返回 2^n 的数值（number类型）
 * - bitClear(): 直接返回清除指定位后的数值（number类型）
 * - bitRead(): 直接返回 0 或 1（number类型）
 * - bitSet(): 直接返回设置指定位为1后的数值（number类型）
 * - bitWrite(): 直接返回写入位后的数值（number类型）
 * - highByte(): 直接返回高字节值（0-255，number类型）
 * - lowByte(): 直接返回低字节值（0-255，number类型）
 * 
 * 使用示例：
 * ```javascript
 * // 计算 2^3 = 8
 * let val = bits.bit(3);
 * console.log("2^3 = " + val);  // 输出: 2^3 = 8
 * 
 * // 清除第1位（将7的二进制0111的第1位清零，得到5）
 * let cleared = bits.bitClear(7, 1);
 * console.log("清除后: " + cleared);  // 输出: 清除后: 5
 * 
 * // 读取第2位的值
 * let readVal = bits.bitRead(0b1010, 2);
 * console.log("第2位的值: " + readVal);  // 输出: 第2位的值: 1
 * 
 * // 设置第0位为1
 * let setVal = bits.bitSet(0, 0);
 * console.log("设置后: " + setVal);  // 输出: 设置后: 1
 * 
 * // 写入第3位的值为1
 * let written = bits.bitWrite(0, 3, 1);
 * console.log("写入后: " + written);  // 输出: 写入后: 8
 * 
 * // 获取高字节（0x1234 >> 8 = 0x12 = 18）
 * let high = bits.highByte(0x1234);
 * console.log("高字节: " + high);  // 输出: 高字节: 18
 * 
 * // 获取低字节（0x1234 & 0xFF = 0x34 = 52）
 * let low = bits.lowByte(0x1234);
 * console.log("低字节: " + low);  // 输出: 低字节: 52
 * ```
 * 
 * @module 位操作API
 * @var bits
 * @category data
 * @keywords bits,位操作,bit,bitClear,bitRead,bitSet,bitWrite,highByte,lowByte,与Arduino位操作API一一对应
 * @capabilities bit,bitClear,bitRead,bitSet,bitWrite,highByte,lowByte
 * @depends 无
 */

var bits = {
    
    /**
     * 计算并返回 2 的 n 次幂的数值
     * 
     * 该函数返回 2^n 的值，即 1 左移 n 位的结果。
     * 在二进制数中，位的数值是按照 2 的幂次来确定的，从右到左依次是 2^0、2^1、2^2 等。
     * 
     * @param {number} n - 位的位置索引，取值范围 0-31（32位整数）
     * @returns {number} 2^n 的数值
     * 
     * @example
     * // n=0 => 1
     * let val1 = bits.bit(0);
     * console.log(val1);  // 1
     * 
     * // n=3 => 8
     * let val2 = bits.bit(3);
     * console.log(val2);  // 8
     * 
     * // 可用于创建位掩码
     * let mask = bits.bit(2) | bits.bit(5); // mask = 4 | 32 = 36
     */
    bit: function(n) {
        return jm.s({op:22, v:n});
    },

    /**
     * 将数值变量 v 的指定位 n 清零（设置为 0）
     * 
     * 该函数清除变量 v 中第 n 位的值（将该位设置为 0），
     * 并返回操作后的变量值，其他位保持不变。
     * 
     * @param {number} v - 要进行操作的数值（支持 int、unsigned int、long 等类型）
     * @param {number} n - 要清零的位的位置，0 表示最低位（LSB），范围 0-31
     * @returns {number} 清除指定位后的数值
     * 
     * @example
     * // 7 = 0b0111，清除第1位（从0开始）后 => 0b0101 = 5
     * let result = bits.bitClear(7, 1);
     * console.log(result);  // 5
     * 
     * // 清除标志位
     * let flags = 0b1010;
     * flags = bits.bitClear(flags, 1); // flags 变为 0b1000
     */
    bitClear: function(v,n) {
        return jm.s({op:23, v:v, n:n});
    },
    
    /**
     * 读取变量 v 中指定位置 n 的位值
     * 
     * 该函数读取变量 v 中第 n 位的值（0 或 1），并返回该值。
     * 常用于检测状态标志位、校验位等。
     * 
     * @param {number} v - 要读取的数值变量（支持 bool、int 等类型，不支持 float/double）
     * @param {number} n - 要读取的位的位置，0 表示最低位（LSB），范围 0-31
     * @returns {number} 位值，0 或 1
     * 
     * @example
     * // 0b1010 (10) 的第3位是1
     * let bitVal = bits.bitRead(10, 3);
     * console.log(bitVal);  // 1
     * 
     * // 检查设备状态（假设第5位表示故障标志）
     * let status = 0b00100000;
     * let hasError = bits.bitRead(status, 5);
     * if (hasError === 1) {
     *     console.log("设备故障");
     * }
     * 
     * // 检查接收数据的校验位
     * let receivedData = 0b1101;
     * let parity = bits.bitRead(receivedData, 0);
     * console.log("校验位: " + parity);
     */
    bitRead: function(v,n) {
        return jm.s({op:24, v:v, n:n});
    },
    
    /**
     * 将变量 v 中指定位置 n 的位设置为 1
     * 
     * 该函数将变量 v 中第 n 位的值设置为 1，并返回操作后的变量值，
     * 其他位保持不变。常用于设置状态标志或控制硬件引脚。
     * 
     * @param {number} v - 要进行操作的数值变量
     * @param {number} n - 要设置的位的位置，0 表示最低位（LSB），范围 0-31
     * @returns {number} 设置指定位为1后的数值
     * 
     * @example
     * // 将 0 的第0位设置为1 => 1
     * let result = bits.bitSet(0, 0);
     * console.log(result);  // 1
     * 
     * // 设置 GPIO 控制位为高电平
     * let gpioCtrl = 0;
     * gpioCtrl = bits.bitSet(gpioCtrl, 3); // 设置第3个引脚输出高电平
     * 
     * // 标记任务完成（设置第2位为1）
     * let taskFlags = 0;
     * taskFlags = bits.bitSet(taskFlags, 2);
     */
    bitSet: function(v,n) {
        return jm.s({op:25, v:v, n:n});
    },
    
    /**
     * 将变量 v 中指定位置 n 的位设置为 b 的值
     * 
     * 该函数将变量 v 中第 n 位的值设置为 b（b 只能是 0 或 1），
     * 并返回操作后的变量值，其他位保持不变。
     * 
     * @param {number} v - 要进行操作的数值变量
     * @param {number} n - 要设置的位的位置，0 表示最低位（LSB），范围 0-31
     * @param {number} b - 要设置的值，只能为 0 或 1
     * @returns {number} 写入位后的数值
     * 
     * @example
     * // 将 0 的第2位设置为1 => 0b0100 = 4
     * let result = bits.bitWrite(0, 2, 1);
     * console.log(result);  // 4
     * 
     * // 将 0b1010 的第1位设置为0 => 0b1000 = 8
     * let result2 = bits.bitWrite(10, 1, 0);
     * console.log(result2);  // 8
     * 
     * // 动态更新配置位
     * let config = 0b0000;
     * config = bits.bitWrite(config, 0, 1); // 启用特性A
     * config = bits.bitWrite(config, 1, 0); // 禁用特性B
     */
    bitWrite: function(v, n, b) {
        return jm.s({op:26, v:v, n:n, b:b});
    },
    
    /**
     * 提取数值的高字节（最高 8 位）
     * 
     * 该函数提取变量 v 的高字节（第 8-15 位），并返回 0-255 的字节值。
     * 常用于处理多字节数据、解析通信协议数据包等场景。
     * 
     * @param {number} v - 要进行操作的数值（16位或32位整数）
     * @returns {number} 高字节值，范围 0-255
     * 
     * @example
     * // 0x1234 = 4660，高字节 = 0x12 = 18
     * let high = bits.highByte(0x1234);
     * console.log(high);  // 18
     * 
     * // 从传感器数据中提取高位值
     * let sensorData = 0x12AB;
     * let highPart = bits.highByte(sensorData);
     * console.log("高位: 0x" + highPart.toString(16));  // 高位: 0x12
     * 
     * // 解析通信协议数据包
     * let packet = 0xABCD;
     * let header = bits.highByte(packet);   // header = 0xAB
     * let payload = bits.lowByte(packet);   // payload = 0xCD
     */
    highByte: function(v) {
        return jm.s({op:27, v:v});
    },
    
    /**
     * 提取数值的低字节（最低 8 位）
     * 
     * 该函数提取变量 v 的低字节（第 0-7 位），并返回 0-255 的字节值。
     * 通过对变量执行 v & 0xFF 按位与操作实现。
     * 
     * @param {number} v - 要进行操作的数值（16位或32位整数）
     * @returns {number} 低字节值，范围 0-255
     * 
     * @example
     * // 0x1234 = 4660，低字节 = 0x34 = 52
     * let low = bits.lowByte(0x1234);
     * console.log(low);  // 52
     * 
     * // 提取颜色值中的 R/G/B 分量
     * let color = 0x12FF34;
     * let blue = bits.lowByte(color);           // B分量 = 0x34
     * let green = bits.lowByte(color >> 8);     // G分量 = 0xFF
     * let red = bits.lowByte(color >> 16);      // R分量 = 0x12
     * 
     * // 从传感器数据中提取低位值
     * let sensorRaw = analog.analogRead(0);
     * let lowValue = bits.lowByte(sensorRaw);
     * console.log("低位: " + lowValue);
     */
    lowByte: function(v) {
        return jm.s({op:28, v:v});
    },
    
};

//exports = bits
