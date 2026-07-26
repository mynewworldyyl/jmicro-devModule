/**
 * 本模块是参考 Arduino 库 HCSR04 实现的 JavaScript 接口，用于与超声波测距传感器（如 HC - SR04）进行交互。
 * 该模块提供了一系列方法，可用于初始化传感器、结束测量、测量超声波传播时间以及以不同单位（毫米、厘米、英寸）测量距离。
 *  使用时方法名称前一定要带上sr04.前缀
 
 * 超声波测距传感器 API 返回值说明：
 * 
 * 所有方法返回的对象结构如下：
 * @typedef {Object} HCSR04Result
 * @property {number} code - 状态码，0 表示成功，非 0 表示错误
 *   - 0: 操作成功
 *   - 1: 缺少 op（操作码）参数
 *   - 2: 缺少 ep（回声引脚）参数
 *   - 3: 缺少 tp（触发引脚）参数
 *   - 6: 无效的操作码
 * @property {number} [v] - 测量值（仅测量操作返回），单位取决于具体方法：
 *   - measureMicroseconds: 微秒值
 *   - measureDistanceMm: 毫米值
 *   - measureDistanceCm: 厘米值
 *   - measureDistanceIn: 英寸值
 * 
 * @module 超声波测距传感器模块
 * @var sr04
 * @category sensor
 * @keywords HCSR04,HC-SR04,超声波,测距,距离测量,毫米,厘米,英寸,trigPin,echoPin,Arduino库
 * @capabilities begin,end,measureMicroseconds,measureDistanceMm,measureDistanceCm,measureDistanceIn
 * @depends 无
 */
let srDefId = 24;
//let type = 65534

var sr04 = {
    /**
     * 初始化超声波测距传感器。
     * 
     * 该方法会向传感器发送初始化请求，设置触发引脚（trigPin）、回声引脚（echoPin）和超时时间（timeout）。
     * 如果指定的引脚组合已经存在实例，会先释放原有实例再重新创建。
     * 
     * @param {number} trigPin - 超声波传感器的触发引脚编号，用于触发超声波信号的发射（对应代码中的 tp）。
     * @param {number} echoPin - 超声波传感器的回声引脚编号，用于接收反射回来的超声波信号（对应代码中的 ep）。
     * @param {number} timeout - 测量超时时间，单位通常为微秒，用于限定测量的最大时长（对应代码中的 to）。
     * @returns {HCSR04Result} 返回操作结果对象，code 为 0 表示初始化成功。
     *   - code: 状态码，0 表示成功
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    begin: function (trigPin, echoPin, timeout) {
        let rst = jm.s({ "_fn": srDefId, op: 1, tp: trigPin, ep: echoPin, to: timeout });
        //console.log("readMqData ", rst)
        return rst;
    },

    /**
     * 结束超声波测距传感器的测量操作。
     * 
     * 该方法会向传感器发送结束测量的请求，释放相关资源。调用后指定的引脚组合将无法继续使用，需要重新调用 begin 初始化。
     * 
     * @param {number} trigPin - 超声波传感器的触发引脚编号（对应代码中的 tp）。
     * @param {number} echoPin - 超声波传感器的回声引脚编号（对应代码中的 ep）。
     * @returns {HCSR04Result} 返回操作结果对象，code 为 0 表示结束操作成功。
     *   - code: 状态码，0 表示成功
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    end: function (trigPin, echoPin) {
        let rst = jm.s({ "_fn": srDefId, op: 2, tp: trigPin, ep: echoPin });
        return rst;
    },

    /**
     * 测量超声波从发射到接收所经过的时间，单位为微秒。
     * 
     * 该方法会触发超声波信号发射，并记录信号从发射到接收到反射信号所经过的时间。
     * 注意：测量前需要先调用 begin 初始化对应的引脚组合。
     * 
     * @param {number} trigPin - 超声波传感器的触发引脚编号（对应代码中的 tp）。
     * @param {number} echoPin - 超声波传感器的回声引脚编号（对应代码中的 ep）。
     * @returns {HCSR04Result} 返回包含测量值的对象。
     *   - code: 状态码，0 表示测量成功
     *   - v: 超声波传播时间，单位为微秒（number 类型）
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    measureMicroseconds: function (trigPin, echoPin) {
        let rst = jm.s({ "_fn": srDefId, op: 3, tp: trigPin, ep: echoPin });
        //console.log("createMq ", rst)
        return rst;
    },

    /**
     * 测量超声波传感器到目标物体的距离，单位为毫米。
     * 
     * 该方法会根据超声波传播时间计算出传感器到目标物体的距离，并以毫米为单位返回结果。
     * 注意：测量前需要先调用 begin 初始化对应的引脚组合。
     * 
     * @param {number} trigPin - 超声波传感器的触发引脚编号（对应代码中的 tp）。
     * @param {number} echoPin - 超声波传感器的回声引脚编号（对应代码中的 ep）。
     * @param {number} temperature - 可选参数，环境温度（摄氏度），用于补偿声速，提高测量精度。不传则使用默认温度 26°C。
     * @returns {HCSR04Result} 返回包含测量值的对象。
     *   - code: 状态码，0 表示测量成功
     *   - v: 距离值，单位为毫米（number 类型）
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    measureDistanceMm: function (trigPin, echoPin, temperature) {
        let params = { "_fn": srDefId, op: 4, tp: trigPin, ep: echoPin };
        if (typeof temperature !== 'undefined') {
            params.t = temperature;
        }
        let rst = jm.s(params);
        return rst;
    },

    /**
     * 测量超声波传感器到目标物体的距离，单位为厘米。
     * 
     * 该方法会根据超声波传播时间计算出传感器到目标物体的距离，并以厘米为单位返回结果。
     * 注意：测量前需要先调用 begin 初始化对应的引脚组合。
     * 
     * @param {number} trigPin - 超声波传感器的触发引脚编号（对应代码中的 tp）。
     * @param {number} echoPin - 超声波传感器的回声引脚编号（对应代码中的 ep）。
     * @param {number} temperature - 可选参数，环境温度（摄氏度），用于补偿声速，提高测量精度。不传则使用默认温度 26°C。
     * @returns {HCSR04Result} 返回包含测量值的对象。
     *   - code: 状态码，0 表示测量成功
     *   - v: 距离值，单位为厘米（number 类型）
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    measureDistanceCm: function (trigPin, echoPin, temperature) {
        let params = { "_fn": srDefId, op: 5, tp: trigPin, ep: echoPin };
        if (typeof temperature !== 'undefined') {
            params.t = temperature;
        }
        let rst = jm.s(params);
        return rst;
    },

    /**
     * 测量超声波传感器到目标物体的距离，单位为英寸。
     * 
     * 该方法会根据超声波传播时间计算出传感器到目标物体的距离，并以英寸为单位返回结果。
     * 注意：测量前需要先调用 begin 初始化对应的引脚组合。
     * 
     * @param {number} trigPin - 超声波传感器的触发引脚编号（对应代码中的 tp）。
     * @param {number} echoPin - 超声波传感器的回声引脚编号（对应代码中的 ep）。
     * @param {number} temperature - 可选参数，环境温度（摄氏度），用于补偿声速，提高测量精度。不传则使用默认温度 26°C。
     * @returns {HCSR04Result} 返回包含测量值的对象。
     *   - code: 状态码，0 表示测量成功
     *   - v: 距离值，单位为英寸（number 类型）
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    measureDistanceIn: function (trigPin, echoPin, temperature) {
        let params = { "_fn": srDefId, op: 6, tp: trigPin, ep: echoPin };
        if (typeof temperature !== 'undefined') {
            params.t = temperature;
        }
        let rst = jm.s(params);
        return rst;
    }
};

//exports = sr04

module.exports = sr04;
