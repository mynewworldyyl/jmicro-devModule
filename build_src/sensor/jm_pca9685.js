/**
 * PCA9685 16通道12位PWM伺服电机驱动控制器接口
 * 适用于控制四足机器人等需要多舵机协同工作的场景
 * 支持单个舵机控制、多舵机协同动作、动作序列播放、AI动作生成等功能
 * 使用时方法名称前一定要带上 pca9685. 前缀
 * 
  
 *
 * @module 四足机器人舵机控制接口
 * @var pca9685
 * @category actuator
 * @keywords PCA9685,PWM,舵机,伺服电机,四足机器人,动作序列,AI动作,I2C
 * @capabilities pwm,setFreq,begin,angle,initChannels,plantTrans,isMoving,info,stop,start,qryActStatus,exeActByJson,delFlashActFile,delFlashActFileByName,exeActSeq,exeAiAction,delayAction,getCacheStatus,clearAllCache,setMaxCacheCount,cleanOneCache,setTTSPlayMode,preloadToMemory
 * @depends 无
 */
const pcaDefId = 62;
//const pcaty = 65526

/**
 * 
 * PCA9685 API 返回值说明：
 * 
 * 大多数方法返回的对象结构如下：
 * @typedef {Object} PCA9685Result
 * @property {number} c - 状态码，0 表示成功，非 0 表示错误
 *   - 0: 操作成功
 *   - 1: 操作码无效或舵机初始化失败
 *   - 2: 内存分配失败
 *   - 3: 读取文件失败
 *   - 6: JSON解析失败
 *   - 7: 启动动作播放失败
 *   - 8: 无JSON数据
 *   - 9: 分配multiAction内存失败
 *   - 10: AI服务调用无响应
 *   - 11: 舵机系统未初始化
 *   - 12: 参数错误（角度数组为空等）
 *   - 20: 动作ID为0（无效）
 *   - 21: 无法从服务器获取动作JSON
 *   - 22: 动作JSON文件大小为0
 *   - 33: 动作队列已满
 *   - 34: 队列扩容失败
 *   - 35: 队列初始化失败
 *   - 36: 入队操作未知错误
 *   - 37: 无效的JSON数据
 *   - 38: 复制JSON字符串失败
 *   - 41: 延时时间未指定或参数错误
 *   - 42: 参数错误
 *   - 43: 无缓存可清理
 *   - 44: 电池电压过低
 *   - 50: 请求AI动作时缺少文本参数
 *   - 51: 参数列表为空或无效
 *   - 52: 预加载动作失败
 *   - 53: ESP8266不支持预加载功能
 *   - 100: 舵机索引无效
 *   - 101: 无效的操作码
 *   - 102: ESP8266不支持TTS功能
 * 
 * @property {boolean} [p] - 是否正在播放动作（仅 op=7,14 返回）
 * @property {number} [v] - 返回值（仅特定操作返回）
 *   - op=7: 1表示有动作执行，0表示空闲
 *   - op=14: 是否正在播放的布尔值
 * @property {number} [cp] - 当前播放到第几个动作（仅 op=14 返回）
 * @property {number} [pc] - 总动作数量（仅 op=14 返回）
 * @property {number} [l] - 剩余循环次数（仅 op=14 返回）
 * @property {number} [pa] - 是否暂停（仅 op=14 返回）
 * @property {number} [r] - PWM分辨率（12位）（仅 op=8 返回）
 * @property {number} [f] - 当前PWM频率（Hz）（仅 op=8 返回）
 * @property {number} [angle] - 舵机当前角度（仅 op=6 返回）
 * @property {boolean} [moving] - 舵机是否正在移动（仅 op=6 返回）
 * @property {number} [target] - 舵机目标角度（仅 op=6 返回）
 * @property {number} [channel] - PWM通道号（仅 op=6 返回）
 * @property {number} [count] - 已缓存的动作数量（仅 op=21 返回）
 * @property {number} [max] - 最大允许缓存数量（仅 op=21 返回）
 * @property {number} [capacity] - 缓存数组容量（仅 op=21 返回）
 * @property {Uint32Array} [id_versions] - ID和版本号缓冲区（仅 op=21 返回）
 */
var pca9685 = {
    /**
     * 直接设置PWM通道的占空比
     * 
     * @param {number} chan - PWM通道号(0-15)，对应PCA9685的16个输出通道
     * @param {number} rate - PWM分辨率值(0-4095)，对应0%-100%占空比
     *                        舵机通常使用102-512范围（对应1ms-2ms脉冲）
     * @returns {PCA9685Result} 返回操作结果，c=0表示成功
     * 
     * @example
     * // 设置通道0的PWM值为300
     * pca9685.pwm(0, 300);
     */
    pwm: function(chan, rate) {
        return jm.s({ "_fn": pcaDefId, 'c': chan, 'op': 0, 'v': rate });
    },
    
    /**
     * 设置PWM频率
     * 
     * @param {number} freq - PWM频率(Hz)，通常舵机使用50Hz
     * @returns {PCA9685Result} 返回操作结果，c=0表示成功
     * 
     * @example
     * // 设置PWM频率为50Hz（标准舵机频率）
     * pca9685.setFreq(50);
     */
    setFreq: function(freq) {
        return jm.s({ "_fn": pcaDefId, op: 1, 'v': freq });
    },
    
    /**
     * 初始化I2C总线并启动PCA9685
     * 
     * @param {number} sda - I2C SDA引脚号（GPIO编号）
     * @param {number} scl - I2C SCL引脚号（GPIO编号）
     * @param {number} freq - PWM频率(Hz)，默认50Hz，不传则使用当前频率
     * @returns {PCA9685Result} 返回操作结果，c=0表示成功
     * 
     * @example
     * // 使用GPIO4(SDA)和GPIO5(SCL)初始化，频率50Hz
     * pca9685.begin(4, 5, 50);
     */
    begin: function(sda, scl, freq) {
        return jm.s({ "_fn": pcaDefId, op: 2, 
        'd':sda, 'c': scl, 'f': freq });
    },
    
    /**
     * 方便设置SG90舵机的角度
     * 自动将角度(0-180)映射到对应的PWM脉冲宽度(1ms-2ms)
     * 
     * @param {number} chan - PWM通道号(0-15)
     * @param {number} angle - 角度值(0-180)
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {PCA9685Result} 返回操作结果，c=0表示成功
     * 
     * @example
     * // 设置通道0的舵机转到90度位置
     * pca9685.angle(0, 90);
     */
    angle: function(chan, angle, targetDevId, sync) {
        return jm.s({ "_fn": pcaDefId, 'c': chan, 'op': 3, 'v': angle, '_d': targetDevId, '_s': sync });
    },
    
    /**
     * 初始化舵机系统，设置通道映射和初始角度
     * 
     * @param {Array<number>} channels - PWM通道数组，如[0,1,2,3,4,5,6,7]
     * @param {Array<number>} initAngles - 初始角度数组，与通道数组一一对应，范围0-180
     * @param {number} count - 通道数量（通常为8）
     * @param {number} defActSpeed - 动作默认执行时间(ms)，影响所有后续动作的默认速度
     * @returns {PCA9685Result} 返回操作结果，c=0表示成功
     * 
     * @example
     * // 初始化8个舵机，初始角度均为90度，默认动作时间500ms
     * pca9685.initChannels([0,1,2,3,4,5,6,7], [90,90,90,90,90,90,90,90], 8, 500);
     */
    initChannels: function(channels, initAngles, count, defActSpeed) {
        return jm.s({ "_fn": pcaDefId, op: 4,
         'n':count, 'c': channels, "a": initAngles, "s":defActSpeed});
    },
    
    /**
     * 协调移动所有舵机到指定角度
     * 所有舵机同时开始移动，并在指定时间内同时到达目标位置
     * 自动进行角度映射处理（根据机器人腿部结构反转部分舵机角度）
     * 
     * @param {Array<number>} angles - 8个舵机的目标角度数组[0-7]，每个值范围0-180
     *        角度映射规则（根据机器人腿部结构自动处理）：
     *        - 索引0: 左前上下
     *        - 索引1: 左前水平
     *        - 索引2: 左后上下
     *        - 索引3: 左后水平
     *        - 索引4: 右后上下
     *        - 索引5: 右后水平
     *        - 索引6: 右前上下
     *        - 索引7: 右前水平
     * @param {number} timeInMs - 移动持续时间(ms)，所有舵机同时到达目标位置
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {PCA9685Result} 返回操作结果，c=0表示成功
     * 
     * @example
     * // 在1000ms内将所有舵机移动到指定角度
     * pca9685.plantTrans([90,45,90,45,90,45,90,45], 1000);
     */
    plantTrans: function(angles, timeInMs, targetDevId, sync) {
        return jm.s({ "_fn": pcaDefId, op: 5, 't': timeInMs, 'a': angles, '_d': targetDevId, '_s': sync });
    },
    
    /**
     * 查询是否有舵机正在运动中
     * 
     * @returns {boolean} true-有舵机在运动，false-所有舵机静止
     * 
     * @example
     * if (pca9685.isMoving()) {
     *     console.log("舵机正在运动");
     * } else {
     *     console.log("舵机已停止");
     * }
     */
    isMoving: function() {
        let rst = jm.s({ "_fn": pcaDefId, op: 7});
        return rst && rst.c == 0 && rst['v']==1;
    },
    
    /**
     * 查询当前设备信息
     * 
     * @returns {Object} 返回设备信息，包含：
     *          - r: 分辨率(12位)
     *          - f: 当前频率(Hz)
     *          - c: 状态码
     * 
     * @example
     * let info = pca9685.info();
     * console.log("PWM频率: " + info.f + "Hz");
     */
    info: function() {
        let rst = jm.s({ "_fn": pcaDefId, op: 8});
        return rst
    },
    
    /**
     * 停止当前正在执行的动作，并回到站立姿态
     * 自动调用"st"(站立)动作使机器人恢复到稳定姿态
     * 
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {boolean} 操作是否成功
     * 
     * @example
     * // 停止当前动作并恢复站立姿态
     * pca9685.stop();
     */
    stop: function(targetDevId, sync) {
        let rst = jm.s({ "_fn": pcaDefId, op:13, '_d': targetDevId, '_s': sync });
        return rst && rst.c == 0 ? true : false
    },
    
    /**
     * 通过动作ID执行预定义动作
     * 动作文件存储在flash中，格式为"act_{id}"
     * 
     * @param {number} actionId - 动作ID
     * @param {number} [loop] - 循环次数控制：
     *        0: 无限循环
     *        >0: 执行指定次数
     *        <0或未指定: 由动作配置决定(默认1次)
     * @param {number} [queueMode] - 队列模式：
     *        true: 当前有动作运行时，请求进入队列等待
     *        false: 直接打断当前动作，立即执行请求的动作
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {boolean} 操作是否成功
     * 
     * @example
     * // 执行动作ID=1001，循环3次，打断模式
     * pca9685.start(1001, 3, false);
     * 
     * // 执行动作ID=1002，无限循环，队列模式
     * pca9685.start(1002, 0, true);
     * 
     * // 命令设备AAAAAAAAABM=执行动作1002，重复3次，队列等待模式，发送此命令给设备AAAAAAAAABM后，不等待设备响应直接返回
     * pca9685.start(1002, 3, true, "AAAAAAAAABM=", false);
     * 
     */
    start: function(actionId, loop, queueMode, targetDevId, sync) {
        let rst = jm.s({ "_fn": pcaDefId, op:12, 'i':actionId, 'l':loop, 'x': !!queueMode, '_d': targetDevId, '_s': sync });
        if(!(rst.c == 0 || rst.code==0)) console.log("start", rst)
        return rst && (rst.c == 0 || rst.code==0) ? true : false
    },
    
    /**
     * 查询当前动作播放状态
     * 
     * @returns {Object} 返回状态信息，包含：
     *          - c: 状态码，0表示成功
     *          - p: 是否正在播放(boolean)
     *          - cp: 当前播放到第几个动作(number)
     *          - pc: 总动作数量(number)
     *          - l: 剩余循环次数(number)
     *          - pa: 是否暂停(boolean)
     * 
     * @example
     * let status = pca9685.qryActStatus();
     * if (status.p) {
     *     console.log("正在播放动作 " + status.cp + "/" + status.pc);
     * }
     */
    qryActStatus: function() {
        let rst = jm.s({ "_fn": pcaDefId, op:14});
        return rst
    },
    
    /**
     * 直接通过JSON数据执行动作，无需预存储
     * 动作JSON格式：
     * {
     *   "l": 循环次数(可选),
     *   "c": [
     *     {"a": [角度数组], "s": 持续时间},
     *     ...
     *   ]
     * }
     * 
     * @param {string} actJson - JSON格式的动作数据字符串
     * @param {number} [loop] - 循环次数控制(覆盖JSON中的l参数)
     * @param {number} [queueMode] - true表示队列模式，false表示打断模式
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {boolean} 操作是否成功
     * 
     * @example
     * let json = '{"c":[{"a":[90,45,90,45,90,45,90,45],"s":500}]}';
     * pca9685.exeActByJson(json, 1, false);
     */
    exeActByJson: function(actJson, loop, queueMode, targetDevId, sync) {
        let rst = jm.s({ "_fn": pcaDefId, op:15, "d":actJson, "l":loop, 'x': !!queueMode, '_d': targetDevId, '_s': sync });
        return rst && rst.c == 0 ? true : false
    },
    
    /**
     * 通过ID从flash中删除动作缓存文件
     * 
     * @param {number} actionId - 要删除的动作ID
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {boolean} 操作是否成功
     * 
     * @example
     * // 删除动作ID为1001的缓存文件
     * pca9685.delFlashActFile(1001);
     */
    delFlashActFile: function(actionId, targetDevId, sync) {
        let rst = jm.s({ "_fn": pcaDefId, op:17, "i":actionId, '_d': targetDevId, '_s': sync });
        return rst && rst.c == 0 ? true : false
    },
    
    /**
     * 通过名称从flash中删除动作缓存文件
     * 
     * @param {string} actionName - 要删除的动作名称
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {boolean} 操作是否成功
     */
    delFlashActFileByName: function(actionName, targetDevId, sync) {
        let rst = jm.s({ "_fn": pcaDefId, op:17, "m":actionName, '_d': targetDevId, '_s': sync });
        return rst && rst.c == 0 ? true : false
    },
    
    /**
     * 按顺序执行多个动作序列
     * 每个子动作可以有独立的循环次数，支持整体循环控制
     * 
     * 动作序列格式示例：
     * [{
     *    "nm": "向前走两步",        // 动作名称(可选)
     *    "s": 400,                  // 全局动作时间(ms)
     *    "l": 2,                    // 该动作循环次数
     *    "b": [                     // 动作帧数组
     *        {"a": [20,45,5,45,20,45,5,45], "s": 300}, // 每帧的角度和时间
     *        {"a": [20,15,5,45,20,75,5,45], "s": 300}
     *    ]
     * },{
     *    "nm": "向左走十步",
     *    "s": 400,
     *    "l": 10,
     *    "b": [
     *        {"a": [20,45,5,45,20,45,5,45], "s": 300}
     *    ]
     * }]
     * 
     * @param {string} acts - JSON格式的动作序列数组字符串
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {boolean} 操作是否成功
     * 
     * @example
     * let seq = '[{"b":[{"a":[90,45,90,45,90,45,90,45],"s":500}]}]';
     * pca9685.exeActSeq(seq);
     */
    exeActSeq: function(acts, targetDevId, sync) {
        let rst = jm.s({ "_fn": pcaDefId, op:18, 'd':acts, '_d': targetDevId, '_s': sync });
        return rst && rst.c == 0 ? true : false
    },
    
    /**
     * 通过请求AI获取动作脚本并执行
     * 
     * @param {string} msg - 告诉AI对动作的要求，如"跳一支民族舞"、"做一个好笑的动作"
     * @param {number} promptId - AI提示词ID，不同ID对应不同的AI处理模式
     *         - 1: 动作设计模式（AI生成新的动作配置），设计基本动作，难度较高
     *         - 4: 动作执行模式（AI生成可执行的JS脚本），默认使用这个
     * @param {boolean} [dispat2Dev] - AI响应是否分发给其他设备，默认false
     * @returns {boolean} 操作是否成功
     * 
     * @example
     * // 让AI生成一个跳舞动作
     * pca9685.exeAiAction("跳一个机械舞", 4, false);
     */
    exeAiAction: function(msg, promptId, dispat2Dev) {
        let rst = jm.s({ "_fn": pcaDefId, op:19, "t":msg, "p":promptId, "d":!!dispat2Dev});
        return rst && rst.c == 0 ? true : false
    },
    
    /**
     * 动作延时
     * 注意：最多只能延时60000毫秒（一分钟），如需超过一分钟，可以多次调用此方法
     * 此方法不能使用JavaScript的delay方法替代
     * 
     * @param {number} delayTime - 动作延时时间，单位毫秒，最大60000
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {boolean} 操作是否成功
     * 
     * @example
     * // 延时3秒
     * pca9685.delayAction(3000);
     * 
     * // 延时65秒（通过两次延时实现）
     * pca9685.delayAction(60000);
     * pca9685.delayAction(5000);
     */
    delayAction: function(delayTime, targetDevId, sync) {
        let rst = jm.s({ "_fn": pcaDefId, op:20, "t":delayTime, '_d': targetDevId, '_s': sync });
        return rst && rst.c == 0 ? true : false
    },
    
    /**
     * 获取动作缓存状态信息
     * 查询当前设备上已缓存的动作ID列表及缓存使用情况
     * 
     * 缓存管理说明：
     * - 设备会自动缓存最近使用过的动作文件，避免重复从服务器下载
     * - 默认最大缓存数量为20个，超过时会自动删除最久未使用的动作
     * - 缓存记录保存在flash中，设备重启后依然有效
     * 
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {Object} 返回缓存状态信息
     * @returns {number} returns.c - 状态码，0表示成功
     * @returns {number} returns.count - 当前已缓存的动作数量
     * @returns {number} returns.max - 最大允许缓存的动作数量
     * @returns {number} returns.capacity - 当前缓存数组容量（动态扩容）
     * @returns {Uint8Array} returns.id_versions - ID和版本号缓冲区（每5字节一组：4字节ID+1字节版本）
     * 
     * @example
     * // 获取缓存状态
     * let status = pca9685.getCacheStatus();
     * if (status.c === 0) {
     *     console.log(`已缓存 ${status.count} 个动作，最大 ${status.max} 个`);
     * }
     */
    getCacheStatus: function(targetDevId, sync) {
        let rst = jm.s({ "_fn": pcaDefId, op:21, '_d': targetDevId, '_s': sync });
        return rst;
    },

    /**
     * 清空所有动作缓存
     * 删除所有本地缓存的动作文件及缓存记录
     * 
     * 使用场景：
     * - 当需要释放flash空间时
     * - 当缓存的动作文件版本过旧需要更新时
     * - 当设备出现缓存相关异常时
     * 
     * 注意：
     * - 此操作会永久删除所有已缓存的动作文件
     * - 后续执行动作时需要重新从服务器下载
     * - 不会影响动作队列中正在执行的动作
     * 
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {boolean} 操作是否成功
     * 
     * @example
     * // 清空所有缓存
     * if (pca9685.clearAllCache()) {
     *     console.log('缓存已清空');
     * } else {
     *     console.log('清空缓存失败');
     * }
     */
    clearAllCache: function(targetDevId, sync) {
        let rst = jm.s({ "_fn": pcaDefId, op:22, '_d': targetDevId, '_s': sync });
        return rst && rst.c == 0 ? true : false
    },

    /**
     * 设置最大缓存数量
     * 动态调整允许缓存的最大动作文件数量
     * 
     * 缓存策略说明：
     * - 当缓存数量达到上限时，会自动删除最久未使用的动作
     * - 减少上限时会自动清理多余的动作，直到符合新上限
     * - 增加上限时不会立即影响现有缓存
     * 
     * @param {number} maxCount - 最大缓存数量，范围1-100
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {boolean} 操作是否成功
     * 
     * @example
     * // 设置最大缓存为30个
     * if (pca9685.setMaxCacheCount(30)) {
     *     console.log('缓存上限已调整为30');
     * }
     */
    setMaxCacheCount: function(maxCount, targetDevId, sync) {
        let rst = jm.s({ "_fn": pcaDefId, op:23, "v": maxCount, '_d': targetDevId, '_s': sync });
        return rst && rst.c == 0 ? true : false
    },

    /**
     * 手动触发缓存清理
     * 立即删除一个最少使用的缓存动作
     * 
     * 清理规则：
     * - 基于LRU(最近最少使用)算法选择要删除的动作
     * - 每次只删除一个最久未被访问的缓存动作
     * - 如果当前没有缓存，操作会返回失败
     * 
     * 使用场景：
     * - 当需要立即释放一些空间时
     * - 在下载新动作前预清理空间
     * - 手动维护缓存质量
     * 
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {boolean} 操作是否成功（c=0成功，c=43表示无缓存可清理）
     * 
     * @example
     * // 手动清理一个最少使用的缓存
     * if (pca9685.cleanOneCache()) {
     *     console.log('已删除一个最少使用的缓存动作');
     * } else {
     *     console.log('没有缓存需要清理');
     * }
     * 
     * // 循环清理直到空间足够
     * while (needMoreSpace() && pca9685.cleanOneCache()) {
     *     console.log('继续清理缓存...');
     * }
     */
    cleanOneCache: function(targetDevId, sync) {
        let rst = jm.s({ "_fn": pcaDefId, op:24, '_d': targetDevId, '_s': sync });
        return rst && rst.c == 0 ? true : false
    },
    
    /**
     * 设置TTS语音播放模式
     * 控制动作执行时是否播放语音提示，以及播放哪种类型的语音
     * 
     * 注意：此功能仅ESP32平台支持，ESP8266会返回错误码102
     * 
     * @param {number} mode - 播放模式
     *        0: 不播放语音
     *        1: 播放动作名称(mn字段)
     *        2: 播放动作描述(m字段)
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {boolean} 操作是否成功
     * 
     * @example
     * // 设置播放动作名称
     * pca9685.setTTSPlayMode(1);
     * 
     * // 设置播放动作描述
     * pca9685.setTTSPlayMode(2);
     * 
     * // 关闭语音播放
     * pca9685.setTTSPlayMode(0);
     */
    setTTSPlayMode: function(mode, targetDevId, sync) {
        let rst = jm.s({ "_fn": pcaDefId, op:25, "v": mode, '_d': targetDevId, '_s': sync });
        return rst && rst.c == 0 ? true : false
    },

    /**
     * 预加载动作到内存缓存（仅ESP32支持）
     * 将指定的动作ID列表预先加载到内存缓存中，避免执行时从Flash读取导致舵机抖动
     * 
     * 功能说明：
     * - 仅在ESP32平台上有效，ESP8266会返回错误码53
     * - 预加载后的动作会解析并缓存在内存中（actionCacheMap）
     * - 后续执行相同动作时直接从内存读取，无需访问Flash
     * - 适用于需要频繁执行或对执行时机要求精确的动作
     * 
     * 使用场景：
     * - 机器人启动时预加载常用动作
     * - 在关键表演前预加载需要流畅执行的动作序列
     * - 避免首次执行动作时的Flash读取延迟和电流波动
     * 
     * 内存占用：
     * - 每个预加载的动作会占用一定内存（取决于动作复杂度）
     * - 建议根据设备可用内存控制预加载数量
     * 
     * @param {Array<number>|number} actionIds - 动作ID或动作ID数组
     *        支持单个ID或多个ID的数组，如：12 或 [12,13,14]
     * @param {number} [targetDevId] - 目标设备ID，为空时操作当前设备
     * @param {boolean} [sync] - 是否同步请求，true表示同步等待结果，false表示异步执行，默认为false
     * @returns {boolean} 操作是否成功（c=0成功，c=52失败，c=53不支持）
     * 
     * @example
     * // 预加载单个动作
     * pca9685.preloadToMemory(12);
     * 
     * // 预加载多个动作
     * pca9685.preloadToMemory([12, 13, 14, 15]);
     * 
     * // 在初始化时预加载常用动作
     * pca9685.preloadToMemory([1001, 1002, 1003, 1004]);
     */
    preloadToMemory: function(actionIds, targetDevId, sync) {
        // 统一转换为数组
        let ids = Array.isArray(actionIds) ? actionIds : [actionIds];
        let rst = jm.s({ "_fn": pcaDefId, op:26, "ids": ids, '_d': targetDevId, '_s': sync });
        return rst && rst.c == 0 ? true : false
    }
};

module.exports = pca9685;
