/**
 * 雨滴传感器模块
 * 该模块提供了读取不同类型传感器数据的功能，包括雨滴传感器（FC37）、红外测距传感器和 DHT11 温湿度传感器。
 * 所有传感器均通过 jm.s 下发指令，由设备端完成采集并返回结果。
 * 使用时方法名称前一定要带上 sensor. 前缀
 *
 * @module 通用传感器控制接口
 * @var sensor
 * @category sensor
 * @keywords 雨滴传感器,FC37,红外测距,DHT11,温湿度,ADC,模拟量,环境监测
 * @capabilities readFC37RainData
 * @depends 无
 */

let sendefId = 20;

var sensor = {
    
	/**
     * 读取 FC37 雨滴传感器的数据
     * 
     * 功能说明：
     * - 通过 MQTT 远程调用设备端的 _jm_mq_remote_call 接口
     * - 设备端会读取模拟引脚上的雨滴传感器数据
     * - 返回雨量百分比、原始模拟值等信息
     * 
     * 注意：
     * - 在 ESP8266 平台上，传感器只能连接到 ADC 引脚（通常为 A0）
     * - 非 ESP8266 平台需要指定引脚编号和分辨率
     * - 设备端默认配置：分辨率 1024，参考电压 5.0V
     * 
     * @param {Object} params - 参数对象
     * @param {number} [params.pin] - 模块连接的引脚编号（仅非ESP8266平台需要）
     * @param {number} [params.vol] - 供电电压，单位：V（毫伏值会被转换为伏特）
     *                                 例如：5000 表示 5.0V
     *                                 默认值：5.0V
     * @param {number} [params.res] - ADC分辨率（仅非ESP8266平台需要）
     *                                 例如：1024 表示 10位ADC
     *                                 默认值：1024
     * 
     * @returns {Object} 返回包含以下字段的对象：
     *   - code {number} 状态码，0表示成功
     *     * 0: 成功
     *     * 1: 缺少引脚参数(g)
     *     * 2: 缺少分辨率参数(r)
     *   - v {number} 雨量百分比，单位：千分之一（实际值除以1000得到百分比）
     *     例如：500 表示 50% 雨量
     *   - vol {number} 原始模拟读取值，单位：千分之一（实际值除以1000得到电压值）
     *     例如：3300 表示 3.3V
     *   - rv {number} 干燥参考电压，单位：千分之一
     *     例如：5000 表示 5.0V
     *   - res {number} ADC分辨率
     * 
     * @example
     * // ESP8266平台（引脚自动为A0）
     * const result = sensor.readFC37RainData({ vol: 5000 });
     * if (result.code === 0) {
     *     const rainPercent = result.v / 1000; // 转换为百分比
     *     const voltage = result.vol / 1000;   // 转换为电压值
     *     console.log(`雨量: ${rainPercent}%, 电压: ${voltage}V`);
     * }
     * 
     * @example
     * // 非ESP8266平台，需要指定引脚和分辨率
     * const result = sensor.readFC37RainData({ 
     *     pin: 34,      // GPIO34
     *     vol: 5000,    // 5V供电
     *     res: 4096     // 12位ADC
     * });
     * 
     * @example
     * // 不传参数，使用默认配置
     * const result = sensor.readFC37RainData({});
     * // 将使用默认值：vol=5.0V, res=1024, pin=A0
     */
    readFC37RainData: function (pin, vol, refVol) {
        let p = { "_fn": sendefId, "ty": 6, op: 1, "g": pin, "v": vol, "r": refVol };
        let r = jm.s(p);
		//jm.i("c37", r)
		return r;
    },
};

//exports = sensor;

module.exports = sensor;
