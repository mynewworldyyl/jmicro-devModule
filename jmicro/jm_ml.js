
/**
 * 设备管理模块 - 主从设备管理接口
 * 提供主设备对从设备的发现、查询与管理能力。
 * 支持通过 UDP 广播自动发现同网络中的设备，并维护设备在线状态与心跳检测。
 * 可用于多设备协同、分布式控制、设备选择与状态监控等场景。
 * 仅主设备可执行设备列表查询操作。
 * 使用时方法名称前一定要带上 deviceMgr. 前缀
 *
 * @module 主从设备管理接口
 * @var deviceMgr
 * @category system
 * @keywords 设备管理,主从设备,设备发现,设备列表,设备监控,分布式控制,UDP广播,心跳检测
 * @capabilities getSlaveList,getSimpleDeviceList
 * @depends 无
 */

// 设备管理模块接口标识（对应设备端 ctrl_registFun 的第二个参数）
const deviceMgrId = 5;

var deviceMgr = {
    
    /**
     * 获取从设备列表（完整信息）
     * 
     * 返回每个设备的详细信息，包括：
     * - deviceId: 设备唯一标识
     * - deviceName: 设备名称
     * - deviceIP: 设备IP地址
     * - devicePort: 设备通信端口
     * - isMaster: 是否主设备
     * - _ma: MAC地址
     * 
     * @returns {Object} 返回设备列表信息
     * @returns {number} returns.code - 0表示成功，非0表示失败
     * @returns {string} returns.msg - 错误消息（仅失败时存在）
     * @returns {Array<Object>} returns.devs - 设备列表数组（成功时存在）
     * 
     * @example
     * // 获取所有从设备完整信息
     * let result = deviceMgr.getSlaveList();
     * if (result.code === 0 && result.devs) {
     *     for (let i = 0; i < result.devs.length; i++) {
     *         let dev = result.devs[i];
     *         console.log(`设备: ${dev.deviceName}(${dev.deviceId})`);
     *         console.log(`  IP: ${dev.deviceIP}:${dev.devicePort}`);
     *         console.log(`  MAC: ${dev._ma}`);
     *         console.log(`  主设备: ${dev.isMaster ? '是' : '否'}`);
     *     }
     * } else {
     *     console.log(`获取失败: ${result.msg}`);
     * }
     */
    getSlaveList: function() {
        return jm.s({ 
            "_fn": deviceMgrId, 
            "op": 0
        });
    },
    
    /**
     * 获取简化设备列表（仅名称和ID）
     * 
     * 相比getSlaveList，此接口只返回最核心的设备信息，数据传输量更小
     * 适用于只需要设备名称和ID的场景，如设备选择下拉框
     * 
     * @returns {Object} 返回简化设备列表
     * @returns {number} returns.code - 0表示成功，1表示非主机
     * @returns {Array<Object>} returns.devs - 设备列表数组，每个元素包含：
     *          - deviceId: 设备ID
     *          - name: 设备名称
     * 
     * @example
     * // 获取简化设备列表（用于下拉框）
     * let result = deviceMgr.getSimpleDeviceList();
     * if (result.code === 0 && result.devs) {
     *     let selectHtml = '<select>';
     *     for (let i = 0; i < result.devs.length; i++) {
     *         selectHtml += `<option value="${result.devs[i].deviceId}">${result.devs[i].name}</option>`;
     *     }
     *     selectHtml += '</select>';
     *     console.log(selectHtml);
     * }
     * 
     * // 输出示例：
     * // [
     * //   {deviceId: "esp32_001", name: "主控机器人"},
     * //   {deviceId: "esp32_002", name: "从机1号"},
     * //   {deviceId: "esp8266_003", name: "传感器节点"}
     * // ]
     */
    getSimpleDeviceList: function() {
        return jm.s({ 
            "_fn": deviceMgrId, 
            "op": 1
        });
    },
    
};

// 导出模块（如果需要）
// exports = deviceMgr;
