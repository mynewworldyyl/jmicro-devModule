/**
 * 本模块提供了针对继电器、MOS管等开关类设备的操作接口。

 * 这些接口允许用户通过代码控制不同类型的开关设备，包括获取开关状态、打开开关、关闭开关以及切换开关状态等操作。

 * 

 * 设备类型说明：

 * - type: 1, 普通继电器； 

 * - type: 2, 磁保持继电器； 

 * - type: 3, MOS管开关。

 * 

 * 引脚参数说明：

 * - p: 代表 Gpio 编号。对于磁保持继电器（type == 2），此为置位引脚。

 * - p1: 仅在 type == 2（磁保持继电器）时有效，表示复位引脚编号。

 * 

 * 设备控制参数：

 * - targetDevId: 目标设备ID，用于指定命令发往的设备。为空时命令在当前设备执行。

 * - sync: 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false。

 * 使用时方法名称前一定要带上swt.前缀

 * 

 * 常量说明：
 * - 设备类型：
 *   - type = 1 : 普通继电器
 *   - type = 2 : 磁保持继电器
 *   - type = 3 : MOS管开关
 * 
 * - 操作码说明：
 *   - op = 0 : 获取开关状态 (status)
 *   - op = 1 : 关闭开关 (turnOff)
 *   - op = 2 : 打开开关 (turnOn)
 *   - op = 3 : 切换开关状态 (toggle)
 *   - op = 4 : 对开和关的操作进行取反 (toggleModel)
 *   - op = 5 : 修正开关的状态，不真正操作灯的状态 (toggleStatus)
 *   - op = 6 : 清空全部缓存数据 (clearCacheData)
* 开关模块 API 返回值说明：
 * 
 * 所有方法返回的对象结构如下：
 * @typedef {Object} SwitchResult
 * @property {number} code - 状态码，0 表示成功，非 0 表示错误
 *   - 0: 操作成功
 *   - 1: 无效的操作码
 *   - 2: 内存分配失败（无法创建开关实例）
 *   - 3: 无效的 GPIO 引脚号（ESP8266 上引脚超出 0-15 范围）
 * @property {string} [msg] - 错误消息（仅在 code != 0 时返回）
 * @property {number} [status] - 开关状态（op=0 查询时返回，以及操作后返回）
 *   - 0: 关闭状态
 *   - 1: 打开状态
 * @property {number} [v] - 查询到的 GPIO 电平值（仅普通开关 op=0 时返回）
 * 
 * 磁保持继电器特殊说明：
 * - 磁保持继电器使用脉冲控制，每次操作后会自动恢复引脚为低电平
 * - 置位(set)和复位(reset)引脚需要连接正确的控制电路
 * - 脉冲宽度为500ms，可根据实际继电器规格调整
 * 
 * 使用示例：
 * ```javascript
 * // 查询普通继电器状态（GPIO 5）
 * let result = swt.status(1, 5);
 * console.log("开关状态: " + (result.status ? "开" : "关"));
 * 
 * // 打开磁保持继电器（置位引脚=4，复位引脚=5）
 * swt.turnOn(2, 4, 5);
 * 
 * // 关闭磁保持继电器
 * swt.turnOff(2, 4, 5);
 * 
 * // 切换MOS管开关状态（GPIO 12）
 * swt.toggle(3, 12);
 * ```
 * 
 * @module 继电器/MOS管开关控制模块
 * @var swt
 * @category actuator
 * @keywords 继电器,磁保持继电器,MOS管,开关,GPIO,控制,打开,关闭,切换,Arduino
 * @capabilities status,turnOn,turnOff,toggle,toggleModel,toggleStatus,clearCacheData
 * @depends 无
 */


 
let swtId = 29;

var swt = {
    /**
     * 获取指定开关设备的当前状态。
     * 
     * 该方法会构造一个符合协议的消息对象，通过 jm.s 函数发送出去以查询开关设备的状态。
     * 
     * @param {number} type - 开关设备的类型，取值为 1（普通继电器）、2（磁保持继电器）或 3（MOS管开关）。
     * @param {number} pin - Gpio 编号。对于磁保持继电器（type == 2），此为置位引脚。
     * @param {number} [p1] - 仅在 type == 2（磁保持继电器）时有效，表示复位引脚编号。
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {SwitchResult} 返回包含开关状态的对象
     *   - code: 状态码，0表示成功
     *   - status: 开关状态（0=关，1=开）
     *   - v: GPIO电平值（仅普通开关）
     * 
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * // 查询普通继电器状态
     * let result = swt.status(1, 5);
     * if (result.code === 0) {
     *     console.log("当前状态: " + (result.status ? "打开" : "关闭"));
     * }
     * 
     * // 查询磁保持继电器状态
     * let relayStatus = swt.status(2, 4, 5);
     */
    status: function (type, pin, p1, targetDevId, sync) {
        return jm.s({ "_fn": swtId, "op": 0, "p": pin, "ty": type, "p1": p1, "_d": targetDevId, "_s": sync });
    },

    /**
     * 打开指定的开关设备。
     * 
     * 该方法会构造一个符合协议的消息对象，通过 jm.s 函数发送出去以控制开关设备打开。
     * 
     * 不同设备类型的打开逻辑：
     * - 普通继电器(type=1): 设置GPIO为高电平（或低电平，取决于电路设计）
     * - 磁保持继电器(type=2): 给置位引脚发送脉冲，复位引脚置低
     * - MOS管开关(type=3): 设置GPIO为高电平导通
     * 
     * @param {number} type - 开关设备的类型，取值为 1（普通继电器）、2（磁保持继电器）或 3（MOS管开关）。
     * @param {number} pin - Gpio 编号。对于磁保持继电器（type == 2），此为置位引脚。
     * @param {number} [p1] - 仅在 type == 2（磁保持继电器）时有效，表示复位引脚编号。
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {SwitchResult} 返回操作结果对象
     *   - code: 状态码，0表示成功
     *   - status: 操作后的开关状态（应为1）
     * 
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * // 打开普通继电器
     * swt.turnOn(1, 5);
     * 
     * // 打开磁保持继电器
     * swt.turnOn(2, 4, 5);
     * 
     * // 打开MOS管开关
     * swt.turnOn(3, 12);
     */
    turnOn: function (type, pin, p1, targetDevId, sync) {
        return jm.s({ "_fn": swtId, "op": 2, "p": pin, "ty": type, "p1": p1, "_d": targetDevId, "_s": sync });
    },

    /**
     * 关闭指定的开关设备。
     * 
     * 该方法会构造一个符合协议的消息对象，通过 jm.s 函数发送出去以控制开关设备关闭。
     * 
     * 不同设备类型的关闭逻辑：
     * - 普通继电器(type=1): 设置GPIO为低电平
     * - 磁保持继电器(type=2): 给复位引脚发送脉冲，置位引脚置低
     * - MOS管开关(type=3): 设置GPIO为低电平截止
     * 
     * @param {number} type - 开关设备的类型，取值为 1（普通继电器）、2（磁保持继电器）或 3（MOS管开关）。
     * @param {number} pin - Gpio 编号。对于磁保持继电器（type == 2），此为置位引脚。
     * @param {number} [p1] - 仅在 type == 2（磁保持继电器）时有效，表示复位引脚编号。
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {SwitchResult} 返回操作结果对象
     *   - code: 状态码，0表示成功
     *   - status: 操作后的开关状态（应为0）
     * 
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * // 关闭普通继电器
     * swt.turnOff(1, 5);
     * 
     * // 关闭磁保持继电器
     * swt.turnOff(2, 4, 5);
     */
    turnOff: function (type, pin, p1, targetDevId, sync) {
        return jm.s({ "_fn": swtId, "op": 1, "p": pin, "ty": type, "p1": p1, "_d": targetDevId, "_s": sync });
    },

    /**
     * 切换指定开关设备的状态。
     * 
     * 该方法会构造一个符合协议的消息对象，通过 jm.s 函数发送出去以切换开关设备的当前状态（开变关，关变开）。
     * 
     * @param {number} type - 开关设备的类型，取值为 1（普通继电器）、2（磁保持继电器）或 3（MOS管开关）。
     * @param {number} pin - Gpio 编号。对于磁保持继电器（type == 2），此为置位引脚。
     * @param {number} [p1] - 仅在 type == 2（磁保持继电器）时有效，表示复位引脚编号。
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {SwitchResult} 返回操作结果对象
     *   - code: 状态码，0表示成功
     *   - status: 切换后的开关状态
     * 
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     * 
     * @example
     * // 切换普通继电器状态
     * swt.toggle(1, 5);
     * 
     * // 切换磁保持继电器状态
     * swt.toggle(2, 4, 5);
     */
    toggle: function (type, pin, p1, targetDevId, sync) {
        console.log("toggle Begin");
        return jm.s({ "_fn": swtId, "op": 3, "p": pin, "ty": type, "p1": p1, "_d": targetDevId, "_s": sync });
    },
    
    /**
     * 对开和关的操作进行取反
     * 
     * 该方法用于交换"打开"和"关闭"操作的逻辑。
     * 例如，如果当前模式是"高电平开"，调用后变为"低电平开"。
     * 此操作仅改变内部逻辑，不实际控制GPIO。
     * 
     * @param {number} type - 开关设备的类型，取值为 1（普通继电器）、2（磁保持继电器）或 3（MOS管开关）。
     * @param {number} pin - Gpio 编号。对于磁保持继电器（type == 2），此为置位引脚。
     * @param {number} [p1] - 仅在 type == 2（磁保持继电器）时有效，表示复位引脚编号。
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {SwitchResult} 返回操作结果对象，code为0表示成功
     * 
     * @example
     * // 取反普通继电器的操作逻辑
     * swt.toggleModel(1, 5);
     */
    toggleModel: function (type, pin, p1, targetDevId, sync) {
        return jm.s({ "_fn": swtId, "op": 4, "p": pin, "ty": type, "p1": p1, "_d": targetDevId, "_s": sync });
    },
    
    /**
     * 修正开关的状态，当前是开状态则变为关，当关为关状态则变为开，不会真正操作灯的状态
     * 
     * 该方法仅修改设备内部记录的开关状态值，不实际控制GPIO。
     * 适用于当实际物理状态与记录状态不同步时需要手动修正的场景。
     * 
     * @param {number} type - 开关设备的类型，取值为 1（普通继电器）、2（磁保持继电器）或 3（MOS管开关）。
     * @param {number} pin - Gpio 编号。对于磁保持继电器（type == 2），此为置位引脚。
     * @param {number} [p1] - 仅在 type == 2（磁保持继电器）时有效，表示复位引脚编号。
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {SwitchResult} 返回操作结果对象，code为0表示成功
     * 
     * @example
     * // 修正记录状态（不实际控制继电器）
     * swt.toggleStatus(2, 4, 5);
     */
    toggleStatus: function (type, pin, p1, targetDevId, sync) {
        return jm.s({ "_fn": swtId, "op": 5, "p": pin, "ty": type, "p1": p1, "_d": targetDevId, "_s": sync });
    },
    
    /**
     * 清空全部缓存数据
     * 
     * 该方法删除所有已保存的开关状态配置，包括：
     * - 所有开关的引脚配置
     * - 各开关的当前状态
     * - 开关模式设置
     * 
     * 注意：清空后开关状态将丢失，需要重新配置。
     * 
     * @param {number} type - 开关设备的类型，取值为 1（普通继电器）、2（磁保持继电器）或 3（MOS管开关）。
     * @param {number} pin - Gpio 编号。对于磁保持继电器（type == 2），此为置位引脚。
     * @param {number} [p1] - 仅在 type == 2（磁保持继电器）时有效，表示复位引脚编号。
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {SwitchResult} 返回操作结果对象，code为0表示成功
     * 
     * @example
     * // 清空所有开关缓存
     * swt.clearCacheData(1, 0);
     */
    clearCacheData: function (type, pin, p1, targetDevId, sync) {
        return jm.s({ "_fn": swtId, "op": 6, "p": pin, "ty": type, "p1": p1, "_d": targetDevId, "_s": sync });
    },
};

//exports = swt;
