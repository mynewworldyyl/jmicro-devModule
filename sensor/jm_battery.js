/**
 * 电池监控模块
 * 支持ESP8266和ESP32平台，用于检测电池电压和电量百分比
 * 
 * 功能说明：
 * - 获取电池原始ADC值
 * - 获取电池电压（mV）
 * - 获取电池电量百分比
 * - 获取电池状态（临界/低电/正常/良好/满电）
 * - 配置电池电压范围参数
 * - 获取硬件配置信息
 * 
 * 
 * // 获取电池电压
 * let voltage = battery.getVoltage()
 * console.log(`电池电压: ${voltage}mV`)
 * 
 * // 获取电量百分比
 * let percentage = battery.getPercentage()
 * console.log(`电量: ${percentage/100}%`)
 * 
 * // 获取完整电池状态
 * let status = battery.getStatus()
 * console.log(`状态: ${status.status}, 电压: ${status.voltage}mV, 电量: ${status.percentage/100}%`)
 * 
 * 使用时方法名称前一定要带上battery.前缀
 * 
 * @module 锂电池电压监测模块
 * @var battery
 * @category sensor
 * @keywords 电池,电压,电量,ADC,锂电池,ESP8266,ESP32,监测
 * @capabilities getRawADC,getVoltage,getPercentage,getStatus,setVoltageRange,getConfig,isAvailable
 * @depends 无
 */


const sdid = 20  // 传感器类型ID，需要与固件中的JM_SENSOR_TYPE_BATTRY保持一致
const batType = 65522  // 电池传感器类型码

/*=======================================电池监控接口开始============================================*/

var battery = {
	/**
	 * 获取电池原始ADC值
	 * 
	 * @returns {number} ADC原始值（ESP32: 0-4095, ESP8266: 0-1023），失败返回-1
	 * 
	 * @example
	 * let adcValue = battery.getRawADC()
	 * console.log(`ADC值: ${adcValue}`)
	 */
	getRawADC: function() {
		let rst = jm.s({"_fn": sdid, "ty": batType, "op": 1});
		if (rst && rst['code'] == 0 && typeof rst['v'] !== 'undefined') {
			return rst['v'];
		}
		return -1;
	},

	/**
	 * 获取电池电压
	 * 
	 * @returns {number} 电池电压值（单位：毫伏mV），失败返回-1
	 * 
	 * @example
	 * let voltage = battery.getVoltage()
	 * console.log(`电池电压: ${voltage}mV (${voltage/1000}V)`)
	 */
	getVoltage: function() {
		let rst = jm.s({"_fn": sdid, "ty": batType, "op": 2});
		if (rst && rst['code'] == 0 && typeof rst['v'] !== 'undefined') {
			return rst['v'];
		}
		return -1;
	},

	/**
	 * 获取电池电量百分比
	 * 
	 * @param {number} [minVoltage] - 可选，最低电压（放电截止电压），默认3000mV
	 * @param {number} [maxVoltage] - 可选，最高电压（满电电压），默认4200mV
	 * @returns {number} 电池电量百分比（0-10000，表示0.00%-100.00%），失败返回-1
	 * 
	 * @example
	 * // 使用默认电压范围（3.0V-4.2V）
	 * let percentage = battery.getPercentage()
	 * console.log(`电量: ${percentage/100}%`)
	 * 
	 * // 自定义电压范围（2.8V-4.2V）
	 * let percentage2 = battery.getPercentage(2800, 4200)
	 * console.log(`电量: ${percentage2/100}%`)
	 */
	getPercentage: function(minVoltage, maxVoltage) {
		let params = {"_fn": sdid, "ty": batType, "op": 3};
		
		if (typeof minVoltage !== 'undefined') {
			params['n'] = minVoltage;
		}
		if (typeof maxVoltage !== 'undefined') {
			params['x'] = maxVoltage;
		}
		
		let rst = jm.s(params);
		if (rst && rst['code'] == 0 && typeof rst['v'] !== 'undefined') {
			return rst['v'];
		}
		return -1;
	},

	/**
	 * 获取电池状态（完整信息）
	 * 
	 * @param {number} [minVoltage] - 可选，最低电压（放电截止电压），默认3000mV
	 * @param {number} [maxVoltage] - 可选，最高电压（满电电压），默认4200mV
	 * @returns {Object} 电池状态对象
	 * @returns {number} status.statusCode - 状态码：0=临界, 1=低电, 2=正常, 3=良好, 4=满电，失败返回-1
	 * @returns {string} status.status - 状态描述（Critical/Low/Normal/Good/Full/Error）
	 * @returns {number} status.voltage - 电池电压（mV），失败返回-1
	 * @returns {number} status.percentage - 电池电量百分比（0-10000），失败返回-1
	 * 
	 * @example
	 * let status = battery.getStatus()
	 * console.log(`电池状态: ${status.status}`)
	 * console.log(`电压: ${status.voltage}mV`)
	 * console.log(`电量: ${status.percentage/100}%`)
	 * 
	 * if (status.statusCode <= 1) {
	 *   console.log('警告：电池电量过低！')
	 * }
	 */
	getStatus: function(minVoltage, maxVoltage) {
		let params = {"_fn": sdid, "ty": batType, "op": 4};
		
		if (typeof minVoltage !== 'undefined') {
			params['n'] = minVoltage;
		}
		if (typeof maxVoltage !== 'undefined') {
			params['x'] = maxVoltage;
		}
		
		let rst = jm.s(params);
		
		if (rst && rst['code'] == 0) {
			let statusMap = {
				0: "Critical",   // 临界
				1: "Low",        // 低电
				2: "Normal",     // 正常
				3: "Good",       // 良好
				4: "Full"        // 满电
			};
			
			return {
				statusCode: rst['s'],
				status: statusMap[rst['s']] || "Unknown",
				voltage: rst['v'],
				percentage: rst['p']
			};
		}
		
		return {
			statusCode: -1,
			status: "Error",
			voltage: -1,
			percentage: -1
		};
	},

	/**
	 * 设置电池电压范围参数（全局配置）
	 * 
	 * @param {number} minVoltage - 最低电压（放电截止电压），单位mV
	 * @param {number} maxVoltage - 最高电压（满电电压），单位mV
	 * @returns {Object|null} 配置结果对象，失败返回null
	 * @returns {number} result.minVoltage - 设置后的最低电压
	 * @returns {number} result.maxVoltage - 设置后的最高电压
	 * 
	 * @example
	 * // 设置锂电池电压范围 3.0V-4.2V
	 * let config = battery.setVoltageRange(3000, 4200)
	 * console.log(`电压范围已设置为: ${config.minVoltage/1000}V-${config.maxVoltage/1000}V`)
	 * 
	 * // 设置磷酸铁锂电池电压范围 2.5V-3.65V
	 * battery.setVoltageRange(2500, 3650)
	 */
	setVoltageRange: function(minVoltage, maxVoltage) {
		let params = {"_fn": sdid, "ty": batType, "op": 5};
		
		if (typeof minVoltage !== 'undefined') {
			params['n'] = minVoltage;
		}
		if (typeof maxVoltage !== 'undefined') {
			params['x'] = maxVoltage;
		}
		
		let rst = jm.s(params);
		
		if (rst && rst['code'] == 0) {
			return {
				minVoltage: rst['n'],
				maxVoltage: rst['x']
			};
		}
		
		return null;
	},

	/**
	 * 获取硬件配置信息
	 * 
	 * @returns {Object|null} 硬件配置对象，失败返回null
	 * @returns {number} config.minVoltage - 当前最低电压配置（mV）
	 * @returns {number} config.maxVoltage - 当前最高电压配置（mV）
	 * @returns {number} config.adcPin - ADC引脚号
	 * @returns {number} config.adcResolution - ADC分辨率（位）
	 * @returns {string} config.platform - 平台类型（ESP32/ESP8266）
	 * 
	 * @example
	 * let config = battery.getConfig()
	 * console.log(`平台: ${config.platform}`)
	 * console.log(`ADC引脚: ${config.adcPin}`)
	 * console.log(`ADC分辨率: ${config.adcResolution}位`)
	 * console.log(`电压范围: ${config.minVoltage/1000}V-${config.maxVoltage/1000}V`)
	 */
	getConfig: function() {
		let rst = jm.s({"_fn": sdid, "ty": batType, "op": 6});
		
		if (rst && rst['code'] == 0) {
			let platform = "Unknown";
			if (typeof rst['r'] !== 'undefined') {
				platform = rst['r'] == 12 ? "ESP32" : "ESP8266";
			}
			
			return {
				minVoltage: rst['n'],
				maxVoltage: rst['x'],
				adcPin: rst['p'],
				adcResolution: rst['r'],
				platform: platform
			};
		}
		
		return null;
	},

	/**
	 * 检查电池传感器是否可用
	 * 
	 * @returns {boolean} 传感器是否可用
	 * 
	 * @example
	 * if (battery.isAvailable()) {
	 *   let voltage = battery.getVoltage()
	 *   console.log(`电池电压: ${voltage}mV`)
	 * } else {
	 *   console.log('电池传感器不可用')
	 * }
	 */
	isAvailable: function() {
		let rst = jm.s({"_fn": sdid, "ty": batType, "op": 6});
		return rst && rst['code'] == 0;
	}
}

/*=======================================电池监控接口结束============================================*/

// 导出模块
//exports = battery
